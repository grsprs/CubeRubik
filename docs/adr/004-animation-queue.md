# ADR 004: Animation Queue with Discrete-Continuous Barrier

**Status**: Accepted  
**Date**: 2026-02-14  
**Decision ID**: DEC-007

## Context

Rubik's Cube moves must be animated smoothly, but users can input moves faster than animations complete. We needed a system to handle queued moves without race conditions.

## Decision

Implement an animation queue with strict discrete-continuous barrier:
- **Discrete updates**: Instant state changes (CubeState)
- **Continuous updates**: Smooth visual transitions (VisualCube)
- **Barrier**: No new move starts until previous animation completes

## Alternatives Considered

1. **Immediate State + Async Animation**: Update state instantly, animate in background
   - ❌ Visual state lags behind logical state
   - ❌ Confusing for users
   - ❌ Violates 3d-addendum.md B4

2. **Blocking Synchronous Animation**: Freeze input until animation completes
   - ✅ Simple implementation
   - ❌ Poor UX (unresponsive to rapid input)
   - ❌ No move queuing

3. **Parallel Animations**: Animate multiple moves simultaneously
   - ❌ Visually chaotic
   - ❌ Hard to follow for educational purposes
   - ❌ Complex collision detection

## Rationale

- **User Experience**: Smooth animations without input lag
- **Correctness**: State and visuals always in sync
- **Educational Value**: Users can see each move clearly
- **Compliance**: Follows 3d-addendum.md B4 barrier principle

## Implementation

```typescript
class AnimationEngine {
  private queue: Move[] = [];
  private isAnimating = false;

  async enqueue(move: Move): Promise<void> {
    this.queue.push(move);
    if (!this.isAnimating) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isAnimating = true;
    while (this.queue.length > 0) {
      const move = this.queue.shift()!;
      await this.animateMove(move); // Blocks until complete
    }
    this.isAnimating = false;
  }
}
```

## Consequences

**Positive**:
- No race conditions
- Predictable behavior
- Queue visible to user (future: show pending moves)

**Negative**:
- Rapid input creates long queue (mitigated: max queue size)
- Cannot skip animations (future: add skip button)

## Performance

- Animation duration: 300ms per move
- Easing function: easeInOutCubic
- 60 FPS maintained throughout

## Future Enhancements

- Add "Skip Animation" button
- Add "Animation Speed" slider
- Show queue length in UI

## Compliance

- ✅ **CRITICAL**: 3d-addendum.md Section B4
- ✅ 3d-addendum.md Section B1: Entity ID Stability
- ✅ guideproject.md Section 8: Failure Model
