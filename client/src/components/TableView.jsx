import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../utils/formatters';
import StatusSelect from './StatusSelect';

export default function TableView({ applications, onUpdate, onViewDetails }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedApplications = [...applications].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'dateApplied' || sortConfig.key === 'reminderDate') {
            aValue = aValue ? new Date(aValue) : new Date(0);
            bValue = bValue ? new Date(bValue) : new Date(0);
        } else if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleStatusChange = async (id, newStatus) => {
        try {
            await onUpdate(id, { status: newStatus });
        } catch (err) {
            console.error('Erreur lors de la mise à jour du statut:', err);
        }
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return null;
        return <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('title')} className="sortable">
                            Titre <SortIcon columnKey="title" />
                        </th>
                        <th onClick={() => handleSort('company')} className="sortable">
                            Entreprise <SortIcon columnKey="company" />
                        </th>
                        <th onClick={() => handleSort('status')} className="sortable">
                            Statut <SortIcon columnKey="status" />
                        </th>
                        <th onClick={() => handleSort('dateApplied')} className="sortable">
                            Date candidature <SortIcon columnKey="dateApplied" />
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedApplications.map(app => (
                        <tr key={app._id}>
                            <td>{app.title || '-'}</td>
                            <td>{app.company || '-'}</td>
                            <td>
                                <StatusSelect
                                    value={app.status}
                                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                    className="table-select"
                                />
                            </td>
                            <td>{formatDate(app.dateApplied)}</td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        onClick={() => onViewDetails(app)}
                                        className="btn small primary"
                                        aria-label="Voir détails"
                                        title="Voir les détails de la candidature"
                                    >
                                        <EyeIcon className="icon-sm" />
                                        <span className="btn-label">Voir</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {sortedApplications.length === 0 && (
                <div className="table-empty">
                    <p>Aucune candidature</p>
                </div>
            )}
        </div>
    );
}

