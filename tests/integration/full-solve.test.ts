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

  it('known algorithm: 4 × R = identity', () => {
    // Any face turn repeated 4 times returns to identity
    let current = state;
    for (let i = 0; i < 4; i++) {
      current = MoveEngine.applyMove(current, 'R');
    }
    
    expect(current.equals(state)).toBe(true);
  });

  it('move and inverse cancel out', () => {
    // R followed by R' should return to solved
    const afterR = MoveEngine.applyMove(state, 'R');
    expect(afterR.isSolved()).toBe(false);
    
    const afterRPrime = MoveEngine.applyMove(afterR, "R'");
    expect(afterRPrime.equals(state)).toBe(true);
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

  it('double move: R2 followed by R2 returns to solved', () => {
    const afterR2 = MoveEngine.applyMove(state, 'R2');
    expect(afterR2.isSolved()).toBe(false);
    
    const afterTwice = MoveEngine.applyMove(afterR2, 'R2');
    expect(afterTwice.equals(state)).toBe(true);
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
