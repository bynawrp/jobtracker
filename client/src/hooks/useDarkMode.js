import { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode doit être utilisé dans un DarkModeProvider');
    }
    return context;
};

