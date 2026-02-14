import { describe, it, expect, beforeEach } from 'vitest';
import { CubeState } from '../../src/domain/CubeState';
import { MoveEngine } from '../../src/domain/MoveEngine';

/**
 * Integration tests - Full solve scenarios
 */
describe('Integration: Full Solve', () => {
  let state: CubeState;

  beforeEach(() => {
    state = CubeState.solved();
  });

  it('scramble and solve returns to solved state', () => {
    // Scramble
    const scramble = MoveEngine.randomSequence(20);
    const scrambled = MoveEngine.applySequence(state, scramble);
    expect(scrambled.isSolved()).toBe(false);

    // Reverse scramble
    const inverse = scramble.map(m => MoveEngine.inverse(m)).reverse();
    const solved = MoveEngine.applySequence(scrambled, inverse);
    
    expect(solved.isSolved()).toBe(true);
    expect(solved.equals(state)).toBe(true);
  });

  it('known algorithm returns to solved state', () => {
    // Sexy move (R U R' U') repeated 6 times = identity
    const sexyMove = MoveEngine.parseNotation("R U R' U'");
    
    let current = state;
    for (let i = 0; i < 6; i++) {
      current = MoveEngine.applySequence(current, sexyMove);
    }
    
    expect(current.equals(state)).toBe(true);
  });

  it('T-perm algorithm swaps edges correctly', () => {
    // T-perm: R U R' U' R' F R2 U' R' U' R U R' F'
    const tPerm = MoveEngine.parseNotation("R U R' U' R' F R2 U' R' U' R U R' F'");
    
    const afterTPerm = MoveEngine.applySequence(state, tPerm);
    expect(afterTPerm.isSolved()).toBe(false);
    expect(afterTPerm.validate()).toBe(true);
    
    // Apply twice should return to solved
    const afterTwice = MoveEngine.applySequence(afterTPerm, tPerm);
    expect(afterTwice.equals(state)).toBe(true);
  });

  it('all 18 moves preserve state validity', () => {
    const allMoves = [
      'U', "U'", 'U2',
      'R', "R'", 'R2',
      'F', "F'", 'F2',
      'D', "D'", 'D2',
      'L', "L'", 'L2',
      'B', "B'", 'B2',
    ];

    for (const move of allMoves) {
      const moved = MoveEngine.applyMove(state, move as any);
      expect(moved.validate()).toBe(true);
    }
  });

  it('100 random moves maintain state validity', () => {
    const moves = MoveEngine.randomSequence(100);
    const final = MoveEngine.applySequence(state, moves);
    
    expect(final.validate()).toBe(true);
  });

  it('commutator [R, U] = R U R\' U\' returns to solved', () => {
    // Commutator: A B A' B'
    const commutator = MoveEngine.parseNotation("R U R' U'");
    
    let current = state;
    // Repeat commutator multiple times
    for (let i = 0; i < 6; i++) {
      current = MoveEngine.applySequence(current, commutator);
    }
    
    expect(current.equals(state)).toBe(true);
  });
});

/**
 * Integration tests - State consistency
 */
describe('Integration: State Consistency', () => {
  it('serialization preserves state through moves', () => {
    const state = CubeState.solved();
    const moves = MoveEngine.parseNotation("R U F D L B");
    const moved = MoveEngine.applySequence(state, moves);
    
    // Serialize and deserialize
    const json = moved.toJSON();
    const restored = CubeState.fromJSON(json);
    
    expect(restored.equals(moved)).toBe(true);
    expect(restored.validate()).toBe(true);
  });

  it('clone creates independent state', () => {
    const state1 = CubeState.solved();
    const state2 = state1.clone();
    
    const moved1 = MoveEngine.applyMove(state1, 'R');
    const moved2 = MoveEngine.applyMove(state2, 'U');
    
    expect(moved1.equals(moved2)).toBe(false);
    expect(state1.equals(state2)).toBe(true); // Originals unchanged
  });
});

/**
 * Integration tests - Move sequences
 */
describe('Integration: Move Sequences', () => {
  it('parsing and execution work together', () => {
    const notation = "R U R' U' R' F R2 U' R' U' R U R' F'";
    const moves = MoveEngine.parseNotation(notation);
    
    expect(moves.length).toBe(14);
    
    const state = CubeState.solved();
    const result = MoveEngine.applySequence(state, moves);
    
    expect(result.validate()).toBe(true);
  });

  it('empty sequence returns same state', () => {
    const state = CubeState.solved();
    const result = MoveEngine.applySequence(state, []);
    
    expect(result.equals(state)).toBe(true);
  });

  it('long sequence maintains validity', () => {
    const state = CubeState.solved();
    const moves = MoveEngine.randomSequence(500);
    const result = MoveEngine.applySequence(state, moves);
    
    expect(result.validate()).toBe(true);
  });
});
