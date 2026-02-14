# ADR 006: Evolution from Educational to Game (v2.0)

**Status**: Accepted  
**Date**: 2026-02-15  
**Supersedes**: Original scope (v1.0)

## Context

v1.0 delivered a complete educational Rubik's Cube simulator with:
- 3D visualization
- Move execution
- Scramble generation
- Keyboard controls

However, the project lacks **engagement mechanics** that would make it:
- More addictive
- More portfolio-impressive
- More competitive with existing implementations

## Decision

**Evolve the project to v2.0 with game mechanics** while preserving v1.0 as a stable base.

**Approach**: Branch-based evolution (v2-game-features)

## Alternatives Considered

### 1. Keep as Educational Only
- ✅ Simple, focused
- ❌ Less engaging
- ❌ Less portfolio value
- ❌ Doesn't stand out

### 2. Pivot Current Project (rewrite scope)
- ✅ Single version
- ❌ Loses v1.0 narrative
- ❌ Messy git history
- ❌ No rollback option

### 3. Start New Project from Scratch
- ✅ Clean slate
- ❌ Duplicate work
- ❌ Loses existing quality
- ❌ Time waste

## Rationale

**Why v2.0 branch evolution:**
- Preserves v1.0 as complete deliverable
- Shows version management skills
- Allows incremental feature addition
- Maintains clean git history
- Follows guideproject.md Section 20 (Evolution Strategy)

**Why game mechanics:**
- Proven engagement (timer, scores, achievements)
- Differentiates from competitors
- More impressive for portfolio
- Demonstrates full-stack thinking (state management, persistence, UX)

## New Classification

**v1.0**: Formal, Brownfield, Low-assurance, Long-lived  
**v2.0**: Formal, Brownfield, **Medium-assurance**, Long-lived

**Why Medium-assurance:**
- Timer accuracy critical for competitive play
- Score persistence affects user trust
- Win detection must be 100% accurate

## Implementation Strategy

**5 Stages** (incremental):
1. Game Foundation (timer, win detection)
2. Game Modes (variety)
3. Progression (XP, levels, achievements)
4. Polish (animations, sound, themes)
5. Advanced (hints, leaderboard)

**Stage Gates**: Each stage must pass quality checks before next

## Consequences

### Positive
- 2 versions = 2x portfolio content
- Shows evolution capability
- v1.0 remains stable reference
- Incremental risk (can stop at any stage)
- Better interview story

### Negative
- Increased complexity
- More testing required
- Bundle size will grow (~100KB)
- Longer development time

### Risks
- Scope creep (mitigated by strict stage gates)
- Performance degradation (mitigated by profiling)
- Feature bloat (mitigated by v3.0 deferral)

## Compliance

- ✅ guideproject.md Section 20: Evolution Strategy
- ✅ Rules.md: Version management
- ✅ Rules.md: Branch protection (main stays stable)
- ✅ 3d-addendum.md: All rules still apply

## Success Criteria

**v2.0 is successful if:**
- All v1.0 features still work
- Timer accurate to ±10ms
- Win detection 100% reliable
- Data persists across sessions
- 60 FPS maintained
- Bundle < 600KB

## Rollback Plan

If v2.0 fails:
- main branch (v1.0) remains deployed
- v2-game-features branch archived
- Lessons documented in reflection
- No impact on v1.0 deliverable

## References

- v1.0 project-state.md
- v2.0 project-state.md
- guideproject.md Section 20
- post-project-reflection.md (v1.0 lessons)
