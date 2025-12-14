
  # Traffic Simulation Game Menu - Algoverse Hub

  This is the main hub for the Algoverse game collection. The original Traffic Simulation Game Menu design is available at https://www.figma.com/design/PpInIPqg02BbaCIXtMplyn/Traffic-Simulation-Game-Menu.

  ## Features

  - **Unified Game Hub**: Access all Algoverse games from a single menu
  - **Traffic Simulation**: Play directly in the hub (internal game)
  - **External Games**: Launch other games in new windows
    - Snake and Ladder
    - Traveling Salesman
    - Tower of Hanoi
    - Eight Queens Puzzle

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  The hub will open at `http://localhost:3000`

  ## Launching Games

  1. Start the main hub: `npm run dev` (in traffic_simulation folder)
  2. Start other games on their respective ports (see GAME_SETUP.md in root)
  3. Click "Launch Game" on any game card in the menu
  4. Internal games (Traffic Simulation) load in the same window
  5. External games open in new browser windows/tabs

  ## Game Configuration

  Game launch settings are configured in `src/utils/gameLauncher.ts`. Each game has:
  - Unique ID matching the menu
  - Port configuration
  - Launch URL

  For detailed setup instructions for all games, see `GAME_SETUP.md` in the project root.
  