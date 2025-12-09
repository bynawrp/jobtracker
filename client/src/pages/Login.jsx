import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { handleApiError } from '../utils/errorHandler';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            const result = handleApiError(err);
            if (result.fieldErrors) {
                setFieldErrors(result.fieldErrors);
            } else {
                setError(result.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Connexion</h1>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
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
                            value={password}
                            onChange={handleChange}
                            className={fieldErrors.password ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {fieldErrors.password && <span className="error-text">{fieldErrors.password}</span>}
                    </div>

                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? <LoadingSpinner size="small" /> : 'Se connecter'}
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
