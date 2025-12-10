import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ApplicationsAPI } from '../utils/api';
import AddForm from '../components/AddForm';
import ApplicationModal from '../components/ApplicationModal';
import ViewToggle from '../components/ViewToggle';
import AdvancedFilters from '../components/AdvancedFilters';
import { VIEWS_CONFIG } from '../utils/constants';
import CardsView from '../components/CardsView';
import KanbanView from '../components/KanbanView';
import TableView from '../components/TableView';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    
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

    //USEMEMO FILTERS
    const filteredApplications = useMemo(() => {
        let result = applications;

        //SEARCHBAR
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            result = result.filter(app => {
                const searchText = `${app.title || ''} ${app.company || ''} ${app.notes || ''}`.toLowerCase();
                return searchText.includes(search);
            });
        }

        //FILTERS
        if (filters.status) {
            result = result.filter(app => app.status === filters.status);
        }
        if (filters.company) {
            result = result.filter(app => 
                app.company && app.company.toLowerCase().includes(filters.company.toLowerCase())
            );
        }
        if (filters.dateApplied) {
            const filterDate = new Date(filters.dateApplied).toDateString();
            result = result.filter(app => 
                app.dateApplied && new Date(app.dateApplied).toDateString() === filterDate
            );
        }
        if (filters.reminderDate) {
            const filterDate = new Date(filters.reminderDate).toDateString();
            result = result.filter(app => 
                app.reminderDate && new Date(app.reminderDate).toDateString() === filterDate
            );
        }
        if (filters.hasNotes) {
            result = result.filter(app => app.notes && app.notes.trim());
        }
        if (filters.hasReminder) {
            result = result.filter(app => app.reminderDate);
        }

        return result;
    }, [applications, searchQuery, filters]);

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

            {applications.length > 0 && (
                <>
                    <div className="search-filters-row">
                        <div className="search-bar">
                            <MagnifyingGlassIcon className="icon-sm" />
                            <input
                                type="text"
                                placeholder="Rechercher (titre, entreprise, notes)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                aria-label="Rechercher dans les candidatures"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn"
                        >
                            <FunnelIcon className="icon-sm" />
                            <span className="btn-label">{showFilters ? 'Masquer' : 'Afficher'} filtres</span>
                        </button>
                    </div>
                    {showFilters && (
                        <AdvancedFilters
                            onFilterChange={setFilters}
                            applications={applications}
                        />
                    )}
                </>
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
                            applications={filteredApplications} 
                            onViewDetails={setSelectedApplication}
                        />
                    )}
                    {currentView === 'kanban' && (
                        <KanbanView 
                            applications={filteredApplications}
                            onStatusChange={handleStatusChange}
                            onViewDetails={setSelectedApplication}
                        />
                    )}
                    {currentView === 'table' && (
                        <TableView 
                            applications={filteredApplications}
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
