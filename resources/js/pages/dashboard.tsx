import { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { KanbanBoard, Task } from '@/components/kanban/kanban-board';
import { TaskModal } from '@/components/kanban/task-modal';

interface Props {
    tasks: Task[];
    users: { name: string; avatar: string }[];
}

export default function Dashboard({ tasks: initialTasks, users }: Props) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>();

    const handleCreateTask = () => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const handleSaveTask = (task: Task) => {
        setTasks((prev) => {
            const index = prev.findIndex((t) => t.id === task.id);
            if (index > -1) {
                const updated = [...prev];
                updated[index] = task;
                return updated;
            }
            return [...prev, task];
        });
    };

    return (
        <DashboardLayout 
            breadcrumbs={[{ title: 'Dashboard', href: route('dashboard') }]}
        >
            <Head title="Dashboard" />
            
            <div className="flex flex-col gap-8 h-full">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main tracking-tight">Team Overview</h1>
                        <p className="text-text-muted text-sm mt-1">Manage and track your team's progress in real-time.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="btn-secondary text-sm">Filters</button>
                        <button onClick={handleCreateTask} className="btn-create">+ Create Task</button>
                    </div>
                </header>

                <KanbanBoard tasks={tasks} />

                <TaskModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTask}
                    initialTask={editingTask}
                    users={users}
                />
            </div>
        </DashboardLayout>
    );
}
