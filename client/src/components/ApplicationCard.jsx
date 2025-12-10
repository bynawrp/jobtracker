import { LinkIcon } from '@heroicons/react/24/outline';
import { parseStatus } from '../utils/formatters';
import ViewButton from './ViewButton';

export default function ApplicationCard({ item, onViewDetails, compact = false }) {
    if (compact) {
        return (
            <div className="card card-compact">
                <div className="card-row">
                    <strong>{item.title}</strong>
                </div>
                <div className="muted">{item.company}</div>
                <div className="row mt-2">
                    <ViewButton item={item} onViewDetails={onViewDetails} stopPropagation />
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-row">
                <strong>{item.title}</strong>
                <span className={`badge ${item.status}`}>{parseStatus(item.status)}</span>
            </div>
            <div className="muted">{item.company}</div>   
            <div className="truncate row">
                <LinkIcon className="icon-sm flex-shrink-0" />
                {item.link ? (
                    <a className="link" href={item.link} target="_blank" rel="noreferrer">{item.link}</a>
                ) : (
                    <span className="muted">-</span>
                )}
            </div>
            <div className="card-notes">
                {item.notes ? (
                    <p>{item.notes}</p>
                ) : (
                    <p className="muted">Aucune note</p>
                )}
            </div>
            <div className="row mt-2">
                <ViewButton item={item} onViewDetails={onViewDetails} />
            </div>
        </div>
    );
}

