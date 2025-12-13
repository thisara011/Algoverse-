# Eight Queens Puzzle - Full Stack Application

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file in the backend directory with:
```
SUPABASE_URL=https://skqtyewgpqdwzbkfobmf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcXR5ZXdncHFkd3pia2ZvYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NjIyMDcsImV4cCI6MjA3ODMzODIwN30.OS1wdf4Fh-D4Z9SD33pwUqZEbfofFzFrTJYDkuOd9oE
PORT=3001
```

### Database Setup
Run these SQL queries in your Supabase dashboard:

```sql
CREATE TABLE IF NOT EXISTS solutions (
  id BIGSERIAL PRIMARY KEY,
  board TEXT NOT NULL UNIQUE,
  recognized BOOLEAN DEFAULT FALSE,
  recognized_by TEXT,
  recognized_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS runs (
  id BIGSERIAL PRIMARY KEY,
  mode TEXT NOT NULL,
  time_ms INTEGER NOT NULL,
  solutions_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  board TEXT NOT NULL,
  solution_id BIGINT REFERENCES solutions(id),
  correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Running the Application

### Backend
```bash
cd backend
npm start
```
Server runs on `http://localhost:3001`

### Frontend
Open `frontend/index.html` in a web browser

## API Endpoints

### Solve Endpoints
- **POST** `/solve/sequential` - Find all solutions using sequential algorithm
- **POST** `/solve/threaded` - Find all solutions using worker threads

### Game Endpoints
- **POST** `/submit` - Submit a player's solution
  - Body: `{ playerName: string, board: string }`
- **GET** `/solutions` - Get all solutions from database
- **GET** `/stats` - Get game statistics

### Health Check
- **GET** `/health` - Check server status

## Running Tests
```bash
cd backend
npm test
```

## Project Structure

```
eight queens puzzle/
├── backend/
│   ├── server.js          # Express server & API routes
│   ├── queensolver.js     # Sequential & threaded solvers
│   ├── worker.js          # Worker thread implementation
│   ├── database.js        # Supabase integration
│   ├── test.js            # Unit tests
│   ├── package.json       # Dependencies
│   └── .env              # Environment variables
└── frontend/
    └── index.html         # Interactive web UI
```

## Features

✅ **Sequential Algorithm** - Find all 92 solutions with backtracking
✅ **Threaded Algorithm** - Parallel solving using Worker Threads
✅ **Player Submissions** - Allow players to submit solutions
✅ **Solution Tracking** - Track which player found each solution first
✅ **Game Statistics** - Compare algorithm performance
✅ **Input Validation** - Strict validation of board configurations
✅ **Error Handling** - Comprehensive exception handling
✅ **Unit Tests** - Full test coverage with Jest
✅ **Responsive UI** - Interactive chessboard interface

## How It Works

1. **Algorithms**: Both sequential and threaded implementations use backtracking to find all valid queen placements
2. **Database**: Solutions are stored with metadata about player recognition and timing
3. **Gameplay**: Players place queens on the board and submit for validation
4. **Round System**: When all solutions are found, the system resets for the next round
5. **Performance Comparison**: Track timing for both algorithm approaches

## Performance Notes

- **Sequential**: ~50-150ms (single-threaded)
- **Threaded**: ~30-100ms (4 worker threads)
- All 92 solutions are found and stored in the database
- Player submissions are validated against known solutions
