import { css } from '@emotion/react';
import { MeshReflectorMaterial, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense, useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gamepadModel from 'src/assets/models/gamepad.glb';
import { getGamepads } from 'src/util/GetGamepad';
import { GamepadModel } from '../models/Gamepad';

const App = () => {
  const [{ isGamepadConnected, checked }, setState] = useState({
    isGamepadConnected: false,
    checked: false,
  });

  useEffect(() => {
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
        position={[10, 10, 5]}
        color={0xffedd9}
        intensity={1.3}
        distance={25}
        angle={Math.PI / 4}
        penumbra={1}
        decay={0.6}
        shadow-mapSize={[2048, 2048]}
      ></spotLight>
      <directionalLight
        position={[-7, 2, -5]}
        color={0xabe2ff}
        intensity={0.6}
      ></directionalLight>
    </>,
  ];
  const light = lights[checked ? 1 : 0];

  const status = isGamepadConnected ? (
    <p
      className="text-green-400 text-4xl text-center animate-fadeout"
      css={css({ animationDelay: '1s' })}
    >
      Connected!!!
    </p>
  ) : (
    <p className="text-white text-4xl text-center animate-pulse">
      Disconnected
    </p>
  );

  return (
    <>
      <div className="absolute w-full top-0 z-10 p-4 pointer-events-none">
        <p className="text-5xl font-medium text-white mb-4">
          Gamepad API Experiment
        </p>
        <input
          className="pointer-events-auto"
          type="checkbox"
          onChange={(event) => setState((s) => ({ ...s, checked: !checked }))}
        />
        {status}
      </div>
      <Canvas shadows camera={{ position: [0, 7, 15], fov: 45, aspect: 1 }}>
        <color attach="background" args={['black']} />
        <fog attach="fog" args={['#000000', 20, 70]} />
        {light}
        <Suspense fallback={null}>
          <GamepadModel url={gamepadModel} castShadow receiveShadow />
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.5, 0]}
          >
            <planeGeometry args={[100, 100]} />
            <MeshReflectorMaterial
              mirror={0.4}
              blur={[400, 100]}
              resolution={1024}
              mixBlur={1}
              opacity={2}
              depthScale={1.1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.25}
              roughness={0.7}
            />
            {/* <meshPhongMaterial color={0xffffff} /> */}
          </mesh>
          {/* <Environment preset="night"></Environment> */}
        </Suspense>
        <OrbitControls
          zoomSpeed={0.4}
          autoRotate
          autoRotateSpeed={-0.4}
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
