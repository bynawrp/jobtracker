import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PencilIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ApplicationsAPI } from '../utils/api';
import { parseStatus, formatDate, formatDateInput } from '../utils/formatters';
import { useForm } from '../hooks/useForm';
import ConfirmDialog from './ConfirmDialog';
import DetailField from './DetailField';
import { DEFAULT_STATUS } from '../utils/constants';

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
        status: currentItem.status || DEFAULT_STATUS,
        dateApplied: formatDateInput(currentItem.dateApplied) || '',
        link: currentItem.link || '',
        reminderDate: formatDateInput(currentItem.reminderDate) || '',
        notes: currentItem.notes || ''
    });

    const form = useForm(getInitialValues(), async (values) => {
        const updated = await ApplicationsAPI.update(currentItem._id, {
            ...values,
            dateApplied: values.dateApplied ? new Date(values.dateApplied) : undefined,
            reminderDate: values.reminderDate ? new Date(values.reminderDate) : undefined
        });
        setCurrentItem(updated);
        onUpdate?.(updated);
        setIsEditing(false);
    });

    useEffect(() => {
        if (!isEditing) {
            const initialValues = getInitialValues();
            form.reset(initialValues);
        }
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
                                    <button onClick={closeAndRestore} className="btn ghost" aria-label="Fermer les détails">
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
                                displayValue={currentItem.title}
                                form={form}
                            />
                            <DetailField
                                label="Entreprise"
                                name="company"
                                isEditing={isEditing}
                                value={form.values.company}
                                displayValue={currentItem.company}
                                form={form}
                            />
                            <DetailField
                                label="Statut"
                                name="status"
                                isEditing={isEditing}
                                value={form.values.status}
                                displayValue={parseStatus(currentItem.status)}
                                form={form}
                                type="status"
                                renderDisplay={() => (
                                    <div className="status-display">
                                        <span className={`status-dot ${currentItem.status}`}></span>
                                        <span className="status-text">{parseStatus(currentItem.status)}</span>
                                    </div>
                                )}
                            />
                            <DetailField
                                label="Date de candidature"
                                name="dateApplied"
                                isEditing={isEditing}
                                value={form.values.dateApplied}
                                displayValue={formatDate(currentItem.dateApplied)}
                                form={form}
                                type="date"
                            />
                            <DetailField
                                label="Lien"
                                name="link"
                                isEditing={isEditing}
                                value={form.values.link}
                                displayValue={currentItem.link || '-'}
                                form={form}
                                renderDisplay={() => (
                                    <div>{currentItem.link ? <a className="link" href={currentItem.link} target="_blank" rel="noreferrer">{currentItem.link}</a> : '-'}</div>
                                )}
                            />
                            <DetailField
                                label="Rappel"
                                name="reminderDate"
                                isEditing={isEditing}
                                value={form.values.reminderDate}
                                displayValue={formatDate(currentItem.reminderDate)}
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
                            displayValue={currentItem.notes || 'Aucune note'}
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
                                    {currentItem.notes ? (
                                        <div className="notes-text">{currentItem.notes}</div>
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
                                <button onClick={() => setIsEditing(true)} className="btn">
                                    <PencilIcon className="icon-sm" />
                                    <span className="btn-label">Modifier</span>
                                </button>
                                <button onClick={() => setConfirmOpen(true)} className="btn danger">
                                    <TrashIcon className="icon-sm" />
                                    <span className="btn-label">Supprimer</span>
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

