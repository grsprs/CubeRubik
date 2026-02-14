/// <reference types="vitest" />
import { MoveEngine } from '../MoveEngine';
import { CubeState } from '../CubeState';
import type { Move } from '../types';

describe('MoveEngine', () => {
  describe('applyMove', () => {
    it('returns new state (immutability)', () => {
      const state1 = CubeState.solved();
      const state2 = MoveEngine.applyMove(state1, 'R');

      expect(state2).not.toBe(state1);
      expect(state1.isSolved()).toBe(true); // Original unchanged
    });

    it('applies R move correctly', () => {
      const state = CubeState.solved();
      const moved = MoveEngine.applyMove(state, 'R');

      expect(moved.isSolved()).toBe(false);
      expect(moved.validate()).toBe(true); // Still valid state
    });

    it('preserves color count after move', () => {
      const state = CubeState.solved();
      const moved = MoveEngine.applyMove(state, 'U');

      const counts = [0, 0, 0, 0, 0, 0];
      for (const color of moved.stickers) {
        counts[color]++;
      }

      expect(counts).toEqual([9, 9, 9, 9, 9, 9]);
    });

    it('applies all 18 moves without error', () => {
      const state = CubeState.solved();
      const moves: Move[] = [
        'U', "U'", 'U2',
        'R', "R'", 'R2',
        'F', "F'", 'F2',
        'D', "D'", 'D2',
        'L', "L'", 'L2',
        'B', "B'", 'B2',
      ];

      for (const move of moves) {
        const moved = MoveEngine.applyMove(state, move);
        expect(moved.validate()).toBe(true);
      }
    });
  });

  describe('applySequence', () => {
    it('applies multiple moves in order', () => {
      const state = CubeState.solved();
      const moved = MoveEngine.applySequence(state, ['R', 'U', "R'", "U'"]);

      expect(moved.validate()).toBe(true);
      expect(moved.isSolved()).toBe(false);
    });

    it('handles empty sequence', () => {
      const state = CubeState.solved();
      const moved = MoveEngine.applySequence(state, []);

      expect(moved.equals(state)).toBe(true);
    });

    it('handles single move', () => {
      const state = CubeState.solved();
      const moved1 = MoveEngine.applySequence(state, ['R']);
      const moved2 = MoveEngine.applyMove(state, 'R');

      expect(moved1.equals(moved2)).toBe(true);
    });
  });

  describe('inverse', () => {
    it('returns R\' for R', () => {
      expect(MoveEngine.inverse('R')).toBe("R'");
    });

    it('returns U for U\'', () => {
      expect(MoveEngine.inverse("U'")).toBe('U');
    });

    it('returns U2 for U2 (self-inverse)', () => {
      expect(MoveEngine.inverse('U2')).toBe('U2');
    });

    it('move + inverse returns to original state', () => {
      const state = CubeState.solved();
      const moves: Move[] = ['R', 'U', 'F', 'D', 'L', 'B'];

      for (const move of moves) {
        const moved = MoveEngine.applyMove(state, move);
        const inv = MoveEngine.inverse(move);
        const restored = MoveEngine.applyMove(moved, inv);

        expect(restored.equals(state)).toBe(true);
      }
    });

    it('applying move 4 times returns to original (90° moves)', () => {
      const state = CubeState.solved();
      const moves: Move[] = ['R', 'U', 'F', 'D', 'L', 'B'];

      for (const move of moves) {
        let current = state;
        for (let i = 0; i < 4; i++) {
          current = MoveEngine.applyMove(current, move);
        }
        expect(current.equals(state)).toBe(true);
      }
    });

    it('applying 180° move twice returns to original', () => {
      const state = CubeState.solved();
      const moves: Move[] = ['R2', 'U2', 'F2', 'D2', 'L2', 'B2'];

      for (const move of moves) {
        const moved = MoveEngine.applyMove(state, move);
        const restored = MoveEngine.applyMove(moved, move);

        expect(restored.equals(state)).toBe(true);
      }
    });
  });

  describe('parseNotation', () => {
    it('parses "R U R\' U\'"', () => {
      const moves = MoveEngine.parseNotation("R U R' U'");
      expect(moves).toEqual(['R', 'U', "R'", "U'"]);
    });

    it('handles whitespace', () => {
      const moves = MoveEngine.parseNotation('  R   U  ');
      expect(moves).toEqual(['R', 'U']);
    });

    it('handles empty string', () => {
      const moves = MoveEngine.parseNotation('');
      expect(moves).toEqual([]);
    });

    it('throws error for invalid notation', () => {
      expect(() => MoveEngine.parseNotation('X')).toThrow('Invalid move notation');
      expect(() => MoveEngine.parseNotation('R3')).toThrow('Invalid move notation');
    });

    it('parses complex algorithm', () => {
      const moves = MoveEngine.parseNotation("R U R' U' R' F R2 U' R' U' R U R' F'");
      expect(moves.length).toBe(14);
    });
  });

  describe('randomSequence', () => {
    it('generates sequence of requested length', () => {
      const moves = MoveEngine.randomSequence(20);
      expect(moves.length).toBe(20);
    });

    it('generates valid moves', () => {
      const moves = MoveEngine.randomSequence(50);
      const state = CubeState.solved();
      const scrambled = MoveEngine.applySequence(state, moves);

      expect(scrambled.validate()).toBe(true);
    });

    it('generates different sequences', () => {
      const seq1 = MoveEngine.randomSequence(10);
      const seq2 = MoveEngine.randomSequence(10);

      // Very unlikely to be identical
      expect(seq1).not.toEqual(seq2);
    });
  });

  describe('property-based tests', () => {
    it('state always has 54 stickers after any move', () => {
      const state = CubeState.solved();
      const moves: Move[] = ['R', 'U', 'F', 'D', 'L', 'B'];

      for (const move of moves) {
        const moved = MoveEngine.applyMove(state, move);
        expect(moved.stickers.length).toBe(54);
      }
    });

    it('state always has 9 stickers per color after any move', () => {
      const state = CubeState.solved();
      const randomMoves = MoveEngine.randomSequence(100);
      const scrambled = MoveEngine.applySequence(state, randomMoves);

      expect(scrambled.validate()).toBe(true);
    });

    it('sequence + inverse sequence = identity', () => {
      const state = CubeState.solved();
      const sequence: Move[] = ['R', 'U', 'F', 'D'];
      const inverseSeq = sequence.map(m => MoveEngine.inverse(m)).reverse();

      const moved = MoveEngine.applySequence(state, sequence);
      const restored = MoveEngine.applySequence(moved, inverseSeq);

      expect(restored.equals(state)).toBe(true);
    });
  });
});
