import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Helper function to hash password
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// User Registration
app.post('/make-server-2f7c4d80/register', async c => {
  try {
    const body = await c.req.json();
    const { username, email, password, age, gender } = body;

    // Validate input
    if (!username || typeof username !== 'string') {
      return c.json({ error: 'Username is required and must be a string' }, 400);
    }

    if (username.trim().length < 3) {
      return c.json({ error: 'Username must be at least 3 characters' }, 400);
    }

    if (username.trim().length > 30) {
      return c.json({ error: 'Username must be less than 30 characters' }, 400);
    }

    if (!email || typeof email !== 'string') {
      return c.json({ error: 'Email is required' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return c.json({ error: 'Invalid email format' }, 400);
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    if (!age || typeof age !== 'number' || age < 1 || age > 120) {
      return c.json({ error: 'Age must be between 1 and 120' }, 400);
    }

    if (!gender || !['male', 'female', 'other'].includes(gender)) {
      return c.json({ error: 'Gender must be male, female, or other' }, 400);
    }

    // Check if email already exists
    const existingUsers = await kv.getByPrefix('user_');
    const emailExists = existingUsers.some(
      u => u && u.value && u.value.email && u.value.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (emailExists) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    // Check if username already exists
    const usernameExists = existingUsers.some(
      u => u && u.value && u.value.username && u.value.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (usernameExists) {
      return c.json({ error: 'Username already taken' }, 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(userId, {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      age,
      gender,
      createdAt: new Date().toISOString(),
      stats: {
        totalGames: 0,
        totalWins: 0,
        totalTime: 0,
        gameStats: {
          traffic: { played: 0, won: 0 },
          sorting: { played: 0, won: 0 },
          pathfinding: { played: 0, won: 0 },
          binarytree: { played: 0, won: 0 },
          graphcoloring: { played: 0, won: 0 },
        },
      },
    });

    console.log(`User registered: ${username} (${email}) - ${userId}`);
    return c.json({ userId, username: username.trim(), email: email.trim().toLowerCase() });
  } catch (error) {
    console.error('Error registering user:', error);
    return c.json(
      { error: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      500
    );
  }
});

// User Login
app.post('/make-server-2f7c4d80/login', async c => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    // Validate input
    if (!email || typeof email !== 'string') {
      return c.json({ error: 'Email is required' }, 400);
    }

    if (!password || typeof password !== 'string') {
      return c.json({ error: 'Password is required' }, 400);
    }

    // Hash the provided password
    const hashedPassword = await hashPassword(password);

    // Find user by email
    const users = await kv.getByPrefix('user_');
    const user = users.find(
      u => u && u.value && u.value.email && u.value.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Verify password
    if (user.value.password !== hashedPassword) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    console.log(`User logged in: ${user.value.username} (${user.value.email}) - ${user.key}`);
    return c.json({ 
      userId: user.key, 
      username: user.value.username,
      email: user.value.email 
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return c.json(
      { error: `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      500
    );
  }
});

// Get User Stats
app.get('/make-server-2f7c4d80/user-stats', async c => {
  try {
    const userId = c.req.query('userId');

    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400);
    }

    const user = await kv.get(userId);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ stats: user.stats || {} });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return c.json(
      { error: `Failed to fetch stats: ${error instanceof Error ? error.message : 'Unknown error'}` },
      500
    );
  }
});

// Update User Stats (after game)
app.post('/make-server-2f7c4d80/update-stats', async c => {
  try {
    const body = await c.req.json();
    const { userId, gameType, won, timeTaken } = body;

    if (!userId || !gameType) {
      return c.json({ error: 'User ID and game type are required' }, 400);
    }

    const user = await kv.get(userId);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Update stats
    const stats = user.stats || {
      totalGames: 0,
      totalWins: 0,
      totalTime: 0,
      gameStats: {
        traffic: { played: 0, won: 0 },
        sorting: { played: 0, won: 0 },
        pathfinding: { played: 0, won: 0 },
        binarytree: { played: 0, won: 0 },
        graphcoloring: { played: 0, won: 0 },
      },
    };

    stats.totalGames += 1;
    if (won) stats.totalWins += 1;
    if (timeTaken) stats.totalTime += timeTaken;

    if (stats.gameStats[gameType]) {
      stats.gameStats[gameType].played += 1;
      if (won) stats.gameStats[gameType].won += 1;
    }

    await kv.set(userId, { ...user, stats });

    console.log(`Stats updated for user ${userId}: ${gameType} - ${won ? 'won' : 'lost'}`);
    return c.json({ success: true, stats });
  } catch (error) {
    console.error('Error updating user stats:', error);
    return c.json(
      { error: `Failed to update stats: ${error instanceof Error ? error.message : 'Unknown error'}` },
      500
    );
  }
});

// Save game result
app.post('/make-server-2f7c4d80/save-game', async c => {
  try {
    const body = await c.req.json();
    const { playerName, maxFlow, fordFulkersonTime, edmondsKarpTime, timestamp } = body;

    // Validate input
    if (!playerName || typeof playerName !== 'string') {
      return c.json({ error: 'Player name is required and must be a string' }, 400);
    }

    if (typeof maxFlow !== 'number' || maxFlow < 0) {
      return c.json({ error: 'Max flow must be a non-negative number' }, 400);
    }

    if (typeof fordFulkersonTime !== 'number' || fordFulkersonTime < 0) {
      return c.json({ error: 'Ford-Fulkerson time must be a non-negative number' }, 400);
    }

    if (typeof edmondsKarpTime !== 'number' || edmondsKarpTime < 0) {
      return c.json({ error: 'Edmonds-Karp time must be a non-negative number' }, 400);
    }

    // Generate unique key with timestamp
    const key = `game_result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store game result
    await kv.set(key, {
      playerName: playerName.trim(),
      maxFlow,
      fordFulkersonTime,
      edmondsKarpTime,
      timestamp: timestamp || new Date().toISOString(),
    });

    console.log(`Game result saved for player: ${playerName}`);
    return c.json({ success: true, key });
  } catch (error) {
    console.error('Error saving game result:', error);
    return c.json(
      { error: `Failed to save game result: ${error instanceof Error ? error.message : 'Unknown error'}` },
      500
    );
  }
});

// Get leaderboard
app.get('/make-server-2f7c4d80/leaderboard', async c => {
  try {
    // Get all game results
    const results = await kv.getByPrefix('game_result_');

    if (!results || results.length === 0) {
      return c.json({ entries: [] });
    }

    // Filter out invalid entries and sort by timestamp
    const validResults = results.filter(r => r && r.value && r.value.timestamp);
    
    const sortedResults = validResults
      .sort((a, b) => {
        const timeA = new Date(a.value.timestamp).getTime();
        const timeB = new Date(b.value.timestamp).getTime();
        return timeB - timeA;
      })
      .slice(0, 20);

    const entries = sortedResults.map(result => result.value);

    return c.json({ entries });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json(
      { error: `Failed to fetch leaderboard: ${error instanceof Error ? error.message : 'Unknown error'}` },
      500
    );
  }
});

// Health check
app.get('/make-server-2f7c4d80/health', c => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
