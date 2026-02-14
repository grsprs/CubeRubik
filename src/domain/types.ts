/**
 * Core domain types for Rubik's Cube
 * 
 * Canonical Coordinate System (3d-addendum.md A1):
 * - Type: Right-handed
 * - X: Right (+X = right side)
 * - Y: Up (+Y = top)
 * - Z: Forward (+Z = front)
 * - Rotation: Counter-clockwise when looking at face
 * - Unit: 1 unit = 1 cubie width
 * - Origin: Center of cube (0, 0, 0)
 */

/**
 * Color enumeration for cube faces
 * Standard color scheme:
 * - White opposite Yellow
 * - Red opposite Orange
 * - Green opposite Blue
 */
export enum Color {
  White = 0,
  Red = 1,
  Green = 2,
  Yellow = 3,
  Orange = 4,
  Blue = 5,
}

/**
 * Face enumeration
 * Order: U, R, F, D, L, B
 */
export enum Face {
  U = 0, // Up (White)
  R = 1, // Right (Red)
  F = 2, // Front (Green)
  D = 3, // Down (Yellow)
  L = 4, // Left (Orange)
  B = 5, // Back (Blue)
}

/**
 * Move notation (Singmaster)
 * 18 possible moves: 6 faces × 3 directions
 */
export type Move =
  | 'U' | "U'" | 'U2'
  | 'R' | "R'" | 'R2'
  | 'F' | "F'" | 'F2'
  | 'D' | "D'" | 'D2'
  | 'L' | "L'" | 'L2'
  | 'B' | "B'" | 'B2';

/**
 * Move sequence (algorithm)
 */
export type MoveSequence = Move[];

/**
 * Canonical cube state
 * 54 stickers: 6 faces × 9 stickers each
 * 
 * Face order: U (0-8), R (9-17), F (18-26), D (27-35), L (36-44), B (45-53)
 * 
 * Sticker indexing per face (0-8):
 *   0 1 2
 *   3 4 5
 *   6 7 8
 * 
 * Center stickers (4, 13, 22, 31, 40, 49) are fixed
 */
export interface CubeState {
  readonly stickers: readonly number[];
}

/**
 * Cubie identity (0-25)
 * Immutable ID that survives all transformations (3d-addendum.md A3)
 */
export type CubieId = number;

/**
 * Position in 3D space
 * Used for visual representation only
 */
export interface Position3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/**
 * Rotation axis for animations
 */
export enum Axis {
  X = 'x',
  Y = 'y',
  Z = 'z',
}

/**
 * Rotation direction
 */
export enum RotationDirection {
  Clockwise = 1,
  CounterClockwise = -1,
}

/**
 * Move metadata for animations
 */
export interface MoveMetadata {
  readonly face: Face;
  readonly axis: Axis;
  readonly direction: RotationDirection;
  readonly angle: number; // radians
}
