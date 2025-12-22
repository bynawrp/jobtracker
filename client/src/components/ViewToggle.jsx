import { VIEWS_CONFIG } from '../config/constants';

export default function ViewToggle({ currentView, onViewChange }) {
    return (
        <div className="view-toggle">
            {Object.values(VIEWS_CONFIG).map(({ key, label, icon: Icon }) => (
                <button
                    key={key}
                    className={`view-toggle-btn ${currentView === key ? 'active' : ''}`}
                    onClick={() => onViewChange(key)}
                    aria-label={label}
                    title={label}
                >
                    <Icon className="icon-sm" />
                    <span className="view-toggle-label">{label}</span>
                </button>
            ))}
        </div>
    );
}

