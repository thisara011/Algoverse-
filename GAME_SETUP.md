# Algoverse Game Hub - Setup Instructions

This document explains how to set up and run all games in the Algoverse project.

## Overview

The main hub is located in `traffic_simulation/` and serves as the home page menu. From there, you can launch:
- **Traffic Simulation** (internal - runs in the same app)
- **Snake and Ladder** (external - opens in new window)
- **Traveling Salesman** (external - opens in new window)
- **Tower of Hanoi** (external - opens in new window)
- **Eight Queens Puzzle** (external - opens in new window)

## Port Configuration

Each game runs on a different port to avoid conflicts:
- Traffic Simulation: `http://localhost:3000` (main hub)
- Snake and Ladder: `http://localhost:3001`
- Traveling Salesman: `http://localhost:3002`
- Tower of Hanoi: `http://localhost:5174`
- Eight Queens (Frontend): `http://localhost:5175`
- Eight Queens (Backend): `http://localhost:3001` (if needed)

## Setup Instructions

### 1. Traffic Simulation (Main Hub)

```bash
cd traffic_simulation
npm install
npm run dev
```

The main menu will open at `http://localhost:3000`

### 2. Snake and Ladder

**Terminal 2:**
```bash
cd snake_and_ladder
npm install
PORT=3001 npm start
```

Or modify `package.json` to use port 3001, or create a `.env` file with `PORT=3001`

### 3. Traveling Salesman

**Terminal 3:**
```bash
cd Travelling-Game
npm install
PORT=3002 npm start
```

### 4. Tower of Hanoi

**Terminal 4:**
```bash
cd Hanoi
npm install
npm run dev -- --port 5174
```

Or modify `vite.config.js` to set port 5174

### 5. Eight Queens Puzzle

**Terminal 5 (Backend - if needed):**
```bash
cd eight-queens/backend
npm install
# Create .env file with Supabase credentials
npm start
```

**Terminal 6 (Frontend):**
```bash
cd eight-queens/frontend
npm install
npm run dev -- --port 5175
```

## Quick Start Script (Windows)

Create a `start-all-games.bat` file in the root directory:

```batch
@echo off
echo Starting all Algoverse games...
start cmd /k "cd traffic_simulation && npm run dev"
timeout /t 3
start cmd /k "cd snake_and_ladder && set PORT=3001 && npm start"
timeout /t 3
start cmd /k "cd Travelling-Game && set PORT=3002 && npm start"
timeout /t 3
start cmd /k "cd Hanoi && npm run dev -- --port 5174"
timeout /t 3
start cmd /k "cd eight-queens\frontend && npm run dev -- --port 5175"
echo All games are starting! Please wait for them to load.
pause
```

## Quick Start Script (Linux/Mac)

Create a `start-all-games.sh` file in the root directory:

```bash
#!/bin/bash
echo "Starting all Algoverse games..."

# Start Traffic Simulation
cd traffic_simulation && npm run dev &
sleep 3

# Start Snake and Ladder
cd ../snake_and_ladder && PORT=3001 npm start &
sleep 3

# Start Traveling Salesman
cd ../Travelling-Game && PORT=3002 npm start &
sleep 3

# Start Tower of Hanoi
cd ../Hanoi && npm run dev -- --port 5174 &
sleep 3

# Start Eight Queens Frontend
cd ../eight-queens/frontend && npm run dev -- --port 5175 &

echo "All games are starting! Please wait for them to load."
```

Make it executable:
```bash
chmod +x start-all-games.sh
```

## Usage

1. Start all games using the scripts above or manually in separate terminals
2. Open the main hub at `http://localhost:3000`
3. Click "Launch Game" on any game card
4. External games will open in new windows/tabs
5. Internal games (Traffic Simulation) will load in the same window

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
- Check which process is using the port: `netstat -ano | findstr :PORT` (Windows) or `lsof -i :PORT` (Mac/Linux)
- Kill the process or change the port in the game's configuration

### Games Not Opening
- Make sure all games are running before clicking "Launch Game"
- Check browser pop-up blocker settings
- Verify the ports match the configuration in `gameLauncher.ts`

### CORS Issues
If you encounter CORS errors, you may need to configure the games to allow cross-origin requests, or use a proxy setup.

## Notes

- The Traffic Simulation game is integrated directly into the main app
- Other games are separate applications that open in new windows
- Make sure all games are running before trying to launch them from the menu
- Each game maintains its own state and user authentication

