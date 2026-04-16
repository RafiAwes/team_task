import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardLayout from '@/layouts/dashboard-layout';

interface Notification {
    id: number;
    type: string;
    user: string;
    task: string;
    time: string;
}

interface NotificationsProps {
    notifications: Notification[];
}

export default function Notifications({ notifications }: NotificationsProps) {
    return (
        <DashboardLayout 
            breadcrumbs={[{ title: 'Notifications', href: '/notifications' }]}
        >
            <Head title="Notifications" />
            
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <header>
                    <h1 className="text-2xl font-bold text-text-main tracking-tight">Activity Feed</h1>
                    <p className="text-text-muted text-sm mt-1">Stay updated with the latest comments and task updates.</p>
                </header>

                <div className="flex flex-col gap-4">
                    <AnimatePresence>
                        {notifications.map((n, i) => (
                            <motion.div 
                                key={n.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-4 rounded-2xl flex items-start gap-4 hover:border-cyan-accent/30 transition-all border border-transparent"
                            >
                                <div className="w-10 h-10 rounded-full bg-cyan-accent/10 flex items-center justify-center text-cyan-accent font-bold ring-2 ring-cyan-accent/10 shrink-0">
                                    {n.user.split(' ').map(s => s[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-text-main">
                                        <span className="font-bold text-cyan-accent">{n.user}</span> 
                                        {n.type === 'created' ? ' created a new task ' : 
                                         n.type === 'updated' ? ' updated the task ' : 
                                         n.type === 'deleted' ? ' deleted the task ' : 
                                         n.type === 'comment' ? ' commented on ' : ' updated '}
                                        <span className="font-semibold text-purple-accent">"{n.task}"</span>
                                    </p>
                                    <p className="text-[11px] text-text-muted mt-1">{n.time}</p>
                                </div>
                                <div className="text-[10px] uppercase tracking-wider font-bold text-cyan-accent/50">New</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {notifications.length === 0 && (
                        <div className="glass p-12 rounded-2xl text-center text-text-muted italic">
                            No recent activity found.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
