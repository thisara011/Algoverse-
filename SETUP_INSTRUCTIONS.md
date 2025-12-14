# Setup Instructions - First Time Setup

## ⚠️ IMPORTANT: Install Dependencies First!

Before running the games, you **must** install dependencies for each game.

## Quick Setup (Recommended)

### Step 1: Install All Dependencies

Run this **once** before starting games:

```bash
install-all-dependencies.bat
```

This will install all required packages for all games. This may take 5-10 minutes.

### Step 2: Start All Games

After dependencies are installed, run:

```bash
start-all-games.bat
```

## Manual Setup (If Batch Script Doesn't Work)

If the batch script doesn't work, install dependencies manually:

### 1. Traffic Simulation
```bash
cd traffic_simulation
npm install
```

### 2. Snake and Ladder
```bash
cd snake_and_ladder
npm install
```

### 3. Traveling Salesman
```bash
cd Travelling-Game
npm install
```

### 4. Tower of Hanoi
```bash
cd Hanoi
npm install
```

### 5. Eight Queens Frontend
```bash
cd eight-queens/frontend
npm install
```

## Common Errors and Solutions

### Error: 'vite' is not recognized
**Solution:** Run `npm install` in the game folder (Hanoi or eight-queens/frontend)

### Error: 'react-scripts' is not recognized
**Solution:** Run `npm install` in the game folder (snake_and_ladder or Travelling-Game)

### Error: 'npm' is not recognized
**Solution:** 
1. Install Node.js from https://nodejs.org/
2. Restart your terminal/computer
3. Verify with: `node --version` and `npm --version`

## Verification

After installing dependencies, you should see `node_modules` folders in each game directory:

- ✅ `traffic_simulation/node_modules`
- ✅ `snake_and_ladder/node_modules`
- ✅ `Travelling-Game/node_modules`
- ✅ `Hanoi/node_modules`
- ✅ `eight-queens/frontend/node_modules`

## After Setup

Once all dependencies are installed:
1. Run `start-all-games.bat`
2. Wait for all games to start
3. Open `http://localhost:3000` in your browser
4. Click "Launch Game" on any game card

## Notes

- You only need to run `install-all-dependencies.bat` **once** (or when you update packages)
- The `node_modules` folders are large and can be ignored in git
- If you delete `node_modules`, you'll need to run `npm install` again

