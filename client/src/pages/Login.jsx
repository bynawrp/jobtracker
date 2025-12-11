import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { useForm } from '../hooks/useForm';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        if (searchParams.get('session') === 'expired') {
            setSessionExpired(true);
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    const form = useForm({ email: '', password: '' }, async (values) => {
        await login(values.email, values.password);
        navigate('/dashboard');
    });

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Connexion</h1>
                
                {sessionExpired && (
                    <div className="warning-message">
                        Votre session a expiré. Veuillez vous reconnecter.
                    </div>
                )}
                
                {form.error && <div className="error-message">{form.error}</div>}

                <form onSubmit={form.handleSubmit}>
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
                    </div>

                    <button type="submit" className="auth-button" disabled={form.isLoading}>
                        {form.isLoading ? <LoadingSpinner size="small" /> : 'Se connecter'}
                    </button>
                </form>

                <p className="auth-link">
                    Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
