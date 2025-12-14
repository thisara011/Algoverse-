# Quick Start Guide - Running All Games

## ⚠️ Important
**All external games must be running before you can launch them from the menu!**

## Step-by-Step Instructions

### Option 1: Use the Batch Script (Easiest - Windows)

1. Open a terminal in the root directory (`Algoverse-`)
2. Run: `start-all-games.bat`
3. Wait for all games to start (this may take a few minutes)
4. Open your browser to `http://localhost:3000`
5. Click "Launch Game" on any game card

### Option 2: Manual Start (All Platforms)

Open **5 separate terminal windows** and run these commands:

#### Terminal 1 - Main Hub (Traffic Simulation)
```bash
cd traffic_simulation
npm run dev
```
Wait for: `Local: http://localhost:3000`

#### Terminal 2 - Snake and Ladder
```bash
cd snake_and_ladder
set PORT=3001
npm start
```
Wait for: `Local: http://localhost:3001`

#### Terminal 3 - Traveling Salesman
```bash
cd Travelling-Game
set PORT=3002
npm start
```
Wait for: `Local: http://localhost:3002`

#### Terminal 4 - Tower of Hanoi
```bash
cd Hanoi
npm run dev -- --port 5174
```
Wait for: `Local: http://localhost:5174`

#### Terminal 5 - Eight Queens
```bash
cd eight-queens/frontend
npm run dev -- --port 5175
```
Wait for: `Local: http://localhost:5175`

### For Linux/Mac Users

Replace `set PORT=3001` with `export PORT=3001` in terminals 2 and 3.

## Verification

Once all games are running, you should see:
- ✅ Traffic Simulation: `http://localhost:3000` (main hub)
- ✅ Snake and Ladder: `http://localhost:3001`
- ✅ Traveling Salesman: `http://localhost:3002`
- ✅ Tower of Hanoi: `http://localhost:5174`
- ✅ Eight Queens: `http://localhost:5175`

## Using the Hub

1. Open `http://localhost:3000` in your browser
2. You'll see the main menu with 5 game cards
3. Click "Launch Game" on any card:
   - **Traffic Simulation**: Opens in the same window
   - **Other games**: Open in new browser windows/tabs

## Troubleshooting

### "Game is not running" or blank page
- Make sure you started the game in a separate terminal
- Check that the port number matches (see above)
- Verify the game is running by opening its URL directly in your browser

### Port already in use
- Another application is using that port
- Close the other application or change the port in the game's config

### Pop-up blocked
- Allow pop-ups for `localhost` in your browser settings
- Or manually navigate to the game's URL

## Need Help?

See `GAME_SETUP.md` for detailed setup instructions and troubleshooting.

