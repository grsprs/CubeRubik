/// <reference types="vitest" />
import { GameState, GameStatus } from '../GameState';

describe('GameState', () => {
  it('starts in Idle status', () => {
    const state = new GameState();
    expect(state.getStatus()).toBe(GameStatus.Idle);
  });

  it('has zero move count initially', () => {
    const state = new GameState();
    expect(state.getMoveCount()).toBe(0);
  });

  it('transitions to Ready after scramble', () => {
    const state = new GameState();
    const ready = state.setReady(20);
    expect(ready.getStatus()).toBe(GameStatus.Ready);
    expect(ready.getScrambleMoves()).toBe(20);
  });

  it('starts timer from Ready state', () => {
    const state = new GameState();
    const ready = state.setReady(20);
    const running = ready.start();
    expect(running.getStatus()).toBe(GameStatus.Running);
    expect(running.isRunning()).toBe(true);
  });

  it('increments move count', () => {
    const state = new GameState();
    const moved = state.incrementMoves();
    expect(moved.getMoveCount()).toBe(1);
  });

  it('completes from Running state', () => {
    const state = new GameState();
    const ready = state.setReady(20);
    const running = ready.start();
    const completed = running.complete();
    expect(completed.getStatus()).toBe(GameStatus.Completed);
    expect(completed.isCompleted()).toBe(true);
  });

  it('resets to Idle', () => {
    const state = new GameState();
    const ready = state.setReady(20);
    const reset = ready.reset();
    expect(reset.getStatus()).toBe(GameStatus.Idle);
    expect(reset.getMoveCount()).toBe(0);
  });

  it('is immutable', () => {
    const state = new GameState();
    const ready = state.setReady(20);
    const running = ready.start();
    
    expect(state.getStatus()).toBe(GameStatus.Idle);
    expect(ready.getStatus()).toBe(GameStatus.Ready);
    expect(running.getStatus()).toBe(GameStatus.Running);
  });
});
