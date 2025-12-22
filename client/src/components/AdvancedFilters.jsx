import { useState, useMemo, useEffect } from 'react';
import { XMarkIcon, TagIcon, BuildingOfficeIcon, CalendarIcon, BellIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import StatusSelect from './StatusSelect';
import { DEFAULT_FILTERS } from '../config/constants';

export default function AdvancedFilters({ filters: externalFilters, onFilterChange, applications }) {
    const [filters, setFilters] = useState(externalFilters || DEFAULT_FILTERS);

    useEffect(() => {
        if (externalFilters) {
            setFilters(externalFilters);
        }
    }, [externalFilters]);

    const companies = useMemo(() => {
        return [...new Set(applications.map(app => app.company).filter(Boolean))].sort();
    }, [applications]);

    const activeFiltersCount = useMemo(() => {
        return Object.values(filters).filter(v => v && v !== false).length;
    }, [filters]);

    const update = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clear = () => {
        setFilters(DEFAULT_FILTERS);
        onFilterChange(DEFAULT_FILTERS);
    };

    return (
        <div className="advanced-filters">
            {activeFiltersCount > 0 && (
                <div className="filters-header">
                    <div className="filters-badge">
                        <span className="filters-count">{activeFiltersCount}</span>
                        <span>filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}</span>
                    </div>
                    <button onClick={clear} className="btn small" aria-label="Effacer tous les filtres" title="Effacer tous les filtres">
                        <XMarkIcon className="icon-sm" />
                        <span className="btn-label">Effacer</span>
                    </button>
                </div>
            )}

            <div className="filters-grid">
                <div className="filter-field">
                    <label className="label-icon">
                        <TagIcon className="icon-sm" />
                        Statut
                    </label>
                    <StatusSelect
                        value={filters.status || ''}
                        onChange={(e) => update('status', e.target.value)}
                        allowEmpty={true}
                    />
                </div>

                <div className="filter-field">
                    <label className="label-icon">
                        <BuildingOfficeIcon className="icon-sm" />
                        Entreprise
                    </label>
                    <select
                        value={filters.company}
                        onChange={(e) => update('company', e.target.value)}
                        className="select"
                    >
                        <option value="">Toutes les entreprises</option>
                        {companies.map(company => (
                            <option key={company} value={company}>{company}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-field">
                    <label className="label-icon">
                        <CalendarIcon className="icon-sm" />
                        Date de candidature
                    </label>
                    <input
                        type="date"
                        value={filters.dateApplied}
                        onChange={(e) => update('dateApplied', e.target.value)}
                        className="input"
                    />
                </div>

                <div className="filter-field">
                    <label className="label-icon">
                        <BellIcon className="icon-sm" />
                        Date de rappel
                    </label>
                    <input
                        type="date"
                        value={filters.reminderDate}
                        onChange={(e) => update('reminderDate', e.target.value)}
                        className="input"
                    />
                </div>

                <div className="filter-field">
                    <label>Options</label>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.hasNotes}
                                onChange={(e) => update('hasNotes', e.target.checked)}
                            />
                            <DocumentTextIcon className="icon-sm" />
                            <span>Avec notes</span>
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.hasReminder}
                                onChange={(e) => update('hasReminder', e.target.checked)}
                            />
                            <BellIcon className="icon-sm" />
                            <span>Avec rappel</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

