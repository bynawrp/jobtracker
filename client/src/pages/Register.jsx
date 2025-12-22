import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { useForm } from '../hooks/useForm';
import { useToast } from '../hooks/useToast';
import PasswordInput from '../components/PasswordInput';

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

                    <PasswordInput
                        id="password"
                        name="password"
                        value={form.values.password}
                        onChange={form.handleChange}
                        label="Mot de passe"
                        error={!!form.getFieldError('password')}
                        errorMessage={form.getFieldError('password')}
                        disabled={form.isLoading}
                        showChecks={true}
                    />

                    <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        value={form.values.confirmPassword}
                        onChange={form.handleChange}
                        label="Confirmation du mot de passe"
                        error={!!form.getFieldError('confirmPassword')}
                        errorMessage={form.getFieldError('confirmPassword')}
                        disabled={form.isLoading}
                    />

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

                    <button type="submit" className="auth-button" disabled={form.isLoading} aria-label="S'inscrire" title="S'inscrire">
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
