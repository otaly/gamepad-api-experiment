import { css } from '@emotion/react';
import React, { useEffect, useRef, useState } from 'react';
import { Dualshock4Model } from 'src/models/dualshock4Model';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const App = () => {
  const [{ isGamepadConnected }, setState] = useState({
    isGamepadConnected: false,
  });
  let gamepadLastState: boolean[] | null = null;
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current) {
      return;
    }
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current,
      antialias: true,
    });
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1.0);
    camera.position.set(0, 7, 15);

    const controls = new OrbitControls(camera, document.body);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    const light = new THREE.SpotLight(0xfff9ed, 1, 30, Math.PI / 4, 1, 0.5);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
    light.position.set(0, 10, 5);

    addPlane(scene);

    const operateGamepadBtns = (
      listener: (state: boolean[], lastState: boolean[]) => void
    ) => {
      const gamepads = getGamepads();
      if (gamepads.length === 0) {
        return;
      }
      const gamepad = gamepads[0];
      console.log(gamepad.axes);
      const state = gamepad.buttons.map((button) => button.pressed);
      const lastState = gamepadLastState ?? state.map(() => false);
      listener(state, lastState);
      gamepadLastState = state;
    };

    const gamepadModel = new Dualshock4Model();

    let animationRequestId: number | null = null;
    const tick = () => {
      gamepadModel.update();

      operateGamepadBtns((state, lastState) => {
        state.forEach((pressed, index) => {
          const btnModel = gamepadModel.btns[index];
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
      });

      renderer.render(scene, camera);
      animationRequestId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      // サイズを取得
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;

      // レンダラーのサイズを調整する
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      // カメラのアスペクト比を正す
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    tick();
    onResize();

    const windowListenerMap: Record<
      'resize' | 'gamepadconnected' | 'gamepaddisconnected',
      ((ev: any) => void) | null
    > = { resize: null, gamepadconnected: null, gamepaddisconnected: null };
    windowListenerMap.resize = onResize;

    const gamepads = getGamepads();
    setState((s) => ({ ...s, isGamepadConnected: gamepads.length > 0 }));
    if (gamepads.length > 0) gamepadModel.add(scene);
    windowListenerMap.gamepadconnected = () => {
      setState((s) => ({ ...s, isGamepadConnected: true }));
      gamepadModel.add(scene);
    };
    windowListenerMap.gamepaddisconnected = () => {
      setState((s) => ({
        ...s,
        isGamepadConnected: getGamepads().length > 0,
      }));
      gamepadModel.remove(scene);
    };

    Object.entries(windowListenerMap).forEach(([evName, listener]) => {
      if (listener)
        window.addEventListener(evName as keyof WindowEventMap, listener);
    });

    return () => {
      Object.entries(windowListenerMap).forEach(([evName, listener]) => {
        if (listener) {
          window.removeEventListener(evName as keyof WindowEventMap, listener);
          windowListenerMap[evName as keyof typeof windowListenerMap] = null;
        }
      });
      if (animationRequestId != null) {
        cancelAnimationFrame(animationRequestId);
      }
    };
  }, []);

  return (
    <>
      <p css={css({ fontWeight: 'bold', fontSize: '3rem' })}>
        Gamepad API Experiment
      </p>
      <p>{isGamepadConnected ? 'connected' : 'disconnected'}</p>
      <canvas ref={canvas}></canvas>
    </>
  );
};

const getGamepads = () =>
  [...navigator.getGamepads()].filter(Boolean) as Gamepad[];

const addPlane = (scene: THREE.Scene) => {
  const geometry = new THREE.PlaneGeometry(600, 600, 16);
  // マテリアルを作成
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });
  // メッシュを作成
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  // 3D空間にメッシュを追加
  scene.add(mesh);
  mesh.rotateX(-(Math.PI / 2));
  mesh.position.y -= 2;
  return mesh;
};

export default App;
