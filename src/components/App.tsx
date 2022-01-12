import { css } from '@emotion/react';
import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gamepadModel from 'src/assets/models/gamepad.glb';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const App = () => {
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

    const loader = new GLTFLoader();
    let model: GLTF;
    loader.load(gamepadModel, (gltf) => {
      gltf.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
        }
      });
      scene.add(gltf.scene);
      model = gltf;
    });

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
    mesh.position.set(mesh.position.x, mesh.position.y - 2, mesh.position.z);

    let animationRequestId: number | null = null;
    const tick = () => {
      renderer.render(scene, camera);
      if (model) {
        model.scene.rotation.y += 0.01;
      }
      animationRequestId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      // サイズを取得
      const width = window.innerWidth;
      const height = window.innerHeight;

      // レンダラーのサイズを調整する
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      // カメラのアスペクト比を正す
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    tick();
    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationRequestId != null) {
        cancelAnimationFrame(animationRequestId);
      }
    };
  });

  return (
    <>
      <p css={css({ fontWeight: 'bold', fontSize: '3rem' })}>
        Gamepad API Experiment
      </p>
      <canvas ref={canvas}></canvas>
    </>
  );
};

export default App;
