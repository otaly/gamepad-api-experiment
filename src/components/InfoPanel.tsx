import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { getGamepad } from 'util/GetGamepad';

const InfoPanel = () => {
  const [{ gamepad, isOpen }, setState] = useState({
    gamepad: null as Gamepad | null,
    isOpen: false,
  });

  const infoArea = useRef<HTMLDivElement>(null);

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

  const arrow = isOpen ? '<<' : '>>';

  const translateX = infoArea.current
    ? `calc(${-infoArea.current.offsetWidth}px - 1rem)`
    : '0px';

  return (
    <div className="text-slate-300 inline-block">
      <p
        className="text-lg font-medium pointer-events-auto cursor-pointer mb-2"
        onClick={() => setState((s) => ({ ...s, isOpen: !s.isOpen }))}
      >
        <span className="mr-2">{arrow}</span>
        Info
      </p>
      <div
        ref={infoArea}
        className="transition-transform"
        css={css({
          transform: `translateX(${isOpen ? '0px' : translateX})`,
        })}
      >
        <p>ID: {gamepad?.id}</p>
        <p>Timestamp: {gamepad?.timestamp}</p>
        <p>Mapping: {gamepad?.mapping}</p>
        <table>
          <tbody>
            {gamepad?.buttons.map((b, i) => (
              <tr className={b.pressed ? 'text-green-400' : ''} key={i}>
                <td>pressed: {b.pressed ? 'true' : 'false'},</td>
                <td>touched: {b.touched ? 'true' : 'false'},</td>
                <td>value: {b.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul>
          {gamepad?.axes.map((v, i) => (
            <p key={i}>
              axes[{i}]: {v}
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
      </div>
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
