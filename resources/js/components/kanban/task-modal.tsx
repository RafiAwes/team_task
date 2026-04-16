declare function route(name: string, params?: any): string;
import { useForm } from '@inertiajs/react';
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
    initialTask?: any;
    users: { id: number; name: string; avatar: string; avatar_url?: string }[];
}

export function TaskModal({ isOpen, onClose, initialTask, users }: TaskModalProps) {
    const { data, setData, post, put, processing, reset, errors } = useForm({
        title: initialTask?.title || '',
        description: initialTask?.description || '',
        status: initialTask?.status || 'pending',
        priority: initialTask?.priority || 'normal',
        assignee_id: initialTask?.assignee?.id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (initialTask) {
            put(route('tasks.update', initialTask.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass border-border/20 text-text-main sm:max-w-[425px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-accent/5 to-cyan-accent/5 pointer-events-none" />
                <form onSubmit={handleSubmit}>
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
                                value={data.title} 
                                onChange={(e) => setData('title', e.target.value)} 
                                className="glass focus-visible:ring-cyan-accent/30 border-border/10"
                                placeholder="What needs to be done?"
                            />
                            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-text-muted">Description</Label>
                            <textarea 
                                id="description" 
                                value={data.description} 
                                onChange={(e) => setData('description', e.target.value)}
                                className="flex min-h-[80px] w-full rounded-md border border-border/10 bg-surface px-3 py-2 text-sm glass focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Add more details..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-text-muted">Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
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
                                <Select value={data.assignee_id?.toString()} onValueChange={(val) => setData('assignee_id', val)}>
                                    <SelectTrigger className="glass border-border/10">
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-border/20">
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-text-muted">Priority</Label>
                            <Select value={data.priority} onValueChange={(val: any) => setData('priority', val)}>
                                <SelectTrigger className="glass border-border/10">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="glass border-border/20">
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="important">Important</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="relative z-10 mt-4">
                        <button type="button" onClick={onClose} className="btn-secondary h-10">Cancel</button>
                        <button type="submit" disabled={processing} className="btn-create h-10 px-8">
                            {processing ? 'Saving...' : 'Save Task'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
