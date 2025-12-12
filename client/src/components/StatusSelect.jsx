import { STATUS_OPTIONS } from '../config/constants';

export default function StatusSelect({ value, onChange, className = '', error = false, name = 'status', allowEmpty = false }) {
    return (
        <select
            name={name}
            className={`select ${error ? 'error' : ''} ${className}`}
            value={value || ''}
            onChange={onChange}
        >
            {allowEmpty && <option value="">Tous les statuts</option>}
            {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

