/**
 * GameState - Domain model for game state
 * Tracks timer, moves, and game status
 */

export enum GameStatus {
  Idle = 'idle',           // Not started
  Ready = 'ready',         // Scrambled, waiting for first move
  Running = 'running',     // Timer running
  Paused = 'paused',       // Timer paused
  Completed = 'completed', // Solved
}

export interface GameStateData {
  status: GameStatus;
  startTime: number | null;    // performance.now() when started
  endTime: number | null;      // performance.now() when completed
  elapsedTime: number;         // milliseconds
  moveCount: number;           // total moves made
  scrambleMoves: number;       // moves in scramble
}

export class GameState {
  private data: GameStateData;

  constructor(data?: Partial<GameStateData>) {
    this.data = {
      status: GameStatus.Idle,
      startTime: null,
      endTime: null,
      elapsedTime: 0,
      moveCount: 0,
      scrambleMoves: 0,
      ...data,
    };
  }

  /**
   * Start the timer (first move)
   */
  start(): GameState {
    if (this.data.status !== GameStatus.Ready) {
      return this;
    }

    return new GameState({
      ...this.data,
      status: GameStatus.Running,
      startTime: performance.now(),
    });
  }

  /**
   * Complete the game (solved)
   */
  complete(): GameState {
    if (this.data.status !== GameStatus.Running) {
      return this;
    }

    const endTime = performance.now();
    const elapsedTime = endTime - (this.data.startTime || endTime);

    return new GameState({
      ...this.data,
      status: GameStatus.Completed,
      endTime,
      elapsedTime,
    });
  }

  /**
   * Increment move count
   */
  incrementMoves(): GameState {
    return new GameState({
      ...this.data,
      moveCount: this.data.moveCount + 1,
    });
  }

  /**
   * Set ready state (after scramble)
   */
  setReady(scrambleMoves: number): GameState {
    return new GameState({
      ...this.data,
      status: GameStatus.Ready,
      scrambleMoves,
      moveCount: 0,
      startTime: null,
      endTime: null,
      elapsedTime: 0,
    });
  }

  /**
   * Reset to idle
   */
  reset(): GameState {
    return new GameState();
  }

  /**
   * Get current elapsed time (live)
   */
  getCurrentTime(): number {
    if (this.data.status === GameStatus.Running && this.data.startTime) {
      return performance.now() - this.data.startTime;
    }
    return this.data.elapsedTime;
  }

  /**
   * Get final time (after completion)
   */
  getFinalTime(): number | null {
    return this.data.status === GameStatus.Completed ? this.data.elapsedTime : null;
  }

  /**
   * Getters
   */
  getStatus(): GameStatus {
    return this.data.status;
  }

  getMoveCount(): number {
    return this.data.moveCount;
  }

  getScrambleMoves(): number {
    return this.data.scrambleMoves;
  }

  isRunning(): boolean {
    return this.data.status === GameStatus.Running;
  }

  isCompleted(): boolean {
    return this.data.status === GameStatus.Completed;
  }

  /**
   * Serialize
   */
  toJSON(): GameStateData {
    return { ...this.data };
  }

  static fromJSON(data: GameStateData): GameState {
    return new GameState(data);
  }
}
