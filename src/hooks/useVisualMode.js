import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = function (transitionMode, replace = false) {
    if (replace === false) {
    const newHistory = [...history, transitionMode]
    setMode(transitionMode)
    setHistory(newHistory)
    } else {
      const newHistory = [initialMode, transitionMode];
      setMode(transitionMode);
      setHistory(newHistory);
    }
  }

  const back = function () {
    if (history.length > 1) {
      const oldHistory = history.slice(0, -1);
      const oldMode = oldHistory[oldHistory.length - 1];
      setMode(oldMode)
      setHistory(oldHistory)
    }
  }

  return { mode, transition, back };
}
