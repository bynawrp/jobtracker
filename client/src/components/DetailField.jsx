import StatusSelect from './StatusSelect';

export default function DetailField({ 
    label, 
    name, 
    isEditing, 
    value, 
    displayValue, 
    form, 
    type = 'text',
    renderDisplay,
    renderEdit
}) {
    if (isEditing) {
        if (renderEdit) {
            return (
                <div className="detail-field">
                    {label && <label>{label}</label>}
                    {renderEdit()}
                    {form.getFieldError(name) && <div className="error">{form.getFieldError(name)}</div>}
                </div>
            );
        }

        if (type === 'status') {
            return (
                <div className="detail-field">
                    {label && <label>{label}</label>}
                    <StatusSelect
                        name={name}
                        value={value}
                        onChange={form.handleChange}
                        error={!!form.getFieldError(name)}
                    />
                    {form.getFieldError(name) && <div className="error">{form.getFieldError(name)}</div>}
                </div>
            );
        }

        if (type === 'textarea') {
            return (
                <div className="detail-field">
                    {label && <label>{label}</label>}
                    <textarea
                        name={name}
                        className={`textarea ${form.getFieldError(name) ? 'error' : ''}`}
                        value={value}
                        onChange={form.handleChange}
                        rows={5}
                    />
                    {form.getFieldError(name) && <div className="error">{form.getFieldError(name)}</div>}
                </div>
            );
        }

        return (
            <div className="detail-field">
                {label && <label>{label}</label>}
                <input
                    type={type}
                    name={name}
                    className={`input ${form.getFieldError(name) ? 'error' : ''}`}
                    value={value}
                    onChange={form.handleChange}
                />
                {form.getFieldError(name) && <div className="error">{form.getFieldError(name)}</div>}
            </div>
        );
    }

    return (
        <div className="detail-field">
            {label && <label>{label}</label>}
            {renderDisplay ? renderDisplay() : <div>{displayValue}</div>}
        </div>
    );
}

