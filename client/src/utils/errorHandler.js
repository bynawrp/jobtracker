export const handleApiError = (err) => {
    const response = err.response;
    
    if (response?.status === 429) {
        return {
            error: response.data?.message || 'Trop de tentatives, veuillez réessayer plus tard.'
        };
    }
    
    const apiErrors = response?.data?.errors || [];
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        const fieldErrors = {};
        apiErrors.forEach(d => {
            const field = d.field || d.param || d.path;
            if (field && !fieldErrors[field]) {
                fieldErrors[field] = d.message || d.msg;
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            return { fieldErrors };
        }
    }
    
    const errorMessage = response?.data?.message || 
                         (!response ? 'Impossible de se connecter au serveur' : 'Une erreur est survenue');
    
    return {
        error: errorMessage
    };
};

