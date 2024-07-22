export const getGamepads = () =>
  [...navigator.getGamepads()].filter(Boolean) as Gamepad[];

export const getGamepad = () => getGamepads()[0] as Gamepad | undefined;
