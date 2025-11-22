import { useEffect, useState } from "react";
import { useMainStore } from '../stores/mainStore';
import ThemeLightIcon from './icons/ThemeLightIcon';
import ThemeDarkIcon from './icons/ThemeDarkIcon';
import { useTerminalQueue } from "../stores/useTerminalQueue";
import textData from "../texts.json";

function ThemeBtn() {
  const darkMode = useMainStore((s) => s.darkMode);
  const changeThemeText: string = textData.theme[0]

  const toggleDarkMode = useMainStore((s) => s.toggleDarkMode);
  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);
  const clearActives = useTerminalQueue((s) => s.clearActives);

  function handleClick(): void {
    clearActives();
    toggleDarkMode();
    enqueueLine("");
    enqueueLine(changeThemeText, darkMode ? "light" : "dark");
  }

  return (
    <div
      onClick={handleClick}
      className=" translate-y-1/4"
    >
      {darkMode ? <ThemeLightIcon /> : <ThemeDarkIcon />}
    </div>
  );
}

export default ThemeBtn;
