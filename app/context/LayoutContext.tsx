'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LayoutContextType {
    isSidebarCollapsed: boolean;
    isMobile: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
    isSidebarCollapsed: false,
    isMobile: false,
    toggleSidebar: () => { },
    setSidebarCollapsed: () => { },
});

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            setIsMobile(mobile);

            // Auto-collapse on tablet, expand on desktop, unless user manually changed it?
            // For now, let's keep the simple logic:
            // If screen is large, default to expanded. If medium, default to collapsed.
            // But we want to respect user preference if possible. 
            // Let's stick to the responsive behavior for now to match existing logic but centralized.

            if (width >= 1024) {
                // Large screen
                // We don't force it here to allow manual toggle, 
                // but we might want to initialize it correctly.
            } else if (width >= 768) {
                // Tablet
                setIsSidebarCollapsed(true);
            } else {
                // Mobile
                setIsSidebarCollapsed(true); // Or irrelevant for mobile as it's hidden
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <LayoutContext.Provider value={{
            isSidebarCollapsed,
            isMobile,
            toggleSidebar,
            setSidebarCollapsed: setIsSidebarCollapsed
        }}>
            {children}
        </LayoutContext.Provider>
    );
};
