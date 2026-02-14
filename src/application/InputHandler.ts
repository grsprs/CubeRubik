import { Move } from '../domain/types';
import { CubeController } from './CubeController';

/**
 * InputHandler - Manages keyboard and mouse input
 * 
 * Keyboard layout (game-friendly):
 * 
 *   Q W E     (U moves: U' U U2)
 *   A S D     (R moves: R' R R2)
 *   Z X C     (F moves: F' F F2)
 * 
 *   I O P     (D moves: D' D D2)
 *   J K L     (L moves: L' L L2)
 *   N M ,     (B moves: B' B B2)
 * 
 * Special:
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
    const key = e.key.toLowerCase();

    // Keyboard layout mapping
    const keyMap: Record<string, Move> = {
      // U moves (top row)
      'q': "U'",
      'w': 'U',
      'e': 'U2',
      
      // R moves (middle row left)
      'a': "R'",
      's': 'R',
      'd': 'R2',
      
      // F moves (bottom row left)
      'z': "F'",
      'x': 'F',
      'c': 'F2',
      
      // D moves (top row right)
      'i': "D'",
      'o': 'D',
      'p': 'D2',
      
      // L moves (middle row right)
      'j': "L'",
      'k': 'L',
      'l': 'L2',
      
      // B moves (bottom row right)
      'n': "B'",
      'm': 'B',
      ',': 'B2',
    };

    if (key in keyMap) {
      e.preventDefault();
      await this.controller.executeMove(keyMap[key]);
      return;
    }

    // Special keys
    switch (e.key) {
      case ' ': // Space - Scramble
        e.preventDefault();
        await this.controller.scramble();
        break;

      // Disabled until proper implementation
      // case 'Backspace': // Undo
      //   e.preventDefault();
      //   await this.controller.undo();
      //   break;

      // case 'Escape': // Reset
      //   e.preventDefault();
      //   this.controller.reset();
      //   break;
    }
  }

  /**
   * Dispose event listeners
   */
  dispose(): void {
    // Remove event listeners if needed
  }
}
