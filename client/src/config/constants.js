import { Squares2X2Icon, ViewColumnsIcon, TableCellsIcon } from '@heroicons/react/24/outline';

export const STATUS_OPTIONS = [
    { value: 'pending', label: 'En attente', color: '#f59e0b' },
    { value: 'interview', label: 'Entretien', color: '#3b82f6' },
    { value: 'rejected', label: 'Refusé', color: '#ef4444' },
    { value: 'applied', label: 'Accepté', color: '#10b981' }
];

export const DEFAULT_STATUS = 'pending';

export const VIEWS_CONFIG = {
    cards: { key: 'cards', label: 'Cartes', icon: Squares2X2Icon },
    kanban: { key: 'kanban', label: 'Kanban', icon: ViewColumnsIcon },
    table: { key: 'table', label: 'Tableau', icon: TableCellsIcon }
};

export const DEFAULT_USER = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user'
};


export const DEFAULT_FILTERS = {
    status: '',
    company: '',
    dateApplied: '',
    reminderDate: '',
    hasNotes: false,
    hasReminder: false
};
