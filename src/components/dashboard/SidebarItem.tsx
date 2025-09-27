'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface SidebarItemProps {
    icon: ReactNode;
    label: string;
    href: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function SidebarItem({ icon, label, href, isActive = false, onClick }: SidebarItemProps) {
    const baseClasses = "flex items-center px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium";
    const activeClasses = isActive
        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

    return (
        <Link
            href={href}
            className={`${baseClasses} ${activeClasses}`}
            onClick={onClick}
        >
            <div className="flex-shrink-0 w-5 h-5">
                {icon}
            </div>
            <span className="ml-3 truncate">
                {label}
            </span>
        </Link>
    );
}