# 🎰 OfficeVegas

Team gamification app - Biến công việc thành game!

## Features

- Employee submit task → Manager distribute coins
- Xổ số Low-High với multiplier
- Team progress tracking
- Leaderboard

## Tech Stack

- Vue 3 + TypeScript
- Tailwind CSS
- Pinia
- Vue Router

## Setup

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

## Demo Accounts

| Name  | Nickname    | Role     | Coins |
|-------|-------------|----------|-------|
| Quốc  | Tiểu Nhân   | Employee | 150   |
| Linh  | Linh        | Employee | 280   |
| Nam   | Nam         | Employee | 95    |
| Trang | Trang       | Employee | 120   |
| Hiếu  | Hiếu thứ 3  | Manager  | 0     |

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   └── layout/      # Layout components
├── views/
│   ├── employee/    # Employee pages
│   └── manager/     # Manager pages
├── stores/          # Pinia stores
├── types/           # TypeScript interfaces
└── router/          # Vue Router config
```
