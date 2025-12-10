import { STATUS_OPTIONS } from '../utils/constants';

export default function StatusSelect({ value, onChange, className = '', error = false, name = 'status' }) {
    return (
        <select
            name={name}
            className={`select ${error ? 'error' : ''} ${className}`}
            value={value}
            onChange={onChange}
        >
            {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

