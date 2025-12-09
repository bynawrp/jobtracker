import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PencilIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ApplicationsAPI } from '../utils/api';
import { parseStatus, formatDate, formatDateInput } from '../utils/formatters';
import { useForm } from '../hooks/useForm';
import ConfirmDialog from './ConfirmDialog';

export default function ApplicationModal({ item, onUpdate, onClose, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(item);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    const getInitialValues = () => ({
        title: currentItem.title || '',
        company: currentItem.company || '',
        status: currentItem.status || 'pending',
        dateApplied: formatDateInput(currentItem.dateApplied) || '',
        link: currentItem.link || '',
        reminderDate: formatDateInput(currentItem.reminderDate) || '',
        notes: currentItem.notes || ''
    });

    const form = useForm(getInitialValues(), async (values) => {
        const data = await ApplicationsAPI.update(currentItem._id, {
            ...values,
            dateApplied: values.dateApplied ? new Date(values.dateApplied) : undefined,
            reminderDate: values.reminderDate ? new Date(values.reminderDate) : undefined
        });
        const updated = data.data || data;
        setCurrentItem(updated);
        onUpdate?.(updated);
        setIsEditing(false);
    });

    useEffect(() => {
        if (!isEditing) {
            const initialValues = getInitialValues();
            form.reset(initialValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentItem, isEditing]);

    useEffect(() => {
        previousFocusRef.current = document.activeElement;
    }, []);

    const closeAndRestore = () => {
        const toFocus = previousFocusRef.current;
        onClose?.();
        setTimeout(() => {
            try { toFocus && toFocus.focus && toFocus.focus(); } catch { }
        }, 0);
    };

    function handleCancel() {
        form.reset(getInitialValues());
        setIsEditing(false);
    }

    async function handleDeleteConfirm() {
        try {
            await ApplicationsAPI.remove(currentItem._id);
            onDelete?.(currentItem);
            onClose();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <div className="application-detail" role="dialog" aria-modal="true" aria-labelledby="application-details-title" onClick={closeAndRestore}>
                <div className="detail-content" onClick={(e) => e.stopPropagation()}>
                    <div className="detail-section">
                        <div className="detail-section-header">
                            <h3 id="application-details-title">Informations générales</h3>
                            <div className="header-actions">
                                {isEditing ? (
                                    <>
                                        <button onClick={(e) => form.handleSubmit(e)} className="btn primary flex-center">
                                            <CheckIcon className="icon-sm" />
                                            Sauvegarder
                                        </button>
                                        <button onClick={handleCancel} className="btn flex-center" aria-label="Annuler les modifications">
                                            <XMarkIcon className="icon-sm" />
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={closeAndRestore} className="btn ghost" aria-label="Fermer les détails">
                                        <XMarkIcon className="icon-sm" />
                                    </button>
                                )}
                            </div>
                        </div>
                        {form.error && <div className="error-message">{form.error}</div>}
                        <div className="detail-grid">
                            <div className="detail-field">
                                <label>Titre</label>
                                {isEditing ? (
                                    <>
                                        <input
                                            name="title"
                                            className={`input ${form.getFieldError('title') ? 'error' : ''}`}
                                            value={form.values.title}
                                            onChange={form.handleChange}
                                        />
                                        {form.getFieldError('title') && <div className="error">{form.getFieldError('title')}</div>}
                                    </>
                                ) : (
                                    <div>{currentItem.title}</div>
                                )}
                            </div>
                            <div className="detail-field">
                                <label>Entreprise</label>
                                {isEditing ? (
                                    <>
                                        <input
                                            name="company"
                                            className={`input ${form.getFieldError('company') ? 'error' : ''}`}
                                            value={form.values.company}
                                            onChange={form.handleChange}
                                        />
                                        {form.getFieldError('company') && <div className="error">{form.getFieldError('company')}</div>}
                                    </>
                                ) : (
                                    <div>{currentItem.company}</div>
                                )}
                            </div>
                            <div className="detail-field">
                                <label>Statut</label>
                                {isEditing ? (
                                    <>
                                        <select
                                            name="status"
                                            className={`select ${form.getFieldError('status') ? 'error' : ''}`}
                                            value={form.values.status}
                                            onChange={form.handleChange}
                                        >
                                            <option value="pending">{parseStatus('pending')}</option>
                                            <option value="interview">{parseStatus('interview')}</option>
                                            <option value="rejected">{parseStatus('rejected')}</option>
                                            <option value="applied">{parseStatus('applied')}</option>
                                        </select>
                                        {form.getFieldError('status') && <div className="error">{form.getFieldError('status')}</div>}
                                    </>
                                ) : (
                                    <div className="status-display">
                                        <span className={`status-dot ${currentItem.status}`}></span>
                                        <span className="status-text">{parseStatus(currentItem.status)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="detail-field">
                                <label>Date de candidature</label>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="date"
                                            name="dateApplied"
                                            className={`input ${form.getFieldError('dateApplied') ? 'error' : ''}`}
                                            value={form.values.dateApplied}
                                            onChange={form.handleChange}
                                        />
                                        {form.getFieldError('dateApplied') && <div className="error">{form.getFieldError('dateApplied')}</div>}
                                    </>
                                ) : (
                                    <div>{formatDate(currentItem.dateApplied)}</div>
                                )}
                            </div>
                            <div className="detail-field">
                                <label>Lien</label>
                                {isEditing ? (
                                    <>
                                        <input
                                            name="link"
                                            className={`input ${form.getFieldError('link') ? 'error' : ''}`}
                                            value={form.values.link}
                                            onChange={form.handleChange}
                                        />
                                        {form.getFieldError('link') && <div className="error">{form.getFieldError('link')}</div>}
                                    </>
                                ) : (
                                    <div>{currentItem.link ? <a className="link" href={currentItem.link} target="_blank" rel="noreferrer">{currentItem.link}</a> : '-'}</div>
                                )}
                            </div>
                            <div className="detail-field">
                                <label>Rappel</label>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="date"
                                            name="reminderDate"
                                            className={`input ${form.getFieldError('reminderDate') ? 'error' : ''}`}
                                            value={form.values.reminderDate}
                                            onChange={form.handleChange}
                                        />
                                        {form.getFieldError('reminderDate') && <div className="error">{form.getFieldError('reminderDate')}</div>}
                                    </>
                                ) : (
                                    <div>{formatDate(currentItem.reminderDate)}</div>
                                )}
                            </div>
                        </div>
                        <br />
                        <h3>Notes</h3>
                        <div className="detail-field">
                            {isEditing ? (
                                <>
                                    <textarea
                                        name="notes"
                                        className={`textarea ${form.getFieldError('notes') ? 'error' : ''}`}
                                        value={form.values.notes}
                                        onChange={form.handleChange}
                                        placeholder="Ajoutez vos notes détaillées..."
                                        rows={5}
                                    />
                                    {form.getFieldError('notes') && <div className="error">{form.getFieldError('notes')}</div>}
                                </>
                            ) : (
                                <div className="notes-viewer">
                                    {currentItem.notes ? (
                                        <div className="notes-text">{currentItem.notes}</div>
                                    ) : (
                                        <div className="notes-empty">
                                            <span className="muted">Aucune note</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="detail-section">
                        <div className="detail-field">
                            <label>Actions disponibles</label>
                            <div className="detail-actions">
                                <button onClick={() => setIsEditing(true)} className="btn flex-center">
                                    <PencilIcon className="icon-sm" />
                                    Modifier
                                </button>
                                <button onClick={() => setConfirmOpen(true)} className="btn danger flex-center">
                                    <TrashIcon className="icon-sm" />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog
                isOpen={confirmOpen}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onClose={() => setConfirmOpen(false)}
            />
        </>
    );
}

