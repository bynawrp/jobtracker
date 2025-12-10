import { STATUS_OPTIONS } from './constants';

export const formatDate = (date) => {
    if (!date) return 'Non spécifiée';
    return new Date(date).toLocaleDateString('fr-FR');
};

export const formatDateInput = (date) => {
    if (!date) return '';
    return date.split('T')[0];
};

export const parseStatus = (status) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option?.label || status;
};

