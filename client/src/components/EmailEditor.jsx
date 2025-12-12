const EmailEditor = ({ value, onChange, placeholder = 'Saisissez votre message...' }) => {
    return (
        <div className="email-editor">
            <textarea
                className="email-editor-textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={12}
            />
        </div>
    );
};

export default EmailEditor;

