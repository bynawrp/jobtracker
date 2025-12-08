import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-container">
            <div className="home-content">
                <h1>JobTracker</h1>
                <p className="home-subtitle">Gérez et suivez vos candidatures facilement</p>
                
                {isAuthenticated ? (
                    <Link to="/dashboard" className="home-button">
                        Accéder au tableau de bord
                    </Link>
                ) : (
                    <div className="home-actions">
                        <Link to="/login" className="home-button">
                            Se connecter
                        </Link>
                        <Link to="/register" className="home-button home-button-secondary">
                            S'inscrire
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;

