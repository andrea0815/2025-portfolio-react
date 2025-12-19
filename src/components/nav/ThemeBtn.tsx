import { useEffect, useState } from "react";
import { useMainStore } from '../../stores/mainStore';
import ThemeLightIcon from '../icons/ThemeLightIcon';
import ThemeDarkIcon from '../icons/ThemeDarkIcon';
import { useTerminalStore } from "../../stores/useTerminal";
import textData from "../../texts.json";

function ThemeBtn() {
  const darkMode = useMainStore((s) => s.darkMode);
  const changeThemeText: string = textData.theme[0]

  const toggleDarkMode = useMainStore((s) => s.toggleDarkMode);
  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearActives = useTerminalStore((s) => s.clearActives);

  function handleClick(): void {
    clearActives();
    toggleDarkMode();
    enqueueLine("");
    enqueueLine(changeThemeText, darkMode ? "light" : "dark");
  }

  return (
    <div
      onClick={handleClick}
      className="hoverEl translate-y-1/4 z-50"
    >
      {darkMode ? <ThemeLightIcon /> : <ThemeDarkIcon />}
    </div>
  );
}

export default ThemeBtn;
