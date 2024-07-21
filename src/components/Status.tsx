import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { getGamepads } from 'util/GetGamepad';

const Status = () => {
  const [{ isGamepadConnected }, setState] = useState({
    isGamepadConnected: false,
  });

  useEffect(() => {
    const gamepads = getGamepads();
    setState((s) => ({ ...s, isGamepadConnected: gamepads.length > 0 }));

    const windowListenerMap: Record<
      'gamepadconnected' | 'gamepaddisconnected',
      ((ev: Event) => void) | null
    > = { gamepadconnected: null, gamepaddisconnected: null };

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

  const status = isGamepadConnected ? (
    <p
      className="text-green-400 tracking-wide text-4xl text-center animate-fadeout"
      css={css({ animationDelay: '1s' })}
    >
      Connected!!!
    </p>
  ) : (
    <p className="text-white tracking-wide text-4xl text-center animate-pulse">
      Connect your Gamepad...
    </p>
  );

  return status;
};

export default Status;
