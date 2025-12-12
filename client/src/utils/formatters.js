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

export const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

export const dateInputToISO = (dateInput) => {
    if (!dateInput || dateInput === '' || dateInput === null) {
        return null;
    }
    return new Date(dateInput).toISOString();
};

export const formatDateForExport = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const calculateDateDifference = (date) => {
    if (!date) return null;
    
    const targetDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const targetDateOnly = new Date(targetDate);
    targetDateOnly.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((targetDateOnly - now) / (1000 * 60 * 60 * 24));
    
    return {
        days: daysDiff,
        isPast: daysDiff < 0,
        isToday: daysDiff === 0,
        isTomorrow: daysDiff === 1
    };
};

export const filterByDate = (items, dateField, filterDate) => {
    if (!filterDate) return items;
    
    const filterDateOnly = new Date(filterDate).toDateString();
    return items.filter(item => {
        if (!item[dateField]) return false;
        return new Date(item[dateField]).toDateString() === filterDateOnly;
    });
};

