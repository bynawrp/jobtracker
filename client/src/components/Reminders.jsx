import { useState } from 'react';
import { BellIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { formatDate, calculateDateDiff } from '../utils/formatters';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Reminders({ reminders, onViewDetails }) {
    const [isExpanded, setIsExpanded] = useLocalStorage('remindersExpanded', true);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="reminders-notification">
            <div 
                className="reminders-notification-header"
                onClick={handleToggle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggle();
                    }
                }}
                aria-label={isExpanded ? 'Masquer les rappels' : 'Afficher les rappels'}
                aria-expanded={isExpanded}
                title={isExpanded ? 'Masquer les rappels' : 'Afficher les rappels'}
            >
                <BellIcon className="icon-sm" />
                <h3>Rappels ({reminders.length})</h3>
                {isExpanded ? (
                    <ChevronUpIcon className="icon-sm reminders-toggle-icon" />
                ) : (
                    <ChevronDownIcon className="icon-sm reminders-toggle-icon" />
                )}
            </div>
            <div className={`reminders-notification-list ${isExpanded ? 'expanded' : 'collapsed'}`}>
                {reminders.map((reminder) => {
                    const dateDiff = calculateDateDiff(reminder.reminderDate);
                    
                    let indicatorText = '';
                    let indicatorClass = '';
                    
                    if (dateDiff.isPast) {
                        indicatorText = `Il y a ${Math.abs(dateDiff.days)} jour${Math.abs(dateDiff.days) > 1 ? 's' : ''}`;
                        indicatorClass = 'past';
                    } else if (dateDiff.isToday) {
                        indicatorText = 'Aujourd\'hui';
                        indicatorClass = 'today';
                    } else if (dateDiff.isTomorrow) {
                        indicatorText = 'Demain';
                        indicatorClass = 'tomorrow';
                    } else {
                        indicatorText = `Dans ${dateDiff.days} jour${dateDiff.days > 1 ? 's' : ''}`;
                        indicatorClass = 'upcoming';
                    }

                    return (
                        <div 
                            key={reminder._id} 
                            className="reminder-notification-item"
                            onClick={() => onViewDetails?.(reminder)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onViewDetails?.(reminder);
                                }
                            }}
                            aria-label={`Voir les détails de ${reminder.title || 'la candidature'}`}
                            title={`Voir les détails de ${reminder.title || 'la candidature'}`}
                        >
                            <div className="reminder-notification-content">
                                <strong>{reminder.title}</strong>
                                <span className="muted">{reminder.company}</span>
                                <span className="reminder-date">Rappel : {formatDate(reminder.reminderDate)}</span>
                            </div>
                            <div className={`reminder-indicator ${indicatorClass}`}>
                                {indicatorText}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
