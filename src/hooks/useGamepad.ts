import { useEffect, useState } from 'react';
import { getGamepad } from 'util/getGamepad';

export const useGamepad = () => {
  const [gamepad, setGamepad] = useState<Gamepad>();

  useEffect(() => {
    let reqAnimId: number | undefined;
    const updateGamepad = () => {
      reqAnimId = requestAnimationFrame(updateGamepad);
      setGamepad(getGamepad());
    };
    if (getGamepad()) {
      reqAnimId = requestAnimationFrame(updateGamepad);
    }

    const onGamepadConnected = () => {
      if (reqAnimId == null) {
        reqAnimId = requestAnimationFrame(updateGamepad);
      }
    };
    window.addEventListener('gamepadconnected', onGamepadConnected);

    const onGamepadDisconnected = () => {
      if (reqAnimId != null && !getGamepad()) {
        cancelAnimationFrame(reqAnimId);
        reqAnimId = undefined;
        setGamepad(undefined);
      }
    };
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', onGamepadConnected);
      window.removeEventListener('gamepaddisconnected', onGamepadDisconnected);
      if (reqAnimId != null) {
        cancelAnimationFrame(reqAnimId);
      }
    };
  }, []);

  return { gamepad };
};
