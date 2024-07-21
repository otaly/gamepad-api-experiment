import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Sync } from 'services/Sync';
import * as THREE from 'three';
import { ColorRepresentation } from 'three';
import { GLTF } from 'three-stdlib';

export type GLTFResult = GLTF & {
  nodes: {
    body: THREE.Mesh;
    analog_stick_base: THREE.Mesh;
    x_btn: THREE.Mesh;
    home_btn: THREE.Mesh;
    options_btn: THREE.Mesh;
    triangle_btn: THREE.Mesh;
    square_btn: THREE.Mesh;
    circle_btn: THREE.Mesh;
    share_btn: THREE.Mesh;
    analog_stick_r: THREE.Mesh;
    analog_stick_l: THREE.Mesh;
    up_btn: THREE.Mesh;
    right_btn: THREE.Mesh;
    down_btn: THREE.Mesh;
    left_btn: THREE.Mesh;
    l_btn: THREE.Mesh;
    r_btn: THREE.Mesh;
    trigger_l: THREE.Mesh;
    trigger_r: THREE.Mesh;
    touchpad: THREE.Mesh;
  };
  materials: {
    body: THREE.MeshStandardMaterial;
    button: THREE.MeshStandardMaterial;
  };
};

export const GamepadModel = (
  props: JSX.IntrinsicElements['group'] & {
    url: string;
    color?: ColorRepresentation;
  }
) => {
  const { url, ...modelProps } = props;
  const gltf = useGLTF(url) as GLTFResult;
  const [scene, sync] = useMemo(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
    const sync = new Sync();
    sync.setNodes(gltf.nodes);
    return [gltf.scene, sync];
  }, [gltf.scene, gltf.nodes]);

  useEffect(() => {
    if (!props.color) {
      return;
    }
    const body = gltf.scene.getObjectByName('body') as THREE.Mesh;
    (body.material as THREE.MeshStandardMaterial).color.set(props.color);
  }, [gltf.scene, props.color]);
  useFrame(() => {
    sync.update();
  });
  return <primitive {...modelProps} object={scene} dispose={null} />;
};

// useGLTF.preload(gamepadModel);
