import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H12V12H4V4Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 12H20V20H12V12Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M4 4L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 4L12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}
