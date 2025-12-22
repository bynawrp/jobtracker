import { useState, useMemo } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const PasswordInput = ({
    id,
    name,
    value,
    onChange,
    label,
    labelIcon,
    error = false,
    errorMessage,
    disabled = false,
    showChecks = false,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    // password checks
    const passwordChecks = useMemo(() => {
        if (!showChecks) return null;
        return {
            length: value.length >= 8,
            lower: /[a-z]/.test(value),
            upper: /[A-Z]/.test(value),
            number: /[0-9]/.test(value)
        };
    }, [value, showChecks]);

    // console.log(passwordChecks);
    // console.log(value);
    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label htmlFor={id} className={labelIcon ? 'label-icon' : ''}>
                    {labelIcon && labelIcon}
                    {label}
                </label>
            )}
            <div className="input-wrapper">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={error ? 'error' : ''}
                    disabled={disabled}
                    {...props}
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={disabled}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                    {showPassword ? (
                        <EyeSlashIcon className="icon-sm" />
                    ) : (
                        <EyeIcon className="icon-sm" />
                    )}
                </button>
            </div>
            {errorMessage && <span className="error-text">{errorMessage}</span>}
            {showChecks && passwordChecks && (
                <div className="password-help">
                    <span className={passwordChecks.length ? 'text-success' : 'text-danger'}>8+ caractères</span>
                    {' · '}
                    <span className={passwordChecks.upper ? 'text-success' : 'text-danger'}>1 majuscule</span>
                    {' · '}
                    <span className={passwordChecks.lower ? 'text-success' : 'text-danger'}>1 minuscule</span>
                    {' · '}
                    <span className={passwordChecks.number ? 'text-success' : 'text-danger'}>1 chiffre</span>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;

