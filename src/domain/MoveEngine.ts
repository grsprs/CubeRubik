import { Move, MoveSequence } from './types';
import { CubeState } from './CubeState';

/**
 * MoveEngine - Applies moves to cube state
 * 
 * Transformation Model (3d-addendum.md A4):
 * - Representation: Permutation arrays (exact, no floating-point)
 * - Composition: Sequential application
 * - Inversion: Reverse permutation
 * - Deterministic and reversible
 * 
 * CRITICAL: Permutations must preserve color count (9 per color)
 * Each permutation is a bijection: old_index → new_index
 */

/**
 * Helper to create identity permutation
 */
function identity(): number[] {
  return Array.from({ length: 54 }, (_, i) => i);
}

/**
 * Helper to rotate a face clockwise
 * Face indices: 0,1,2,3,4,5,6,7,8
 * Rotation: 0→2, 1→5, 2→8, 3→1, 4→4, 5→7, 6→0, 7→3, 8→6
 */
function rotateFace(perm: number[], faceStart: number): void {
  const temp = [...perm];
  const f = faceStart;
  
  // Corners: 0→2→8→6→0
  perm[f + 2] = temp[f + 0];
  perm[f + 8] = temp[f + 2];
  perm[f + 6] = temp[f + 8];
  perm[f + 0] = temp[f + 6];
  
  // Edges: 1→5→7→3→1
  perm[f + 5] = temp[f + 1];
  perm[f + 7] = temp[f + 5];
  perm[f + 3] = temp[f + 7];
  perm[f + 1] = temp[f + 3];
  
  // Center stays: 4→4
}

/**
 * Helper to cycle 4 stickers
 */
function cycle4(perm: number[], a: number, b: number, c: number, d: number): void {
  const temp = [...perm];
  perm[a] = temp[d];
  perm[b] = temp[a];
  perm[c] = temp[b];
  perm[d] = temp[c];
}

/**
 * Generate U move permutation
 */
function generateU(): number[] {
  const perm = identity();
  rotateFace(perm, 0); // Rotate U face
  
  // Cycle top rows: F→L→B→R→F
  cycle4(perm, 18, 36, 45, 9);   // 0
  cycle4(perm, 19, 37, 46, 10);  // 1
  cycle4(perm, 20, 38, 47, 11);  // 2
  
  return perm;
}

/**
 * Generate R move permutation
 */
function generateR(): number[] {
  const perm = identity();
  rotateFace(perm, 9); // Rotate R face
  
  // Cycle right columns: F→U→B→D→F
  cycle4(perm, 20, 2, 47, 29);   // Right column
  cycle4(perm, 23, 5, 50, 32);
  cycle4(perm, 26, 8, 53, 35);
  
  return perm;
}

/**
 * Generate F move permutation
 */
function generateF(): number[] {
  const perm = identity();
  rotateFace(perm, 18); // Rotate F face
  
  // Cycle front: U→R→D→L→U
  cycle4(perm, 6, 9, 27, 44);
  cycle4(perm, 7, 12, 28, 41);
  cycle4(perm, 8, 15, 29, 38);
  
  return perm;
}

/**
 * Generate D move permutation
 */
function generateD(): number[] {
  const perm = identity();
  rotateFace(perm, 27); // Rotate D face
  
  // Cycle bottom rows: F→R→B→L→F
  cycle4(perm, 24, 15, 51, 42);
  cycle4(perm, 25, 16, 52, 43);
  cycle4(perm, 26, 17, 53, 44);
  
  return perm;
}

/**
 * Generate L move permutation
 */
function generateL(): number[] {
  const perm = identity();
  rotateFace(perm, 36); // Rotate L face
  
  // Cycle left columns: F→D→B→U→F
  cycle4(perm, 18, 27, 45, 0);
  cycle4(perm, 21, 30, 48, 3);
  cycle4(perm, 24, 33, 51, 6);
  
  return perm;
}

/**
 * Generate B move permutation
 */
function generateB(): number[] {
  const perm = identity();
  rotateFace(perm, 45); // Rotate B face
  
  // Cycle back: U→L→D→R→U
  cycle4(perm, 0, 36, 35, 17);
  cycle4(perm, 1, 39, 34, 14);
  cycle4(perm, 2, 42, 33, 11);
  
  return perm;
}

/**
 * Apply permutation twice (for X2 moves)
 */
function applyTwice(perm: number[]): number[] {
  const result = new Array(54);
  for (let i = 0; i < 54; i++) {
    result[i] = perm[perm[i]];
  }
  return result;
}

/**
 * Invert permutation
 */
function invertPerm(perm: number[]): number[] {
  const result = new Array(54);
  for (let i = 0; i < 54; i++) {
    result[perm[i]] = i;
  }
  return result;
}

/**
 * Generate all move permutations
 */
const MOVE_PERMUTATIONS: Record<Move, number[]> = {
  'U': generateU(),
  "U'": invertPerm(generateU()),
  'U2': applyTwice(generateU()),
  
  'R': generateR(),
  "R'": invertPerm(generateR()),
  'R2': applyTwice(generateR()),
  
  'F': generateF(),
  "F'": invertPerm(generateF()),
  'F2': applyTwice(generateF()),
  
  'D': generateD(),
  "D'": invertPerm(generateD()),
  'D2': applyTwice(generateD()),
  
  'L': generateL(),
  "L'": invertPerm(generateL()),
  'L2': applyTwice(generateL()),
  
  'B': generateB(),
  "B'": invertPerm(generateB()),
  'B2': applyTwice(generateB()),
};

/**
 * MoveEngine class
 */
export class MoveEngine {
  /**
   * Apply a single move to the cube state
   * Returns new state (immutable - 3d-addendum.md A5)
   */
  static applyMove(state: CubeState, move: Move): CubeState {
    const permutation = MOVE_PERMUTATIONS[move];
    const newStickers = new Array(54);

    for (let i = 0; i < 54; i++) {
      newStickers[i] = state.stickers[permutation[i]];
    }

    return CubeState.fromArray(newStickers);
  }

  /**
   * Apply a sequence of moves
   */
  static applySequence(state: CubeState, moves: MoveSequence): CubeState {
    let current = state;
    for (const move of moves) {
      current = this.applyMove(current, move);
    }
    return current;
  }

  /**
   * Get inverse of a move
   */
  static inverse(move: Move): Move {
    if (move.endsWith("'")) {
      return move.slice(0, -1) as Move;
    }
    if (move.endsWith('2')) {
      return move as Move; // 180° is self-inverse
    }
    return (move + "'") as Move;
  }

  /**
   * Parse move notation string
   * Example: "R U R' U'" → ['R', 'U', "R'", "U'"]
   */
  static parseNotation(notation: string): MoveSequence {
    const tokens = notation.trim().split(/\s+/);
    const moves: MoveSequence = [];

    for (const token of tokens) {
      if (!token) continue;

      if (!this.isValidMove(token)) {
        throw new Error(`Invalid move notation: ${token}`);
      }

      moves.push(token as Move);
    }

    return moves;
  }

  /**
   * Check if string is valid move
   */
  private static isValidMove(token: string): token is Move {
    return token in MOVE_PERMUTATIONS;
  }

  /**
   * Generate random move sequence (for scrambling)
   */
  static randomSequence(length: number): MoveSequence {
    const allMoves: Move[] = Object.keys(MOVE_PERMUTATIONS) as Move[];
    const moves: MoveSequence = [];

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allMoves.length);
      moves.push(allMoves[randomIndex]);
    }

    return moves;
  }
}
