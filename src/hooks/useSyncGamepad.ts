import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTFResult, NodeNames } from '../types';
import { getGamepad } from '../util/getGamepad';

// アナログスティックの傾きの最大角
const STICK_MAX_ANGLE = Math.PI / 9;

export const useSyncGamepad = (nodes: GLTFResult['nodes']) => {
  const lastStateRef = useRef<ButtonState>();
  const nodeMap = useMemo<NodeMap>(
    () => ({
      x_btn: { mesh: nodes.x_btn, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
      circle_btn: {
        mesh: nodes.circle_btn,
        maxPressedPos: { x: 0, y: -0.06, z: 0 },
      },
      square_btn: {
        mesh: nodes.square_btn,
        maxPressedPos: { x: 0, y: -0.06, z: 0 },
      },
      triangle_btn: {
        mesh: nodes.triangle_btn,
        maxPressedPos: { x: 0, y: -0.06, z: 0 },
      },
      l_btn: { mesh: nodes.l_btn, maxPressedPos: { x: 0.07, y: 0, z: 0 } },
      r_btn: { mesh: nodes.r_btn, maxPressedPos: { x: 0.07, y: 0, z: 0 } },
      trigger_l: {
        mesh: nodes.trigger_l,
        maxPressedAngl: { x: 0, y: 0, z: 0.5 },
      },
      trigger_r: {
        mesh: nodes.trigger_r,
        maxPressedAngl: { x: 0, y: 0, z: 0.5 },
      },
      share_btn: {
        mesh: nodes.share_btn,
        maxPressedPos: { x: 0, y: -0.018, z: 0 },
      },
      options_btn: {
        mesh: nodes.options_btn,
        maxPressedPos: { x: 0, y: -0.018, z: 0 },
      },
      analog_stick_l: {
        mesh: nodes.analog_stick_l,
        maxPressedPos: { x: 0, y: -0.04, z: 0 },
      },
      analog_stick_r: {
        mesh: nodes.analog_stick_r,
        maxPressedPos: { x: 0, y: -0.04, z: 0 },
      },
      up_btn: { mesh: nodes.up_btn, maxPressedPos: { x: 0, y: -0.06, z: 0 } },
      down_btn: {
        mesh: nodes.down_btn,
        maxPressedPos: { x: 0, y: -0.06, z: 0 },
      },
      left_btn: {
        mesh: nodes.left_btn,
        maxPressedPos: { x: 0, y: -0.06, z: 0 },
      },
      right_btn: {
        mesh: nodes.right_btn,
        maxPressedPos: { x: 0, y: -0.06, z: 0 },
      },
      home_btn: {
        mesh: nodes.home_btn,
        maxPressedPos: { x: 0, y: -0.06, z: 0 },
      },
      touchpad: {
        mesh: nodes.touchpad,
        maxPressedPos: { x: 0, y: -0.06, z: 0 },
      },
      analog_stick_base: { mesh: nodes.analog_stick_base },
      body: { mesh: nodes.body },
    }),
    [nodes],
  );

  useFrame(() => {
    const gamepad = getGamepad();
    if (!gamepad) {
      return;
    }
    const state = gamepad.buttons.map(({ pressed, value }) => ({
      pressed,
      value,
    }));
    const lastState =
      lastStateRef.current ?? state.map(() => ({ pressed: false, value: 0 }));

    state.forEach(({ pressed, value }, index) => {
      const btnModel = Object.values(nodeMap)[index];

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

    const lStick = nodeMap.analog_stick_l.mesh;
    const rStick = nodeMap.analog_stick_r.mesh;
    // axesは[左スティックX軸, 左スティックY軸, 右スティックX軸, 右スティックY軸]の配列
    const [lStickX, lStickY, rStickX, rStickY] = gamepad.axes;
    lStick.rotation.set(
      -(lStickX * STICK_MAX_ANGLE),
      lStick.rotation.y,
      -(lStickY * STICK_MAX_ANGLE),
    );
    rStick.rotation.set(
      -(rStickX * STICK_MAX_ANGLE),
      rStick.rotation.y,
      -(rStickY * STICK_MAX_ANGLE),
    );

    lastStateRef.current = state;
  });
};

type ButtonState = { pressed: boolean; value: number }[];

type NodeMap = Record<NodeNames, OperableModel>;

type OperableModel =
  | {
      mesh: THREE.Mesh;
    }
  | {
      mesh: THREE.Mesh;
      maxPressedPos: { x: number; y: number; z: number };
    }
  | {
      mesh: THREE.Mesh;
      maxPressedAngl: { x: number; y: number; z: number };
    };
