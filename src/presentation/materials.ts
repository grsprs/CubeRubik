import * as THREE from 'three';
import { Color } from '../domain/types';

/**
 * Materials for Rubik's Cube faces
 * Standard color scheme (3d-addendum.md A1)
 */

/**
 * Color mapping (hex values)
 */
export const COLOR_HEX: Record<Color, number> = {
  [Color.White]: 0xffffff,
  [Color.Red]: 0xff0000,
  [Color.Green]: 0x00ff00,
  [Color.Yellow]: 0xffff00,
  [Color.Orange]: 0xff8800,
  [Color.Blue]: 0x0000ff,
};

/**
 * Create material for a specific color
 */
export function createMaterial(color: Color): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: COLOR_HEX[color],
    roughness: 0.3,
    metalness: 0.1,
  });
}

/**
 * Create all materials (cached)
 */
export const MATERIALS: Record<Color, THREE.MeshStandardMaterial> = {
  [Color.White]: createMaterial(Color.White),
  [Color.Red]: createMaterial(Color.Red),
  [Color.Green]: createMaterial(Color.Green),
  [Color.Yellow]: createMaterial(Color.Yellow),
  [Color.Orange]: createMaterial(Color.Orange),
  [Color.Blue]: createMaterial(Color.Blue),
};

/**
 * Black material for cubie body
 */
export const BLACK_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0x000000,
  roughness: 0.5,
  metalness: 0.2,
});

/**
 * Get material by color
 */
export function getMaterial(color: Color): THREE.MeshStandardMaterial {
  return MATERIALS[color];
}
