import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Tableau de bord</h1>
                <p>Bienvenue, {user?.firstName} {user?.lastName} !</p>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-card">
                    <h2>Informations du profil</h2>
                    <div className="profile-info">
                        <p><strong>Nom complet :</strong> {user?.firstName} {user?.lastName}</p>
                        <p><strong>Email :</strong> {user?.email}</p>
                        {user?.phone && (
                            <p><strong>Téléphone :</strong> {user?.phone}</p>
                        )}
                        <p><strong>Rôle :</strong> {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h2>Mes candidatures</h2>
                    <p>Fonctionnalité à venir...</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

