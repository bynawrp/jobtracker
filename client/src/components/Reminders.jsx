import { useState } from 'react';
import { BellIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../utils/formatters';

export default function Reminders({ reminders, onViewDetails }) {
    const [isExpanded, setIsExpanded] = useState(() => {
        const savedExpanded = localStorage.getItem('remindersExpanded');
        return savedExpanded !== null ? savedExpanded === 'true' : true;
    });

    const handleToggle = () => {
        const newExpanded = !isExpanded;
        setIsExpanded(newExpanded);
        localStorage.setItem('remindersExpanded', newExpanded);
    };

    return (
        <div className="reminders-notification">
            <div 
                className="reminders-notification-header"
                onClick={handleToggle}
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
                    const reminderDate = new Date(reminder.reminderDate);
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    const reminderDateOnly = new Date(reminderDate);
                    reminderDateOnly.setHours(0, 0, 0, 0);
                    
                    const daysDiff = Math.floor((reminderDateOnly - now) / (1000 * 60 * 60 * 24));
                    const isPast = daysDiff < 0;
                    const isToday = daysDiff === 0;
                    const isTomorrow = daysDiff === 1;

                    let indicatorText = '';
                    let indicatorClass = '';
                    
                    if (isPast) {
                        indicatorText = `Il y a ${Math.abs(daysDiff)} jour${Math.abs(daysDiff) > 1 ? 's' : ''}`;
                        indicatorClass = 'past';
                    } else if (isToday) {
                        indicatorText = 'Aujourd\'hui';
                        indicatorClass = 'today';
                    } else if (isTomorrow) {
                        indicatorText = 'Demain';
                        indicatorClass = 'tomorrow';
                    } else {
                        indicatorText = `Dans ${daysDiff} jour${daysDiff > 1 ? 's' : ''}`;
                        indicatorClass = 'upcoming';
                    }

                    return (
                        <div 
                            key={reminder._id} 
                            className="reminder-notification-item"
                            onClick={() => onViewDetails?.(reminder)}
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
