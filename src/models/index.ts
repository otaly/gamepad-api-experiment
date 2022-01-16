import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export interface GamepadModel {
  gltf: GLTF | null;
  btnMap: { [key: string]: THREE.Mesh | null };
  btns: (THREE.Mesh | null)[];
  add: (scene: THREE.Scene) => Promise<void>;
  update: () => void;
  remove: (scene: THREE.Scene) => void;
}
