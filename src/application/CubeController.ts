import { CubeState } from '../domain/CubeState';
import { MoveEngine } from '../domain/MoveEngine';
import { Move, MoveSequence } from '../domain/types';
import { VisualCube } from '../presentation/VisualCube';

/**
 * CubeController - Main orchestrator
 * 
 * Architecture (3d-addendum.md D1-D7):
 * - Coordinates domain state and visual representation
 * - Ensures state changes trigger visual updates
 * - Manages move history for undo/redo
 */
export class CubeController {
  private state: CubeState;
  private readonly visual: VisualCube;
  private readonly history: Move[] = [];
  private readonly maxHistory = 1000;

  constructor(visual: VisualCube) {
    this.visual = visual;
    this.state = CubeState.solved();
    this.syncVisual();
  }

  /**
   * Execute a single move
   * Updates domain state and animates visual
   */
  async executeMove(move: Move): Promise<void> {
    // Block if animating
    if (this.visual.isAnimating()) {
      console.warn('Animation in progress, move blocked');
      return;
    }

    // Update domain state (3d-addendum.md B4: discrete update)
    this.state = MoveEngine.applyMove(this.state, move);

    // Add to history
    this.history.push(move);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Animate visual (3d-addendum.md B4: continuous interpolation)
    await this.visual.animateMove(move);

    // Sync visual with state
    this.syncVisual();

    console.log(`Move ${move} executed. Solved: ${this.state.isSolved()}`);
  }

  /**
   * Execute a sequence of moves
   */
  async executeSequence(moves: MoveSequence): Promise<void> {
    for (const move of moves) {
      await this.executeMove(move);
    }
  }

  /**
   * Scramble the cube
   */
  async scramble(moveCount: number = 20): Promise<void> {
    console.log(`Scrambling with ${moveCount} moves...`);
    const moves = MoveEngine.randomSequence(moveCount);
    await this.executeSequence(moves);
    console.log('Scramble complete');
  }

  /**
   * Reset to solved state
   */
  reset(): void {
    this.state = CubeState.solved();
    this.history.length = 0;
    this.syncVisual();
    console.log('Cube reset to solved state');
  }

  /**
   * Undo last move
   */
  async undo(): Promise<void> {
    if (this.history.length === 0) {
      console.warn('No moves to undo');
      return;
    }

    if (this.visual.isAnimating()) {
      console.warn('Animation in progress, undo blocked');
      return;
    }

    // Get last move and its inverse
    const lastMove = this.history.pop()!;
    const inverseMove = MoveEngine.inverse(lastMove);

    // Update domain state
    this.state = MoveEngine.applyMove(this.state, inverseMove);

    // Animate visual
    await this.visual.animateMove(inverseMove);

    // Sync visual
    this.syncVisual();

    console.log(`Undid move ${lastMove}`);
  }

  /**
   * Get current state
   */
  getState(): CubeState {
    return this.state;
  }

  /**
   * Get move history
   */
  getHistory(): readonly Move[] {
    return this.history;
  }

  /**
   * Check if solved
   */
  isSolved(): boolean {
    return this.state.isSolved();
  }

  /**
   * Sync visual with domain state
   * (3d-addendum.md D4: explicit update)
   */
  private syncVisual(): void {
    this.visual.syncWithState(this.state);
  }
}
