import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ApplicationsAPI } from '../utils/api';
import { handleApiError } from '../utils/errorHandler';
import ApplicationCard from '../components/ApplicationCard';
import AddForm from '../components/AddForm';
import ApplicationModal from '../components/ApplicationModal';
import { PlusIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [addError, setAddError] = useState('');
    const [addErrors, setAddErrors] = useState({});

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await ApplicationsAPI.list();
            setApplications(data.data || []);
            setError('');
        } catch (err) {
            setError('Impossible de charger les candidatures');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (payload) => {
        try {
            const data = await ApplicationsAPI.create(payload);
            setApplications([data.data || data, ...applications]);
            setShowForm(false);
            setAddError('');
            setAddErrors({});
        } catch (err) {
            const result = handleApiError(err);
            if (result.fieldErrors) {
                setAddErrors(result.fieldErrors);
                setAddError('');
            } else {
                setAddError(result.error);
                setAddErrors({});
            }
            setShowForm(true);
        }
    };

    const handleUpdate = (updated) => {
        setApplications(applications.map(app => app._id === updated._id ? updated : app));
    };

    const handleDelete = (deleted) => {
        setApplications(applications.filter(app => app._id !== deleted._id));
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
                <button onClick={() => setShowForm(true)} className="btn primary flex-center">
                    <PlusIcon className="icon-sm" />
                    Ajouter une candidature
                </button>
            </div>

            {showForm && (
                <AddForm 
                    onSubmit={handleCreate} 
                    onCancel={() => {
                        setShowForm(false);
                        setAddError('');
                        setAddErrors({});
                    }} 
                    errors={addErrors} 
                    error={addError} 
                />
            )}

            {applications.length === 0 && !showForm ? (
                <div className="dashboard-empty">
                    <p>Aucune candidature</p>
                    <p className="muted">Utilisez le bouton "Ajouter une candidature" pour commencer le suivi.</p>
                </div>
            ) : (
                <div className="cards">
                    {applications.map(app => (
                        <ApplicationCard 
                            key={app._id} 
                            item={app} 
                            onViewDetails={setSelectedApplication}
                        />
                    ))}
                </div>
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
