import { Link, usePage } from '@inertiajs/react';
import { dashboard, tasksMine, notifications, settings } from '@/routes';
import { LayoutGrid, CheckSquare, Bell, Settings2 } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'My Tasks',
        href: tasksMine(),
        icon: CheckSquare,
    },
    {
        title: 'Notifications',
        href: notifications(),
        icon: Bell,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: settings(),
        icon: Settings2,
    },
];

export function AppSidebar() {
    const { url } = usePage();

    return (
        <Sidebar collapsible="icon" className="glass border-r border-border/10">
            <SidebarHeader className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-cyan-accent/10">
                            <Link href={dashboard()}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="p-4">
                <NavMain items={footerNavItems} />
                <div className="mt-4 p-4 glass rounded-xl text-[10px] text-text-muted">
                    <p>Elegant Dark v1.0</p>
                    <p className="mt-1">Senior Edition</p>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
