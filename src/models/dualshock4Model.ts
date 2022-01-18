// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gamepadModel from 'src/assets/models/gamepad.glb';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GamepadModel } from '.';

export class Dualshock4Model implements GamepadModel {
  gltf: GLTF | null = null;
  btnMap: { [key: string]: THREE.Mesh | null } = {
    x_btn: null,
    circle_btn: null,
    square_btn: null,
    triangle_btn: null,
    l_btn: null,
    r_btn: null,
    trigger_l: null,
    trigger_r: null,
    share_btn: null,
    options_btn: null,
    analog_stick_l: null,
    analog_stick_r: null,
    up_btn: null,
    down_btn: null,
    left_btn: null,
    right_btn: null,
    home_btn: null,
  };
  btns: (THREE.Mesh | null)[] = [];
  private loadPromise: Promise<void>;

  constructor() {
    this.loadPromise = this.load();
  }

  async add(scene: THREE.Scene) {
    await this.loadPromise;
    if (this.gltf) {
      scene.add(this.gltf?.scene);
    }
  }

  update() {
    if (this.gltf) {
      this.gltf.scene.rotation.y -= 0.001;
    }
  }

  remove(scene: THREE.Scene) {
    if (this.gltf) {
      scene.remove(this.gltf?.scene);
    }
  }

  private load() {
    const loader = new GLTFLoader();

    return new Promise<void>((resolve) => {
      loader.load(gamepadModel, (gltf) => {
        gltf.scene.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) {
            return;
          }
          child.castShadow = true;
          child.receiveShadow = true;
          console.log(child.name);
          if (child.name in this.btnMap) {
            this.btnMap[child.name] = child;
          }
        });
        this.btns = Object.values(this.btnMap);
        this.gltf = gltf;
        resolve();
      });
    });
  }
}
