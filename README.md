# Kanban Task Manager

A multi-project Kanban board built with React 19, Vite, Tailwind CSS 4, and
[dnd-kit](https://dndkit.com). Organize tasks across boards, drag cards between
columns, filter by status/priority/label, and track activity — all persisted
locally in your browser.

## Features

- **Multiple projects** — create, rename, and delete boards from the sidebar
- **Drag & drop** — reorder cards within a column or move them between columns
- **Filters** — search tasks and filter by status, priority, and label
- **Deadlines** — due-date chips with overdue/today warnings and a progress bar
- **Overview dashboard** — status and priority breakdowns, upcoming deadlines
- **Activity log** — a record of created, moved, completed, and deleted tasks
- **Dark mode** — toggled from the header, follows your system preference by default
- **Local persistence** — everything is saved to `localStorage` automatically
- **Data backup** — export/import your whole workspace as a JSON file (sidebar → Data)

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

| Script          | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the Vite dev server          |
| `npm run build` | Production build to `dist/`        |
| `npm run lint`  | Run ESLint                         |
| `npm run test`  | Run the Vitest test suite once     |

## Project structure

```
src/
├── App.jsx                    # Layout, view switching, global filter state
├── main.jsx                   # Entry point
├── index.css                  # Tailwind theme, animations, dark-mode variant
├── Context/
│   ├── TaskProvider.jsx       # State: projects, tasks, activity, localStorage
│   └── taskContext.js
├── Hooks/
│   ├── useTasks.js            # Context accessor (throws outside provider)
│   ├── useTaskFilters.js      # Search + status/priority/label filtering
│   └── useTheme.js            # Dark/light theme with system preference
├── utils/
│   └── dueDate.js             # Due-date labels, overdue detection, progress bar
└── components/
    ├── KanbanBoard.jsx        # dnd-kit wiring, drag/drop handling
    ├── KanbanColumn.jsx       # Column + drop target
    ├── TaskCard.jsx           # Sortable card with edit/delete actions
    ├── TaskModal.jsx          # Create/edit dialog (focus-trapped)
    ├── FilterBar.jsx          # Status/priority/label filters
    ├── SearchBar.jsx
    ├── Overview.jsx           # Dashboard with stats and deadlines
    ├── Activity.jsx           # Activity log
    ├── Sidebar.jsx            # Navigation, project switcher, data backup
    └── EmptyState.jsx
```

## Data model

All state lives in `localStorage` under the key `kanban:state`:

```jsonc
{
  "projects": [{ "id": "default", "name": "My Workspace", "color": "#8b5cf6" }],
  "activeProjectId": "default",
  "projectData": {
    "default": {
      "tasks": [
        {
          "id": "...",
          "title": "...",
          "description": "...",
          "status": "todo",          // todo | in-progress | done
          "priority": "medium",      // low | medium | high
          "labels": ["Frontend"],
          "dueDate": "2026-08-20"    // optional, ISO date
        }
      ],
      "columnOrder": {
        "todo": ["task-id", "..."],  // manual drag order per column
        "in-progress": [],
        "done": []
      },
      "activity": [
        { "id": "...", "type": "created", "message": "...", "timestamp": 1234567890 }
      ]
    }
  }
}
```

The loader also migrates the legacy single-board shape (`{ tasks, columnOrder }`)
automatically.

## Testing

Tests run with [Vitest](https://vitest.dev) and React Testing Library:

```bash
npm run test
```

Coverage includes the due-date utilities, the filter hook, and the
`TaskProvider` state transitions (create/update/delete, activity logging,
project switching, import/export).
