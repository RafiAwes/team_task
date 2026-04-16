import React from 'react';
import { useSearch } from '@/contexts/search-context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface FilterPopoverProps {
    users: { id: number; name: string }[];
}

export function FilterPopover({ users }: FilterPopoverProps) {
    const { filters, togglePriority, toggleAssignee, clearFilters, isFiltered } = useSearch();

    const priorities = [
        { id: 'urgent', label: 'Urgent', color: 'text-rose-500' },
        { id: 'important', label: 'Important', color: 'text-cyan-400' },
        { id: 'normal', label: 'Normal', color: 'text-slate-400' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={`btn-secondary text-sm flex items-center gap-2 relative ${isFiltered ? 'border-cyan-accent/50 text-cyan-accent' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                    Filters
                    {isFiltered && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-accent rounded-full border-2 border-bg shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass border-border/20 p-2" align="end">
                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-text-muted px-2 py-1.5">
                    Filter by Priority
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                    {priorities.map((p) => (
                        <DropdownMenuCheckboxItem
                            key={p.id}
                            checked={filters.priorities.includes(p.id)}
                            onCheckedChange={() => togglePriority(p.id)}
                            className="text-sm focus:bg-white/5 cursor-pointer"
                        >
                            <span className={p.color}>{p.label}</span>
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator className="bg-white/5 my-1" />
                
                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-text-muted px-2 py-1.5">
                    Filter by Assignee
                </DropdownMenuLabel>
                <DropdownMenuGroup className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    {users.map((user) => (
                        <DropdownMenuCheckboxItem
                            key={user.id}
                            checked={filters.assignees.includes(user.id)}
                            onCheckedChange={() => toggleAssignee(user.id)}
                            className="text-sm focus:bg-white/5 cursor-pointer"
                        >
                            {user.name}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>

                {isFiltered && (
                    <>
                        <DropdownMenuSeparator className="bg-white/5 my-1" />
                        <button 
                            onClick={(e) => { e.preventDefault(); clearFilters(); }}
                            className="w-full text-left px-2 py-1.5 text-xs font-bold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors uppercase tracking-wider"
                        >
                            Clear All Filters
                        </button>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
