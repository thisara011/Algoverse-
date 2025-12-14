# Troubleshooting Guide - Games Not Starting

## Common Issues and Solutions

### Issue: Only Traffic Simulation and Traveling Salesman are working

This usually means the other games (Snake and Ladder, Tower of Hanoi, Eight Queens) are not starting properly.

## Solutions

### 1. Check if node_modules are installed

Each game needs its dependencies installed. Run this in each game folder:

```bash
# Snake and Ladder
cd snake_and_ladder
npm install

# Tower of Hanoi
cd Hanoi
npm install

# Eight Queens Frontend
cd eight-queens/frontend
npm install
```

### 2. Check Terminal Windows

When you run `start-all-games.bat`, check each terminal window for error messages:

- **Snake and Ladder terminal**: Look for errors like "module not found" or "port already in use"
- **Tower of Hanoi terminal**: Check for Vite errors
- **Eight Queens terminal**: Check for missing dependencies

### 3. Port Conflicts

If you see "port already in use" errors:

**Windows:**
```bash
netstat -ano | findstr :3001
netstat -ano | findstr :5174
netstat -ano | findstr :5175
```

Kill the process using:
```bash
taskkill /PID <process_id> /F
```

### 4. Manual Start (To See Errors)

Start each game manually to see what's wrong:

**Snake and Ladder:**
```bash
cd snake_and_ladder
npm start
```
Should show: `Local: http://localhost:3001`

**Tower of Hanoi:**
```bash
cd Hanoi
npm run dev
```
Should show: `Local: http://localhost:5174`

**Eight Queens:**
```bash
cd eight-queens/frontend
npm run dev
```
Should show: `Local: http://localhost:5175`

### 5. Check .env Files

The `.env` files should exist:
- `snake_and_ladder/.env` should contain: `PORT=3001`
- `Travelling-Game/.env` should contain: `PORT=3002`

### 6. Verify Vite Configs

Check that these files have the correct ports:
- `Hanoi/vite.config.js` - should have `port: 5174`
- `eight-queens/frontend/vite.config.js` - should have `port: 5175`

## Quick Fix Checklist

1. ✅ Run `npm install` in each game folder
2. ✅ Check terminal windows for error messages
3. ✅ Verify ports are not in use
4. ✅ Check .env files exist
5. ✅ Verify vite.config.js files have correct ports
6. ✅ Try starting games manually to see errors

## Still Not Working?

If a specific game still doesn't start:

1. Open its terminal window from the batch script
2. Copy the error message
3. Check if it's a missing dependency, port conflict, or configuration issue
4. The error message will tell you exactly what's wrong

## Expected Behavior

When all games are running, you should see:
- ✅ 5 terminal windows open
- ✅ Each showing "Local: http://localhost:XXXX"
- ✅ No error messages in any terminal
- ✅ All games accessible from main menu at `http://localhost:3000`

