import { useState } from 'react';
import { Head } from '@inertiajs/react';

import DashboardLayout from '@/layouts/dashboard-layout';
import { KanbanBoard, Task } from '@/components/kanban/kanban-board';
import { TaskModal } from '@/components/kanban/task-modal';

interface Props {
    tasks: { data: Task[] }; // From TaskResource::collection
    users: { id: number; name: string; avatar: string; avatar_url?: string }[];
}

export default function Dashboard({ tasks: initialTasks, users }: Props) {
    const tasks = initialTasks.data;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>();

    const handleCreateTask = () => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    // Removed handleSaveTask as Inertia's useForm will handle the refresh

    return (
        <DashboardLayout 
            breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}
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
                    initialTask={editingTask}
                    users={users}
                />
            </div>
        </DashboardLayout>
    );
}
