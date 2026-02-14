# ADR 001: Dual State Architecture (Canonical + Visual)

**Status**: Accepted  
**Date**: 2026-02-14  
**Decision ID**: DEC-002

## Context

A Rubik's Cube simulator requires both logical state (which colors are where) and visual representation (3D meshes). We needed to decide how to structure this relationship.

## Decision

Implement a dual state architecture with:
- **Canonical State**: Flat array of 54 integers (domain layer)
- **Visual State**: 26 Three.js mesh objects (presentation layer)
- **One-way sync**: CubeState → VisualCube only

## Alternatives Considered

1. **Single Three.js State**: Store colors directly in mesh userData
   - ❌ Violates separation of concerns
   - ❌ Makes testing difficult
   - ❌ Couples logic to rendering library

2. **Bidirectional Sync**: Allow visual state to update canonical state
   - ❌ Creates circular dependencies
   - ❌ Risk of state desynchronization
   - ❌ Violates 3d-addendum.md Section 24

3. **Event-driven Architecture**: Emit events on state changes
   - ✅ Good decoupling
   - ❌ Overkill for single-user application
   - ❌ Adds complexity without benefit

## Rationale

- **Testability**: Domain logic testable without Three.js
- **Maintainability**: Clear ownership (domain owns truth)
- **Performance**: Visual updates only when needed
- **Compliance**: Follows 3d-addendum.md canonical model rules

## Consequences

**Positive**:
- Domain layer has 100% test coverage
- Visual bugs don't affect logical correctness
- Easy to add alternative renderers (2D, ASCII)

**Negative**:
- Must manually sync states
- Potential for desync bugs (mitigated by strict one-way flow)

## Compliance

- ✅ 3d-addendum.md Section 23: Canonical Domain Model
- ✅ 3d-addendum.md Section 24: Representation Separation
- ✅ guideproject.md Section 8: Modeling Phase
