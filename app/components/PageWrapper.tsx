'use client';

import React from 'react';
import { useLayout } from '../context/LayoutContext';
import { usePathname } from 'next/navigation';

interface PageWrapperProps {
    children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
    const { isSidebarCollapsed, isMobile } = useLayout();
    const pathname = usePathname();

    const publicRoutes = ['/', '/sign-in', '/signup', '/forgot-password', '/reset-password'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Calculate margin based on sidebar state
    // Mobile or Public Route: ml-0
    // Desktop Collapsed: ml-20
    // Desktop Expanded: ml-72
    const marginClass = isMobile || isPublicRoute
        ? 'ml-0'
        : (isSidebarCollapsed ? 'ml-20' : 'ml-72');

    return (
        <main className={`min-h-screen bg-gray-50 transition-all duration-300 ease-out ${marginClass}`}>
            {children}
        </main>
    );
};

export default PageWrapper;
