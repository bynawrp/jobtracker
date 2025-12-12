import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftStartOnRectangleIcon, Squares2X2Icon, UserGroupIcon, UserIcon, ArrowRightOnRectangleIcon, BriefcaseIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
                        <BriefcaseIcon className="icon-md" />
                        <span>JobTracker</span>
                    </Link>
                    <button 
                        className="navbar-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <XMarkIcon className="icon-md" /> : <Bars3Icon className="icon-md" />}
                    </button>
                    <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                >
                                    <Squares2X2Icon className="icon-sm" />
                                    <span>
                                        Dashboard
                                    </span>
                                </Link>
                                {(user.role === 'admin' || user.role === 'superadmin') && (
                                    <Link 
                                        to="/admin" 
                                        className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}
                                        onClick={handleLinkClick}
                                    >
                                        <UserGroupIcon className="icon-sm" />
                                        <span>Admin</span>
                                    </Link>
                                )}

                                <div className="navbar-separator"></div>

                                <div className="navbar-user">
                                    <UserIcon className="icon-sm" />
                                    <span>{user?.firstName} {user?.lastName}</span>
                                </div>

                                <div className="navbar-separator"></div>

                                <button onClick={handleLogout} className="navbar-button">
                                    <ArrowLeftStartOnRectangleIcon className="icon-sm" />
                                    <span>Déconnexion</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                >
                                    <ArrowRightOnRectangleIcon className="icon-sm" />
                                    <span>Connexion</span>
                                </Link>
                                <Link 
                                    to="/register" 
                                    className={`navbar-link navbar-link-primary ${location.pathname === '/register' ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                >
                                    <UserIcon className="icon-sm" />
                                    <span>Inscription</span>
                                </Link>
                            </>
                        )}
                    </div>
                    {isMenuOpen && <div className="navbar-overlay" onClick={() => setIsMenuOpen(false)}></div>}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;