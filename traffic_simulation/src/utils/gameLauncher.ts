/**
 * Game Launcher Utility
 * Handles launching different games from the main menu
 */

export interface GameConfig {
    id: string;
    name: string;
    type: 'internal' | 'external';
    path?: string; // Relative path from workspace root
    port?: number; // Port number if external
    url?: string; // Full URL if external
}

export const GAME_CONFIGS: Record<string, GameConfig> = {
    traffic: {
        id: 'traffic',
        name: 'Traffic Simulation',
        type: 'internal',
    },
    Snake: {
        id: 'Snake',
        name: 'Snake and Ladder',
        type: 'external',
        path: '../snake_and_ladder',
        port: 3003, // Port 3003 to avoid conflicts
        url: 'http://localhost:3003', // Home page - user can enter name and start game
    },
    Traveling: {
        id: 'Traveling',
        name: 'Traveling Salesman',
        type: 'external',
        path: '../Travelling-Game',
        port: 3002,
        url: 'http://localhost:3002',
    },
    Tower: {
        id: 'Tower',
        name: 'Tower of Hanoi',
        type: 'external',
        path: '../Hanoi',
        port: 5174, // Vite default is 5173, using 5174
        url: 'http://localhost:5174',
    },
    queens: {
        id: 'queens',
        name: 'Eight Queens Puzzle',
        type: 'external',
        path: '../eight-queens/frontend',
        port: 5175,
        url: 'http://localhost:5175',
    },
};

/**
 * Launches an external game in a new window
 * Shows helpful instructions if game is not running
 */
export function launchExternalGame(gameId: string): void {
    const config = GAME_CONFIGS[gameId];

    if (!config || config.type !== 'external') {
        console.error(`Game ${gameId} is not configured as external or doesn't exist`);
        return;
    }

    if (!config.url) {
        console.error(`No URL configured for game ${gameId}`);
        return;
    }

    // Get instructions for starting this game
    const instructions = getGameStartInstructions(gameId);

    // Try to open the game window
    const gameWindow = window.open(
        config.url,
        `game-${gameId}`,
        'width=1200,height=800,resizable=yes,scrollbars=yes'
    );

    if (!gameWindow) {
        // Popup was blocked
        alert(
            `⚠️ Pop-up blocked!\n\n` +
            `Please allow pop-ups for this site to launch ${config.name}.\n\n` +
            `Alternatively, you can manually navigate to:\n${config.url}\n\n` +
            `Make sure the game is running first:\n\n${instructions}`
        );
        return;
    }

    // Check if the window loaded successfully after a short delay
    // Note: Due to CORS, we can't directly check if the page loaded,
    // but we can show instructions if the user sees an error page
    setTimeout(() => {
        try {
            // If we can access the window and it's still open, check if it has content
            if (gameWindow && !gameWindow.closed) {
                // Window opened successfully
                // If the game isn't running, the user will see an error page
                // We'll show a helpful message after a moment
                setTimeout(() => {
                    // Show instructions in case the game isn't running
                    // The user will see this if they check the console or if we add a notification
                    console.log(
                        `If ${config.name} didn't load, make sure it's running:\n${instructions}`
                    );
                }, 2000);
            }
        } catch (e) {
            // Cross-origin error is expected, window opened successfully
        }
    }, 1000);

    // Also show a helpful notification with instructions
    // (The user can refer to this if the game page shows an error)
    console.info(
        `\n🎮 Launching ${config.name}...\n` +
        `If the game doesn't load, make sure it's running:\n\n${instructions}\n` +
        `URL: ${config.url}\n`
    );
}

/**
 * Gets start instructions for a game
 */
function getGameStartInstructions(gameId: string): string {
    const instructions: Record<string, string> = {
        Snake: `cd snake_and_ladder\nset PORT=3003\nnpm start`,
        Traveling: `cd Travelling-Game\nset PORT=3002\nnpm start`,
        Tower: `cd Hanoi\nnpm run dev -- --port 5174`,
        queens: `cd eight-queens\\frontend\nnpm run dev -- --port 5175`,
    };

    return instructions[gameId] || 'Check the game folder for start instructions';
}

/**
 * Checks if a game is internal (rendered in current app) or external
 */
export function isInternalGame(gameId: string): boolean {
    const config = GAME_CONFIGS[gameId];
    return config?.type === 'internal';
}

/**
 * Gets the game configuration
 */
export function getGameConfig(gameId: string): GameConfig | undefined {
    return GAME_CONFIGS[gameId];
}

