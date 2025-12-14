# Complete Setup Guide - Step by Step

## ⚠️ IMPORTANT: Follow These Steps in Order

### Step 1: Verify Node.js is Installed

Open Command Prompt and run:
```bash
node --version
npm --version
```

If you get "not recognized", install Node.js from https://nodejs.org/ (LTS version recommended)

### Step 2: Install All Dependencies

**Run this FIRST (double-click or run from terminal):**
```
install-all-dependencies.bat
```

This will:
- Create `.env` files for port configuration
- Install all npm packages for all games
- Verify installations

**Wait for it to complete** - this may take 5-15 minutes depending on your internet speed.

### Step 3: Start All Games

**After Step 2 completes successfully, run:**
```
start-all-games.bat
```

This will:
- Check that dependencies are installed
- Start all 5 games in separate terminal windows
- Show you the URLs for each game

### Step 4: Access the Main Menu

1. Wait for all games to start (you'll see "Local: http://localhost:XXXX" in each terminal)
2. Open your browser
3. Go to: `http://localhost:3000`
4. You should see the Algoverse game menu
5. Click "Launch Game" on any game card

## Expected Terminal Windows

When `start-all-games.bat` runs, you should see 5 terminal windows open:

1. **Traffic Simulation** - Port 3000 (Main Hub)
2. **Snake and Ladder** - Port 3001
3. **Traveling Salesman** - Port 3002
4. **Tower of Hanoi** - Port 5174
5. **Eight Queens** - Port 5175

## Troubleshooting

### If a game doesn't start:

1. **Check the terminal window** for that game - it will show the error
2. **Common errors:**
   - `'vite' is not recognized` → Run `npm install` in that game's folder
   - `'react-scripts' is not recognized` → Run `npm install` in that game's folder
   - `Port already in use` → Close the program using that port
   - `Module not found` → Run `npm install` in that game's folder

### If install-all-dependencies.bat fails:

1. Make sure you have internet connection
2. Make sure Node.js is installed
3. Try installing games one by one manually:
   ```bash
   cd traffic_simulation && npm install
   cd ../snake_and_ladder && npm install
   cd ../Travelling-Game && npm install
   cd ../Hanoi && npm install
   cd ../eight-queens/frontend && npm install
   ```

### If start-all-games.bat doesn't work:

1. Check that `node_modules` folders exist in each game directory
2. Try starting games manually one by one to see which one fails
3. Check each terminal window for specific error messages

## Verification Checklist

After running `install-all-dependencies.bat`, verify:

- [ ] `traffic_simulation/node_modules` exists
- [ ] `snake_and_ladder/node_modules` exists
- [ ] `Travelling-Game/node_modules` exists
- [ ] `Hanoi/node_modules` exists
- [ ] `eight-queens/frontend/node_modules` exists
- [ ] `snake_and_ladder/.env` exists with `PORT=3001`
- [ ] `Travelling-Game/.env` exists with `PORT=3002`

## Quick Reference

**Install dependencies:**
```bash
install-all-dependencies.bat
```

**Start all games:**
```bash
start-all-games.bat
```

**Main hub URL:**
```
http://localhost:3000
```

## Still Having Issues?

1. Check `TROUBLESHOOTING.md` for detailed solutions
2. Check each game's terminal window for specific error messages
3. Make sure all `node_modules` folders exist
4. Verify Node.js and npm are working: `node --version` and `npm --version`

