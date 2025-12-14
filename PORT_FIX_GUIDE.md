# Port Conflict Fix Guide

## Problem
You're getting errors like:
- `Something is already running on port 3001`
- `Error: listen EADDRINUSE: address already in use 0.0.0.0:3002`

This means old game instances are still running and blocking the ports.

## Quick Fix

### Option 1: Use the Stop Script (Easiest)

1. **Run this first:**
   ```
   stop-all-games.bat
   ```
   This will kill all processes using the game ports.

2. **Then start games again:**
   ```
   start-all-games.bat
   ```

### Option 2: Manual Fix

1. **Close all terminal windows** that are running games
2. **Or kill processes manually:**

   Check what's using the ports:
   ```bash
   netstat -ano | findstr ":3001"
   netstat -ano | findstr ":3002"
   ```

   Kill the process (replace PID with the number you see):
   ```bash
   taskkill /PID <PID> /F
   ```

3. **Then start games again:**
   ```
   start-all-games.bat
   ```

### Option 3: Restart Your Computer

If nothing else works, restart your computer to clear all ports.

## Prevention

**Always stop games properly:**
1. Close each game's terminal window
2. Or run `stop-all-games.bat` before starting new instances

## Port Usage

- **Port 3000**: Traffic Simulation (Main Hub)
- **Port 3001**: Snake and Ladder
- **Port 3002**: Traveling Salesman
- **Port 5174**: Tower of Hanoi
- **Port 5175**: Eight Queens

Make sure these ports are free before starting games!

