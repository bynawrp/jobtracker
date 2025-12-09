import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ConfirmDialog({
    isOpen,
    title = 'Confirmation',
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    onConfirm,
    onClose,
    confirmVariant = 'danger'
}) {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 id="confirm-title">{title}</h3>
                    <button className="btn" aria-label="Fermer" onClick={onClose}>
                        <XMarkIcon className="icon-sm" />
                    </button>
                </div>
                <div className="modal-body">
                    {typeof message === 'string' ? <p className="m-0">{message}</p> : message}
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={onClose}>{cancelText}</button>
                    <button className={`btn ${confirmVariant}`} onClick={() => { onConfirm?.(); onClose?.(); }}>{confirmText}</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

