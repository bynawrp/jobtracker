import { useEffect } from 'react';
import { BuildingOfficeIcon, LinkIcon, CalendarIcon, BellIcon, DocumentTextIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from '../hooks/useForm';

export default function AddForm({ onSubmit, onCancel, errors = {}, error = '' }) {
    const today = new Date().toISOString().split('T')[0];
    
    const form = useForm({
        title: '',
        company: '',
        link: '',
        status: 'pending',
        dateApplied: today,
        reminderDate: '',
        notes: ''
    }, async (values) => {
        await onSubmit?.({
            title: values.title.trim(),
            company: values.company.trim(),
            link: values.link.trim() || undefined,
            status: values.status,
            dateApplied: values.dateApplied ? new Date(values.dateApplied) : undefined,
            reminderDate: values.reminderDate ? new Date(values.reminderDate) : undefined,
            notes: values.notes.trim() || undefined
        });
        form.reset();
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            form.setFieldErrors(errors);
        }
        if (error) {
            form.setError(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors, error]);

    return (
        <form onSubmit={form.handleSubmit} className="form" aria-describedby={form.error ? 'add-error' : undefined}>
            {form.error && <div className="error" id="add-error">{form.error}</div>}
            <div className="field">
                <label className="label" htmlFor="add-title">Titre du poste *</label>
                <input
                    id="add-title"
                    name="title"
                    className={`input ${form.getFieldError('title') ? 'error' : ''}`}
                    placeholder="Ex: Développeur React, Product Manager..."
                    value={form.values.title}
                    onChange={form.handleChange}
                    aria-describedby={form.getFieldError('title') ? 'err-add-title' : undefined}
                />
                {form.getFieldError('title') && <div className="error" id="err-add-title">{form.getFieldError('title')}</div>}
            </div>

            <div className="field">
                <label className="label label-icon" htmlFor="add-company">
                    <BuildingOfficeIcon className="icon-sm" />
                    Entreprise *
                </label>
                <input
                    id="add-company"
                    name="company"
                    className={`input ${form.getFieldError('company') ? 'error' : ''}`}
                    placeholder="Ex: Google, Microsoft, StartupXYZ..."
                    value={form.values.company}
                    onChange={form.handleChange}
                    aria-describedby={form.getFieldError('company') ? 'err-add-company' : undefined}
                />
                {form.getFieldError('company') && <div className="error" id="err-add-company">{form.getFieldError('company')}</div>}
            </div>

            <div className="field">
                <label className="label label-icon" htmlFor="add-link">
                    <LinkIcon className="icon-sm" />
                    Lien de l'offre
                </label>
                <input
                    id="add-link"
                    name="link"
                    className={`input ${form.getFieldError('link') ? 'error' : ''}`}
                    placeholder="https://entreprise.com/offre-emploi"
                    value={form.values.link}
                    onChange={form.handleChange}
                    type="text"
                    aria-describedby={form.getFieldError('link') ? 'err-add-link' : undefined}
                />
                {form.getFieldError('link') && <div className="error" id="err-add-link">{form.getFieldError('link')}</div>}
            </div>

            <div className="field">
                <label className="label" htmlFor="add-status">Statut *</label>
                <select
                    id="add-status"
                    name="status"
                    className={`select ${form.getFieldError('status') ? 'error' : ''}`}
                    value={form.values.status}
                    onChange={form.handleChange}
                    aria-describedby={form.getFieldError('status') ? 'err-add-status' : undefined}
                >
                    <option value="pending">En attente</option>
                    <option value="interview">Entretien</option>
                    <option value="rejected">Refusé</option>
                    <option value="applied">Accepté</option>
                </select>
                {form.getFieldError('status') && <div className="error" id="err-add-status">{form.getFieldError('status')}</div>}
            </div>

            <div className="field">
                <label className="label label-icon" htmlFor="add-date">
                    <CalendarIcon className="icon-sm" />
                    Date de candidature
                </label>
                <input
                    id="add-date"
                    name="dateApplied"
                    className={`input ${form.getFieldError('dateApplied') ? 'error' : ''}`}
                    type="date"
                    value={form.values.dateApplied}
                    onChange={form.handleChange}
                    aria-describedby={form.getFieldError('dateApplied') ? 'err-add-date' : undefined}
                />
                {form.getFieldError('dateApplied') && <div className="error" id="err-add-date">{form.getFieldError('dateApplied')}</div>}
            </div>

            <div className="field">
                <label className="label label-icon" htmlFor="add-reminder">
                    <BellIcon className="icon-sm" />
                    Date de rappel
                </label>
                <input
                    id="add-reminder"
                    name="reminderDate"
                    className={`input ${form.getFieldError('reminderDate') ? 'error' : ''}`}
                    type="date"
                    value={form.values.reminderDate}
                    onChange={form.handleChange}
                    aria-describedby={form.getFieldError('reminderDate') ? 'err-add-reminder' : undefined}
                />
                {form.getFieldError('reminderDate') && <div className="error" id="err-add-reminder">{form.getFieldError('reminderDate')}</div>}
            </div>

            <div className="field">
                <label className="label label-icon" htmlFor="add-notes">
                    <DocumentTextIcon className="icon-sm" />
                    Notes
                </label>
                <textarea
                    id="add-notes"
                    name="notes"
                    className={`textarea ${form.getFieldError('notes') ? 'error' : ''}`}
                    placeholder="Ajoutez des notes sur cette candidature..."
                    value={form.values.notes}
                    onChange={form.handleChange}
                    rows={3}
                    aria-describedby={form.getFieldError('notes') ? 'err-add-notes' : undefined}
                />
                {form.getFieldError('notes') && <div className="error" id="err-add-notes">{form.getFieldError('notes')}</div>}
            </div>

            <div className="row">
                <button type="submit" className="btn primary flex-center">
                    <CheckIcon className="icon-sm" />Enregistrer
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn flex-center">
                        <XMarkIcon className="icon-sm" />Annuler
                    </button>
                )}
            </div>
        </form>
    );
}

