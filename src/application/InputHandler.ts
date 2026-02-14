import { Move } from '../domain/types';
import { CubeController } from './CubeController';

/**
 * InputHandler - Manages keyboard and mouse input
 * 
 * Keyboard controls:
 * - R, U, F, D, L, B: Execute move
 * - Shift + key: Execute inverse move (e.g., Shift+R = R')
 * - Space: Scramble
 * - Backspace: Undo
 * - Escape: Reset
 */
export class InputHandler {
  private readonly controller: CubeController;

  constructor(controller: CubeController) {
    this.controller = controller;
    this.setupKeyboardControls();
  }

  /**
   * Setup keyboard event listeners
   */
  private setupKeyboardControls(): void {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      this.handleKeyPress(e);
    });
  }

  /**
   * Handle key press
   */
  private async handleKeyPress(e: KeyboardEvent): Promise<void> {
    const key = e.key.toUpperCase();
    const isShift = e.shiftKey;

    // Face moves
    const faceKeys: Record<string, string> = {
      'R': 'R',
      'U': 'U',
      'F': 'F',
      'D': 'D',
      'L': 'L',
      'B': 'B',
    };

    if (key in faceKeys) {
      e.preventDefault();
      const baseFace = faceKeys[key];
      const move = isShift ? `${baseFace}'` as Move : baseFace as Move;
      await this.controller.executeMove(move);
      return;
    }

    // Special keys
    switch (e.key) {
      case ' ': // Space - Scramble
        e.preventDefault();
        await this.controller.scramble();
        break;

      case 'Backspace': // Undo
        e.preventDefault();
        await this.controller.undo();
        break;

      case 'Escape': // Reset
        e.preventDefault();
        this.controller.reset();
        break;

      case '2': // 180° moves (e.g., R2)
        // Check if last key was a face key
        // For now, just log
        console.log('2 key pressed (180° moves not yet implemented via keyboard)');
        break;
    }
  }

  /**
   * Dispose event listeners
   */
  dispose(): void {
    // Remove event listeners if needed
  }
}
