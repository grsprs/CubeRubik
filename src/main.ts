import * as THREE from 'three';
import { CubeState } from './domain/CubeState';
import { VisualCube } from './presentation/VisualCube';
import { CameraController } from './presentation/CameraController';

/**
 * Main application entry point
 * Initializes Three.js scene and cube visualization
 */

// Get canvas element
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

if (!canvas) {
  throw new Error('Canvas element not found');
}

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Create camera
const camera = new THREE.PerspectiveCamera(
  50, // FOV
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near plane
  1000 // Far plane
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// Create renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create visual cube
const visualCube = new VisualCube(scene);
const state = CubeState.solved();
visualCube.syncWithState(state);

// Create camera controller
const cameraController = new CameraController(camera, canvas);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  
  // Calculate delta time
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  // Update camera controls
  cameraController.update();
  
  // Update animations
  visualCube.update(deltaTime);
  
  renderer.render(scene, camera);
}

animate();

// Log initialization
console.log('CubeRubik initialized');
console.log('Domain layer ready:', state.isSolved());
console.log('Visual cube created with 26 cubies');

// Test animation (press R key)
window.addEventListener('keydown', async (e) => {
  if (e.key === 'r' && !visualCube.isAnimating()) {
    console.log('Animating R move...');
    await visualCube.animateMove('R');
    console.log('Animation complete!');
  }
});
