import React, { useEffect, useState } from 'react';
import { getGamepad } from 'src/util/GetGamepad';

const InfoPanel = () => {
  const [{ gamepad }, setState] = useState({
    gamepad: null as Gamepad | null,
  });

  useEffect(() => {
    let reqAnimId: number;
    const update = () => {
      reqAnimId = requestAnimationFrame(update);
      setState((s) => ({ ...s, gamepad: getGamepad() ?? null }));
    };

    update();

    return () => {
      cancelAnimationFrame(reqAnimId);
    };
  }, []);

  return (
    <div className="text-slate-300">
      <p>Info</p>
      {gamepad == null ? null : (
        <>
          <p>ID: {gamepad?.id}</p>
          <p>Timestamp: {gamepad?.timestamp}</p>
          <p>Mapping: {gamepad?.mapping}</p>
          <table>
            <tbody>
              {gamepad?.buttons.map((b, i) => (
                <tr key={i}>
                  <td className="text-right">{i}.</td>
                  <td>pressed: {b.pressed ? 'true' : 'false'},</td>
                  <td>touched: {b.touched ? 'true' : 'false'},</td>
                  <td>value: {b.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul>
            {gamepad?.axes.map((axe, i) => (
              <p key={i}>
                axes[{i}]: {axe}
              </p>
            ))}
          </ul>
          <button
            className="px-7 py-1 font-medium border rounded pointer-events-auto"
            type="button"
            onClick={() =>
              gamepad
                ? vibrate(gamepad, { duration: 1000, weakMagnitude: 0.5 })
                : null
            }
          >
            Vibrate
          </button>
        </>
      )}
    </div>
  );
};

const vibrate = (
  gamepad: Gamepad,
  options: {
    duration: number;
    weakMagnitude?: number;
    strongMagnitude?: number;
  }
) => {
  (gamepad as any).vibrationActuator.playEffect('dual-rumble', {
    weakMagnitude: 1,
    strongMagnitude: 1,
    ...options,
  });
};

export default InfoPanel;
