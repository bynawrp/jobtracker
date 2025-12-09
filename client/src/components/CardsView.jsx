import ApplicationCard from './ApplicationCard';

export default function CardsView({ applications, onViewDetails }) {
    return (
        <div className="cards">
            {applications.map(app => (
                <ApplicationCard 
                    key={app._id} 
                    item={app} 
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
}

