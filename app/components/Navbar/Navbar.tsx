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

    // Ref for the sidebar to detect clicks outside
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
            handleResize();
            window.addEventListener('resize', handleResize);
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                window.removeEventListener('resize', handleResize);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isMobile]);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        // Simulate a small delay for animation
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
    const handleProfileClick = () => {
        router.push('/profile');
    };

    const isSignInPage = pathname === '/sign-in';

    // Don't render sidebar on sign-in page
    if (isSignInPage) return null;
    if (!admin) return null;


    // Get initials for avatar
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
        <motion.button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-green-100"
            whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 128, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}
        >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
    );

    // Decorative elements
    const SidebarDecorations = () => (
        <>
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white/30 pointer-events-none"></div>

            {/* Subtle corner shapes */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-100 opacity-5 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 opacity-5 rounded-full"></div>

            {/* Subtle pattern grid */}
            <div className="absolute inset-0 opacity-3 pointer-events-none">
                {Array(6).fill(0).map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-px bg-green-500"
                        style={{
                            top: `${(i + 1) * 16}%`,
                            left: 0,
                            right: 0,
                            opacity: 0.03
                        }}
                    ></div>
                ))}
            </div>
        </>
    );

    return (
        <>
            <MobileMenuButton />

            {/* Mobile Backdrop */}

            {/* Backdrop overlay for mobile */}
            <AnimatePresence>
                {isMobile && showMobileMenu && (
                    <motion.div
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

            {/* Sidebar */}
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
                className={`fixed inset-y-0 left-0 transform transition-all duration-300 ease-out z-40 ${isMobile ? (showMobileMenu ? 'translate-x-0 w-72' : '-translate-x-full') : (isCollapsed ? 'w-20' : 'w-72')
                    }`}
                initial={isMobile ? { x: "-100%" } : { x: 0 }}
                animate={isMobile ? (showMobileMenu ? { x: 0 } : { x: "-100%" }) : { x: 0 }}
                transition={{ duration: 0.25, type: "spring", stiffness: 200, damping: 28 }}
                style={{
                    boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)"
                }}
            >
                <div className="relative h-full flex flex-col bg-white/90 backdrop-blur-lg border-r border-green-100 overflow-hidden">
                    <SidebarDecorations />

                    {/* Logo and collapse toggle */}
                    <div className="flex items-center justify-between h-16 px-5 py-6 border-b border-green-100 bg-white/50 backdrop-blur-md relative z-10">
                        {!isCollapsed && (
                            <motion.div
                                className="flex items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                                        <span className="text-white text-lg font-bold">A</span>
                                    </div>
                                    <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent transition-all duration-300">Admin</h1>
                                </div>
                            </motion.div>
                        )}

                        {isCollapsed && (
                            <motion.div
                                className="mx-auto"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white text-lg font-bold">A</span>
                                </div>
                            </motion.div>
                        )}

                        {!isMobile && (
                            <motion.button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-1.5 rounded-lg hover:bg-green-100/60 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {isCollapsed ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
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
                    {/* User profile section */}
                    <motion.div
                        className={`flex flex-col px-4 py-5 border-b border-green-100 relative z-10 ${isCollapsed ? 'items-center' : ''}`}
                        whileHover={{ backgroundColor: "rgba(240, 250, 240, 0.5)" }}
                        onClick={handleProfileClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
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
                                    <motion.div
                                        className="ml-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="font-medium text-gray-800">{name}</p>
                                        <div className="flex items-center">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                                            <p className="text-xs text-gray-500">Administrator</p>
                                        </div>
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
                    </motion.div>

                    {/* Navigation section */}
                    <div className="flex-grow overflow-y-auto py-6 relative z-10">
                        <ul className="space-y-2 px-3">
                            {navItems.map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.04 }}
                                    onHoverStart={() => setHoverItem(index)}
                                    onHoverEnd={() => setHoverItem(null)}
                                >
                                    <motion.button
                                        onClick={() => router.push(item.path)}
                                        className={`relative flex items-center py-3 px-4 w-full rounded-xl cursor-pointer transition-all duration-200 ${pathname === item.path
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-green-50'
                                            } ${isCollapsed ? 'justify-center' : ''}`}
                                        whileHover={isCollapsed ? { scale: 1.05 } : { scale: 1.01, x: 1 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {/* Active indicator */}
                                        {pathname === item.path && (
                                            <motion.div
                                                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full bg-white"
                                                layoutId="activeIndicator"
                                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                            />
                                        )}

                                        <span className={`flex items-center justify-center ${pathname === item.path ? 'text-white' : 'text-green-600'}`}>
                                            {item.icon}
                                        </span>

                                        <AnimatePresence>
                                            {!isCollapsed && (
                                                <motion.span
                                                    className="ml-3 font-medium text-sm whitespace-nowrap"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        {/* Item description tooltip */}
                                        {isCollapsed && hoverItem === index && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute left-16 z-50 px-3 py-2 bg-white rounded-lg shadow-lg border border-green-100"
                                                transition={{ duration: 0.15 }}
                                                style={{ width: "max-content", maxWidth: "200px" }}
                                            >
                                                <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-2 h-2 rotate-45 bg-white border-l border-t border-green-100"></div>
                                                <p className="font-medium text-sm text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-600">{item.description}</p>
                                            </motion.div>
                                        )}
                                    </motion.button>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Logout section */}
                    <div className="border-t border-green-100 p-4 backdrop-blur-sm bg-white/30 relative z-10">
                        <motion.button
                            onClick={handleLogout}
                            className={`relative flex items-center p-3 w-full rounded-xl text-red-500 hover:bg-red-50 cursor-pointer transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} overflow-hidden`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Logout animation */}
                            {isLoggingOut && (
                                <motion.div
                                    className="absolute inset-0 bg-red-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            )}

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${isLoggingOut ? 'text-white' : 'text-red-500'} relative z-10`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>

                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        className={`ml-3 font-medium text-sm ${isLoggingOut ? 'text-white' : 'text-red-500'} relative z-10`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
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