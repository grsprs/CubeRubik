# ADR 002: Permutation-Based Move Engine

**Status**: Accepted  
**Date**: 2026-02-14  
**Decision ID**: DEC-003

## Context

Rubik's Cube moves are transformations of the 54-sticker state. We needed an algorithm that is correct, fast, and maintainable.

## Decision

Implement moves as precomputed permutation arrays:
- Each of 18 moves (R, R', R2, U, U', ...) has a fixed permutation
- Apply move by remapping sticker indices: `newState[i] = oldState[perm[i]]`
- Generate permutations programmatically using helper functions

## Alternatives Considered

1. **Rotation Matrices**: Apply 3D rotations to sticker positions
   - ❌ Floating-point errors
   - ❌ Complex coordinate transformations
   - ❌ Slower than array lookups

2. **Rule-Based Logic**: Hardcode which stickers move where
   - ❌ Error-prone (54 stickers × 18 moves = 972 mappings)
   - ❌ Difficult to verify correctness
   - ❌ Hard to maintain

3. **Cycle Notation**: Represent moves as cycles (e.g., R = (1 3 8 6)(2 5 7 4))
   - ✅ Mathematically elegant
   - ❌ Harder to implement
   - ❌ No performance benefit

## Rationale

- **Correctness**: Permutations are bijections (preserve color count)
- **Performance**: O(54) array copy, no computation
- **Testability**: Easy to verify with property-based tests
- **Maintainability**: Permutations generated from simple face rotation logic

## Implementation

```typescript
const R_PERM = generateFaceRotation(Face.Right);
function applyMove(state: number[], move: Move): number[] {
  const perm = MOVE_PERMUTATIONS[move];
  return perm.map(i => state[i]);
}
```

## Consequences

**Positive**:
- Zero floating-point errors
- Deterministic behavior
- Fast execution (< 1ms per move)
- Easy to add new move types

**Negative**:
- 18 × 54 = 972 integers in memory (~4KB)
- Permutations must be precomputed correctly

## Verification

- ✅ Property test: 4 × R = identity
- ✅ Property test: R followed by R' = identity
- ✅ Property test: Color count preserved
- ✅ Integration test: Known algorithms produce solved state

## Compliance

- ✅ guideproject.md Section 14: Complexity Documentation
- ✅ Rules.md: Test-Driven Development
