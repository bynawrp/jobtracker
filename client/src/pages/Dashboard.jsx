import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ApplicationsAPI } from '../utils/api';
import AddForm from '../components/AddForm';
import ApplicationModal from '../components/ApplicationModal';
import ViewToggle from '../components/ViewToggle';
import { VIEWS_CONFIG } from '../utils/constants';
import CardsView from '../components/CardsView';
import KanbanView from '../components/KanbanView';
import TableView from '../components/TableView';
import { PlusIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    
    const [currentView, setCurrentView] = useState(() => {
        const savedView = localStorage.getItem('dashboardView');
        return savedView && Object.keys(VIEWS_CONFIG).includes(savedView) ? savedView : 'cards';
    });

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const applications = await ApplicationsAPI.list();
            setApplications(applications);
            setError('');
        } catch (err) {
            setError('Impossible de charger les candidatures');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (payload) => {
        try {
            const newApp = await ApplicationsAPI.create(payload);
            setApplications([newApp, ...applications]);
            setShowForm(false);
        } catch (err) {
            throw err;
        }
    };

    const updateApplication = (id, updated) => {
        setApplications(applications.map(app => app._id === id ? updated : app));
    };

    const handleUpdate = (updated) => {
        updateApplication(updated._id, updated);
    };

    const handleDelete = (deleted) => {
        setApplications(applications.filter(app => app._id !== deleted._id));
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const updated = await ApplicationsAPI.update(id, { status: newStatus });
            updateApplication(id, updated);
        } catch (err) {
            console.error('Erreur lors du changement de statut:', err);
        }
    };

    const handleTableUpdate = async (id, updates) => {
        try {
            const updated = await ApplicationsAPI.update(id, updates);
            updateApplication(id, updated);
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
            throw err;
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Tableau de bord</h1>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Tableau de bord</h1>
                <p>Bienvenue, {user?.firstName} {user?.lastName} !</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-actions">
                <button onClick={() => setShowForm(true)} className="btn primary btn-add">
                    <PlusIcon className="icon-sm" />
                    <span className="btn-label">Ajouter une candidature</span>
                </button>
                <ViewToggle 
                    currentView={currentView} 
                    onViewChange={(view) => {
                        setCurrentView(view);
                        localStorage.setItem('dashboardView', view);
                    }} 
                />
            </div>

            {showForm && (
                <AddForm 
                    onSubmit={handleCreate} 
                    onCancel={() => setShowForm(false)} 
                />
            )}

            {applications.length === 0 && !showForm ? (
                <div className="dashboard-empty">
                    <p>Aucune candidature</p>
                    <p className="muted">Utilisez le bouton "Ajouter une candidature" pour commencer le suivi.</p>
                </div>
            ) : (
                <>
                    {currentView === 'cards' && (
                        <CardsView 
                            applications={applications} 
                            onViewDetails={setSelectedApplication}
                        />
                    )}
                    {currentView === 'kanban' && (
                        <KanbanView 
                            applications={applications}
                            onStatusChange={handleStatusChange}
                            onViewDetails={setSelectedApplication}
                        />
                    )}
                    {currentView === 'table' && (
                        <TableView 
                            applications={applications}
                            onUpdate={handleTableUpdate}
                            onViewDetails={setSelectedApplication}
                        />
                    )}
                </>
            )}

            {selectedApplication && (
                <ApplicationModal
                    item={selectedApplication}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onClose={() => setSelectedApplication(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
