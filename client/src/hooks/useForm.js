import { useState } from 'react';
import { handleApiError } from '../utils/errorHandler';

export const useForm = (initialValues = {}, onSubmit) => {
    const [values, setValues] = useState(initialValues);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const setValue = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setFieldErrors({});
        setIsLoading(true);

        try {
            await onSubmit(values);
            return { success: true };
        } catch (err) {
            const result = handleApiError(err);
            if (result.fieldErrors) {
                setFieldErrors(result.fieldErrors);
                setError('');
            } else {
                setError(result.error);
                setFieldErrors({});
            }
            return { success: false, error: result };
        } finally {
            setIsLoading(false);
        }
    };

    const reset = (newValues = initialValues) => {
        setValues(newValues);
        setError('');
        setFieldErrors({});
        setIsLoading(false);
    };

    const getFieldError = (field) => fieldErrors[field] || '';

    return {
        values,
        error,
        fieldErrors,
        isLoading,
        handleChange,
        setValue,
        handleSubmit,
        reset,
        getFieldError,
        setError,
        setFieldErrors
    };
};

