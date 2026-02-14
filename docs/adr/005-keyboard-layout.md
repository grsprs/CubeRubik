# ADR 005: Game-Friendly Keyboard Layout

**Status**: Accepted  
**Date**: 2026-02-14  
**Decision ID**: DEC-009

## Context

Standard Rubik's Cube notation uses R, U, F, D, L, B keys, but these are spread across the keyboard. For a game-like experience, we needed keys closer together for comfortable two-handed use.

## Decision

Implement dual keyboard layouts:
- **Left Hand**: Q/W/E (top), A/S/D (middle), Z/X/C (bottom)
- **Right Hand**: I/O/P (top), J/K/L (middle), N/M/, (bottom)
- **Modifiers**: Shift = inverse move, Ctrl = double move
- **Special**: Space = scramble, Backspace = undo, Esc = reset

## Alternatives Considered

1. **Standard Notation Only**: R, U, F, D, L, B
   - ❌ Keys too spread out
   - ❌ Awkward hand positions
   - ❌ Poor for rapid input

2. **WASD + Arrow Keys**: Gaming standard
   - ❌ Only 8 keys (need 18 moves)
   - ❌ Doesn't map to cube faces intuitively

3. **Numpad Layout**: 1-9 for different moves
   - ❌ Not available on all keyboards
   - ❌ Requires memorization

## Rationale

- **Ergonomics**: Hands stay in comfortable positions
- **Speed**: Minimal finger travel
- **Accessibility**: Works on all keyboards
- **Discoverability**: UI shows key bindings

## Key Mapping

| Face | Standard | Left Hand | Right Hand |
|------|----------|-----------|------------|
| Front | F | W | K |
| Back | B | S | J |
| Right | R | E | O |
| Left | L | Q | I |
| Up | U | D | L |
| Down | D | A | N |

**Modifiers**:
- Shift + Key = Inverse (e.g., Shift+W = F')
- Ctrl + Key = Double (e.g., Ctrl+W = F2)

## Implementation

```typescript
const KEY_MAP: Record<string, Move> = {
  'w': 'F', 'W': "F'", // Shift detection
  'k': 'F', 'K': "F'",
  // ... 18 total mappings
};
```

## Consequences

**Positive**:
- Comfortable for extended use
- Supports speedcubing practice
- Intuitive for gamers

**Negative**:
- Non-standard (requires learning)
- Conflicts with browser shortcuts (mitigated: preventDefault)

## User Feedback

- ✅ Requested by user during development
- ✅ Tested with rapid input sequences
- ✅ No accidental browser shortcuts triggered

## Future Enhancements

- Customizable key bindings
- Gamepad support
- Touch gesture controls (mobile)

## Compliance

- ✅ guideproject.md Section 6: Accessibility
- ✅ Rules.md: User-centered design
