import { useIsGamepadConnected } from '../hooks';

export const Status = () => {
  const { isGamepadConnected } = useIsGamepadConnected();

  return isGamepadConnected ? (
    <p className="text-green-400 tracking-wide text-2xl sm:text-4xl text-center animate-fadeout animation-delay-1000">
      Connected!!!
    </p>
  ) : (
    <p className="text-white tracking-wide text-2xl sm:text-4xl text-center animate-pulse">
      Connect your Gamepad...
    </p>
  );
};
