import { css } from '@emotion/react';
import { useGamepad } from 'hooks';
import { useRef, useState } from 'react';

export const InfoPanel = () => {
  const { gamepad } = useGamepad();
  const [isOpen, setIsOpen] = useState(false);

  const infoArea = useRef<HTMLDivElement>(null);

  const arrow = isOpen ? '<<' : '>>';

  const translateX = infoArea.current
    ? `calc(${infoArea.current.offsetWidth}px + 1rem)`
    : '600px';

  return (
    <div className="text-slate-300 inline-block relative">
      <button
        className="text-lg font-medium pointer-events-auto cursor-pointer mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">{arrow}</span>
        Info
      </button>
      <div
        ref={infoArea}
        className={`transition-[transform,opacity] relative ${!isOpen && 'opacity-0'}`}
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
          className="px-7 py-1 mt-4 font-medium border rounded pointer-events-auto"
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
  (gamepad as any).vibrationActuator.playEffect('dual-rumble', {
    weakMagnitude: 1,
    strongMagnitude: 1,
    ...options,
  });
};
