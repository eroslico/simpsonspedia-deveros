# 🍩 Simpsonspedia

<div align="center">

![Simpsonspedia Banner](https://img.shields.io/badge/Simpsonspedia-FFD93D?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PC9zdmc+&logoColor=black)

**The Ultimate Encyclopedia of The Simpsons Universe**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)

[Live Demo](#) • [Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About

Simpsonspedia is a comprehensive, feature-rich web application dedicated to The Simpsons universe. Built as a portfolio project, it showcases modern web development practices including React, TypeScript, and Progressive Web App capabilities.

Explore characters, episodes, and locations from Springfield. Play trivia games, create memes, track your progress, and much more!

---

## ✨ Features

### 🎭 Core Features
- **Characters Database** - Browse 100+ characters with detailed profiles
- **Episodes Guide** - Explore 750+ episodes across 35+ seasons
- **Locations Directory** - Discover iconic Springfield locations
- **Advanced Search** - Find anything with powerful filters

### 🎮 Interactive Features
- **Trivia Game** - Test your knowledge with timed questions and streaks
- **Personality Quiz** - Find out which Simpson character you are
- **Meme Generator** - Create and download custom Simpsons memes
- **Soundboard** - Play famous catchphrases and quotes
- **Character Comparator** - Compare characters side by side

### 📊 Data & Progress
- **Favorites System** - Save your favorite content
- **Episode Timeline** - Track watched episodes visually
- **Reviews & Ratings** - Rate and review episodes
- **User Profile** - Track your stats and achievements
- **16 Achievements** - Unlock badges as you explore

### 🔮 Unique Features
- **Predictions Page** - Famous Simpsons predictions that came true
- **Family Tree** - Interactive Simpson family visualization
- **On This Day** - Episodes that aired on today's date
- **Character of the Day** - Daily featured character

### 🛠 Technical Features
- **PWA Support** - Install as a native app
- **Offline Mode** - Works without internet
- **Dark Mode** - Beautiful night theme
- **i18n** - English and Spanish support
- **Data Export/Import** - Backup your progress
- **Easter Eggs** - Hidden surprises to discover!

---

## 📸 Screenshots

<div align="center">

| Home Page | Characters | Trivia |
|:-:|:-:|:-:|
| 🏠 Hero with animations | 👥 Grid with filters | 🧠 Timed questions |

| Meme Generator | Family Tree | Profile |
|:-:|:-:|:-:|
| 🎨 Create & download | 🌳 Interactive tree | 👤 Stats & achievements |

</div>

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/simpsonspedia.git

# Navigate to project directory
cd simpsonspedia

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
No environment variables required! The app uses a public API.

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful components
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching

### Build & Tools
- **Vite** - Fast build tool
- **ESLint** - Code linting
- **PostCSS** - CSS processing

### Features
- **PWA** - Service Worker for offline
- **i18n** - Custom translation system
- **LocalStorage** - Persistent data

### API
- [The Simpsons API](https://thesimpsonsapi.com/) - Character, episode, and location data

---

## 📁 Project Structure

```
simpsonspedia/
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service Worker
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/            # Shadcn components
│   │   ├── Navbar.tsx
│   │   ├── CharacterModal.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useFavorites.ts
│   │   ├── useTheme.ts
│   │   └── ...
│   ├── i18n/              # Translations
│   │   └── translations.ts
│   ├── pages/             # Route pages
│   │   ├── Index.tsx
│   │   ├── Characters.tsx
│   │   ├── Trivia.tsx
│   │   └── ...
│   ├── lib/               # Utilities
│   ├── App.tsx            # Main app component
│   └── index.css          # Global styles
└── package.json
```

---

## 🎯 Key Features Breakdown

### Trivia Game
- 25+ questions across multiple categories
- 15-second timer per question
- Streak bonuses for consecutive correct answers
- High score tracking with localStorage

### Achievement System
- 16 unlockable achievements
- 4 categories: Explorer, Collector, Trivia, Dedication
- Progress tracking with visual indicators

### Meme Generator
- Select from 100+ character images
- 4 text templates (top/bottom, caption, etc.)
- 5 color options
- Canvas-based image generation
- Direct download as PNG

### Family Tree
- Pan and zoom navigation
- 12 family members across 3 generations
- Marriage and parent-child connections
- Detailed info modals

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| Mobile | ✅ Full + PWA |

---

## 📱 PWA Features

- ✅ Installable on desktop and mobile
- ✅ Offline support with caching
- ✅ App shortcuts
- ✅ Splash screen
- ✅ Push notification ready

---

## 🎨 Theming

### Light Mode
- Simpsons yellow (#FFD93D) as primary
- Sky blue accents
- Warm, cheerful aesthetic

### Dark Mode
- Deep purple/blue background
- Neon accents
- "Springfield at Night" theme

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational and portfolio purposes only.

**The Simpsons™** and all related characters are property of **20th Century Fox** and **The Walt Disney Company**.

---

## 👨‍💻 Author

**Your Name**

- Portfolio: [yourportfolio.com](#)
- LinkedIn: [linkedin.com/in/yourprofile](#)
- GitHub: [@yourusername](#)

---

## 🙏 Acknowledgments

- [The Simpsons API](https://thesimpsonsapi.com/) for providing the data
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Lucide Icons](https://lucide.dev/) for the icon set
- The Simpsons creators and fans worldwide

---

<div align="center">

**Made with 💛 by Simpsons fans, for Simpsons fans**

*D'oh! You've reached the end of the README!* 🍩

</div>
