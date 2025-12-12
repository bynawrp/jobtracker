import { useEffect, useState, useMemo } from 'react';
import { AdminAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { handleApiError } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';

export default function Admin() {
    const { user: currentUser } = useAuth();
    const toast = useToast();
    const isSuperAdmin = currentUser?.role === 'superadmin';
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    
    const form = useForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'user'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await AdminAPI.getUsers();
            setUsers(usersData);
        } catch (err) {
            form.setError('Impossible de charger les utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user._id);
        form.reset({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'user'
        });
    };

    const handleCancel = () => {
        setEditingUser(null);
        form.reset({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'user'
        });
    };

    const handleSave = async (userId) => {
        form.setError('');
        form.setFieldErrors({});
        
        try {
            const payload = { ...form.values };
            if (!isSuperAdmin) {
                delete payload.role;
            }
            await AdminAPI.updateUser(userId, payload);
            await loadUsers();
            setEditingUser(null);
            form.reset({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                role: 'user'
            });
            toast.success('Utilisateur mis à jour avec succès');
        } catch (err) {
            const result = handleApiError(err);
            if (result.fieldErrors) {
                form.setFieldErrors(result.fieldErrors);
                form.setError('');
            } else {
                form.setError(result.error);
                form.setFieldErrors({});
            }
        }
    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        try {
            await AdminAPI.deleteUser(userToDelete);
            await loadUsers();
            form.setError('');
            toast.success('Utilisateur supprimé avec succès');
        } catch (err) {
            form.setError('Erreur lors de la suppression de l\'utilisateur');
        } finally {
            setUserToDelete(null);
        }
    };

    const filteredUsers = useMemo(() => {
        let result = users;

        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            result = result.filter(user => {
                const searchText = `${user.firstName || ''} ${user.lastName || ''} ${user.email || ''}`.toLowerCase();
                return searchText.includes(search);
            });
        }

        if (roleFilter) {
            result = result.filter(user => user.role === roleFilter);
        }

        return result;
    }, [users, searchQuery, roleFilter]);

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Administration</h1>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Administration</h1>
                <p>Gestion des utilisateurs</p>
            </div>

            {form.error && <div className="error-message">{form.error}</div>}

            <div className="admin-filters">
                <div className="search-bar">
                    <MagnifyingGlassIcon className="icon-sm" />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        aria-label="Rechercher dans les utilisateurs"
                    />
                </div>
                {isSuperAdmin && (
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="admin-role-filter"
                    >
                        <option value="">Tous les rôles</option>
                        <option value="admin">Administrateurs</option>
                        <option value="user">Utilisateurs</option>
                    </select>
                )}
            </div>

            {filteredUsers.length === 0 ? (
                <div className="dashboard-empty">
                    <p>Aucun utilisateur trouvé</p>
                </div>
            ) : (
                <div className="admin-users-grid">
                    {filteredUsers.map((user) => (
                    <div key={user._id} className="admin-user-card">
                        {editingUser === user._id ? (
                            <div className="admin-user-edit">
                                {form.error && <div className="error-message">{form.error}</div>}
                                <div className="admin-form-group">
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.values.firstName}
                                        onChange={form.handleChange}
                                        className={`admin-input ${form.getFieldError('firstName') ? 'error' : ''}`}
                                    />
                                    {form.getFieldError('firstName') && <div className="error">{form.getFieldError('firstName')}</div>}
                                </div>
                                <div className="admin-form-group">
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.values.lastName}
                                        onChange={form.handleChange}
                                        className={`admin-input ${form.getFieldError('lastName') ? 'error' : ''}`}
                                    />
                                    {form.getFieldError('lastName') && <div className="error">{form.getFieldError('lastName')}</div>}
                                </div>
                                <div className="admin-form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.values.email}
                                        onChange={form.handleChange}
                                        className={`admin-input ${form.getFieldError('email') ? 'error' : ''}`}
                                    />
                                    {form.getFieldError('email') && <div className="error">{form.getFieldError('email')}</div>}
                                </div>
                                <div className="admin-form-group">
                                    <label>Téléphone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.values.phone}
                                        onChange={form.handleChange}
                                        className={`admin-input ${form.getFieldError('phone') ? 'error' : ''}`}
                                    />
                                    {form.getFieldError('phone') && <div className="error">{form.getFieldError('phone')}</div>}
                                </div>
                                {isSuperAdmin && (
                                    <div className="admin-form-group">
                                        <label>Rôle</label>
                                        <select
                                            name="role"
                                            value={form.values.role}
                                            onChange={form.handleChange}
                                            className={`admin-select ${form.getFieldError('role') ? 'error' : ''}`}
                                        >
                                            <option value="user">Utilisateur</option>
                                            <option value="admin">Administrateur</option>
                                        </select>
                                        {form.getFieldError('role') && <div className="error">{form.getFieldError('role')}</div>}
                                    </div>
                                )}
                                <div className="admin-actions">
                                    <button
                                        onClick={() => handleSave(user._id)}
                                        className="btn primary"
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="btn"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="admin-user-header">
                                    <div>
                                        <h3>{user.firstName} {user.lastName}</h3>
                                        <span className={`badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                                            {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                                        </span>
                                    </div>
                                    <div className="admin-user-actions">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="btn"
                                            title="Modifier"
                                        >
                                            <PencilIcon className="icon-sm" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user._id)}
                                            className="btn danger"
                                            title="Supprimer"
                                        >
                                            <TrashIcon className="icon-sm" />
                                        </button>
                                    </div>
                                </div>
                                <div className="admin-user-info">
                                    <div className="admin-info-item">
                                        <span className="admin-info-label">Email</span>
                                        <span className="admin-info-value">{user.email}</span>
                                    </div>
                                    {user.phone ? (
                                        <div className="admin-info-item">
                                            <span className="admin-info-label">Téléphone</span>
                                            <span className="admin-info-value">{user.phone}</span>
                                        </div>
                                    ): (
                                        <div className="admin-info-item">
                                            <span className="admin-info-label">Téléphone</span>
                                            <span className="admin-info-value">Non renseigné</span>
                                        </div>
                                    )}
                                    <div className="admin-info-item">
                                        <span className="admin-info-label">Candidatures</span>
                                        <span className="admin-info-value admin-count">{user.applicationsCount || 0}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    ))}
                </div>
            )}
            <ConfirmDialog
                isOpen={confirmOpen}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Toutes ses candidatures seront également supprimées."
                confirmText="Supprimer"
                cancelText="Annuler"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onClose={() => {
                    setConfirmOpen(false);
                    setUserToDelete(null);
                }}
            />
        </div>
    );
}
