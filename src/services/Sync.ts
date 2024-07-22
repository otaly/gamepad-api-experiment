import { GLTFResult } from 'models/Gamepad';
import * as THREE from 'three';
import { getGamepad } from 'util/getGamepad';

// アナログスティックの傾きの最大角
const STICK_MAX_ANGLE = Math.PI / 9;

export class Sync {
  static instance: Sync;
  private lastState: ButtonState | null = null;
  nodes: OperableModel[] = [];
  private nodeMap: { [key in ModelNodeKeys]: OperableModel } = {
    x_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    circle_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    square_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    triangle_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    l_btn: { mesh: null, maxPressedPos: { x: 0.07, y: 0, z: 0 } },
    r_btn: { mesh: null, maxPressedPos: { x: 0.07, y: 0, z: 0 } },
    trigger_l: { mesh: null, maxPressedAngl: { x: 0, y: 0, z: 0.5 } },
    trigger_r: { mesh: null, maxPressedAngl: { x: 0, y: 0, z: 0.5 } },
    share_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.018, z: 0 } },
    options_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.018, z: 0 } },
    analog_stick_l: { mesh: null, maxPressedPos: { x: 0, y: -0.04, z: 0 } },
    analog_stick_r: { mesh: null, maxPressedPos: { x: 0, y: -0.04, z: 0 } },
    up_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    down_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    left_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    right_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    home_btn: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    touchpad: { mesh: null, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
    analog_stick_base: { mesh: null },
    body: { mesh: null },
  };

  constructor() {
    if (Sync.instance) {
      return Sync.instance;
    }
    Sync.instance = this;
  }

  setNodes(nodes: GLTFResult['nodes']) {
    this.nodes = [];
    Object.keys(this.nodeMap).forEach((key) => {
      this.nodeMap[key as ModelNodeKeys].mesh = null;
      const node = nodes[key as ModelNodeKeys];
      this.nodeMap[key as ModelNodeKeys].mesh = node;
    });
    this.nodes = Object.values(this.nodeMap);
  }

  update() {
    this.operateGamepadBtns((state, lastState, axes) => {
      state.forEach(({ pressed, value }, index) => {
        const btnModel = this.nodes[index];
        if (!btnModel.mesh) {
          return;
        }

        if ('maxPressedPos' in btnModel) {
          const { x, y, z } = btnModel.maxPressedPos;
          const wasPressed = lastState[index].pressed;
          if (pressed && !wasPressed) {
            btnModel.mesh.position.x += x;
            btnModel.mesh.position.y += y;
            btnModel.mesh.position.z += z;
          } else if (!pressed && wasPressed) {
            btnModel.mesh.position.x -= x;
            btnModel.mesh.position.y -= y;
            btnModel.mesh.position.z -= z;
          }
        }

        if ('maxPressedAngl' in btnModel) {
          const { x, y, z } = btnModel.maxPressedAngl;
          btnModel.mesh.rotation.set(x * value, y * value, z * value);
        }
      });

      const lStick = this.nodeMap.analog_stick_l.mesh;
      const rStick = this.nodeMap.analog_stick_r.mesh;
      [lStick, rStick].forEach((stick, index) =>
        // axesは[左スティックX軸, 左スティックY軸, 右スティックX軸, 右スティックY軸]の配列
        stick?.rotation.set(
          -(axes[0 + index * 2] * STICK_MAX_ANGLE),
          stick.rotation.y,
          -(axes[1 + index * 2] * STICK_MAX_ANGLE),
        ),
      );
    });
  }

  private operateGamepadBtns(
    listener: (
      state: ButtonState,
      lastState: ButtonState,
      axes: readonly number[],
    ) => void,
  ) {
    const gamepad = getGamepad();
    if (!gamepad) {
      return;
    }
    const state = gamepad.buttons.map(({ pressed, value }) => ({
      pressed,
      value,
    }));
    const lastState =
      this.lastState ?? state.map(() => ({ pressed: false, value: 0 }));
    listener(state, lastState, gamepad.axes);
    this.lastState = state;
  }
}

type ModelNodeKeys = keyof GLTFResult['nodes'];

type OperableModel =
  | {
      mesh: THREE.Mesh | null;
    }
  | {
      mesh: THREE.Mesh | null;
      maxPressedPos: { x: number; y: number; z: number };
    }
  | {
      mesh: THREE.Mesh | null;
      maxPressedAngl: { x: number; y: number; z: number };
    };

type ButtonState = { pressed: boolean; value: number }[];
