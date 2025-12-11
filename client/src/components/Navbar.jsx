import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
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
                                <Link to="/dashboard" className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                                    <span className="hide-mobile">Dashboard</span>
                                </Link>
                                {(user.role === 'admin' || user.role === 'superadmin') && (
                                    <Link to="/admin" className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                                        <span className="hide-mobile">Admin</span>
                                    </Link>
                                )}
                                <span className="navbar-user hide-mobile">
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <button onClick={handleLogout} className="navbar-button">
                                    <ArrowLeftStartOnRectangleIcon className="icon-sm" />
                                    <span className="btn-label">Déconnexion</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                                >
                                    <span className="hide-mobile">Connexion</span>
                                </Link>
                                <Link 
                                    to="/register" 
                                    className={`navbar-link navbar-link-primary ${location.pathname === '/register' ? 'active' : ''}`}
                                >
                                    <span className="hide-mobile">Inscription</span>
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