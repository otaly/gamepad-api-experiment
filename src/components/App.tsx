import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
// @ts-ignore
import gamepadModel from 'assets/models/gamepad.glb';
import { GUI } from 'dat.gui';
import { Ref, Suspense, useEffect, useRef, useState } from 'react';
import THREE, { ColorRepresentation } from 'three';
import { GamepadModel } from '../models/Gamepad';
import { InfoPanel } from './InfoPanel';
import { Status } from './Status';
import { Title } from './Title';

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

    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <>
      <div className="absolute inset-0 z-10 p-4 pointer-events-none">
        <Title />
        <div className='absolute left-0 bottom-4 w-full sm:static'>
          <Status />
        </div>
        <InfoPanel />
      </div>
      <Canvas
        shadows
        camera={{ position: [0, 8, 13], fov: 45 }}
        className="cursor-grab select-none"
      >
        <color attach="background" args={['black']} />
        <fog attach="fog" args={['#000000', 20, 60]} />
        <spotLight
          castShadow
          position={[0, 10, 11.2]}
          color={0xffedd9}
          intensity={10.6}
          distance={25}
          angle={Math.PI / 4}
          penumbra={0.6}
          decay={0.6}
          shadow-mapSize={[2048, 2048]}
        ></spotLight>
        <directionalLight
          position={[2, 3.5, -8.4]}
          color={0xabe2ff}
          intensity={0.95}
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
