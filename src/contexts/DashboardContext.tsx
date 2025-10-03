'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface DashboardContextType {
    refreshKey: number;
    refreshDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshDashboard = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <DashboardContext.Provider value={{ refreshKey, refreshDashboard }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
