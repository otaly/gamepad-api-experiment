import { useIsGamepadConnected } from '../hooks';

export const Status = () => {
  const { isGamepadConnected } = useIsGamepadConnected();

  return isGamepadConnected ? (
    <p className="animation-delay-1000 animate-fadeout text-center text-2xl tracking-wide text-green-400 sm:text-4xl">
      Connected!!!
    </p>
  ) : (
    <p className="animate-pulse text-center text-2xl tracking-wide text-white sm:text-4xl">
      Connect your Gamepad...
    </p>
  );
};
