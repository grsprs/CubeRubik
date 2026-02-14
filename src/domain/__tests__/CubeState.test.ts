/// <reference types="vitest" />
import { CubeState } from '../CubeState';

describe('CubeState', () => {
  describe('solved', () => {
    it('creates solved state with 54 stickers', () => {
      const state = CubeState.solved();
      expect(state.stickers.length).toBe(54);
    });

    it('creates state with uniform colors per face', () => {
      const state = CubeState.solved();
      
      // Check each face has uniform color
      for (let face = 0; face < 6; face++) {
        const faceStart = face * 9;
        const color = state.stickers[faceStart];
        
        for (let i = 0; i < 9; i++) {
          expect(state.stickers[faceStart + i]).toBe(color);
        }
      }
    });

    it('creates state with correct color distribution', () => {
      const state = CubeState.solved();
      const counts = [0, 0, 0, 0, 0, 0];
      
      for (const color of state.stickers) {
        counts[color]++;
      }
      
      expect(counts).toEqual([9, 9, 9, 9, 9, 9]);
    });
  });

  describe('fromArray', () => {
    it('creates state from valid array', () => {
      const stickers = Array(54).fill(0).map((_, i) => Math.floor(i / 9));
      const state = CubeState.fromArray(stickers);
      expect(state.stickers.length).toBe(54);
    });

    it('throws error for invalid sticker count', () => {
      expect(() => CubeState.fromArray([0, 1, 2])).toThrow('expected 54 stickers');
    });

    it('throws error for invalid color value', () => {
      const stickers = Array(54).fill(0);
      stickers[0] = 6; // Invalid color
      expect(() => CubeState.fromArray(stickers)).toThrow('Invalid color value');
    });

    it('throws error for invalid color distribution', () => {
      const stickers = Array(54).fill(0); // All white
      expect(() => CubeState.fromArray(stickers)).toThrow('Invalid color distribution');
    });

    it('accepts valid color distribution', () => {
      const stickers = Array(54).fill(0).map((_, i) => Math.floor(i / 9));
      expect(() => CubeState.fromArray(stickers)).not.toThrow();
    });
  });

  describe('isSolved', () => {
    it('returns true for solved state', () => {
      const state = CubeState.solved();
      expect(state.isSolved()).toBe(true);
    });

    it('returns false for scrambled state', () => {
      const stickers = Array(54).fill(0).map((_, i) => Math.floor(i / 9));
      // Swap two stickers from DIFFERENT faces to break solved state
      [stickers[0], stickers[9]] = [stickers[9], stickers[0]]; // Swap U and R face stickers
      const state = CubeState.fromArray(stickers);
      expect(state.isSolved()).toBe(false);
    });

    it('returns false for partially solved state', () => {
      // Create a valid state first (9 of each color)
      const stickers = Array(54).fill(0).map((_, i) => Math.floor(i / 9));
      // Swap stickers between two faces (maintains color count)
      [stickers[0], stickers[9]] = [stickers[9], stickers[0]];
      const state = CubeState.fromArray(stickers);
      expect(state.isSolved()).toBe(false);
    });
  });

  describe('validate', () => {
    it('passes for valid state', () => {
      const state = CubeState.solved();
      expect(state.validate()).toBe(true);
    });

    it('fails for invalid sticker count', () => {
      const state = CubeState.solved();
      // Hack to create invalid state
      (state as any).stickers = [0, 1, 2];
      expect(state.validate()).toBe(false);
    });

    it('fails for invalid color values', () => {
      const stickers = Array(54).fill(0).map((_, i) => Math.floor(i / 9));
      const state = CubeState.fromArray(stickers);
      (state as any).stickers = [...state.stickers];
      (state as any).stickers[0] = 6;
      expect(state.validate()).toBe(false);
    });
  });

  describe('clone', () => {
    it('creates independent copy', () => {
      const state1 = CubeState.solved();
      const state2 = state1.clone();
      
      expect(state2.stickers).toEqual(state1.stickers);
      expect(state2).not.toBe(state1);
    });

    it('does not share references', () => {
      const state1 = CubeState.solved();
      const state2 = state1.clone();
      
      expect(state1.stickers).not.toBe(state2.stickers);
    });
  });

  describe('toJSON / fromJSON', () => {
    it('serializes and deserializes correctly', () => {
      const state1 = CubeState.solved();
      const json = state1.toJSON();
      const state2 = CubeState.fromJSON(json);
      
      expect(state2.stickers).toEqual(state1.stickers);
    });

    it('preserves state through serialization', () => {
      const stickers = Array(54).fill(0).map((_, i) => Math.floor(i / 9));
      const state1 = CubeState.fromArray(stickers);
      const state2 = CubeState.fromJSON(state1.toJSON());
      
      expect(state2.equals(state1)).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true for identical states', () => {
      const state1 = CubeState.solved();
      const state2 = CubeState.solved();
      expect(state1.equals(state2)).toBe(true);
    });

    it('returns false for different states', () => {
      const stickers1 = Array(54).fill(0).map((_, i) => Math.floor(i / 9));
      const stickers2 = [...stickers1];
      // Swap stickers from different faces
      [stickers2[0], stickers2[9]] = [stickers2[9], stickers2[0]];
      
      const state1 = CubeState.fromArray(stickers1);
      const state2 = CubeState.fromArray(stickers2);
      
      expect(state1.equals(state2)).toBe(false);
    });
  });
});
