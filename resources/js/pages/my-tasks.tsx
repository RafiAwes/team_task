import { Head } from '@inertiajs/react';

import DashboardLayout from '@/layouts/dashboard-layout';
import { KanbanBoard, Task } from '@/components/kanban/kanban-board';

interface MyTasksProps {
    tasks: Task[];
}

export default function MyTasks({ tasks }: MyTasksProps) {
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
                </header>

                <KanbanBoard tasks={tasks} />
            </div>
        </DashboardLayout>
    );
}
