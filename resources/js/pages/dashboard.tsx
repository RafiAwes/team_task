import { useState } from 'react';
import { Head } from '@inertiajs/react';

import DashboardLayout from '@/layouts/dashboard-layout';
import { KanbanBoard, Task } from '@/components/kanban/kanban-board';
import { TaskModal } from '@/components/kanban/task-modal';
import { TaskViewModal } from '@/components/kanban/task-view-modal';
import { FilterPopover } from '@/components/kanban/filter-popover';

interface Props {
    tasks: { data: Task[] }; // From TaskResource::collection
    users: { id: number; name: string; avatar: string; avatar_url?: string }[];
}

export default function Dashboard({ tasks: initialTasks, users }: Props) {
    const tasks = initialTasks.data;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>();
    const [viewingTask, setViewingTask] = useState<Task | undefined>();

    const handleCreateTask = () => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleViewTask = (task: Task) => {
        setViewingTask(task);
        setIsViewModalOpen(true);
    };

    return (
        <DashboardLayout 
            breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}
        >
            <Head title="Dashboard" />
            
            <div className="flex flex-col gap-8 h-fit">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main tracking-tight">Team Overview</h1>
                        <p className="text-text-muted text-sm mt-1">Manage and track your team's progress in real-time.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <FilterPopover users={users} />
                        <button onClick={handleCreateTask} className="btn-create">+ Create Task</button>
                    </div>
                </header>

                <KanbanBoard tasks={tasks} onView={handleViewTask} onEdit={handleEditTask} />

                <TaskModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialTask={editingTask}
                    users={users}
                />

                <TaskViewModal 
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    task={viewingTask}
                />
            </div>
        </DashboardLayout>
    );
}
