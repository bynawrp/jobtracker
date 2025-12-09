export const formatDate = (date) => {
    if (!date) return 'Non spécifiée';
    return new Date(date).toLocaleDateString('fr-FR');
};

export const formatDateInput = (date) => {
    if (!date) return '';
    return date.split('T')[0];
};

export const parseStatus = (status) => {
    const map = { 
        pending: 'En attente', 
        interview: 'Entretien', 
        rejected: 'Refusé', 
        applied: 'Accepté' 
    };
    return map[status] || status;
};

