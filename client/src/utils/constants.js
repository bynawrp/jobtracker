import { Squares2X2Icon, ViewColumnsIcon, TableCellsIcon } from '@heroicons/react/24/outline';

export const STATUS_OPTIONS = [
    { value: 'pending', label: 'En attente' },
    { value: 'interview', label: 'Entretien' },
    { value: 'rejected', label: 'Refusé' },
    { value: 'applied', label: 'Accepté' }
];

export const DEFAULT_STATUS = 'pending';

export const VIEWS_CONFIG = {
    cards: { key: 'cards', label: 'Cartes', icon: Squares2X2Icon },
    kanban: { key: 'kanban', label: 'Kanban', icon: ViewColumnsIcon },
    table: { key: 'table', label: 'Tableau', icon: TableCellsIcon }
};