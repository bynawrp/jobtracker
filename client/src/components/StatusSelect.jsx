import { parseStatus } from '../utils/formatters';
import { STATUSES } from '../utils/constants';

export default function StatusSelect({ value, onChange, className = '', error = false, name = 'status' }) {
    return (
        <select
            name={name}
            className={`select ${error ? 'error' : ''} ${className}`}
            value={value}
            onChange={onChange}
        >
            {STATUSES.map(status => (
                <option key={status} value={status}>
                    {parseStatus(status)}
                </option>
            ))}
        </select>
    );
}

