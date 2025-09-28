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
        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200";

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