import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Page non trouvée</h2>
                <p>Désolé, la page que vous recherchez n'existe pas.</p>
                <Link to="/dashboard" className="not-found-link">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
};

export default NotFound;

