import * as THREE from 'three';
import { Move, Axis, RotationDirection } from '../domain/types';

/**
 * AnimationEngine - Handles smooth rotation animations
 * 
 * Architecture (3d-addendum.md):
 * - B4: Discrete-continuous barrier (animation interpolates, doesn't define state)
 * - B8: Animation timing (no race conditions)
 * - C1: Step-by-step animation policy
 */

/**
 * Animation state
 */
interface Animation {
  group: THREE.Group;
  axis: Axis;
  targetAngle: number;
  currentAngle: number;
  duration: number;
  elapsed: number;
  onComplete: () => void;
}

/**
 * Move metadata for animations
 */
interface MoveAnimation {
  axis: Axis;
  direction: RotationDirection;
  angle: number; // radians
}

/**
 * Move to animation mapping
 */
const MOVE_ANIMATIONS: Record<Move, MoveAnimation> = {
  'U': { axis: Axis.Y, direction: RotationDirection.Clockwise, angle: Math.PI / 2 },
  "U'": { axis: Axis.Y, direction: RotationDirection.CounterClockwise, angle: -Math.PI / 2 },
  'U2': { axis: Axis.Y, direction: RotationDirection.Clockwise, angle: Math.PI },
  
  'R': { axis: Axis.X, direction: RotationDirection.Clockwise, angle: Math.PI / 2 },
  "R'": { axis: Axis.X, direction: RotationDirection.CounterClockwise, angle: -Math.PI / 2 },
  'R2': { axis: Axis.X, direction: RotationDirection.Clockwise, angle: Math.PI },
  
  'F': { axis: Axis.Z, direction: RotationDirection.Clockwise, angle: Math.PI / 2 },
  "F'": { axis: Axis.Z, direction: RotationDirection.CounterClockwise, angle: -Math.PI / 2 },
  'F2': { axis: Axis.Z, direction: RotationDirection.Clockwise, angle: Math.PI },
  
  'D': { axis: Axis.Y, direction: RotationDirection.CounterClockwise, angle: -Math.PI / 2 },
  "D'": { axis: Axis.Y, direction: RotationDirection.Clockwise, angle: Math.PI / 2 },
  'D2': { axis: Axis.Y, direction: RotationDirection.CounterClockwise, angle: -Math.PI },
  
  'L': { axis: Axis.X, direction: RotationDirection.CounterClockwise, angle: -Math.PI / 2 },
  "L'": { axis: Axis.X, direction: RotationDirection.Clockwise, angle: Math.PI / 2 },
  'L2': { axis: Axis.X, direction: RotationDirection.CounterClockwise, angle: -Math.PI },
  
  'B': { axis: Axis.Z, direction: RotationDirection.CounterClockwise, angle: -Math.PI / 2 },
  "B'": { axis: Axis.Z, direction: RotationDirection.Clockwise, angle: Math.PI / 2 },
  'B2': { axis: Axis.Z, direction: RotationDirection.CounterClockwise, angle: -Math.PI },
};

/**
 * AnimationEngine class
 */
export class AnimationEngine {
  private currentAnimation: Animation | null = null;
  private readonly queue: Array<() => void> = [];

  /**
   * Check if animation is in progress
   */
  isAnimating(): boolean {
    return this.currentAnimation !== null;
  }

  /**
   * Animate a move
   * Returns promise that resolves when animation completes
   */
  animateMove(
    group: THREE.Group,
    move: Move,
    duration: number = 300
  ): Promise<void> {
    return new Promise((resolve) => {
      const animation = MOVE_ANIMATIONS[move];
      
      // Create temporary group for rotation
      const rotationGroup = new THREE.Group();
      group.parent?.add(rotationGroup);
      
      // Move affected cubies to rotation group
      const affectedCubies = this.getAffectedCubies(group, animation.axis);
      affectedCubies.forEach(cubie => {
        // Store world position
        const worldPos = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();
        cubie.getWorldPosition(worldPos);
        cubie.getWorldQuaternion(worldQuat);
        
        // Move to rotation group
        group.remove(cubie);
        rotationGroup.add(cubie);
        
        // Restore world transform
        cubie.position.copy(worldPos);
        cubie.quaternion.copy(worldQuat);
      });
      
      // Setup animation
      this.currentAnimation = {
        group: rotationGroup,
        axis: animation.axis,
        targetAngle: animation.angle,
        currentAngle: 0,
        duration,
        elapsed: 0,
        onComplete: () => {
          // Move cubies back to main group
          affectedCubies.forEach(cubie => {
            const worldPos = new THREE.Vector3();
            const worldQuat = new THREE.Quaternion();
            cubie.getWorldPosition(worldPos);
            cubie.getWorldQuaternion(worldQuat);
            
            rotationGroup.remove(cubie);
            group.add(cubie);
            
            cubie.position.copy(worldPos);
            cubie.quaternion.copy(worldQuat);
          });
          
          // Remove rotation group
          group.parent?.remove(rotationGroup);
          
          this.currentAnimation = null;
          resolve();
          
          // Process queue
          if (this.queue.length > 0) {
            const next = this.queue.shift();
            next?.();
          }
        },
      };
    });
  }

  /**
   * Get cubies affected by rotation on given axis
   */
  private getAffectedCubies(group: THREE.Group, axis: Axis): THREE.Object3D[] {
    const affected: THREE.Object3D[] = [];
    
    group.children.forEach(child => {
      const pos = child.position;
      
      switch (axis) {
        case Axis.X:
          if (Math.abs(pos.x - 1) < 0.1) affected.push(child); // Right layer
          break;
        case Axis.Y:
          if (Math.abs(pos.y - 1) < 0.1) affected.push(child); // Top layer
          break;
        case Axis.Z:
          if (Math.abs(pos.z - 1) < 0.1) affected.push(child); // Front layer
          break;
      }
    });
    
    return affected;
  }

  /**
   * Update animation (call in animation loop)
   */
  update(deltaTime: number): void {
    if (!this.currentAnimation) return;
    
    const anim = this.currentAnimation;
    anim.elapsed += deltaTime;
    
    // Calculate progress (0 to 1)
    const progress = Math.min(anim.elapsed / anim.duration, 1);
    
    // Easing function (ease-in-out)
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    // Calculate current angle
    const newAngle = anim.targetAngle * eased;
    const deltaAngle = newAngle - anim.currentAngle;
    anim.currentAngle = newAngle;
    
    // Apply rotation
    switch (anim.axis) {
      case Axis.X:
        anim.group.rotateX(deltaAngle);
        break;
      case Axis.Y:
        anim.group.rotateY(deltaAngle);
        break;
      case Axis.Z:
        anim.group.rotateZ(deltaAngle);
        break;
    }
    
    // Check if complete
    if (progress >= 1) {
      anim.onComplete();
    }
  }

  /**
   * Clear animation queue
   */
  clear(): void {
    this.queue.length = 0;
  }
}
