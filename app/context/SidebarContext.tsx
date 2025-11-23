'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    isMobile: boolean;
    showMobileMenu: boolean;
    toggleCollapse: () => void;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;

            setIsMobile(mobile);

            // Auto-collapse on tablet, expand on desktop, reset mobile menu
            if (width >= 1024) {
                setIsCollapsed(false);
            } else if (width >= 768) {
                setIsCollapsed(true);
            }

            if (width >= 768) {
                setShowMobileMenu(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
    const closeMobileMenu = () => setShowMobileMenu(false);

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            isMobile,
            showMobileMenu,
            toggleCollapse,
            toggleMobileMenu,
            closeMobileMenu
        }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
