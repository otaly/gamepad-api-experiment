import { css } from '@emotion/react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { GUI } from 'dat.gui';
import React, { Ref, Suspense, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gamepadModel from 'src/assets/models/gamepad.glb';
import { getGamepads } from 'src/util/GetGamepad';
import { ColorRepresentation } from 'three';
import { GamepadModel } from '../models/Gamepad';

const App = () => {
  const [{ isGamepadConnected, checked, gamepadColor }, setState] = useState({
    isGamepadConnected: false,
    checked: false,
    gamepadColor: 0xffffff as ColorRepresentation,
  });

  const planeMatRef: Ref<THREE.MeshPhongMaterial> = useRef(null);
  useEffect(() => {
    const gui = new GUI();
    const planeFolder = gui.addFolder('Floor');
    planeFolder
      .addColor({ color: 0xffffff }, 'color')
      .onChange((v) => planeMatRef.current?.color.set(v));
    planeFolder.open();
    const gamepadFolder = gui.addFolder('Gamepad');
    gamepadFolder
      .addColor({ color: 0xffffff }, 'color')
      .onChange((v) => setState((s) => ({ ...s, gamepadColor: v })));
    gamepadFolder.open();

    const windowListenerMap: Record<
      'gamepadconnected' | 'gamepaddisconnected',
      ((ev: Event) => void) | null
    > = { gamepadconnected: null, gamepaddisconnected: null };

    const gamepads = getGamepads();
    setState((s) => ({ ...s, isGamepadConnected: gamepads.length > 0 }));
    windowListenerMap.gamepadconnected = () => {
      setState((s) => ({ ...s, isGamepadConnected: true }));
    };
    windowListenerMap.gamepaddisconnected = () => {
      setState((s) => ({
        ...s,
        isGamepadConnected: getGamepads().length > 0,
      }));
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
    };
  }, []);

  const lights = [
    <>
      <spotLight
        castShadow
        position={[0, 10, 5]}
        color={0xfff9ed}
        intensity={1}
        distance={25}
        angle={Math.PI / 4}
        penumbra={1}
        decay={0.5}
        shadow-mapSize={[2048, 2048]}
      ></spotLight>
      <ambientLight intensity={0.05}></ambientLight>
    </>,
    <>
      <spotLight
        castShadow
        position={[0, 10, 11.2]}
        color={0xffedd9}
        intensity={1.3}
        distance={25}
        angle={Math.PI / 4}
        penumbra={1}
        decay={0.6}
        shadow-mapSize={[2048, 2048]}
      ></spotLight>
      <directionalLight
        position={[2, 3.5, -8.4]}
        color={0xabe2ff}
        intensity={0.35}
      ></directionalLight>
    </>,
  ];
  const light = lights[checked ? 0 : 1];

  const status = isGamepadConnected ? (
    <p
      className="text-green-400 tracking-wide text-4xl text-center animate-fadeout"
      css={css({ animationDelay: '1s' })}
    >
      Connected!!!
    </p>
  ) : (
    <p className="text-white tracking-wide text-4xl text-center animate-pulse">
      Disconnected
    </p>
  );

  return (
    <>
      <div className="absolute w-full top-0 z-10 p-4 pointer-events-none">
        <p className="text-5xl font-medium text-white tracking-wider mb-4">
          Gamepad API Experiment
        </p>
        <input
          className="pointer-events-auto"
          type="checkbox"
          onChange={(event) => setState((s) => ({ ...s, checked: !checked }))}
        />
        {status}
      </div>
      <Canvas
        shadows
        camera={{ position: [0, 8, 13], fov: 45, aspect: 1 }}
        className="cursor-grab"
      >
        <color attach="background" args={['black']} />
        <fog attach="fog" args={['#000000', 20, 60]} />
        {light}
        <Suspense fallback={null}>
          <GamepadModel
            url={gamepadModel}
            color={gamepadColor}
            castShadow
            receiveShadow
            rotation={[0, -Math.PI / 2, 0]}
          />
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.5, 0]}
          >
            <planeGeometry args={[150, 150]} />
            {/* <MeshReflectorMaterial
              mirror={0.4}
              blur={[400, 100]}
              resolution={1024}
              mixBlur={1}
              opacity={2}
              depthScale={1.1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.25}
              roughness={0.7}
            /> */}
            <meshPhongMaterial ref={planeMatRef} color={0xffffff} />
          </mesh>
          {/* <Environment preset="night"></Environment> */}
        </Suspense>
        <OrbitControls
          zoomSpeed={0.3}
          autoRotate
          autoRotateSpeed={0.4}
          rotateSpeed={1}
          enableDamping
          dampingFactor={0.2}
          minPolarAngle={-Math.PI / 2}
          maxPolarAngle={Math.PI / 1.7}
          makeDefault
        />
      </Canvas>
    </>
  );
};

export default App;
