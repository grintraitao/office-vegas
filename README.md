# OfficeVegas

Team gamification app - Bien cong viec thanh game!

## Features

### Employee
- Submit task outcomes de nhan coins tu manager
- Choi xo so Low-High voi multiplier (x1.5 - x10)
- Xem leaderboard va team progress
- Theo doi lich su task ca nhan

### Manager
- Review va approve/reject tasks
- Phan bo coins cho employees
- Tao va quan ly game/sprint
- Xem thong ke team contributions

### Gamification
- Lottery system voi dual slider (chon LOW/HIGH range)
- Monthly leaderboard voi chart lich su
- Team progress bar huong toi muc tieu chung
- Bonus coins cho Top 1/2/3 cuoi moi sprint

## Tech Stack

- **Frontend**: Vue 3 + TypeScript
- **Styling**: Tailwind CSS
- **State**: Pinia
- **Routing**: Vue Router
- **Build**: Vite

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Demo Accounts

| Name | Nickname             | Role     | Coins |
|------|----------------------|----------|-------|
| Quoc | Tieu Nhan            | Employee | 150   |
| Tin  | Thay Tin             | Employee | 280   |
| Long | Vietlish Expert      | Employee | 95    |
| Tung | Tung Tung Tung Sahur | Employee | 120   |
| Hieu | Hieu thu 3           | Manager  | 0     |

## Project Structure

```
src/
├── components/
│   ├── employee/        # Employee-specific components
│   │   ├── MyTasksList.vue
│   │   ├── StatsBar.vue
│   │   └── SubmitTaskForm.vue
│   ├── manager/         # Manager-specific components
│   │   ├── CreateGameModal.vue
│   │   ├── GameControl.vue
│   │   ├── ManagerStatsBar.vue
│   │   ├── PendingTaskCard.vue
│   │   ├── PendingTasksList.vue
│   │   └── RecentlyApproved.vue
│   ├── lottery/         # Lottery game components
│   │   ├── DualSlider.vue
│   │   ├── LotteryGame.vue
│   │   └── LotteryResult.vue
│   ├── shared/          # Shared components
│   │   ├── Leaderboard.vue
│   │   ├── LeaderboardChart.vue
│   │   └── TeamProgress.vue
│   ├── layout/          # Layout components
│   │   ├── AppHeader.vue
│   │   ├── AppLayout.vue
│   │   └── TabBar.vue
│   └── ui/              # Reusable UI components
│       ├── Badge.vue
│       ├── Button.vue
│       ├── Card.vue
│       ├── CoinDisplay.vue
│       ├── Input.vue
│       ├── Modal.vue
│       └── ProgressBar.vue
├── views/
│   ├── auth/            # Authentication pages
│   │   ├── LoginPage.vue
│   │   └── RegisterPage.vue
│   ├── employee/        # Employee pages
│   │   ├── EmployeeDashboard.vue
│   │   ├── EmployeeLeaderboard.vue
│   │   └── EmployeeLottery.vue
│   ├── manager/         # Manager pages
│   │   ├── ManagerDashboard.vue
│   │   ├── ManagerLeaderboard.vue
│   │   └── ManagerReviews.vue
│   └── HomePage.vue
├── stores/              # Pinia stores
│   ├── user.ts          # User state & authentication
│   ├── game.ts          # Game/sprint & task management
│   ├── lottery.ts       # Lottery game logic
│   └── leaderboard.ts   # Leaderboard history
├── types/               # TypeScript interfaces
├── router/              # Vue Router config
└── lib/                 # Utility functions
```

## Screenshots

Coming soon...

## License

MIT
