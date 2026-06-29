<div align="center">
  <img src="src/assets/Veltrix text logo.svg" alt="Veltrix Logo" width="80" height="80" style="margin-bottom: 20px;" />
  
  # Veltrix
  
  ### *Autonomous AI Marketing Platform*

  [![React](https://img.shields.io/badge/React-19.0-blue?logo=react&logoColor=white&style=flat-square)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript&logoColor=white&style=flat-square)](#)
  [![Vite](https://img.shields.io/badge/Vite-8.1-purple?logo=vite&logoColor=white&style=flat-square)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwind-css&logoColor=white&style=flat-square)](#)
  [![Oxlint](https://img.shields.io/badge/Oxlint-1.69-orange?logo=oxc&logoColor=white&style=flat-square)](#)

  **Veltrix** is an immersive, next-generation autonomous AI marketing platform that lets you design, test, optimize, and deploy high-converting campaigns across Meta, Google, X, TikTok, and Email—all powered by intelligent agents.

  [veltrix-mu.vercel.app](https://veltrix-mu.vercel.app)
</div>

---

## ✨ Features

- ⚡ **Autonomous AI Campaign Studio**: Define your product hooks, select tone/audience parameters, and generate high-impact copywriting & media creatives in seconds.
- 🎯 **Omnichannel Precision**: Tailored outputs optimized for Meta Sponsored Ads, Google Search Ads, X (Twitter) Posts, and Email Newsletters.
- 📊 **Predictive Campaign Analytics**: Live forecasting metrics covering estimated Click-Through Rate (CTR), Cost Per Acquisition (CPA), and Quality Scores.
- 🌊 **Liquid Motion & Glassmorphism UI**: Beautiful, weightless visual design implementing custom glass backgrounds, Outfit typography, smooth animations, and Lenis inertia scrolling.
- 🔐 **Secure Auth Flow**: Seamless customer onboarding, login, and registration modules designed with robust TypeScript forms and validation states.

---

## 🛠️ Technology Stack

### Frontend & Core
- **Framework:** React 19 (TypeScript)
- **Bundler & Build Tool:** Vite 8
- **Router:** React Router DOM v7
- **Linting & Code Quality:** Oxlint (for ultra-fast static analysis)

### Design & Motion
- **CSS Framework:** Tailwind CSS v3
- **Animations:** Motion (formerly Framer Motion)
- **Smooth Scroll:** Lenis (Inertia scrolling engine)
- **Icons:** Lucide React

---

## 📁 Repository Structure

```text
├── .agents/               # Custom agent skills, presets, and references
├── agent/                 # Agent logic directories
├── public/                # Static assets (Favicons, images)
├── src/
│   ├── assets/            # Fonts, media assets, and vector logos
│   ├── components/        # Reusable UI component modules
│   │   ├── BlurText.tsx   # Text entry animation layout
│   │   ├── FAQ.tsx        # Collapsible accordion item listings
│   │   ├── Features.tsx   # Detailed functional spotlight panels
│   │   ├── Footer.tsx     # Site map and licensing layout
│   │   ├── Hero.tsx       # Video-backed landing intro section
│   │   ├── Navbar.tsx     # Fluid blur-backdrop navigation head
│   │   ├── Playground.tsx # Interactive AI creative testing workshop
│   │   ├── Pricing.tsx    # Campaign tiers & subscriptions grid
│   │   └── Stats.tsx      # Marketing efficacy telemetry
│   ├── pages/             # Route-level view controllers
│   │   ├── Home.tsx       # Main marketing landing index
│   │   ├── Login.tsx      # Secure account entry workspace
│   │   └── Register.tsx   # Detailed user enrollment workspace
│   ├── index.css          # Styling tokens, variables, & fonts
│   └── main.tsx           # Application routing and entry hook
├── .gitattributes         # GitHub Linguist statistics configuration
├── tailwind.config.ts     # Styling constraints and custom tokens
├── tsconfig.json          # TypeScript project compiler guidelines
└── vite.config.ts         # Vite bundler rules and plugin configs
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nimalanrao/Veltrix.git
   cd Veltrix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch local development server:
   ```bash
   npm run dev
   ```

4. Open the local site:
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧹 Code Quality

This project utilizes `oxlint` for high-performance static analysis. You can trigger the linter locally by running:

```bash
npm run lint
```
