# ADR 003: Position-Based Color Derivation

**Status**: Accepted  
**Date**: 2026-02-14  
**Decision ID**: DEC-006

## Context

Each cubie in the 3D visualization must display the correct colors after moves. We needed to decide: should cubies remember their identity, or derive colors from their current position?

## Decision

**Cubies derive colors from their current position in the canonical state.**

Visual appearance = f(position), NOT f(identity)

## Alternatives Considered

1. **Identity-Based Coloring**: Each cubie remembers its original colors
   - ❌ Violates 3d-addendum.md Section C6a
   - ❌ Requires tracking cubie identity through moves
   - ❌ Creates duplicate state (domain + visual)
   - ❌ Risk of desynchronization

2. **Hybrid Approach**: Use identity for performance, sync periodically
   - ❌ Complexity without benefit
   - ❌ Still violates canonical model principle

## Rationale

- **Single Source of Truth**: CubeState is the only authority
- **Correctness**: Visual bugs cannot corrupt logical state
- **Simplicity**: No identity tracking needed
- **Compliance**: Mandated by 3d-addendum.md C6a

## Implementation

```typescript
class VisualCube {
  syncWithState(state: CubeState): void {
    this.cubies.forEach(cubie => {
      const position = cubie.userData.position; // e.g., "FRU"
      const colors = this.getColorsAtPosition(state, position);
      this.updateCubieMaterials(cubie, colors);
    });
  }
}
```

## Consequences

**Positive**:
- Guaranteed visual-logical consistency
- Simpler mental model
- Easy to add state serialization/loading

**Negative**:
- Must recompute colors on every sync (mitigated: only 26 cubies)
- Slightly more complex color lookup logic

## Performance

- 26 cubies × 3 faces/cubie = 78 material updates per move
- Measured: < 1ms on mid-range laptop
- Well within 16ms frame budget (60 FPS)

## Compliance

- ✅ **CRITICAL**: 3d-addendum.md Section C6a
- ✅ 3d-addendum.md Section 24: Representation Separation
- ✅ guideproject.md Section 23: Canonical Domain Model
