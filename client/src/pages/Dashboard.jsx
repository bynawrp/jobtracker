import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import { ApplicationsAPI } from '../utils/api';
import AddForm from '../components/AddForm';
import ApplicationModal from '../components/ApplicationModal';
import ViewToggle from '../components/ViewToggle';
import AdvancedFilters from '../components/AdvancedFilters';
import FileExporter from '../components/FileExporter';
import StatsChart from '../components/StatsChart';
import { VIEWS_CONFIG } from '../config/constants';
import CardsView from '../components/CardsView';
import KanbanView from '../components/KanbanView';
import TableView from '../components/TableView';
import Reminders from '../components/Reminders';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';
import { useSearch } from '../hooks/useSearch';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { filterByDate } from '../utils/formatters';

const Dashboard = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [adminError, setAdminError] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        company: '',
        dateApplied: '',
        reminderDate: '',
        hasNotes: false,
        hasReminder: false
    });
    const [showFilters, setShowFilters] = useState(false);
    
    const [currentView, setCurrentView] = useLocalStorage('dashboardView', 'cards');

    useEffect(() => {
        loadApplications();
        
        if (searchParams.get('error') === 'no_admin') {
            setAdminError(true);
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

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
            toast.success('Candidature ajoutée avec succès');
        } catch (err) {
            throw err;
        }
    };

    const updateApplication = (id, updated) => {
        setApplications(applications.map(app => app._id === id ? updated : app));
    };

    const handleUpdate = (updated) => {
        updateApplication(updated._id, updated);
        toast.success('Candidature mise à jour avec succès');
    };

    const handleDelete = (deleted) => {
        setApplications(applications.filter(app => app._id !== deleted._id));
        toast.success('Candidature supprimée avec succès');
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const updated = await ApplicationsAPI.update(id, { status: newStatus });
            updateApplication(id, updated);
        } catch (err) {
            console.error('Erreur lors du changement de statut:', err);
            loadApplications();
        }
    };

    const handleTableUpdate = async (id, updates) => {
        try {
            const updated = await ApplicationsAPI.update(id, updates);
            updateApplication(id, updated);
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
            loadApplications();
            throw err;
        }
    };

    const searchedApplications = useSearch(
        applications,
        searchQuery,
        (app) => `${app.title || ''} ${app.company || ''} ${app.notes || ''}`
    );

    const filteredApplications = useMemo(() => {
        let result = searchedApplications;

        if (filters.status) {
            result = result.filter(app => app.status === filters.status);
        }
        if (filters.company) {
            result = result.filter(app => 
                app.company && app.company.toLowerCase().includes(filters.company.toLowerCase())
            );
        }
        if (filters.dateApplied) {
            result = filterByDate(result, 'dateApplied', filters.dateApplied);
        }
        if (filters.reminderDate) {
            result = filterByDate(result, 'reminderDate', filters.reminderDate);
        }
        if (filters.hasNotes) {
            result = result.filter(app => app.notes && app.notes.trim());
        }
        if (filters.hasReminder) {
            result = result.filter(app => app.reminderDate);
        }
        // console.log(result.length);
        // console.log(filters);

        return result;
    }, [searchedApplications, filters]);



    // only reminders for the next 7 days
    const reminders = applications
        .filter(item => {
            if (!item.reminderDate) return false;
            if (item.status === 'rejected' || item.status === 'applied') return false;
            
            const now = new Date();
            const reminderDate = new Date(item.reminderDate);
            const limitDate = new Date(now);
            limitDate.setDate(limitDate.getDate() + 7);
            
            return reminderDate <= limitDate;
        })
        .sort((a, b) => {
            const now = new Date();
            const dateA = new Date(a.reminderDate);
            const dateB = new Date(b.reminderDate);
            const isPastA = dateA <= now;
            const isPastB = dateB <= now;
            
            if (isPastA && !isPastB) return -1;
            if (!isPastA && isPastB) return 1;
            
            return dateA - dateB;
        });
    // console.log(reminders.length);

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Tableau de bord</h1>
                    <LoadingSpinner />
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

            {adminError && (
                <div className="warning-message">
                    Vous devez être administrateur pour accéder à cette page.
                </div>
            )}
            
            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-actions">
                <button onClick={() => setShowForm(true)} className="btn primary btn-add" aria-label="Ajouter une nouvelle candidature" title="Ajouter une nouvelle candidature">
                    <PlusIcon className="icon-sm" />
                    <span className="btn-label">Ajouter une candidature</span>
                </button>
                
                <ViewToggle 
                    currentView={currentView} 
                    onViewChange={setCurrentView} 
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
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                aria-label="Rechercher dans les candidatures"
                            />
                        </div>
                        <button onClick={() => setShowFilters(!showFilters)} className="btn" aria-label={showFilters ? 'Masquer les filtres' : 'Afficher les filtres'} title={showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}>
                            <FunnelIcon className="icon-sm" />
                            <span className="btn-label">{showFilters ? 'Masquer' : 'Afficher'} filtres</span>
                        </button>
                        <FileExporter 
                            applications={filteredApplications}
                            filters={filters}
                        />
                    </div>
                    {showFilters && (
                        <AdvancedFilters
                            filters={filters}
                            onFilterChange={setFilters}
                            applications={applications}
                        />
                    )}
                </>
            )}
            
            {reminders.length > 0 && (
                <Reminders reminders={reminders} onViewDetails={setSelectedApplication} />
            )}

            {applications.length > 0 && (
                <StatsChart applications={applications} />
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
