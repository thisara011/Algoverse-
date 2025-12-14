// Utility function to update player stats in the main hub
// This allows external games to update the player profile

const PROJECT_ID = "ddzxvknrczvhwmposomw";
const PUBLIC_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkenh2a25yY3p2aHdtcG9zb213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzA1MDgsImV4cCI6MjA4MDc0NjUwOH0.9vdx1rspn5T0hzzs47BYCuiqqBQAszJH_Av6j82lIP0";

/**
 * Updates player stats in the main hub
 * @param {string} playerName - Player's name
 * @param {boolean} won - Whether the player won
 * @param {number} timeTaken - Time taken in milliseconds
 */
export const updatePlayerStats = async (playerName, won, timeTaken = 0) => {
    try {
        // Try to get userId from localStorage (if available)
        let userId = null;
        try {
            const userData = localStorage.getItem('algoverse_user');
            if (userData) {
                const user = JSON.parse(userData);
                userId = user.id;
            }
        } catch (e) {
            // localStorage not available or invalid
        }

        const response = await fetch(
            `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-2f7c4d80/update-stats`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${PUBLIC_ANON_KEY}`,
                },
                body: JSON.stringify({
                    userId: userId || null,
                    playerName: playerName || null,
                    gameType: 'queens',
                    won,
                    timeTaken,
                }),
            }
        );

        if (!response.ok) {
            console.warn('Failed to update player stats:', await response.text());
        }
    } catch (error) {
        // Silently fail - stats update is optional
        console.warn('Could not update player stats:', error);
    }
};

