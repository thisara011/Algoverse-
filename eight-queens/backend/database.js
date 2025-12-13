/**
 * Supabase Database Manager
 */

const { createClient } = require('@supabase/supabase-js');

class DatabaseManager {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Save solutions and run metadata
   */
  async saveSolutions(solutions, mode, timeMs) {
    try {
      // Save run record
      const { data: runData, error: runError } = await this.supabase
        .from('runs')
        .insert({
          mode,
          time_ms: Math.round(timeMs),
          solutions_count: solutions.length,
          created_at: new Date().toISOString()
        })
        .select();

      if (runError) throw new Error(`Run insert error: ${runError.message}`);

      // Insert solutions (avoiding duplicates)
      for (const solution of solutions) {
        const { error: solutionError } = await this.supabase
          .from('solutions')
          .upsert(
            { board: solution },
            { onConflict: 'board' }
          );

        if (solutionError && !solutionError.message.includes('duplicate')) {
          console.warn(`Solution insert warning: ${solutionError.message}`);
        }
      }

      return {
        success: true,
        runId: runData[0].id,
        solutionsCount: solutions.length
      };
    } catch (error) {
      throw new Error(`Failed to save solutions: ${error.message}`);
    }
  }

  /**
   * Get all solutions
   */
  async getAllSolutions() {
    try {
      const { data, error } = await this.supabase
        .from('solutions')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch solutions: ${error.message}`);
    }
  }

  /**
   * Check if solution exists and is already recognized
   */
  async checkSolution(boardStr) {
    try {
      const { data, error } = await this.supabase
        .from('solutions')
        .select('*')
        .eq('board', boardStr)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found

      return data || null;
    } catch (error) {
      throw new Error(`Failed to check solution: ${error.message}`);
    }
  }

  /**
   * Submit a player's answer
   */
  async submitAnswer(playerName, boardStr) {
    try {
      // Get solution
      const solution = await this.checkSolution(boardStr);

      if (!solution) {
        return { correct: false, message: 'This is not a valid solution. Please read the instructions!'};
      }

      if (solution.recognized) {
        return {
          correct: false,
          alreadyRecognized: true,
          message: 'This solution has already been found. Try another one!'
        };
      }

      // Mark as recognized and record player
      const { error: updateError } = await this.supabase
        .from('solutions')
        .update({
          recognized: true,
          recognized_by: playerName,
          recognized_at: new Date().toISOString()
        })
        .eq('id', solution.id);

      if (updateError) throw updateError;

      // Save correct submission
      const { error: submissionError } = await this.supabase
        .from('submissions')
        .insert({
          player_name: playerName,
          board: boardStr,
          solution_id: solution.id,
          correct: true,
          created_at: new Date().toISOString()
        });

      if (submissionError) throw submissionError;

      // Check if all solutions recognized
      const allSolutions = await this.getAllSolutions();
      const unrecognized = allSolutions.filter(s => !s.recognized).length;

      return {
        correct: true,
        alreadyRecognized: false,
        remainingSolutions: unrecognized,
        message: `Correct! ${unrecognized} solutions remaining.`
      };
    } catch (error) {
      throw new Error(`Failed to submit answer: ${error.message}`);
    }
  }

  /**
   * Reset recognized flag for all solutions (when all are found)
   */
  async resetAllSolutions() {
    try {
      const { error } = await this.supabase
        .from('solutions')
        .update({
          recognized: false,
          recognized_by: null,
          recognized_at: null
        })
        .neq('id', 0); 

      if (error) throw error;

      return { success: true, message: 'All solutions reset' };
    } catch (error) {
      throw new Error(`Failed to reset solutions: ${error.message}`);
    }
  }

  /**
   * Get game statistics
   */
  async getStatistics() {
    try {
      const [runs, solutions, submissions] = await Promise.all([
        this.supabase.from('runs').select('*'),
        this.supabase.from('solutions').select('*'),
        this.supabase.from('submissions').select('*')
      ]);

      if (runs.error) throw runs.error;
      if (solutions.error) throw solutions.error;
      if (submissions.error) throw submissions.error;

      const sequentialRuns = runs.data.filter(r => r.mode === 'sequential');
      const threadedRuns = runs.data.filter(r => r.mode === 'threaded');

      const avgSequentialTime = sequentialRuns.length
        ? sequentialRuns.reduce((sum, r) => sum + r.time_ms, 0) / sequentialRuns.length
        : 0;

      const avgThreadedTime = threadedRuns.length
        ? threadedRuns.reduce((sum, r) => sum + r.time_ms, 0) / threadedRuns.length
        : 0;

      return {
        totalSolutions: solutions.data.length,
        recognizedCount: solutions.data.filter(s => s.recognized).length,
        sequentialStats: {
          runs: sequentialRuns.length,
          avgTime: avgSequentialTime,
          lastTime: sequentialRuns[sequentialRuns.length - 1]?.time_ms
        },
        threadedStats: {
          runs: threadedRuns.length,
          avgTime: avgThreadedTime,
          lastTime: threadedRuns[threadedRuns.length - 1]?.time_ms
        },
        totalSubmissions: submissions.data.length,
        correctSubmissions: submissions.data.filter(s => s.correct).length
      };
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }
}

module.exports = DatabaseManager;
