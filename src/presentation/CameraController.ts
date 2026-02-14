import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * CameraController - Manages camera movement and controls
 * 
 * Features:
 * - Orbit controls (mouse drag to rotate)
 * - Zoom (mouse wheel)
 * - Pan (right-click drag)
 */
export class CameraController {
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    
    // Create orbit controls
    this.controls = new OrbitControls(camera, domElement);
    
    // Configure controls
    this.controls.enableDamping = true; // Smooth movement
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3; // Min zoom
    this.controls.maxDistance = 15; // Max zoom
    this.controls.maxPolarAngle = Math.PI; // Allow full rotation
    
    // Target center of cube
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  /**
   * Update controls (call in animation loop)
   */
  update(): void {
    this.controls.update();
  }

  /**
   * Reset camera to default position
   */
  reset(): void {
    this.camera.position.set(5, 5, 5);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  /**
   * Dispose controls
   */
  dispose(): void {
    this.controls.dispose();
  }
}
