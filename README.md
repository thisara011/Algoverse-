<div align="center">

# 🚀 **ALGOVERSE** 🚀

### *Where Algorithms Meet Adventure*

[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.87+-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**A unified gaming platform that transforms complex algorithms into interactive, engaging experiences**

[Features](#-features) • [Games](#-games) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Contributing](#-contributing)

---

</div>

## 📖 **About**

**Algoverse** is a revolutionary educational gaming platform that combines **5 unique algorithm-based games** into a single, seamless experience. Built with modern web technologies, Algoverse makes learning computer science concepts fun, interactive, and visually stunning.

Whether you're a student learning algorithms, a developer brushing up on fundamentals, or just someone who loves puzzle games, Algoverse offers an immersive journey through the world of computational thinking.

---

## ✨ **Features**

### 🎮 **Unified Gaming Hub**
- **Single Sign-On**: One account, all games
- **Centralized Profile**: Track your progress across all games
- **Seamless Navigation**: Switch between games without losing your place
- **Real-time Statistics**: Monitor your performance and achievements

### 🎯 **Interactive Learning**
- **Visual Algorithm Execution**: Watch algorithms solve problems in real-time
- **Multiple Difficulty Levels**: From beginner to expert challenges
- **Performance Metrics**: Compare your solutions with optimal algorithms
- **Educational Feedback**: Learn why algorithms make specific choices

### 🎨 **Modern UI/UX**
- **Cyberpunk Aesthetic**: Neon-glowing interfaces with futuristic designs
- **Responsive Design**: Works seamlessly on desktop and tablet
- **Smooth Animations**: Polished transitions and visual effects
- **Accessibility**: Keyboard navigation and screen reader support

### 💾 **Data Persistence**
- **Cloud Storage**: Supabase-powered backend for secure data storage
- **Leaderboards**: Compete with players worldwide
- **Progress Tracking**: Save your game state and resume anytime
- **Statistics Dashboard**: Detailed analytics of your gameplay

---

## 🎮 **Games**

### 1. 🚦 **Traffic Simulation**
**Master Maximum Flow Algorithms**

Navigate through complex traffic networks and optimize flow using Ford-Fulkerson and Edmonds-Karp algorithms. Build your network, set capacities, and watch the algorithms find the optimal path.

- **Algorithms**: Ford-Fulkerson, Edmonds-Karp
- **Concepts**: Network Flow, Graph Theory, Optimization
- **Difficulty**: Beginner to Advanced

---

### 2. 🐍 **Snake and Ladder**
**Race Against Sorting Algorithms**

A unique twist on the classic game! Compete against sorting algorithms (Bubble Sort, Quick Sort, Merge Sort) as you race up the board. Guess which algorithm will win and learn their characteristics.

- **Algorithms**: Bubble Sort, Quick Sort, Merge Sort, Heap Sort
- **Concepts**: Sorting Algorithms, Time Complexity, Algorithm Comparison
- **Difficulty**: Beginner to Intermediate

---

### 3. 🗺️ **Traveling Salesman**
**Optimize Your Route**

Plan the shortest route through multiple cities using different TSP solving strategies. Compare your manual solutions with brute force, nearest neighbor, and dynamic programming approaches.

- **Algorithms**: Brute Force, Nearest Neighbor, Dynamic Programming
- **Concepts**: Combinatorial Optimization, NP-Hard Problems, Heuristics
- **Difficulty**: Intermediate to Advanced
- **Theme**: Cyberpunk aesthetic with distance matrix visualization

---

### 4. 🗼 **Tower of Hanoi**
**Master Recursive Problem Solving**

Solve the classic Tower of Hanoi puzzle with varying disk counts. Choose between 3-peg classic mode or 4-peg Reve's Puzzle variant. Learn recursion and optimal move strategies.

- **Algorithms**: Recursive Solution, Iterative Approach
- **Concepts**: Recursion, Divide and Conquer, Optimal Substructure
- **Difficulty**: Beginner to Expert
- **Variants**: 3-Peg Classic, 4-Peg Reve's Puzzle

---

### 5. ♛ **Eight Queens Puzzle**
**Place Queens Strategically**

Place 8 queens on a chessboard so that none can attack each other. Submit your solutions and see how they compare with algorithmic solutions using sequential and threaded approaches.

- **Algorithms**: Backtracking, Constraint Satisfaction
- **Concepts**: Constraint Satisfaction Problems, Backtracking, Parallel Processing
- **Difficulty**: Intermediate
- **Features**: Real-time validation, solution statistics

---

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18.3+** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Serverless functions
  - Real-time subscriptions

### **Game-Specific Technologies**
- **React Router** - Navigation (Snake and Ladder)
- **Konva/React-Konva** - Canvas rendering (Traveling Salesman)
- **Three.js** - 3D graphics (Snake and Ladder)
- **Chart.js** - Data visualization (Tower of Hanoi)

### **Development Tools**
- **ESLint** - Code linting
- **Jest** - Testing framework
- **Git** - Version control

---

## 📦 **Installation**

### **Prerequisites**
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Git** (for cloning the repository)

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Algoverse-.git
   cd Algoverse-
   ```

2. **Install all dependencies** (Windows)
   ```bash
   install-all-dependencies.bat
   ```
   
   Or manually install for each game:
   ```bash
   cd traffic_simulation && npm install
   cd ../snake_and_ladder && npm install
   cd ../Travelling-Game && npm install
   cd ../Hanoi && npm install
   cd ../eight-queens/frontend && npm install
   cd ../eight-queens/backend && npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in `traffic_simulation/`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   Similar setup may be required for other games. Check individual game READMEs for details.

4. **Start all games** (Windows)
   ```bash
   start-all-games.bat
   ```
   
   This will start all games on their respective ports:
   - Main Hub: `http://localhost:3000`
   - Snake and Ladder: `http://localhost:3003`
   - Traveling Salesman: `http://localhost:3002`
   - Tower of Hanoi: `http://localhost:5174`
   - Eight Queens: `http://localhost:5175`
   - Eight Queens API: `http://localhost:3001`

5. **Open the main hub**
   ```
   http://localhost:3000
   ```

### **Manual Start (Alternative)**

If you prefer to start games individually:

```bash
# Terminal 1 - Main Hub
cd traffic_simulation
npm run dev

# Terminal 2 - Snake and Ladder
cd snake_and_ladder
set PORT=3003 && npm start

# Terminal 3 - Traveling Salesman
cd Travelling-Game
set PORT=3002 && npm start

# Terminal 4 - Tower of Hanoi
cd Hanoi
npm run dev

# Terminal 5 - Eight Queens Backend
cd eight-queens/backend
npm start

# Terminal 6 - Eight Queens Frontend
cd eight-queens/frontend
npm run dev
```

### **Stopping All Games** (Windows)
```bash
stop-all-games.bat
```

---

## 🚀 **Usage**

### **First Time Setup**

1. **Launch the main hub** at `http://localhost:3000`
2. **Create an account** or **log in** with existing credentials
3. **Explore the main menu** to see all available games
4. **Click on any game** to launch it

### **Playing Games**

- **Traffic Simulation**: Build networks, set capacities, and run flow algorithms
- **Snake and Ladder**: Enter your name, make guesses, and race against algorithms
- **Traveling Salesman**: Select cities, build your route, and compare with algorithms
- **Tower of Hanoi**: Choose difficulty, solve puzzles, and track your moves
- **Eight Queens**: Place queens on the board and submit valid solutions

### **Viewing Statistics**

- Click on your **profile icon** in the main menu
- View your **game statistics** across all games
- Check your **achievements** and **leaderboard rankings**

### **Navigation**

- Use the **"Back to Menu"** button in each game to return to the main hub
- Games are embedded seamlessly using iframes
- Your progress is automatically saved

---

## 🏗️ **Architecture**

### **System Overview**

```
┌─────────────────────────────────────────────────────────┐
│                  Main Hub (Port 3000)                   │
│              traffic_simulation/                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  User Authentication & Profile Management        │  │
│  │  Game Launcher & Iframe Manager                  │  │
│  │  Statistics Aggregation                          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Snake &      │ │ Traveling    │ │ Tower of     │
│ Ladder       │ │ Salesman     │ │ Hanoi        │
│ (Port 3003)  │ │ (Port 3002)  │ │ (Port 5174)  │
└──────────────┘ └──────────────┘ └──────────────┘
                        │
                        ▼
                ┌──────────────┐
                │ Eight Queens │
                │ (Port 5175) │
                │ + API 3001  │
                └──────────────┘
```

### **Communication Flow**

1. **Main Hub** launches games via iframes
2. **Games** communicate with hub using `postMessage` API
3. **Statistics** are sent to hub's `/update-stats` endpoint
4. **User data** is stored in Supabase database
5. **Authentication** is handled centrally by the main hub

### **Project Structure**

```
Algoverse-/
├── traffic_simulation/          # Main hub application
│   ├── src/
│   │   ├── components/          # Game components & UI
│   │   ├── supabase/            # Backend functions
│   │   └── utils/               # Game launcher & utilities
│   └── package.json
│
├── snake_and_ladder/            # Snake and Ladder game
│   ├── src/
│   │   ├── pages/               # Game pages
│   │   ├── components/          # Game components
│   │   └── utils/               # Game logic & stats
│   └── package.json
│
├── Travelling-Game/             # Traveling Salesman game
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── lib/                 # TSP algorithms
│   │   └── utils/               # Utilities
│   └── package.json
│
├── Hanoi/                       # Tower of Hanoi game
│   ├── src/
│   │   ├── components/          # Game component
│   │   └── utils/               # Solvers & stats
│   └── package.json
│
├── eight-queens/                # Eight Queens game
│   ├── frontend/                # React frontend
│   ├── backend/                 # Node.js API
│   └── package.json
│
├── start-all-games.bat          # Start all games script
├── stop-all-games.bat            # Stop all games script
└── install-all-dependencies.bat # Install dependencies script
```

---

## 🧪 **Testing**

### **Run Tests**

```bash
# Traffic Simulation
cd traffic_simulation
npm test

# Snake and Ladder
cd snake_and_ladder
npm test

# Traveling Salesman
cd Travelling-Game
npm test

# Tower of Hanoi
cd Hanoi
npm test
```

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

### **Ways to Contribute**

1. **🐛 Report Bugs**: Open an issue describing the bug
2. **💡 Suggest Features**: Share your ideas for new games or improvements
3. **📝 Improve Documentation**: Help make our docs better
4. **🎨 Enhance UI/UX**: Improve the visual design and user experience
5. **⚡ Optimize Performance**: Make algorithms faster or reduce bundle size
6. **🧪 Add Tests**: Increase test coverage

### **Development Workflow**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Code Style**

- Follow existing code style and conventions
- Use TypeScript for new components
- Add comments for complex algorithms
- Write tests for new features
- Update documentation as needed

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Supabase** for providing an excellent backend platform
- **React Team** for the amazing framework
- **All Contributors** who have helped improve Algoverse
- **The Algorithm Community** for inspiration and resources

---

## 📧 **Contact & Support**

- **Issues**: [GitHub Issues](https://github.com/yourusername/Algoverse-/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/Algoverse-/discussions)

---

<div align="center">

### **Made with ❤️ and Algorithms**

**Star ⭐ this repo if you find it helpful!**

[⬆ Back to Top](#-algoverse)

</div>

