# OfficeVegas 🎰

Team gamification app - Biến công việc thành game!

## Features

### Employee
- Submit task outcomes để nhận coins từ manager
- Chơi xổ số Low-High với multiplier (x1.5 - x10)
- Đổi coins lấy rewards (voucher, ngày nghỉ, quà...)
- Xem leaderboard và team progress
- Theo dõi lịch sử task và redemption cá nhân

### Manager
- Review và approve/reject tasks
- Phân bổ coins cho employees
- Tạo và quản lý game/sprint
- Quản lý reward catalog (thêm/sửa/xóa rewards)
- Approve/reject redemption requests
- Xem thống kê team contributions

### Gamification
- **Lottery System**: Dual slider để chọn LOW/HIGH range với odds tự động
- **Rewards Shop**: Đổi coins lấy real rewards
- **Monthly Leaderboard**: Chart lịch sử với ranking
- **Team Progress**: Progress bar hướng tới mục tiêu chung
- **Sprint Bonuses**: Bonus coins cho Top 1/2/3 cuối mỗi sprint

### Theme System
App hỗ trợ 5 themes với CSS Variables:
- ☀️ **Light** - Clean, professional look
- 🌙 **Dark** - Easy on the eyes
- 🎰 **Vegas** - Glassmorphism casino vibes
- 🤖 **Cyberpunk** - Neon cyan & magenta
- 💎 **Luxury** - Gold & black premium feel

Theme selector nằm ở header, setting được lưu vào localStorage.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript (Composition API)
- **Styling**: Tailwind CSS v4 + CSS Variables theming
- **State**: Pinia (stores for user, game, lottery, leaderboard, reward, theme)
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
├── assets/
│   └── main.css            # Theme system & global styles
├── components/
│   ├── employee/           # Employee-specific components
│   │   ├── MyTasksList.vue
│   │   ├── StatsBar.vue
│   │   └── SubmitTaskForm.vue
│   ├── manager/            # Manager-specific components
│   │   ├── AddRewardModal.vue
│   │   ├── CreateGameModal.vue
│   │   ├── GameControl.vue
│   │   ├── ManagerStatsBar.vue
│   │   ├── PendingRedemptions.vue
│   │   ├── PendingTaskCard.vue
│   │   ├── PendingTasksList.vue
│   │   ├── RecentlyApproved.vue
│   │   └── RewardManageCard.vue
│   ├── lottery/            # Lottery game components
│   │   ├── DualSlider.vue
│   │   ├── LotteryGame.vue
│   │   └── LotteryResult.vue
│   ├── redeem/             # Reward redemption components
│   │   ├── MyRedemptions.vue
│   │   ├── RewardCard.vue
│   │   └── RewardsList.vue
│   ├── shared/             # Shared components
│   │   ├── Leaderboard.vue
│   │   ├── LeaderboardChart.vue
│   │   └── TeamProgress.vue
│   ├── layout/             # Layout components
│   │   ├── AppHeader.vue
│   │   ├── AppLayout.vue
│   │   └── TabBar.vue
│   └── ui/                 # Reusable UI components
│       ├── Badge.vue
│       ├── Button.vue
│       ├── Card.vue
│       ├── CoinDisplay.vue
│       ├── Input.vue
│       ├── Modal.vue
│       └── ProgressBar.vue
├── views/
│   ├── auth/               # Authentication pages
│   │   ├── LoginPage.vue
│   │   └── RegisterPage.vue
│   ├── employee/           # Employee pages
│   │   ├── EmployeeDashboard.vue
│   │   ├── EmployeeLeaderboard.vue
│   │   ├── EmployeeLottery.vue
│   │   └── EmployeeRedeem.vue
│   ├── manager/            # Manager pages
│   │   ├── ManagerDashboard.vue
│   │   ├── ManagerLeaderboard.vue
│   │   ├── ManagerReviews.vue
│   │   └── ManagerRewards.vue
│   └── HomePage.vue
├── stores/                 # Pinia stores
│   ├── user.ts             # User state & authentication
│   ├── game.ts             # Game/sprint & task management
│   ├── lottery.ts          # Lottery game logic
│   ├── leaderboard.ts      # Leaderboard history
│   ├── reward.ts           # Rewards & redemptions
│   ├── theme.ts            # Theme management
│   └── index.ts            # Store exports
├── types/                  # TypeScript interfaces
├── router/                 # Vue Router config
└── lib/                    # Utility functions
```

## Theming

App sử dụng CSS Variables cho theming. Tất cả colors được define trong `main.css`:

```css
[data-theme="vegas"] {
  --color-bg-base: 26 26 46;
  --color-bg-surface: 22 33 62;
  --color-text-base: 255 255 255;
  --color-primary: 139 92 246;
  --color-card-bg: 255 255 255 / 0.1;
  --blur-strength: 12px;
}
```

Utility classes tự động adapt theo theme:
- `text-base`, `text-muted`, `text-faint` - Text colors
- `bg-base`, `bg-surface`, `bg-elevated` - Backgrounds
- `card`, `glass`, `glass-dark` - Card/glass effects
- `btn-primary`, `btn-secondary` - Buttons

## License

MIT
