import { useState, useEffect } from 'react';
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
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { usePage } from '@inertiajs/react';
import { SearchProvider, useSearch } from '@/contexts/search-context';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';

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
    id: string | number;
    title: string;
    description: string;
    status: string;
    priority: 'urgent' | 'important' | 'normal';
    assignee?: { id: number; name: string; avatar: string; avatar_url?: string };
    comments: any[];
}

interface KanbanBoardProps {
    tasks: Task[];
    onEdit?: (task: Task) => void;
}

export function KanbanBoard({ tasks: initialTasks, onEdit }: KanbanBoardProps) {
    const { searchQuery } = useSearch();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    // ... rest of the component
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

        const activeId = active.id;
        const overId = over.id;

        const activeTaskInList = tasks.find((t) => t.id === activeId);
        
        if (activeId !== overId) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);
            
            // Determine the new status
            const overTask = tasks.find((t) => t.id === overId);
            const newStatus = overTask ? overTask.status : (columns.find(c => c.id === overId)?.id as string);

            if (activeTaskInList && newStatus && activeTaskInList.status !== newStatus) {
                // Persist to backend
                router.put(`/tasks/${activeId}`, {
                    status: newStatus
                }, {
                    preserveScroll: true,
                });
            }

            if (activeIndex > -1 && overIndex > -1 && tasks[activeIndex].status === tasks[overIndex]?.status) {
                setTasks((items) => arrayMove(items, activeIndex, overIndex));
            }
        }

        setActiveTask(null);
    }

    const filteredTasks = tasks.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        tasks={filteredTasks.filter(t => t.status === column.id)} 
                        onEdit={onEdit}
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

function KanbanColumn({ column, tasks, onEdit }: { column: Column; tasks: Task[]; onEdit?: (task: Task) => void }) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    return (
        <div 
            ref={setNodeRef}
            className="flex flex-col gap-4 h-full min-h-[500px] p-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] transition-colors"
        >
            <div className="column-header">
                <div className="flex items-center gap-2">
                    <span className="text-text-main font-bold">{column.title}</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-text-muted">{tasks.length}</span>
                </div>
                <button className="text-text-muted hover:text-cyan-accent transition-colors">+</button>
            </div>
            
            <SortableContext id={column.id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 flex flex-col gap-3">
                    {tasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} onEdit={onEdit} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="flex-1 border-2 border-dashed border-white/[0.03] rounded-xl flex items-center justify-center text-text-muted text-[11px] italic">
                            No tasks here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

function SortableTaskCard({ task, onEdit }: { task: Task; onEdit?: (task: Task) => void }) {
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
            <TaskCard task={task} onEdit={onEdit} />
        </div>
    );
}

function TaskCard({ task, isOverlay, onEdit }: { task: Task; isOverlay?: boolean; onEdit?: (task: Task) => void }) {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const priorityColors = {
        urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
        important: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]',
        normal: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };

    return (
        <div className={`glass glass-hover p-4 rounded-xl cursor-grab active:cursor-grabbing transition-all ${isOverlay ? 'shadow-2xl border-cyan-accent/50 scale-105' : ''}`}>
            <div className="flex justify-between items-start gap-3 mb-2 ">
                <div className="flex flex-col gap-2 flex-1 pointer-events-none">
                    <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border w-fit ${priorityColors[task.priority || 'normal']}`}>
                        {task.priority || 'normal'}
                    </div>
                    <h3 className="card-title">{task.title}</h3>
                </div>
            </div>
            <p className="card-desc mb-4 pointer-events-none">{task.description}</p>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {task.assignee && (
                            <div className="avatar ring-2 ring-bg">
                                {task.assignee.avatar}
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
                        className="text-[10px] font-bold text-text-muted hover:text-white transition-colors uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md border border-white/5 active:scale-95"
                    >
                        Details
                    </button>
                </div>
                
                <div className="flex items-center gap-2 text-text-muted text-[10px]">
                    <button 
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
                        className="flex items-center gap-1.5 hover:text-cyan-accent transition-colors p-1 rounded-md hover:bg-white/5"
                    >
                        <span className="text-base leading-none">💬</span> 
                        <span className="font-medium">{task.comments?.length || 0}</span>
                    </button>
                </div>
            </div>

            {showComments && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 pt-4 border-t border-border/10 overflow-hidden"
                >
                    <div className="flex flex-col gap-2.5 mb-4 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                        {task.comments && task.comments.length > 0 ? (
                            task.comments.map((c, i) => (
                                <div key={i} className="text-[11px] text-text-muted bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05]">
                                    <span className="font-bold text-cyan-accent/80 mr-1.5">{c.user}:</span> 
                                    <span className="text-text-main/90">{c.text}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-[10px] text-text-muted italic px-2">No comments yet...</div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newComment}
                            onPointerDown={(e) => e.stopPropagation()}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 glass text-[11px] px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-accent/30 border-border/10 placeholder:text-text-muted/50"
                        />
                        <button 
                            onPointerDown={(e) => e.stopPropagation()}
                            className="text-[10px] font-bold px-3 py-1.5 bg-cyan-accent/10 text-cyan-accent rounded-lg hover:bg-cyan-accent/20 border border-cyan-accent/20 transition-colors uppercase tracking-wider"
                            onClick={(e) => { e.stopPropagation(); setNewComment(''); }}
                        >
                            Post
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
