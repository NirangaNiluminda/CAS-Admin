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
    X,
    Settings,
    HelpCircle
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
    const [hoverItem, setHoverItem] = useState<number | null>(null);

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

    // Don't render sidebar on sign-in page
    if (isSignInPage) return null;
    if (!admin) return null;

    // Get initials for avatar
    const getInitials = (fullName: string) => {
        if (!fullName) return 'U';
        return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, description: 'Overview' },
        { name: 'Manage Assignments', path: '/addingquiz', icon: FileText, description: 'Create & Edit' },
        { name: 'Analytics', path: '/analytics', icon: BarChart2, description: 'Stats & Reports' },
        { name: 'Profile', path: '/profile', icon: User, description: 'Account Settings' }
    ];

    // Mobile Menu Button
    const MobileMenuButton = () => (
        <motion.button
            onClick={toggleMobileMenu}
            className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-emerald-100 text-emerald-700"
            whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(16, 185, 129, 0.15)" }}
            whileTap={{ scale: 0.95 }}
        >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
    );

    // Decorative elements for the glassmorphism look
    const SidebarDecorations = () => (
        <>
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-white/90 to-white/80 pointer-events-none"></div>

            {/* Glass reflection effect */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

            {/* Subtle pattern grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>
        </>
    );

    return (
        <>
            <MobileMenuButton />

            {/* Backdrop overlay for mobile */}
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

            <motion.div
                ref={sidebarRef}
                className={`fixed inset-y-0 left-0 z-40 flex flex-col 
                    backdrop-blur-xl border-r border-emerald-100/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
                    ${isMobile ? (showMobileMenu ? 'translate-x-0' : '-translate-x-full') : ''}
                `}
                initial={false}
                animate={{
                    width: isMobile ? 280 : (isCollapsed ? 88 : 280),
                    x: isMobile ? (showMobileMenu ? 0 : -300) : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="relative h-full flex flex-col overflow-hidden bg-white/80">
                    <SidebarDecorations />

                    {/* Header / Logo */}
                    <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center flex-col' : 'justify-between'} h-auto min-h-[80px] py-4 px-6 transition-all duration-300`}>
                        {!isCollapsed && (
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                                    <span className="text-xl font-bold">A</span>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-bold text-gray-800 leading-tight">Admin</h1>
                                    <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Workspace</span>
                                </div>
                            </motion.div>
                        )}

                        {isCollapsed && (
                            <motion.div
                                className="mb-2"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md text-white">
                                    <span className="text-lg font-bold">A</span>
                                </div>
                            </motion.div>
                        )}

                        {!isMobile && (
                            <motion.button
                                onClick={toggleCollapse}
                                className={`p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 ${isCollapsed ? 'mt-1' : ''}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                            </motion.button>
                        )}
                    </div>

                    {/* Navigation section */}
                    <div className="flex-grow overflow-y-auto py-6 px-4 relative z-10 scrollbar-hide">
                        <div className="space-y-1.5">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path;

                                return (
                                    <motion.div
                                        key={index}
                                        onHoverStart={() => setHoverItem(index)}
                                        onHoverEnd={() => setHoverItem(null)}
                                        className="relative"
                                    >
                                        <motion.button
                                            onClick={() => router.push(item.path)}
                                            className={`relative flex items-center w-full rounded-xl cursor-pointer transition-all duration-300 group
                                            ${isCollapsed ? 'justify-center py-3 px-0' : 'py-3.5 px-4'}
                                            ${isActive
                                                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-700'
                                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
                                                }
                                        `}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {/* Active Indicator Line */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className={`absolute bg-emerald-500 rounded-full
                                                    ${isCollapsed ? 'left-1 w-1 h-8' : 'left-0 w-1 h-8 rounded-r-full'}
                                                `}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}

                                            {/* Icon */}
                                            <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`}>
                                                <Icon size={isCollapsed ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
                                            </span>

                                            {/* Label */}
                                            <AnimatePresence>
                                                {!isCollapsed && (
                                                    <motion.span
                                                        className={`ml-3.5 font-medium text-[15px] whitespace-nowrap relative z-10 ${isActive ? 'font-semibold' : ''}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {item.name}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>

                                            {/* Tooltip for collapsed state */}
                                            {isCollapsed && hoverItem === index && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                                    exit={{ opacity: 0, x: 10, scale: 0.95 }}
                                                    className="absolute left-full ml-4 z-50 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
                                                >
                                                    {item.name}
                                                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Footer / User Profile */}
                    <div className="relative z-10 p-4 mt-auto">
                        <div className={`
                            relative overflow-hidden rounded-2xl transition-all duration-300
                            ${isCollapsed ? 'bg-transparent p-0' : 'bg-gradient-to-br from-emerald-500 to-teal-600 p-4 shadow-lg shadow-emerald-500/20'}
                        `}>
                            {/* Decorative circles for profile card */}
                            {!isCollapsed && (
                                <>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-lg"></div>
                                </>
                            )}

                            <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'gap-3'}`}>
                                <motion.div
                                    className="relative shrink-0 cursor-pointer"
                                    onClick={handleProfileClick}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className={`
                                        flex items-center justify-center rounded-full border-2 border-white shadow-sm
                                        ${isCollapsed ? 'w-10 h-10 bg-emerald-100 text-emerald-700' : 'w-10 h-10 bg-white/20 text-white backdrop-blur-sm'}
                                    `}>
                                        <span className="font-bold text-sm">{getInitials(name)}</span>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                </motion.div>

                                {!isCollapsed && (
                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={handleProfileClick}>
                                        <p className="text-sm font-bold text-white truncate">{name}</p>
                                        <p className="text-xs text-emerald-100 truncate opacity-90">Administrator</p>
                                    </div>
                                )}

                                <motion.button
                                    onClick={handleLogout}
                                    className={`
                                        flex items-center justify-center rounded-lg transition-colors
                                        ${isCollapsed
                                            ? 'w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-50'
                                            : 'p-2 text-white/70 hover:text-white hover:bg-white/20'
                                        }
                                    `}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;