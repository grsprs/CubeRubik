import * as THREE from 'three';
import { CubeState } from '../domain/CubeState';
import { Color, CubieId } from '../domain/types';
import { getMaterial, BLACK_MATERIAL } from './materials';

/**
 * VisualCube - Three.js representation of Rubik's Cube
 * 
 * Architecture (3d-addendum.md):
 * - B1: Entity ID stability (26 cubies, immutable IDs)
 * - B7: No scene reconstruction (reuse meshes)
 * - C6a: Position-based color derivation
 */

/**
 * Cubie position in 3D space
 */
interface CubiePosition {
  x: number;
  y: number;
  z: number;
}

/**
 * Visual representation of a single cubie
 */
class Cubie {
  readonly id: CubieId;
  readonly mesh: THREE.Group;
  private readonly stickers: THREE.Mesh[] = [];

  constructor(id: CubieId, position: CubiePosition) {
    this.id = id;
    this.mesh = new THREE.Group();

    // Create cubie body (black cube)
    const bodyGeometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
    const body = new THREE.Mesh(bodyGeometry, BLACK_MATERIAL);
    this.mesh.add(body);

    // Create stickers (colored faces)
    this.createStickers(position);

    // Set initial position
    this.mesh.position.set(position.x, position.y, position.z);
  }

  /**
   * Create stickers based on cubie position
   * Only create stickers for visible faces
   */
  private createStickers(pos: CubiePosition): void {
    const stickerSize = 0.9;
    const offset = 0.48;
    const stickerGeometry = new THREE.PlaneGeometry(stickerSize, stickerSize);

    // Right face (+X)
    if (pos.x > 0) {
      const sticker = new THREE.Mesh(stickerGeometry, getMaterial(Color.Red));
      sticker.position.set(offset, 0, 0);
      sticker.rotation.y = Math.PI / 2;
      this.mesh.add(sticker);
      this.stickers.push(sticker);
    }

    // Left face (-X)
    if (pos.x < 0) {
      const sticker = new THREE.Mesh(stickerGeometry, getMaterial(Color.Orange));
      sticker.position.set(-offset, 0, 0);
      sticker.rotation.y = -Math.PI / 2;
      this.mesh.add(sticker);
      this.stickers.push(sticker);
    }

    // Top face (+Y)
    if (pos.y > 0) {
      const sticker = new THREE.Mesh(stickerGeometry, getMaterial(Color.White));
      sticker.position.set(0, offset, 0);
      sticker.rotation.x = -Math.PI / 2;
      this.mesh.add(sticker);
      this.stickers.push(sticker);
    }

    // Bottom face (-Y)
    if (pos.y < 0) {
      const sticker = new THREE.Mesh(stickerGeometry, getMaterial(Color.Yellow));
      sticker.position.set(0, -offset, 0);
      sticker.rotation.x = Math.PI / 2;
      this.mesh.add(sticker);
      this.stickers.push(sticker);
    }

    // Front face (+Z)
    if (pos.z > 0) {
      const sticker = new THREE.Mesh(stickerGeometry, getMaterial(Color.Green));
      sticker.position.set(0, 0, offset);
      this.mesh.add(sticker);
      this.stickers.push(sticker);
    }

    // Back face (-Z)
    if (pos.z < 0) {
      const sticker = new THREE.Mesh(stickerGeometry, getMaterial(Color.Blue));
      sticker.position.set(0, 0, -offset);
      sticker.rotation.y = Math.PI;
      this.mesh.add(sticker);
      this.stickers.push(sticker);
    }
  }

  /**
   * Update sticker colors based on current position
   * CRITICAL: Position-based color derivation (3d-addendum.md C6a)
   */
  updateColors(state: CubeState): void {
    // TODO: Implement position-based color lookup
    // For now, colors are set at creation
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.stickers.forEach(s => {
      s.geometry.dispose();
    });
  }
}

/**
 * VisualCube class
 */
export class VisualCube {
  private readonly scene: THREE.Scene;
  private readonly cubies: Cubie[] = [];
  private readonly cubeGroup: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);

    this.createCubies();
  }

  /**
   * Create 26 cubies (3d-addendum.md B1: entity ID stability)
   */
  private createCubies(): void {
    let id = 0;

    // Create cubies at all positions except center (0,0,0)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip center
          if (x === 0 && y === 0 && z === 0) continue;

          const cubie = new Cubie(id++, { x, y, z });
          this.cubies.push(cubie);
          this.cubeGroup.add(cubie.mesh);
        }
      }
    }

    console.log(`Created ${this.cubies.length} cubies`);
  }

  /**
   * Sync visual with domain state
   * (3d-addendum.md B3: projection integrity)
   */
  syncWithState(state: CubeState): void {
    // TODO: Update cubie colors based on state
    // For now, cubies show initial solved colors
  }

  /**
   * Get cube group for animations
   */
  getCubeGroup(): THREE.Group {
    return this.cubeGroup;
  }

  /**
   * Dispose all resources
   */
  dispose(): void {
    this.cubies.forEach(c => c.dispose());
    this.scene.remove(this.cubeGroup);
  }
}
