import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { handleApiError } from '../utils/errorHandler';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const pwdChecks = useMemo(() => ({
        length: formData.password.length >= 8,
        lower: /[a-z]/.test(formData.password),
        upper: /[A-Z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        match: formData.password === formData.confirmPassword && formData.password.length > 0
    }), [formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsLoading(true);

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            const { error: errorMessage, fieldErrors: errors } = handleApiError(err);
            if (errors) {
                setFieldErrors(errors);
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Inscription</h1>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={fieldErrors.firstName ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {fieldErrors.firstName && <span className="error-text">{fieldErrors.firstName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={fieldErrors.lastName ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {fieldErrors.lastName && <span className="error-text">{fieldErrors.lastName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={fieldErrors.email ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={fieldErrors.password ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {fieldErrors.password && <span className="error-text">{fieldErrors.password}</span>}
                        <div className="password-help">
                            <span className={pwdChecks.length ? 'text-success' : 'text-danger'}>8+ caractères</span>
                            {' · '}
                            <span className={pwdChecks.upper ? 'text-success' : 'text-danger'}>1 majuscule</span>
                            {' · '}
                            <span className={pwdChecks.lower ? 'text-success' : 'text-danger'}>1 minuscule</span>
                            {' · '}
                            <span className={pwdChecks.number ? 'text-success' : 'text-danger'}>1 chiffre</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={fieldErrors.confirmPassword ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {fieldErrors.confirmPassword && <span className="error-text">{fieldErrors.confirmPassword}</span>}
                        {formData.confirmPassword && !pwdChecks.match && (
                            <span className="error-text">Les mots de passe ne correspondent pas</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Téléphone (optionnel)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={fieldErrors.phone ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {fieldErrors.phone && <span className="error-text">{fieldErrors.phone}</span>}
                    </div>

                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? <LoadingSpinner size="small" /> : 'S\'inscrire'}
                    </button>
                </form>

                <p className="auth-link">
                    Déjà un compte ? <Link to="/login">Connectez-vous</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
