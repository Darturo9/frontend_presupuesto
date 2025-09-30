'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface SidebarItemProps {
    icon: ReactNode;
    label: string;
    href: string;
    isActive?: boolean;
    onClick?: () => void;
    isLogout?: boolean;
}

export default function SidebarItem({ icon, label, href, isActive = false, onClick, isLogout = false }: SidebarItemProps) {
    const baseClasses = "flex items-center px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium";

    let classes;
    if (isLogout) {
        classes = "text-red-600 hover:bg-red-50 hover:text-red-700";
    } else if (isActive) {
        classes = "bg-blue-100 text-blue-700 border-r-2 border-blue-700";
    } else {
        classes = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    }

    if (isLogout) {
        return (
            <button
                onClick={onClick}
                className={`${baseClasses} ${classes} w-full text-left`}
            >
                <div className="flex-shrink-0 w-5 h-5">
                    {icon}
                </div>
                <span className="ml-3 truncate">
                    {label}
                </span>
            </button>
        );
    }

    return (
        <Link
            href={href}
            className={`${baseClasses} ${classes}`}
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