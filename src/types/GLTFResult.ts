import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

export type NodeNames =
  | 'body'
  | 'analog_stick_base'
  | 'x_btn'
  | 'home_btn'
  | 'options_btn'
  | 'triangle_btn'
  | 'square_btn'
  | 'circle_btn'
  | 'share_btn'
  | 'analog_stick_r'
  | 'analog_stick_l'
  | 'up_btn'
  | 'right_btn'
  | 'down_btn'
  | 'left_btn'
  | 'l_btn'
  | 'r_btn'
  | 'trigger_l'
  | 'trigger_r'
  | 'touchpad';

export type GLTFResult = GLTF & {
  nodes: Record<NodeNames, THREE.Mesh>;
  materials: {
    body: THREE.MeshStandardMaterial;
    button: THREE.MeshStandardMaterial;
  };
};
