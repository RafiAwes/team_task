import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <AppLogoIcon className="size-5 text-cyan-accent drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
            </div>
            <div className="ml-3 grid flex-1 text-left">
                <span className="truncate leading-tight font-extrabold tracking-tighter text-white text-base">
                    TEAMS<span className="text-cyan-accent">TASKS</span>
                </span>
            </div>
        </>
    );
}
