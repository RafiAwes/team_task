import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Column {
    id: string;
    title: string;
}

const columns: Column[] = [
    { id: 'pending', title: 'Pending' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' },
];

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    assignee: { name: string; avatar: string };
    comments: any[];
}

interface KanbanBoardProps {
    tasks: Task[];
}

export function KanbanBoard({ tasks: initialTasks }: KanbanBoardProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        setActiveTask(tasks.find((t) => t.id === active.id) || null);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);

        if (!activeTask) return;

        // If dropping over a task in a different column
        if (overTask && activeTask.status !== overTask.status) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                const overIndex = prev.findIndex((t) => t.id === overId);
                
                const updatedTasks = [...prev];
                updatedTasks[activeIndex] = { ...activeTask, status: overTask.status };
                return arrayMove(updatedTasks, activeIndex, overIndex);
            });
        } 
        // If dropping over a column container itself
        else if (!overTask && columns.some(c => c.id === overId)) {
            if (activeTask.status !== overId) {
                setTasks((prev) => {
                    const activeIndex = prev.findIndex((t) => t.id === activeId);
                    const updatedTasks = [...prev];
                    updatedTasks[activeIndex] = { ...activeTask, status: overId as string };
                    return updatedTasks;
                });
            }
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) {
            setActiveTask(null);
            return;
        }

        if (active.id !== over.id) {
            const activeIndex = tasks.findIndex((t) => t.id === active.id);
            const overIndex = tasks.findIndex((t) => t.id === over.id);
            
            if (tasks[activeIndex].status === tasks[overIndex]?.status) {
                setTasks((items) => arrayMove(items, activeIndex, overIndex));
            }
        }

        setActiveTask(null);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
                {columns.map((column) => (
                    <KanbanColumn 
                        key={column.id} 
                        column={column} 
                        tasks={tasks.filter(t => t.status === column.id)} 
                    />
                ))}
            </div>
            
            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: { opacity: '0.5' },
                    },
                }),
            }}>
                {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}

function KanbanColumn({ column, tasks }: { column: Column; tasks: Task[] }) {
    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="column-header">
                <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
                </div>
                <button className="text-text-muted hover:text-cyan-accent">+</button>
            </div>
            
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 flex flex-col gap-3">
                    {tasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="flex-1 border-2 border-dashed border-border/5 rounded-xl flex items-center justify-center text-text-muted text-[11px] italic min-h-[100px]">
                            No tasks here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

function SortableTaskCard({ task }: { task: Task }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} />
        </div>
    );
}

function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
    return (
        <div className={`glass glass-hover p-4 rounded-xl cursor-grab active:cursor-grabbing ${isOverlay ? 'shadow-2xl border-cyan-accent/50 scale-105' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="card-title">{task.title}</h3>
                <div className="ai-btn">AI</div>
            </div>
            <p className="card-desc mb-4">{task.description}</p>
            
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    <div className="avatar ring-2 ring-bg">
                        {task.assignee.avatar}
                    </div>
                </div>
                
                <div className="flex items-center gap-2 text-text-muted text-[10px]">
                    <span className="flex items-center gap-1">
                        💬 {task.comments?.length || 0}
                    </span>
                </div>
            </div>
        </div>
    );
}
