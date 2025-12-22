import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from '../hooks/useDarkMode';

const DarkModeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    // console.log(isDarkMode);
    return (
        <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
            title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        >
            {isDarkMode ? (
                 <>
                    <SunIcon className="icon-sm" />
                    <span>Clair</span>
                 </>
            ) : (
                <>
                    <MoonIcon className="icon-sm" />
                    <span>Sombre</span>
                </>
            )}
        </button>
    );
};

export default DarkModeToggle;

