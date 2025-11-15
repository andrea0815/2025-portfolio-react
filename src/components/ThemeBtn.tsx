import { useMainStore } from '../stores/mainStore';
import ThemeLightIcon from './icons/ThemeLightIcon';
import ThemeDarkIcon from './icons/ThemeDarkIcon';

function ThemeBtn() {
  const darkMode = useMainStore((s) => s.darkMode);
  const toggleDarkMode = useMainStore((s) => s.toggleDarkMode);

  function handleClick(): void {
    toggleDarkMode();
  }

  return (
    <a 
      onClick={handleClick}
      className="cursor-pointer translate-y-1/4"
    >
      {darkMode ? <ThemeLightIcon /> : <ThemeDarkIcon />}
    </a>
  );
}

export default ThemeBtn;
