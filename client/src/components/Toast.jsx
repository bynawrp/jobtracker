import { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Toast = ({ id, message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };

    return (
        <div className={`toast toast-success ${isVisible ? 'visible' : ''}`}>
            <CheckCircleIcon className="toast-icon" />
            <span className="toast-message">{message}</span>
            <button 
                className="toast-close" 
                onClick={handleClose}
                aria-label="Fermer"
            >
                <XMarkIcon className="icon-xs" />
            </button>
        </div>
    );
};

export default Toast;

