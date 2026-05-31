# 🚀 Sprint Intel (Frontend) — Engineering Ops Intelligence Partner

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-5.4--Beta-blueviolet)](https://vitejs.dev/)

**Sprint Intel** is a premium, cybernetic Engineering Operations Command Center that solves workspace context fragmentation. It consolidates scattered telemetry across **Linear** (tickets), **GitHub** (pull requests), and **Slack** (discussion logs) using the **Coral SQL Retrieval Layer** to build a unified chronological timeline, capacity indicators, and an on-demand AI Ops assistant.

**🌐 Live Demo:** [sprint-intell.netlify.app](https://sprint-intell.netlify.app/)  
*(Note: Hosted on a free Render instance, so the APIs can take 20-30s to respond on the first request while the server container spins up).*

---

## 🎨 Premium UI/UX Features

Sprint Intel is crafted to deliver a premium, high-fidelity developer cockpit experience:
*   **Dynamic Glassmorphism Controls**: Subtle translucency, blur filters (`backdrop-filter`), and cybernetic neon gradients designed for maximum visual appeal.
*   **Dynamic Sprint Health Score**: Real-time algorithmic telemetry monitoring.
*   **On-Demand Loaders (Render Safe)**: Lazy-loading sub-resource context architecture that prevents memory peaks under 512MB while achieving sub-250ms page loads.
*   **Temporal Timeline Correlation**: Chronological vertical node timeline graphing cross-platform events.
*   **AI Chat Ops & Synthesizer Sidecar**: Markdown-rendered conversational interface supporting interactive action chips and one-click standup log generations.

---

## 🛠️ Technology Stack

*   **Core**: React 18, Vite 5.4.
*   **Styling & Motion**: Tailwind CSS 3.4, Framer Motion 11 (Transitions), Lucide React (Icons).
*   **Visual Charts**: Recharts 2.12 (Capacity distribution bars).
*   **Markdown Core**: React Markdown 9, Remark GFM 4 (GFM tables, quotes, code).
*   **Routing**: React Router DOM 6.

---

## 📂 Repository Structure

```directory
sprint-intell-frontend/
├── src/
│   ├── components/               # Cybernetic UI Views
│   │   ├── AIChatView.jsx        # AI Chat ops & Markdown renderers
│   │   ├── DashboardView.jsx     # Health Gauges and charts
│   │   ├── TeamWorkloadView.jsx  # Capacity bars
│   │   ├── TimelineView.jsx      # Historical node timelines
│   │   └── Sidebar.jsx           # Nav system
│   ├── context/
│   │   └── SprintContext.jsx     # On-Demand lazy data context
│   ├── App.jsx                   # Router mappings
│   ├── main.jsx                  # App bootstrapper
│   └── index.css                 # Glassmorphic custom CSS tokens
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start

### 1. Clone the repository:
```bash
git clone https://github.com/gurpal-04/sprint-intell-frontend.git
cd sprint-intell-frontend
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run Development Server:
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

## 🎥 Sprint Intel — 3-Minute Video Demo

[![Sprint Intel Demo Video](https://img.youtube.com/vi/iFJG41VjdAU/maxresdefault.jpg)](https://www.youtube.com/watch?v=iFJG41VjdAU)

