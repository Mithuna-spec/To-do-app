# TaskFlow — Smart Task Management

> **Plan Better. Focus Deeper. Get Things Done.**

A production-quality, responsive task management web application built for the GDG IARE technical team selection challenge. TaskFlow helps college students, developers, and productivity-focused individuals organize their daily work, prioritize responsibilities, track deadlines, and monitor progress — all in a clean, dark-themed interface.

---

## Problem Statement

Students and developers often struggle to manage multiple responsibilities across academics, projects, and personal goals. Existing tools are either too complex or too simple. TaskFlow bridges this gap with a focused, intuitive productivity dashboard that provides real-time visibility into what needs to get done.

---

## Features

### Core Task Management
- ✅ **Create tasks** — with title, description, category, priority, and optional due date
- ✅ **Edit tasks** — pre-populated form, all fields editable, preserves ID and `createdAt`
- ✅ **Complete tasks** — toggle between pending and complete with immediate UI feedback
- ✅ **Delete tasks** — confirmation dialog before deletion, with toast notification

### Organization
- 📂 **Categories** — Study, Coding, Personal, Other (sidebar navigation with counts)
- 🚩 **Priorities** — High, Medium, Low (with colored badges and priority stripe)
- 📅 **Due dates** — optional, displayed with overdue/today highlighting

### Dashboard
- 📊 **Statistics cards** — Total, Completed, Pending, Overdue (dynamically computed)
- 📈 **Productivity overview** — completion percentage with animated progress bar

### Views & Filtering
- 🗂️ **Views** — All Tasks, Today, Upcoming, Completed (sidebar navigation)
- 🔍 **Real-time search** — case-insensitive, searches titles and descriptions
- 🔧 **Filters** — by status (all/pending/completed/overdue) and priority
- 🔃 **Sorting** — by recently created, due date, or priority
- 🤝 **Combined filters** — all filters work together simultaneously

### UX & Accessibility
- 🌙 **Dark/Light theme** — toggle persisted across refreshes
- 🔔 **Toast notifications** — for create, edit, complete, and delete actions
- 📭 **Empty states** — contextual messages for each view and filter combination
- ♿ **Accessibility** — semantic HTML, ARIA labels, keyboard navigation, focus management
- 📱 **Responsive** — mobile drawer navigation, adapts to 375px–1440px viewports

### Data & Persistence
- 💾 **localStorage persistence** — tasks and theme survive browser refresh/close
- 🛡️ **Data validation** — corrupt/malformed localStorage data handled gracefully
- 🕐 **Correct date handling** — local calendar dates, no UTC timezone bugs

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 + Vite 8 | UI framework and build tooling |
| Tailwind CSS v4 | Styling with custom design tokens |
| Lucide React | Icon library |
| React Hooks | State management (useState, useEffect, useCallback) |
| Browser localStorage | Task and theme persistence |

---

## Project Structure

```
src/
├── components/
│   ├── ConfirmDialog.jsx      # Accessible delete confirmation dialog
│   ├── FilterBar.jsx          # Status, priority, sort dropdowns
│   ├── Header.jsx             # Page header with search and add button
│   ├── ProgressOverview.jsx   # Completion percentage and progress bar
│   ├── SearchInput.jsx        # Controlled search input with clear button
│   ├── Sidebar.jsx            # Navigation, category links, theme toggle
│   ├── StatsCards.jsx         # Total/completed/pending/overdue cards
│   ├── TaskFormDialog.jsx     # Create/edit task modal with validation
│   ├── TaskItem.jsx           # Individual task card
│   ├── TaskList.jsx           # Task list with contextual empty states
│   ├── ThemeToggle.jsx        # Dark/light mode button
│   └── Toast.jsx              # Auto-dismissing toast notifications
├── hooks/
│   └── useTasks.js            # Central task state and CRUD operations
├── utils/
│   ├── storage.js             # localStorage helpers with error handling
│   └── taskUtils.js           # Task factory, filtering, sorting, statistics
├── App.jsx                    # Root component — orchestrates all state
├── index.css                  # Tailwind v4 + design tokens + animations
└── main.jsx                   # React entry point
```

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+

---

## Installation

```bash
# Clone or download the repository
git clone <repository-url>
cd GDGC

# Install dependencies
npm install
```

---

## Local Development

```bash
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173) with HMR enabled.

---

## Production Build

```bash
npm run build
```

Outputs optimized static files to the `dist/` directory. Build output:
- `dist/index.html` ~1 kB
- `dist/assets/index.css` ~40 kB (7.5 kB gzipped)
- `dist/assets/index.js` ~269 kB (82 kB gzipped)

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment (Vercel)

The project includes a `vercel.json` configuration for SPA routing fallback.

### Deploy via Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### Deploy via Vercel Dashboard

1. Push the repository to GitHub/GitLab.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Vite — no additional configuration needed.
4. The `vercel.json` handles deep-link routing correctly.

No environment variables or API keys are required.

---

## Task Data Model

```js
{
  id: string,           // "1729590000000-abc123f" — timestamp + random
  title: string,        // Required, trimmed, max 200 chars
  description: string,  // Optional
  category: string,     // "Study" | "Coding" | "Personal" | "Other"
  priority: string,     // "High" | "Medium" | "Low"
  dueDate: string,      // "YYYY-MM-DD" or empty string
  completed: boolean,
  createdAt: string,    // ISO 8601 timestamp
  updatedAt: string,    // ISO 8601 timestamp
}
```

---

## Overdue Logic

A task is **overdue** only when:
1. It is **not** completed
2. It **has** a due date
3. Its due date is **strictly before** today's local calendar date

Tasks due today are **not** overdue. Tasks without due dates are **never** overdue.
All date comparisons use local calendar dates (no UTC timezone conversion).

---

## Current Limitations

- **No backend** — all data is stored in the browser's localStorage (single-device only)
- **No collaboration** — tasks are not shared between users or devices
- **No recurring tasks** — each task is a one-time item
- **No subtasks** — no hierarchical task nesting
- **No file attachments** — tasks support text only
- **No notifications/reminders** — the app does not send browser push notifications

---

## License

Built for the GDG IARE technical team selection challenge. Educational use only.
