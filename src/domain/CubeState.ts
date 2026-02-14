import { CubeState as ICubeState } from './types';

/**
 * Canonical cube state implementation
 * Immutable state representation (3d-addendum.md A2, A5)
 */
export class CubeState implements ICubeState {
  readonly stickers: readonly number[];

  private constructor(stickers: readonly number[]) {
    this.stickers = stickers;
  }

  /**
   * Create solved state
   * Fixed reference model (3d-addendum.md A2)
   */
  static solved(): CubeState {
    const stickers = [
      // U face (0-8): White
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      // R face (9-17): Red
      1, 1, 1, 1, 1, 1, 1, 1, 1,
      // F face (18-26): Green
      2, 2, 2, 2, 2, 2, 2, 2, 2,
      // D face (27-35): Yellow
      3, 3, 3, 3, 3, 3, 3, 3, 3,
      // L face (36-44): Orange
      4, 4, 4, 4, 4, 4, 4, 4, 4,
      // B face (45-53): Blue
      5, 5, 5, 5, 5, 5, 5, 5, 5,
    ];
    return new CubeState(stickers);
  }

  /**
   * Create state from sticker array
   * Validates input (3d-addendum.md A11)
   */
  static fromArray(stickers: number[]): CubeState {
    if (stickers.length !== 54) {
      throw new Error(`Invalid state: expected 54 stickers, got ${stickers.length}`);
    }

    // Validate color values
    for (const color of stickers) {
      if (color < 0 || color > 5) {
        throw new Error(`Invalid color value: ${color} (must be 0-5)`);
      }
    }

    // Validate color distribution (9 per color)
    const counts = [0, 0, 0, 0, 0, 0];
    for (const color of stickers) {
      counts[color]++;
    }

    for (let i = 0; i < 6; i++) {
      if (counts[i] !== 9) {
        throw new Error(
          `Invalid color distribution: color ${i} has ${counts[i]} stickers (expected 9)`
        );
      }
    }

    return new CubeState([...stickers]);
  }

  /**
   * Check if cube is solved
   * Domain verification (3d-addendum.md A11, B12)
   */
  isSolved(): boolean {
    // Each face should have uniform color
    for (let face = 0; face < 6; face++) {
      const faceStart = face * 9;
      const centerColor = this.stickers[faceStart + 4];

      for (let i = 0; i < 9; i++) {
        if (this.stickers[faceStart + i] !== centerColor) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Validate state integrity
   * Ensures 9 stickers per color (3d-addendum.md A8)
   */
  validate(): boolean {
    if (this.stickers.length !== 54) return false;

    const counts = [0, 0, 0, 0, 0, 0];
    for (const color of this.stickers) {
      if (color < 0 || color > 5) return false;
      counts[color]++;
    }

    return counts.every((count) => count === 9);
  }

  /**
   * Clone state (immutability)
   */
  clone(): CubeState {
    return new CubeState([...this.stickers]);
  }

  /**
   * Serialize to JSON
   */
  toJSON(): string {
    return JSON.stringify(Array.from(this.stickers));
  }

  /**
   * Deserialize from JSON
   */
  static fromJSON(json: string): CubeState {
    const stickers = JSON.parse(json) as number[];
    return CubeState.fromArray(stickers);
  }

  /**
   * Equality check
   */
  equals(other: CubeState): boolean {
    if (this.stickers.length !== other.stickers.length) return false;
    return this.stickers.every((s, i) => s === other.stickers[i]);
  }
}
