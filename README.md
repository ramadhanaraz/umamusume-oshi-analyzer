# 🏇 Umamusume Top 50 Oshi Strategy Analyzer

An interactive web application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Zustand** designed for *Umamusume: Pretty Derby* fans and strategists. Rank your favorite top 50 trainees ("oshis") and analyze track surface affinities, distance aptitudes, running style distributions, and tactical archetypes.

---

## ✨ Features

- **📊 Dashboard & Analytics**
  - Interactive charts (powered by Recharts) breaking down track surface (Turf vs. Dirt), distance preferences (Sprint, Mile, Medium, Long), and running styles (Front Runner, Pace Chaser, Late Surger, End Closer).
  - Customizable weighting modes (Equal Weight, Tiered Weighting, Linear Decaying Weight) and grade filters (A-Grade Only, A-C Viable, All Grades).
  - Strategy archetype identification (e.g., Speed Demon, Balanced Master, Mile Specialist) based on roster composition.

- **🏆 Interactive Top 50 Roster Manager**
  - Smooth drag-and-drop reordering with `@dnd-kit`.
  - Instant slot operations: swap positions, insert, remove, random autofill, or clear roster.
  - Export top roster list to CSV format for external analysis.

- **📖 Playable Trainees Database**
  - Searchable catalog of 130+ playable Umamusume trainees with full aptitude ratings (Surface, Distance, Style).
  - Filter trainees by base rarity, track affinity, running style, and distance specialty.
  - One-click addition to your active Top 50 roster.

- **⚔️ Oshi Sorter**
  - Built-in pairwise comparison engine using binary merge sort algorithm.
  - Step-by-step head-to-head comparisons to determine your definitive Top 50 list.
  - Supports undoing choices and mid-sorter progress saving.

- **🎯 Strategy Center**
  - Detailed breakdown of team strengths and distance coverage.
  - Hero Archetype analysis providing tailored advice for PvP / Champion's Meeting and Team Stadium building.

- **🔗 Shareable Links & Compressed State**
  - Client-side URL state encoding using `lz-string` — share your complete 50-trainee roster without needing a server backend database.
  - Read-only preview mode for shared links with 1-click roster importing.

- **🖼️ Exportable Strategy Cards**
  - Generate beautiful, high-resolution PNG summary cards of your Top 50 roster using `html-to-image` for sharing on social media.

- **🌐 Dual Terminology Toggle**
  - Seamlessly switch between Global (English) and JP localized terms (e.g. Turf / 芝, Front Runner / 逃げ, Pace Chaser / 先行, Late Surger / 差し, End Closer / 追込).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Client-side React 18)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with PostCSS & Autoprefixer
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with `localStorage` persistence
- **Drag & Drop**: [`@dnd-kit/core`](https://dndkit.com/) & `@dnd-kit/sortable`
- **Charts & Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **URL Compression**: [lz-string](https://github.com/pieroxy/lz-string)
- **Image Generation**: [html-to-image](https://github.com/bubkoo/html-to-image)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/umamusume-oshi-analyzer.git
   cd umamusume-oshi-analyzer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` – Starts the development server at `http://localhost:3000`.
- `npm run build` – Builds the production-ready static application.
- `npm run start` – Starts the production Next.js server.
- `npm run lint` – Runs ESLint code checks.

---

## 📁 Project Structure

```
├── public/                # Static assets & public images
├── src/
│   ├── app/               # Next.js App Router root layout and pages
│   ├── components/        # React UI components
│   │   ├── modals/        # Action, Export, Trainee, and Confirmation Modals
│   │   ├── views/         # Dashboard, Roster, Database, Sorter, Archetype, & Presets views
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── data/              # Trainee dataset & portrait image mapping
│   ├── hooks/             # Custom React hooks (useRosterHydration)
│   ├── types/             # TypeScript interfaces (Trainee, Aptitude, Sorter, etc.)
│   └── utils/             # Calculator logic, URL serializer, Sorter engine, grade styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

*Umamusume: Pretty Derby* assets and character names are trademarks and copyrights of Cygames, Inc.
