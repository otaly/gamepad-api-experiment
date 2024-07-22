import { useGLTF } from '@react-three/drei';
import { useSyncGamepad } from 'hooks';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { ColorRepresentation } from 'three';
import { GLTFResult } from 'types';

type Props = JSX.IntrinsicElements['group'] & {
  url: string;
  color?: ColorRepresentation;
};

export const GamepadModel = ({ color, url, ...modelProps }: Props) => {
  const gltf = useGLTF(url) as GLTFResult;
  const scene = useMemo(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
    return gltf.scene;
  }, [gltf.scene]);

  useEffect(() => {
    if (!color) {
      return;
    }
    const bodyMaterial = gltf.materials.body;
    bodyMaterial.color.set(color);
  }, [gltf.materials.body, color]);

  useSyncGamepad(gltf.nodes);

  return <primitive {...modelProps} object={scene} dispose={null} />;
};

// useGLTF.preload(gamepadModel);
