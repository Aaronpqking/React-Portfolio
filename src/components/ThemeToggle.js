import { useTheme } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';

function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'auto') {
      return faCircleHalfStroke;
    }
    return resolvedTheme === 'dark' ? faSun : faMoon;
  };

  const getTitle = () => {
    if (theme === 'light') return 'Switch to Dark Mode';
    if (theme === 'dark') return 'Switch to Auto Mode';
    return 'Switch to Light Mode';
  };

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      title={getTitle()}
      aria-label={getTitle()}
    >
      <FontAwesomeIcon icon={getIcon()} />
    </button>
  );
}

export default ThemeToggle;


