import { GLTFResult } from 'src/models/Gamepad';
import { getGamepad } from 'src/util/GetGamepad';
import * as THREE from 'three';

export class Sync {
  static instance: Sync;
  private lastState: boolean[] | null = null;
  nodes: THREE.Mesh[] = [];
  private nodeMap: { [key in ModelNodeKeys]: THREE.Mesh | null } = {
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
    touchpad: null,
    analog_stick_base: null,
    body: null,
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
      this.nodeMap[key as ModelNodeKeys] = null;
      const node = nodes[key as ModelNodeKeys];
      this.nodeMap[key as ModelNodeKeys] = node;
      this.nodes.push(node);
    });
  }

  update() {
    this.operateGamepadBtns((state, lastState, axes) => {
      state.forEach((pressed, index) => {
        const btnModel = this.nodes[index];
        if (!btnModel) {
          return;
        }
        const wasPressed = lastState[index];
        if (pressed && !wasPressed) {
          btnModel.position.y -= 0.06;
        } else if (!pressed && wasPressed) {
          btnModel.position.y += 0.06;
        }
      });

      const lStick = this.nodeMap.analog_stick_l;
      const rStick = this.nodeMap.analog_stick_r;
      const MAX_ANGLE = Math.PI / 9;
      [lStick, rStick].forEach((stick, index) =>
        // axesは[左スティックX軸, 左スティックY軸, 右スティックX軸, 右スティックY軸]の配列
        stick?.rotation.set(
          -(axes[0 + index * 2] * MAX_ANGLE),
          stick.rotation.y,
          -(axes[1 + index * 2] * MAX_ANGLE)
        )
      );
    });
  }

  private operateGamepadBtns(
    listener: (
      state: boolean[],
      lastState: boolean[],
      axes: readonly number[]
    ) => void
  ) {
    const gamepad = getGamepad();
    if (!gamepad) {
      return;
    }
    const state = gamepad.buttons.map((button) => button.pressed);
    const lastState = this.lastState ?? state.map(() => false);
    listener(state, lastState, gamepad.axes);
    this.lastState = state;
  }
}

type ModelNodeKeys = keyof GLTFResult['nodes'];
