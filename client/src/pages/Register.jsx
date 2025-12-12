import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { useForm } from '../hooks/useForm';
import { useToast } from '../hooks/useToast';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const form = useForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    }, async (values) => {
        await register(values);
        toast.success(`Inscription réussie, bienvenue ${values.firstName} ${values.lastName} !`);
        navigate('/dashboard');
    });

    const pwdChecks = useMemo(() => ({
        length: form.values.password.length >= 8,
        lower: /[a-z]/.test(form.values.password),
        upper: /[A-Z]/.test(form.values.password),
        number: /[0-9]/.test(form.values.password),
        match: form.values.password === form.values.confirmPassword && form.values.password.length > 0
    }), [form.values.password, form.values.confirmPassword]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Inscription</h1>
                
                {form.error && <div className="error-message">{form.error}</div>}

                <form onSubmit={form.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={form.values.firstName}
                            onChange={form.handleChange}
                            className={form.getFieldError('firstName') ? 'error' : ''}
                            disabled={form.isLoading}
                        />
                        {form.getFieldError('firstName') && <span className="error-text">{form.getFieldError('firstName')}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={form.values.lastName}
                            onChange={form.handleChange}
                            className={form.getFieldError('lastName') ? 'error' : ''}
                            disabled={form.isLoading}
                        />
                        {form.getFieldError('lastName') && <span className="error-text">{form.getFieldError('lastName')}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.values.email}
                            onChange={form.handleChange}
                            className={form.getFieldError('email') ? 'error' : ''}
                            disabled={form.isLoading}
                        />
                        {form.getFieldError('email') && <span className="error-text">{form.getFieldError('email')}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.values.password}
                            onChange={form.handleChange}
                            className={form.getFieldError('password') ? 'error' : ''}
                            disabled={form.isLoading}
                        />
                        {form.getFieldError('password') && <span className="error-text">{form.getFieldError('password')}</span>}
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
                            value={form.values.confirmPassword}
                            onChange={form.handleChange}
                            className={form.getFieldError('confirmPassword') ? 'error' : ''}
                            disabled={form.isLoading}
                        />
                        {form.getFieldError('confirmPassword') && <span className="error-text">{form.getFieldError('confirmPassword')}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Téléphone (optionnel)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={form.values.phone}
                            onChange={form.handleChange}
                            className={form.getFieldError('phone') ? 'error' : ''}
                            disabled={form.isLoading}
                        />
                        {form.getFieldError('phone') && <span className="error-text">{form.getFieldError('phone')}</span>}
                    </div>

                    <button type="submit" className="auth-button" disabled={form.isLoading}>
                        {form.isLoading ? <LoadingSpinner size="small" /> : 'S\'inscrire'}
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
