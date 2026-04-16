import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, CheckSquare, Bell, Settings2 } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function AppSidebar() {
    const { url } = usePage();

    const navItems = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { title: 'My Tasks', href: '/tasks', icon: CheckSquare },
        { title: 'Notifications', href: '/notifications', icon: Bell },
        { title: 'Settings', href: '/settings', icon: Settings2 },
    ];

    return (
        <Sidebar collapsible="icon" className="bg-slate-900 border-r border-slate-800">
            <SidebarHeader className="p-4 border-b border-slate-800/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/5 transition-all">
                            <Link href={navItems[0].href}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                <SidebarMenu className="gap-2">
                    {navItems.map((item) => {
                        const isActive = url === item.href || url.startsWith(`${item.href}/`);
                        
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    className={`
                                        transition-all duration-300 group
                                        ${isActive 
                                            ? 'text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] bg-white/10 border border-cyan-400/20' 
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                        }
                                    `}
                                    tooltip={item.title}
                                >
                                    <Link href={item.href}>
                                        <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-slate-800/50">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Active</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Dark Futuristic v1.0</p>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
