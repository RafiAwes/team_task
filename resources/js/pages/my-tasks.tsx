import { Head } from '@inertiajs/react';
import { useState } from 'react';

import DashboardLayout from '@/layouts/dashboard-layout';
import { KanbanBoard, Task } from '@/components/kanban/kanban-board';
import { TaskModal } from '@/components/kanban/task-modal';
import { TaskViewModal } from '@/components/kanban/task-view-modal';
import { FilterPopover } from '@/components/kanban/filter-popover';

interface MyTasksProps {
    tasks: { data: Task[] };
    users: any[];
}

export default function MyTasks({ tasks: initialTasks, users }: MyTasksProps) {
    const tasks = initialTasks.data;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>();
    const [viewingTask, setViewingTask] = useState<Task | undefined>();

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
            breadcrumbs={[{ title: 'My Tasks', href: '/tasks' }]}
        >
            <Head title="My Tasks" />
            
            <div className="flex flex-col gap-8 h-full">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main tracking-tight">My Assigned Tasks</h1>
                        <p className="text-text-muted text-sm mt-1">Focus on what matters to you today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <FilterPopover users={users} />
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
