import { describe, expect, it } from "vitest";
import { DUE_WINDOW_DAYS, getDueDateInfo, getDueProgress } from "./dueDate";

// Local-date arithmetic so the tests aren't affected by DST or timezones.
function dateInDays(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

describe("getDueDateInfo", () => {
  it("labels overdue tasks", () => {
    const info = getDueDateInfo(dateInDays(-3), false);
    expect(info.label).toMatch(/^Overdue/);
    expect(info.className).toContain("rose");
  });

  it("labels tasks due today", () => {
    const info = getDueDateInfo(dateInDays(0), false);
    expect(info.label).toBe("Due today");
  });

  it("labels tasks due tomorrow", () => {
    const info = getDueDateInfo(dateInDays(1), false);
    expect(info.label).toBe("Due tomorrow");
  });

  it("labels tasks due within a week", () => {
    const info = getDueDateInfo(dateInDays(3), false);
    expect(info.label).toBe("Due in 3d");
  });

  it("uses a neutral label for tasks further out", () => {
    const info = getDueDateInfo(dateInDays(10), false);
    expect(info.label).toBe(
      new Date(`${dateInDays(10)}T00:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    );
  });

  it("never shows overdue styling for completed tasks", () => {
    const info = getDueDateInfo(dateInDays(-10), true);
    expect(info.label).not.toMatch(/Overdue/);
    expect(info.className).toContain("slate");
  });
});

describe("getDueProgress", () => {
  it("saturates at 100% when overdue", () => {
    const { pct, barClass } = getDueProgress(dateInDays(-1));
    expect(pct).toBe(100);
    expect(barClass).toContain("rose");
  });

  it("shows a small bar just before the window opens", () => {
    const { pct } = getDueProgress(dateInDays(DUE_WINDOW_DAYS - 1));
    expect(pct).toBeGreaterThan(0);
    expect(pct).toBeLessThan(15);
  });

  it("never returns a negative percentage", () => {
    const { pct } = getDueProgress(dateInDays(DUE_WINDOW_DAYS + 30));
    expect(pct).toBe(0);
  });

  it("colors the bar amber within a day of the deadline", () => {
    const { barClass } = getDueProgress(dateInDays(0));
    expect(barClass).toContain("amber");
  });

  it("colors the bar violet within five days", () => {
    const { barClass } = getDueProgress(dateInDays(3));
    expect(barClass).toContain("violet");
  });

  it("keeps the bar emerald beyond five days out", () => {
    const { barClass } = getDueProgress(dateInDays(8));
    expect(barClass).toContain("emerald");
  });
});
