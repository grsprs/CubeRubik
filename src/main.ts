import * as THREE from 'three';
import { VisualCube } from './presentation/VisualCube';
import { CameraController } from './presentation/CameraController';
import { CubeController } from './application/CubeController';
import { InputHandler } from './application/InputHandler';
import { ControlPanel } from './ui/ControlPanel';

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

// Create application layer
const cubeController = new CubeController(visualCube);
new InputHandler(cubeController);
new ControlPanel(cubeController);

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
console.log('Domain layer ready:', cubeController.isSolved());
console.log('Visual cube created with 26 cubies');
console.log('\nKeyboard controls:');
console.log('  R, U, F, D, L, B - Execute move');
console.log('  Shift + key - Inverse move (e.g., Shift+R = R\')');
console.log('  Space - Scramble');
console.log('  Backspace - Undo');
console.log('  Escape - Reset');

// Expose controller for debugging
(window as any).cube = cubeController;
