import { Squares2X2Icon, ViewColumnsIcon, TableCellsIcon } from '@heroicons/react/24/outline';

const VIEWS = {
    cards: 'cards',
    kanban: 'kanban',
    table: 'table'
};

export default function ViewToggle({ currentView, onViewChange }) {
    return (
        <div className="view-toggle">
            <button
                className={`view-toggle-btn ${currentView === VIEWS.cards ? 'active' : ''}`}
                onClick={() => onViewChange(VIEWS.cards)}
                aria-label="Vue cartes"
                title="Vue cartes"
            >
                <Squares2X2Icon className="icon-sm" />
            </button>
            <button
                className={`view-toggle-btn ${currentView === VIEWS.kanban ? 'active' : ''}`}
                onClick={() => onViewChange(VIEWS.kanban)}
                aria-label="Vue kanban"
                title="Vue kanban"
            >
                <ViewColumnsIcon className="icon-sm" />
            </button>
            <button
                className={`view-toggle-btn ${currentView === VIEWS.table ? 'active' : ''}`}
                onClick={() => onViewChange(VIEWS.table)}
                aria-label="Vue tableau"
                title="Vue tableau"
            >
                <TableCellsIcon className="icon-sm" />
            </button>
        </div>
    );
}

export { VIEWS };

