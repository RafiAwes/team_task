import { Head } from '@inertiajs/react';

import DashboardLayout from '@/layouts/dashboard-layout';

export default function Settings() {
    return (
        <DashboardLayout 
            breadcrumbs={[{ title: 'Settings', href: '/settings' }]}
        >
            <Head title="Settings" />
            
            <div className="max-w-2xl mx-auto flex flex-col gap-8">
                <header>
                    <h1 className="text-2xl font-bold text-text-main tracking-tight">Project Settings</h1>
                    <p className="text-text-muted text-sm mt-1">Configure your workspace and preferences.</p>
                </header>

                <div className="flex flex-col gap-6">
                    <div className="glass p-6 rounded-2xl flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-cyan-accent">Theme Preferences</h2>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border/10">
                            <div>
                                <p className="text-sm font-medium text-text-main">Elegant Dark Mode</p>
                                <p className="text-xs text-text-muted">High-fidelity futuristic aesthetic active.</p>
                            </div>
                            <div className="w-12 h-6 bg-cyan-accent/20 rounded-full flex items-center px-1">
                                <div className="w-4 h-4 bg-cyan-accent rounded-full ml-auto" />
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-2xl flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-purple-accent">Notification Settings</h2>
                        <p className="text-sm text-text-muted">Manage how you receive updates on your tasks and comments.</p>
                        <button className="bg-white/5 hover:bg-white/10 text-text-main px-4 py-2 rounded-xl border border-border transition-all w-full text-sm font-medium">Manage Notifications</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
