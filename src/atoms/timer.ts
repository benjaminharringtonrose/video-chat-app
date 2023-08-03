import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

interface ITimerState {
  isRunning: boolean;
  minutes: number;
  seconds: number;
}

export const timerState = atom<ITimerState>({
  key: "timerState",
  default: {
    isRunning: false,
    minutes: 0,
    seconds: 0,
  },
});

export const useTimer = () => {
  const [state, setState] = useRecoilState(timerState);

  const { isRunning, minutes, seconds } = state;

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 59) {
          setSeconds(0);
          setMinutes(minutes + 1);
        } else {
          setSeconds(seconds + 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, minutes]);

  const setMinutes = (minutes: number) => {
    setState((state) => ({ ...state, minutes }));
  };

  const setSeconds = (seconds: number) => {
    setState((state) => ({ ...state, seconds }));
  };

  const setIsRunning = (isRunning: boolean) => {
    setState((state) => ({ ...state, isRunning }));
  };

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    isRunning: state.isRunning,
    formattedTime,
    minutes,
    seconds,
    setMinutes,
    setSeconds,
    setIsRunning,
  };
};
