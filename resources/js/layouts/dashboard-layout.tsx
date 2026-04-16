import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { SearchProvider, useSearch } from '@/contexts/search-context';

interface Props {
    children: ReactNode;
    breadcrumbs?: { title: string; href: string }[];
}

export default function DashboardLayout({ children, breadcrumbs }: Props) {
    return (
        <SearchProvider>
            <DashboardLayoutContent breadcrumbs={breadcrumbs}>
                {children}
            </DashboardLayoutContent>
        </SearchProvider>
    );
}

function DashboardLayoutContent({ children, breadcrumbs }: Props) {
    const { url } = usePage();
    const { searchQuery, setSearchQuery } = useSearch();

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-bg">
                <AppSidebar />
                <SidebarInset className="flex flex-col bg-transparent lg:pl-0">
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-6 glass border-b border-border/10 sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="-ml-1 text-text-muted hover:text-cyan-accent" />
                            {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="relative group hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted group-focus-within:text-cyan-accent transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Search tasks..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 w-64 glass rounded-full pl-10 pr-4 text-xs font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-cyan-accent/30 transition-all"
                                />
                            </div>
                            <div className="avatar ring-2 ring-purple-accent/20">
                                AR
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-8 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
