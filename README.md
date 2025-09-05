# Vue Daily Statuses

A modern team management application designed for daily standup meetings and team coordination. This project helps teams manage their daily routines with random member selection and time tracking capabilities.

## 🎯 Project Purpose

This application is specifically created for **team basic daily setup** where you can:

- **Manage team members** with presence tracking
- **Randomly select team members** to give updates during standups
- **Track time** with built-in timer functionality
- **Organize daily meetings** efficiently

## ✨ Features

### 👥 Team Management
- Add/remove team members with custom avatars
- Track daily presence (present/absent)
- Visual indicators for team member status
- Persistent team data storage

### 🎲 Random Selection System
- **Matrix-style winner selection** with animated interface
- Fair selection ensuring each member can only be selected once
- Only present team members are eligible for selection
- Manual selection/unselection capabilities

### ⏱️ Timer Functionality
- Customizable countdown timer (minutes/seconds)
- Start, pause, and stop controls
- Timer state management with Pinia store
- Integration with selection system (clear only when timer stopped)

### 🎨 Modern UI/UX
- Clean, responsive design
- Matrix-themed selection interface
- Smooth animations and transitions
- Mobile-friendly layout

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

### Build for Production

```sh
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── MatrixWinner/     # Random selection component
│   ├── Spinner/          # Animated spinner component
│   └── common/          # Common components (navigation)
├── features/            # Feature-specific components
│   ├── TeamSettings/    # Team management sidebar
│   └── TimerSettings/   # Timer controls
├── pages/               # Page components
│   └── dashboard/       # Main dashboard view
├── stores/              # Pinia state management
│   ├── teamStore.ts     # Team member data
│   └── timerStore.ts    # Timer state
├── composables/         # Reusable composition functions
└── configuration/       # App configuration
```

## 🎮 How to Use

### 1. Team Setup
- Navigate to the Dashboard
- Use the left sidebar to add team members
- Mark members as present/absent for the day
- Customize avatars and roles

### 2. Random Selection
- Click "SELECT" to randomly choose a team member
- Watch the Matrix-style animation reveal the winner
- Selected members are excluded from future selections
- Use "CLEAR" to reset selections (only when timer is stopped)

### 3. Timer Management
- Set custom time limits for meetings
- Use start/pause/stop controls
- Timer state affects selection clearing capabilities

## 🛠️ Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Pinia** - State management
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with animations
- **Vue Router** - Client-side routing

## 🧪 Testing

### Unit Tests
```sh
npm run test:unit
```

### End-to-End Tests
```sh
# Install browsers for the first run
npx playwright install

# Run E2E tests
npm run test:e2e
```

### Linting
```sh
npm run lint
```

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🔧 Configuration

### IDE Setup
- **VSCode** + **Volar** extension recommended
- Disable Vetur extension for Vue 3 support

### TypeScript Support
- Full TypeScript support for `.vue` files
- Type checking with `vue-tsc`
- Editor integration with Volar

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## �� Support

For support or questions, please open an issue in the GitHub repository.
