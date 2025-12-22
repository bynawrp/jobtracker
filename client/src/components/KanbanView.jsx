import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, rectIntersection, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { STATUS_OPTIONS } from '../config/constants';
import ApplicationCard from './ApplicationCard';

function KanbanColumn({ id, title, items, onViewDetails, isOver }) {
    const { setNodeRef } = useSortable({ id: `column-${id}` });
    const { setNodeRef: setDropRef, isOver: isDropOver } = useDroppable({
        id: `drop-zone-${id}`
    });
    
    return (
        <div 
            ref={setNodeRef} 
            className="kanban-column" 
            data-column-id={id}
            data-over={isOver ? 'true' : undefined}
        >
            <div className="kanban-column-header">
                <div className="kanban-header-content">
                    <span className={`kanban-status-indicator kanban-status-${id}`}></span>
                    <h3>{title}</h3>
                </div>
                <span className="kanban-count">{items.length}</span>
            </div>
            <SortableContext items={items.map(item => item._id)} strategy={verticalListSortingStrategy}>
                <div 
                    ref={setDropRef}
                    className="kanban-column-content" 
                    data-column-content={id}
                    data-drop-over={isDropOver ? 'true' : undefined}
                >
                    {items.map(item => (
                        <KanbanCard key={item._id} item={item} onViewDetails={onViewDetails} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

function KanbanCard({ item, onViewDetails }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item._id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="kanban-card">
            <div {...listeners} className="kanban-card-drag-handle" />
            <ApplicationCard item={item} onViewDetails={onViewDetails} compact={true} />
        </div>
    );
}

export default function KanbanView({ applications, onStatusChange, onViewDetails }) {
    const [activeId, setActiveId] = useState(null);
    const [overColumnId, setOverColumnId] = useState(null);
    const [localApplications, setLocalApplications] = useState(applications);

    useEffect(() => {
        setLocalApplications(applications);
    }, [applications]);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    );

    const groupedApplications = STATUS_OPTIONS.reduce((acc, option) => {
        acc[option.value] = localApplications.filter(app => app.status === option.value);
        return acc;
    }, {});

    const allItemIds = localApplications.map(app => app._id);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const getColumnStatusFromId = (id) => {
        if (!id || typeof id !== 'string') return null;
        if (id.startsWith('column-')) return id.replace('column-', '');
        if (id.startsWith('drop-zone-')) return id.replace('drop-zone-', '');
        if (allItemIds.includes(id)) {
            const status = localApplications.find(a => a._id === id)?.status || null;
            // console.log(status);
            return status;
        }
        return null;
    };

    const handleDragOver = (event) => {
        const { over } = event;
        if (!over) {
            setOverColumnId(null);
            return;
        }
        const status = getColumnStatusFromId(over.id);
        setOverColumnId(status);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setOverColumnId(null);

        if (!over) return;

        const activeId = active.id;
        const activeApp = localApplications.find(app => app._id === activeId);
        if (!activeApp) return;

        const targetStatus = getColumnStatusFromId(over.id);
        if (!targetStatus || !STATUS_OPTIONS.some(opt => opt.value === targetStatus)) return;

        const newStatus = targetStatus;
        // console.log(newStatus);
        const shouldReorder = targetStatus === activeApp.status && over.id !== activeId && allItemIds.includes(over.id);
        // console.log(shouldReorder);
        // console.log(activeApp.status, newStatus);

        if (newStatus !== activeApp.status) {
            onStatusChange(activeId, newStatus);
        } else if (shouldReorder) {
            handleReorder(activeId, over.id, activeApp.status);
        }
    };

    const handleReorder = (activeId, overId, status) => {
        const statusItems = localApplications.filter(app => app.status === status);
        const activeIndex = statusItems.findIndex(app => app._id === activeId);
        const overIndex = statusItems.findIndex(app => app._id === overId);

        if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return;

        const reorderedItems = [...statusItems];
        const [movedItem] = reorderedItems.splice(activeIndex, 1);
        reorderedItems.splice(overIndex, 0, movedItem);
        // console.log(activeIndex, overIndex);

        const otherItems = localApplications.filter(app => app.status !== status);
        const newApplications = [...otherItems, ...reorderedItems];
        // console.log(newApplications.length);
        
        setLocalApplications(newApplications);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="kanban-container">
                {STATUS_OPTIONS.map(option => (
                    <KanbanColumn
                        key={option.value}
                        id={option.value}
                        title={option.label}
                        items={groupedApplications[option.value] || []}
                        onViewDetails={onViewDetails}
                        isOver={overColumnId === option.value}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeId ? (
                    <div className="kanban-card-dragging">
                        <ApplicationCard 
                            item={localApplications.find(app => app._id === activeId)} 
                            onViewDetails={onViewDetails}
                            compact={true}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

