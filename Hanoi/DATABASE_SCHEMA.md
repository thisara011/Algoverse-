# Tower of Hanoi Database Schema

## Table: `game_players`

This table stores all player game attempts and results for the Tower of Hanoi puzzle.

### Columns

| Column | Type | Description | Values |
|--------|------|-------------|--------|
| `id` | UUID | Primary key, auto-generated | - |
| `created_at` | TIMESTAMP | Timestamp when the record was created | - |
| `player_name` | TEXT | Name of the player | Any string |
| `disks` | INTEGER | Number of disks in the puzzle | 5-10 (typically) |
| `pegs` | INTEGER | Number of pegs available | 3 or 4 |
| `user_moves` | INTEGER | Number of moves made by the player | >= 0 |
| `quiz_answer` | INTEGER | Player's prediction of optimal moves | >= 0 |
| `is_quiz_correct` | BOOLEAN | Whether the quiz answer matched the optimal moves | true / false |
| `duration_seconds` | INTEGER | Time spent on the puzzle in seconds | >= 0 |
| `game_status` | TEXT | Status of the game attempt | `completed` / `failed` |

### Game Status Values

- **`completed`**: Player successfully moved all disks to the destination peg in the correct order
- **`failed`**: Player gave up or couldn't complete the puzzle and submitted an incomplete sequence

### Example Records

#### Completed Game
```json
{
  "id": "uuid-1",
  "created_at": "2025-12-13T10:30:00",
  "player_name": "John Doe",
  "disks": 7,
  "pegs": 3,
  "user_moves": 127,
  "quiz_answer": 127,
  "is_quiz_correct": true,
  "duration_seconds": 245,
  "game_status": "completed"
}
```

#### Failed/Incomplete Game
```json
{
  "id": "uuid-2",
  "created_at": "2025-12-13T10:45:00",
  "player_name": "Jane Smith",
  "disks": 8,
  "pegs": 4,
  "user_moves": 45,
  "quiz_answer": 300,
  "is_quiz_correct": false,
  "duration_seconds": 180,
  "game_status": "failed"
}
```

## Features

### User Submission Options
1. **Complete**: Win by successfully moving all disks to the destination
2. **Give Up**: Submit an incomplete sequence and save the attempt with `game_status = 'failed'`

### Statistics Tracking
- Tracks both successful and failed attempts
- Stores the player's quiz prediction (optimal move count estimate)
- Records time taken and actual moves made
- Allows comparison between user performance and optimal solution

## Migration SQL

If you need to add the `game_status` column to an existing table:

```sql
ALTER TABLE game_players ADD COLUMN game_status TEXT DEFAULT 'completed';
```

To update existing records (optional):
```sql
UPDATE game_players SET game_status = 'completed' WHERE game_status IS NULL;
```

## Frontend Implementation

### When a user completes the puzzle:
```javascript
// Saves with game_status: 'completed'
await supabase.from('game_players').insert({
  player_name: playerName,
  disks: n,
  pegs: m,
  user_moves: moveCount,
  quiz_answer: parseInt(quizAnswer),
  is_quiz_correct: isQuizCorrect,
  duration_seconds: timeElapsed,
  game_status: 'completed'
});
```

### When a user gives up:
```javascript
// Saves with game_status: 'failed'
await supabase.from('game_players').insert({
  player_name: playerName,
  disks: n,
  pegs: m,
  user_moves: moveCount,
  quiz_answer: parseInt(quizAnswer),
  is_quiz_correct: false,
  duration_seconds: timeElapsed,
  game_status: 'failed'
});
```
