import { useState, useEffect, useRef } from 'react';
import { ApplicationsAPI } from '../utils/api';
import ConfirmDialog from './ConfirmDialog';
import ApplicationDetails from './ApplicationDetails';
import EmailComposer from './EmailComposer';

export default function ApplicationModal({ item, onUpdate, onClose, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showEmailComposer, setShowEmailComposer] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(item);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

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

    const handleUpdate = (updated) => {
        setCurrentItem(updated);
        onUpdate?.(updated);
    };

    async function handleDeleteConfirm() {
        try {
            await ApplicationsAPI.remove(currentItem._id);
            onDelete?.(currentItem);
            onClose();
        } catch (e) {
            console.error('Erreur lors de la suppression:', e);
        }
    }

    return (
        <>
            <div className="application-detail" role="dialog" aria-modal="true" aria-labelledby="application-details-title" onClick={closeAndRestore}>
                <div className="detail-content" onClick={(e) => e.stopPropagation()}>
                    {!showEmailComposer ? (
                        <ApplicationDetails
                            item={currentItem}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            onUpdate={handleUpdate}
                            onClose={closeAndRestore}
                            onDelete={onDelete}
                            onOpenEmailComposer={() => setShowEmailComposer(true)}
                            onConfirmDelete={() => setConfirmOpen(true)}
                        />
                    ) : (
                        <EmailComposer
                            application={currentItem}
                            onBack={() => setShowEmailComposer(false)}
                        />
                    )}
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

