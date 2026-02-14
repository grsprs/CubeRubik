import { Move } from '../domain/types';
import { CubeController } from '../application/CubeController';

/**
 * ControlPanel - UI controls for cube manipulation
 */
export class ControlPanel {
  private readonly controller: CubeController;
  private readonly container: HTMLElement;

  constructor(controller: CubeController, containerId: string = 'controls') {
    this.controller = controller;
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Element with id "${containerId}" not found`);
    }
    this.container = element;
    this.render();
  }

  /**
   * Render control panel
   */
  private render(): void {
    this.container.innerHTML = `
      <div class="control-panel">
        <h3>Controls</h3>
        
        <!-- Main Actions -->
        <div class="button-group">
          <button id="btn-scramble" class="btn btn-primary">🎲 Scramble</button>
          <!-- <button id="btn-reset" class="btn btn-secondary">🔄 Reset</button> -->
          <!-- <button id="btn-undo" class="btn btn-secondary">↩️ Undo</button> -->
        </div>

        <!-- Face Moves -->
        <div class="moves-section">
          <h4>Face Moves</h4>
          
          <!-- Top Row: U moves -->
          <div class="move-row">
            <span class="move-label">Up (U):</span>
            <button class="btn-move" data-move="U'">U'</button>
            <button class="btn-move" data-move="U">U</button>
            <button class="btn-move" data-move="U2">U2</button>
          </div>

          <!-- Row: R moves -->
          <div class="move-row">
            <span class="move-label">Right (R):</span>
            <button class="btn-move" data-move="R'">R'</button>
            <button class="btn-move" data-move="R">R</button>
            <button class="btn-move" data-move="R2">R2</button>
          </div>

          <!-- Row: F moves -->
          <div class="move-row">
            <span class="move-label">Front (F):</span>
            <button class="btn-move" data-move="F'">F'</button>
            <button class="btn-move" data-move="F">F</button>
            <button class="btn-move" data-move="F2">F2</button>
          </div>

          <!-- Row: D moves -->
          <div class="move-row">
            <span class="move-label">Down (D):</span>
            <button class="btn-move" data-move="D'">D'</button>
            <button class="btn-move" data-move="D">D</button>
            <button class="btn-move" data-move="D2">D2</button>
          </div>

          <!-- Row: L moves -->
          <div class="move-row">
            <span class="move-label">Left (L):</span>
            <button class="btn-move" data-move="L'">L'</button>
            <button class="btn-move" data-move="L">L</button>
            <button class="btn-move" data-move="L2">L2</button>
          </div>

          <!-- Row: B moves -->
          <div class="move-row">
            <span class="move-label">Back (B):</span>
            <button class="btn-move" data-move="B'">B'</button>
            <button class="btn-move" data-move="B">B</button>
            <button class="btn-move" data-move="B2">B2</button>
          </div>
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="keyboard-info">
          <h4>⌨️ Keyboard Shortcuts</h4>
          <div class="shortcut-grid">
            <div><kbd>Q</kbd> U'</div>
            <div><kbd>W</kbd> U</div>
            <div><kbd>E</kbd> U2</div>
            
            <div><kbd>A</kbd> R'</div>
            <div><kbd>S</kbd> R</div>
            <div><kbd>D</kbd> R2</div>
            
            <div><kbd>Z</kbd> F'</div>
            <div><kbd>X</kbd> F</div>
            <div><kbd>C</kbd> F2</div>
            
            <div><kbd>I</kbd> D'</div>
            <div><kbd>O</kbd> D</div>
            <div><kbd>P</kbd> D2</div>
            
            <div><kbd>J</kbd> L'</div>
            <div><kbd>K</kbd> L</div>
            <div><kbd>L</kbd> L2</div>
            
            <div><kbd>N</kbd> B'</div>
            <div><kbd>M</kbd> B</div>
            <div><kbd>,</kbd> B2</div>
          </div>
          <div class="shortcut-special">
            <div><kbd>Space</kbd> Scramble</div>
            <!-- <div><kbd>Backspace</kbd> Undo</div> -->
            <!-- <div><kbd>Esc</kbd> Reset</div> -->
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  /**
   * Attach event listeners to buttons
   */
  private attachEventListeners(): void {
    // Main action buttons
    const scrambleBtn = document.getElementById('btn-scramble');
    // const resetBtn = document.getElementById('btn-reset');
    // const undoBtn = document.getElementById('btn-undo');

    scrambleBtn?.addEventListener('click', async () => await this.controller.scramble());
    // resetBtn?.addEventListener('click', () => this.controller.reset());
    // undoBtn?.addEventListener('click', async () => await this.controller.undo());

    // Move buttons
    const moveButtons = this.container.querySelectorAll('.btn-move');
    moveButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const move = btn.getAttribute('data-move') as Move;
        if (move) {
          await this.controller.executeMove(move);
        }
      });
    });
  }
}
