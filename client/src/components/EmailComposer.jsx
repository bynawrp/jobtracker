import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeftIcon, DocumentTextIcon, ClipboardIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { emailTemplates, replacePlaceholders } from '../utils/emailTemplates';
import EmailEditor from './EmailEditor';
import { useToast } from '../hooks/useToast';
import { formatDate } from '../utils/formatters';

export default function EmailComposer({ application, onBack }) {
    const { user } = useAuth();
    const toast = useToast();
    
    const [selectedTemplate, setSelectedTemplate] = useState('motivation');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [recipient, setRecipient] = useState('');

    useEffect(() => {
        if (application && user) {
            const template = emailTemplates[selectedTemplate];
            const data = {
                title: application.title || '',
                company: application.company || '',
                dateApplied: application.dateApplied,
                link: application.link || '',
                userFirstName: user.firstName || '',
                userLastName: user.lastName || '',
                phoneNumber: user.phone || ''
            };
            
            setSubject(replacePlaceholders(template.subject, data));
            setBody(replacePlaceholders(template.body, data));
        }
    }, [application, selectedTemplate, user]);

    const handleTemplateChange = (templateKey) => {
        setSelectedTemplate(templateKey);
    };

    const handleCopyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copié dans le presse-papier !');
        } catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
    };

    return (
        <div className="detail-section composer-detail-section">
            <div className="detail-section-header">
                <h3 id="application-details-title">
                    <EnvelopeIcon className="icon-sm" />
                    Créer un email
                </h3>
                <div className="header-actions">
                    <button 
                        onClick={onBack} 
                        className="btn"
                    >
                        <ArrowLeftIcon className="icon-sm" />
                        <span className="btn-label">Retour</span>
                    </button>
                </div>
            </div>

            <div className="composer-email-content-modal">
                <div className="composer-email-sidebar-modal">
                    {application && (
                        <div className="composer-section">
                            <h3>Informations candidature</h3>
                            <div className="application-info">
                                <p><strong>Poste:</strong> {application.title || 'Non spécifié'}</p>
                                <p><strong>Entreprise:</strong> {application.company || 'Non spécifiée'}</p>
                                {application.dateApplied && (
                                    <p><strong>Date de candidature:</strong> {formatDate(application.dateApplied)}</p>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="composer-section">
                        <h3>Template d'email</h3>
                        <div className="template-list">
                            {Object.entries(emailTemplates).map(([key, template]) => (
                                <button
                                    key={key}
                                    className={`template-btn ${selectedTemplate === key ? 'active' : ''}`}
                                    onClick={() => handleTemplateChange(key)}
                                >
                                    <DocumentTextIcon className="icon-sm" />
                                    <span>{template.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="composer-section">
                        <h3>Actions</h3>
                        <div className="composer-email-actions-sidebar">
                            <button
                                className="btn primary"
                                onClick={() => {
                                    const mailtoLink = `mailto:${recipient || 'email@exemple.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                    window.location.href = mailtoLink;
                                }}
                                disabled={!recipient || !subject || !body}
                            >
                                <EnvelopeIcon className="icon-sm" />
                                <span>Ouvrir email</span>
                            </button>
                            <button
                                className="btn"
                                onClick={() => {
                                    setSubject('');
                                    setBody('');
                                    setRecipient('');
                                }}
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>

                <div className="composer-email-main-modal">
                    <div className="composer-section">
                        <div className="composer-form-group">
                            <label htmlFor="recipient">Destinataire</label>
                            <input
                                type="email"
                                id="recipient"
                                className="composer-form-input"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="email@exemple.com"
                            />
                        </div>
                    </div>

                    <div className="composer-section">
                        <div className="composer-form-group">
                            <div className="composer-form-group-header">
                                <label htmlFor="subject">Objet</label>
                                <button
                                    type="button"
                                    className="composer-btn-icon"
                                    onClick={() => handleCopyToClipboard(subject)}
                                    title="Copier l'objet"
                                >
                                    <ClipboardIcon className="icon-sm" />
                                </button>
                            </div>
                            <input
                                type="text"
                                id="subject"
                                className="composer-form-input"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Objet de l'email"
                            />
                        </div>
                    </div>

                    <div className="composer-section composer-section-flex">
                        <div className="composer-form-group composer-form-group-flex">
                            <div className="composer-form-group-header">
                                <label htmlFor="body">Message</label>
                                <button
                                    type="button"
                                    className="composer-btn-icon"
                                    onClick={() => handleCopyToClipboard(body)}
                                    title="Copier le message"
                                >
                                    <ClipboardIcon className="icon-sm" />
                                </button>
                            </div>
                            <div className="composer-editor-wrapper">
                                <EmailEditor
                                    value={body}
                                    onChange={setBody}
                                    placeholder="Saisissez votre message..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

