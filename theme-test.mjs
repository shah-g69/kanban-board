// Test (theme-agnostic): toggle flips dark class + storage, reload keeps the flipped theme.
const CDP_PORT = 9223;
const APP_URL = "http://localhost:5173/";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const targets = await (await fetch(`http://localhost:${CDP_PORT}/json`)).json();
  const page = targets.find((t) => t.type === "page");
  if (!page) throw new Error("no page target");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let msgId = 0;
  const pending = new Map();
  const diagnostics = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    } else if (msg.method === "Runtime.exceptionThrown") {
      diagnostics.push("EXCEPTION: " + (msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text));
    } else if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
      diagnostics.push(`CONSOLE.${msg.params.type}: ` + msg.params.args.map((a) => a.value ?? a.description ?? "").join(" "));
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++msgId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: APP_URL });
  await sleep(4000);

  const state = () => evaluate(`({
    dark: document.documentElement.classList.contains("dark"),
    stored: localStorage.getItem("kanban:theme"),
    title: document.querySelector("h1")?.textContent,
    cards: document.querySelectorAll('[aria-roledescription="sortable"]').length,
    toggleBtn: !!document.querySelector('button[title*="mode"]'),
  })`);

  const initial = await state();
  console.log("INITIAL:", JSON.stringify(initial));
  const initialOk = initial.title === "Kanban Task Manager" && initial.cards === 4 && initial.toggleBtn;

  // Click the toggle → theme should flip.
  await evaluate(`document.querySelector('button[title*="mode"]').click(); true`);
  await sleep(600);
  const flipped = await state();
  console.log("FLIPPED:", JSON.stringify(flipped));
  const flippedOk = flipped.dark !== initial.dark && flipped.stored === (flipped.dark ? "dark" : "light");

  // Reload → the flipped theme must persist.
  await send("Page.reload");
  await sleep(4000);
  const reloaded = await state();
  console.log("RELOAD: ", JSON.stringify(reloaded));
  const reloadOk = reloaded.dark === flipped.dark && reloaded.stored === flipped.stored && reloaded.cards === 4;

  // Restore original theme.
  await evaluate(`document.querySelector('button[title*="mode"]').click(); true`);
  await sleep(500);

  if (diagnostics.length) console.log("BROWSER DIAGNOSTICS:\n" + diagnostics.slice(0, 10).join("\n"));

  const pass = initialOk && flippedOk && reloadOk;
  console.log(pass ? "RESULT: ALL PASS" : "RESULT: FAIL");
  try { await send("Browser.close"); } catch {}
  process.exit(pass ? 0 : 1);
}

main().catch((err) => { console.error("SCRIPT ERROR:", err.message); process.exit(1); });
