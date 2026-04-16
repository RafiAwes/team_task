import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: any) => void;
    initialTask?: any;
    users: { name: string; avatar: string }[];
}

export function TaskModal({ isOpen, onClose, onSave, initialTask, users }: TaskModalProps) {
    const [title, setTitle] = useState(initialTask?.title || '');
    const [description, setDescription] = useState(initialTask?.description || '');
    const [status, setStatus] = useState(initialTask?.status || 'pending');
    const [assigneeName, setAssigneeName] = useState(initialTask?.assignee?.name || '');

    const handleSave = () => {
        const assignee = users.find(u => u.name === assigneeName) || users[0];
        onSave({
            id: initialTask?.id || Math.random().toString(36).substr(2, 9),
            title,
            description,
            status,
            assignee,
            comments: initialTask?.comments || [],
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass border-border/20 text-text-main sm:max-w-[425px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-accent/5 to-cyan-accent/5 pointer-events-none" />
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        {initialTask ? 'Edit Task' : 'Create New Task'}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-6 py-4 relative z-10">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-text-muted">Title</Label>
                        <Input 
                            id="title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="glass focus-visible:ring-cyan-accent/30 border-border/10"
                            placeholder="What needs to be done?"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-text-muted">Description</Label>
                        <textarea 
                            id="description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-border/10 bg-surface px-3 py-2 text-sm glass focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Add more details..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-text-muted">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="glass border-border/10">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="glass border-border/20">
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-text-muted">Assignee</Label>
                            <Select value={assigneeName} onValueChange={setAssigneeName}>
                                <SelectTrigger className="glass border-border/10">
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent className="glass border-border/20">
                                    {users.map((u) => (
                                        <SelectItem key={u.name} value={u.name}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter className="relative z-10 mt-4">
                    <button onClick={onClose} className="btn-secondary h-10">Cancel</button>
                    <button onClick={handleSave} className="btn-create h-10 px-8">Save Task</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
