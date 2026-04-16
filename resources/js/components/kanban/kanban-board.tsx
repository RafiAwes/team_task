import { ReactNode } from 'react';

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

export function KanbanBoard({ tasks }: KanbanBoardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
            {columns.map((column) => (
                <KanbanColumn 
                    key={column.id} 
                    column={column} 
                    tasks={tasks.filter(t => t.status === column.id)} 
                />
            ))}
        </div>
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
            
            <div className="flex-1 flex flex-col gap-3">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <div className="flex-1 border-2 border-dashed border-border/5 rounded-xl flex items-center justify-center text-text-muted text-[11px] italic">
                        No tasks here
                    </div>
                )}
            </div>
        </div>
    );
}

function TaskCard({ task }: { task: Task }) {
    return (
        <div className="glass glass-hover p-4 rounded-xl cursor-grab active:cursor-grabbing">
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
