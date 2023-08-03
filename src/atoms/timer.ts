import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

interface ITimerState {
  minutes: number;
  seconds: number;
}

export const timerState = atom<ITimerState>({
  key: "timerState",
  default: {
    minutes: 0,
    seconds: 0,
  },
});

export const useTimer = () => {
  const [state, setState] = useRecoilState(timerState);

  const { minutes, seconds } = state;

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds === 59) {
        setSeconds(0);
        setMinutes(minutes + 1);
      } else {
        setSeconds(seconds + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.seconds, state.minutes]);

  const setMinutes = (minutes: number) => {
    setState((state) => ({ ...state, minutes }));
  };

  const setSeconds = (seconds: number) => {
    setState((state) => ({ ...state, seconds }));
  };

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    formattedTime,
    minutes,
    seconds,
    setMinutes,
    setSeconds,
  };
};
