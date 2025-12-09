import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        JobTracker
                    </Link>
                    <div className="navbar-menu">
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                >
                                    Dashboard
                                </Link>
                                <span className="navbar-user">
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <button onClick={handleLogout} className="navbar-button">
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                                >
                                    Connexion
                                </Link>
                                <Link 
                                    to="/register" 
                                    className={`navbar-link navbar-link-primary ${location.pathname === '/register' ? 'active' : ''}`}
                                >
                                    Inscription
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

