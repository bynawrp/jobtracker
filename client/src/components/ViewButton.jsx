import { EyeIcon } from '@heroicons/react/24/outline';

export default function ViewButton({ item, onViewDetails, stopPropagation = false }) {
    return (
        <button 
            onClick={(e) => {
                if (stopPropagation) e.stopPropagation();
                onViewDetails?.(item);
            }} 
            className="btn small primary"
        >
            <EyeIcon className="icon-sm" />
            <span className="btn-label">Voir</span>
        </button>
    );
}

