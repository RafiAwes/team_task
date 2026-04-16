import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { KanbanBoard, Task } from '@/components/kanban/kanban-board';

interface Props {
    tasks: Task[];
}

export default function Dashboard({ tasks }: Props) {
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
                        <button className="btn-create">+ Create Task</button>
                    </div>
                </header>

                <KanbanBoard tasks={tasks} />
            </div>
        </DashboardLayout>
    );
}
