import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { useGamepad } from '../hooks';

export const InfoPanel = () => {
  const { gamepad } = useGamepad();
  const [isOpen, setIsOpen] = useState(false);

  const infoArea = useRef<HTMLDivElement>(null);

  const arrow = isOpen ? '<<' : '>>';

  const translateX = infoArea.current
    ? `calc(${infoArea.current.offsetWidth}px + 1rem)`
    : '600px';

  return (
    <div className="relative inline-block text-slate-300">
      <button
        className="pointer-events-auto mb-2 cursor-pointer text-lg font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">{arrow}</span>
        Info
      </button>
      <div
        ref={infoArea}
        className={`relative transition-[transform,opacity] ${!isOpen && 'opacity-0'}`}
        css={css({
          right: translateX,
          transform: `translateX(${isOpen ? translateX : '0px'})`,
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
          className="pointer-events-auto mt-4 rounded border px-7 py-1 font-medium"
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
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (gamepad as any).vibrationActuator.playEffect('dual-rumble', {
    weakMagnitude: 1,
    strongMagnitude: 1,
    ...options,
  });
};
