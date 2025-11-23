'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useAdmin } from '@/app/context/AdminContext';
import { useSidebar } from '@/app/context/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    BarChart2,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { admin, setAdmin } = useAdmin();
    const {
        isCollapsed,
        isMobile,
        showMobileMenu,
        toggleCollapse,
        toggleMobileMenu,
        closeMobileMenu
    } = useSidebar();

    const [name, setName] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (admin?.name) {
            setName(admin.name);
        } else {
            setName('');
        }
    }, [admin]);

    // Close sidebar when clicking outside (for mobile)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isMobile && showMobileMenu) {
                closeMobileMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobile, showMobileMenu, closeMobileMenu]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('name');
            localStorage.removeItem('adminData');
            setAdmin(null);
            router.push('/');
        }, 600);
    };

    const isSignInPage = pathname === '/sign-in' || pathname === '/';
    if (isSignInPage) return null;
    if (!admin) return null;

    const getInitials = (fullName: string) => {
        if (!fullName) return 'U';
        return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Manage Assignments', path: '/addingquiz', icon: FileText },
        { name: 'Analytics', path: '/analytics', icon: BarChart2 },
        { name: 'Profile', path: '/profile', icon: User }
    ];

    // Mobile Menu Button
    const MobileMenuButton = () => (
        <motion.button
            onClick={toggleMobileMenu}
            className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md text-emerald-600 p-3 rounded-xl shadow-lg border border-emerald-100"
            whileTap={{ scale: 0.95 }}
        >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
    );

    return (
        <>
            <MobileMenuButton />

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobile && showMobileMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                        onClick={closeMobileMenu}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.div
                ref={sidebarRef}
                className={`fixed inset-y-0 left-0 z-40 flex flex-col 
                    bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/60 
                    backdrop-blur-xl border-r border-emerald-100/80 shadow-2xl shadow-emerald-100/40
                    ${isMobile ? (showMobileMenu ? 'translate-x-0 w-72' : '-translate-x-full') : (isCollapsed ? 'w-20' : 'w-72')}
                `}
                initial={false}
                animate={{
                    width: isMobile ? 288 : (isCollapsed ? 80 : 288),
                    x: isMobile ? (showMobileMenu ? 0 : -300) : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* Header / Logo */}
                <div className={`relative z-10 flex items-center h-24 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
                    <div className="flex items-center gap-4 overflow-hidden">
                        <motion.div
                            layout
                            className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200"
                        >
                            <span className="font-bold text-white text-xl">A</span>
                        </motion.div>

                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex flex-col"
                                >
                                    <span className="font-bold text-lg tracking-wide text-slate-800">Admin</span>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Portal</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-hide relative z-10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <motion.button
                                key={item.path}
                                onClick={() => {
                                    router.push(item.path);
                                    if (isMobile) closeMobileMenu();
                                }}
                                layout
                                className={`relative flex items-center transition-all duration-300 group overflow-hidden
                                    ${isCollapsed
                                        ? 'justify-center w-12 h-12 mx-auto rounded-xl'
                                        : 'w-full p-3.5 rounded-xl'
                                    }
                                    ${isActive
                                        ? (isCollapsed
                                            ? 'text-emerald-600 bg-emerald-100/80 shadow-sm ring-1 ring-emerald-200'
                                            : 'text-emerald-800 shadow-md shadow-emerald-100/60')
                                        : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/60'}
                                `}
                            >
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="activeNavExpanded"
                                        className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white border border-emerald-100/60"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <span className="relative z-10 flex-shrink-0">
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </span>

                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="relative z-10 ml-4 font-medium whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Footer / User Profile */}
                <div className={`relative z-10 p-4 border-t border-emerald-100/80 bg-white/40 backdrop-blur-md transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
                        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => router.push('/profile')}>
                            <motion.div
                                layout
                                className="relative flex-shrink-0"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center border border-emerald-200 shadow-sm">
                                    <span className="font-bold text-emerald-700">{getInitials(name)}</span>
                                </div>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                            </motion.div>

                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="flex flex-col min-w-0"
                                    >
                                        <span className="font-semibold text-sm text-slate-800 truncate">{name}</span>
                                        <span className="text-xs text-emerald-600 font-medium truncate">Administrator</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {!isCollapsed && (
                            <motion.button
                                whileHover={{ scale: 1.1, color: "#ef4444", backgroundColor: "#fef2f2" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                            >
                                <LogOut size={18} />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Collapse Toggle (Desktop Only) */}
                {!isMobile && (
                    <button
                        onClick={toggleCollapse}
                        className="absolute -right-3 top-24 z-50 flex items-center justify-center w-6 h-6 bg-white text-emerald-600 border border-emerald-100 rounded-full shadow-md hover:bg-emerald-50 transition-colors focus:outline-none"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                )}
            </motion.div>
        </>
    );
};

export default Sidebar;