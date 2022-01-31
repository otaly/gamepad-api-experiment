import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { GUI } from 'dat.gui';
import React, { Ref, Suspense, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gamepadModel from 'src/assets/models/gamepad.glb';
import { ColorRepresentation } from 'three';
import { GamepadModel } from '../models/Gamepad';
import Status from './Status';

const App = () => {
  const [{ gamepadColor }, setState] = useState({
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
  }, []);

  return (
    <>
      <div className="absolute w-full top-0 z-10 p-4 pointer-events-none">
        <h1
          className="text-5xl font-medium text-white tracking-wider mb-4"
          translate="no"
        >
          Gamepad API Experiment
        </h1>
        <Status />
      </div>
      <Canvas
        shadows
        camera={{ position: [0, 8, 13], fov: 45, aspect: 1 }}
        className="cursor-grab select-none"
      >
        <color attach="background" args={['black']} />
        <fog attach="fog" args={['#000000', 20, 60]} />
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
          <Environment preset="night"></Environment>
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
