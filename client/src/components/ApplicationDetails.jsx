import { useEffect } from 'react';
import { XMarkIcon, PencilIcon, CheckIcon, TrashIcon, EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { parseStatus, formatDate, formatDateInput, dateInputToISO } from '../utils/formatters';
import { useForm } from '../hooks/useForm';
import DetailField from './DetailField';
import { DEFAULT_STATUS } from '../config/constants';
import { ApplicationsAPI } from '../utils/api';

export default function ApplicationDetails({ 
    item, 
    isEditing, 
    setIsEditing, 
    onUpdate, 
    onClose, 
    onDelete, 
    onOpenEmailComposer,
    onConfirmDelete 
}) {
    const getInitialValues = () => ({
        title: item.title || '',
        company: item.company || '',
        status: item.status || DEFAULT_STATUS,
        dateApplied: formatDateInput(item.dateApplied) || '',
        link: item.link || '',
        reminderDate: formatDateInput(item.reminderDate) || '',
        notes: item.notes || ''
    });

    const form = useForm(getInitialValues(), async (values) => {
        const payload = {
            ...values,
            reminderDate: dateInputToISO(values.reminderDate),
            dateApplied: dateInputToISO(values.dateApplied)
        };
        const updated = await ApplicationsAPI.update(item._id, payload);
        onUpdate?.(updated);
        setIsEditing(false);
    });

    useEffect(() => {
        if (!isEditing) {
            form.reset(getInitialValues());
        }
    }, [item, isEditing]);

    function handleCancel() {
        form.reset(getInitialValues());
        setIsEditing(false);
    }

    return (
        <>
            <div className="detail-section">
                <div className="detail-section-header">
                    <h3 id="application-details-title">
                        <DocumentTextIcon className="icon-sm" />
                        Informations générales
                    </h3>
                    <div className="header-actions">
                        {isEditing ? (
                            <>
                                <button onClick={(e) => form.handleSubmit(e)} className="btn primary">
                                    <CheckIcon className="icon-sm" />
                                    <span className="btn-label">Sauvegarder</span>
                                </button>
                                <button onClick={handleCancel} className="btn" aria-label="Annuler les modifications">
                                    <XMarkIcon className="icon-sm" />
                                    <span className="btn-label">Annuler</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={onClose} className="btn ghost" aria-label="Fermer les détails">
                                <XMarkIcon className="icon-sm" />
                            </button>
                        )}
                    </div>
                </div>
                {form.error && <div className="error-message">{form.error}</div>}
                <div className="detail-grid">
                    <DetailField
                        label="Titre"
                        name="title"
                        isEditing={isEditing}
                        value={form.values.title}
                        displayValue={item.title}
                        form={form}
                    />
                    <DetailField
                        label="Entreprise"
                        name="company"
                        isEditing={isEditing}
                        value={form.values.company}
                        displayValue={item.company}
                        form={form}
                    />
                    <DetailField
                        label="Statut"
                        name="status"
                        isEditing={isEditing}
                        value={form.values.status}
                        displayValue={parseStatus(item.status)}
                        form={form}
                        type="status"
                        renderDisplay={() => (
                            <div className="status-display">
                                <span className={`status-dot ${item.status}`}></span>
                                <span className="status-text">{parseStatus(item.status)}</span>
                            </div>
                        )}
                    />
                    <DetailField
                        label="Date de candidature"
                        name="dateApplied"
                        isEditing={isEditing}
                        value={form.values.dateApplied}
                        displayValue={formatDate(item.dateApplied)}
                        form={form}
                        type="date"
                    />
                    <DetailField
                        label="Lien"
                        name="link"
                        isEditing={isEditing}
                        value={form.values.link}
                        displayValue={item.link || '-'}
                        form={form}
                        renderDisplay={() => (
                            <div>{item.link ? <a className="link" href={item.link} target="_blank" rel="noreferrer">{item.link}</a> : '-'}</div>
                        )}
                    />
                    <DetailField
                        label="Rappel"
                        name="reminderDate"
                        isEditing={isEditing}
                        value={form.values.reminderDate}
                        displayValue={formatDate(item.reminderDate)}
                        form={form}
                        type="date"
                    />
                </div>
                <br />
                <h3>Notes</h3>
                <DetailField
                    name="notes"
                    isEditing={isEditing}
                    value={form.values.notes}
                    displayValue={item.notes || 'Aucune note'}
                    form={form}
                    type="textarea"
                    renderEdit={() => (
                        <textarea
                            name="notes"
                            className={`textarea ${form.getFieldError('notes') ? 'error' : ''}`}
                            value={form.values.notes}
                            onChange={form.handleChange}
                            placeholder="Ajoutez vos notes détaillées..."
                            rows={5}
                        />
                    )}
                    renderDisplay={() => (
                        <div className="notes-viewer">
                            {item.notes ? (
                                <div className="notes-text">{item.notes}</div>
                            ) : (
                                <div className="notes-empty">
                                    <span className="muted">Aucune note</span>
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            <div className="detail-section">
                <div className="detail-field">
                    <label>Actions disponibles</label>
                    <div className="detail-actions">
                        <button 
                            onClick={onOpenEmailComposer} 
                            className="btn primary"
                        >
                            <EnvelopeIcon className="icon-sm" />
                            <span className="btn-label">Créer un email</span>
                        </button>
                        <button onClick={() => setIsEditing(true)} className="btn">
                            <PencilIcon className="icon-sm" />
                            <span className="btn-label">Modifier</span>
                        </button>
                        <button onClick={onConfirmDelete} className="btn danger">
                            <TrashIcon className="icon-sm" />
                            <span className="btn-label">Supprimer</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

