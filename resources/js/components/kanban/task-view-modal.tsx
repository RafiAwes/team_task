import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { Task } from './kanban-board';

interface TaskViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task;
}

export function TaskViewModal({ isOpen, onClose, task }: TaskViewModalProps) {
    if (!task) return null;

    const priorityColors = {
        urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
        important: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]',
        normal: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };

    const statusColors = {
        pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass border-border/20 text-text-main sm:max-w-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-accent/5 to-cyan-accent/5 pointer-events-none" />
                
                <DialogHeader className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusColors[task.status as keyof typeof statusColors]}`}>
                            {task.status.replace('-', ' ')}
                        </div>
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-text-main">
                        {task.title}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-6 py-4 relative z-10">
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Description</h4>
                        <div className="text-sm text-text-main/90 bg-white/5 p-4 rounded-xl border border-white/5 min-h-[100px] whitespace-pre-wrap leading-relaxed">
                            {task.description || <span className="italic text-text-muted">No description provided.</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Assignee</h4>
                            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-cyan-accent/10 flex items-center justify-center text-cyan-accent font-bold text-xs ring-2 ring-cyan-accent/10">
                                    {task.assignee?.avatar || '??'}
                                </div>
                                <span className="text-sm font-medium text-text-main">{task.assignee?.name || 'Unassigned'}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Due Date</h4>
                            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5 h-[42px]">
                                <span className="text-sm font-medium text-text-main px-2">
                                    {task.due_date ? new Date(task.due_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'No due date'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/10">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                             Activity & Comments
                            <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-[10px]">{task.comments?.length || 0}</span>
                        </h4>
                        
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            {task.comments && task.comments.length > 0 ? (
                                task.comments.map((comment, index) => (
                                    <div key={index} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/5 group/modal-comment relative">
                                        <div className="w-8 h-8 rounded-full bg-cyan-accent/10 flex items-center justify-center text-cyan-accent font-bold text-[10px] shrink-0 font-display">
                                            {comment.avatar}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-text-main">{comment.user}</span>
                                                <span className="text-[9px] text-text-muted uppercase tracking-wider">{comment.created_at}</span>
                                            </div>
                                            <p className="text-xs text-text-main/80 leading-relaxed font-display">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-text-muted italic py-4 text-center">No comments yet. Start the conversation!</div>
                            )}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <input 
                                type="text" 
                                placeholder="Add to the discussion..."
                                className="flex-1 glass text-xs px-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-accent/30 border-border/10 placeholder:text-text-muted/50"
                                onKeyDown={(e) => {
                                    e.stopPropagation(); // BUG FIX: Prevent dnd-kit spacebar conflict
                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        router.post(`/tasks/${task.id}/comments`, {
                                            content: e.currentTarget.value
                                        }, {
                                            preserveScroll: true,
                                            onSuccess: () => (e.currentTarget.value = ''),
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="relative z-10 mt-6 border-t border-border/10 pt-4">
                    <button onClick={onClose} className="btn-create h-10 px-8">Close</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
