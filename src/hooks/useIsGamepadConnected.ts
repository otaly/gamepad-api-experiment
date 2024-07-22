import { useEffect, useState } from 'react';
import { getGamepad } from 'util/getGamepad';

export const useIsGamepadConnected = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(!!getGamepad());

    const onGamepadConnected = () => {
      setIsConnected(true);
    };
    window.addEventListener('gamepadconnected', onGamepadConnected);

    const onGamepadDisconnected = () => {
      if (!getGamepad()) {
        setIsConnected(false);
      }
    };
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', onGamepadConnected);
      window.removeEventListener('gamepaddisconnected', onGamepadDisconnected);
    };
  }, []);

  return { isGamepadConnected: isConnected };
};
