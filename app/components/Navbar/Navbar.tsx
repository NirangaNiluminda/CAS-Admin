'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/app/context/AdminContext';

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { admin, setAdmin } = useAdmin();
    const [apiUrl, setApiUrl] = useState('');
    const [name, setName] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        if (admin?.name) {
            setName(admin.name);
        } else {
            setName('');
        }
    }, [admin]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost') {
                setApiUrl('http://localhost:4000');
            } else {
                setApiUrl('http://13.228.36.212');
            }

            const handleResize = () => {
                setIsMobile(window.innerWidth < 768);
                if (window.innerWidth >= 768) {
                    setShowMobileMenu(false);
                }
            };

            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('name');
        setAdmin(null);
        router.push('/');
    };

    const isSignInPage = pathname === '/sign-in';
    
    // Don't render sidebar on sign-in page
    if (isSignInPage) return null;
    
    // Navigation items with icons
    const navItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            )
        },
        {
            name: 'Manage Assignments',
            path: '/addingquiz',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
            )
        }
    ];

    if (!admin) return null;

    // Mobile menu toggle button with glass effect
    const MobileMenuButton = () => (
        <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden fixed top-4 left-4 z-50 bg-white bg-opacity-30 backdrop-blur-md p-2 rounded-full shadow-lg border border-white border-opacity-40 transition-all duration-300 hover:shadow-green-300/50"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
            </svg>
        </button>
    );

    return (
        <>
            <MobileMenuButton />
            
            {/* Backdrop overlay for mobile */}
            {isMobile && showMobileMenu && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 transition-opacity duration-300"
                    onClick={() => setShowMobileMenu(false)}
                ></div>
            )}
            
            {/* Sidebar */}
            <div 
                className={`fixed inset-y-0 left-0 transform ${
                    isMobile ? (showMobileMenu ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
                } transition-all duration-500 ease-in-out z-40 ${
                    isCollapsed ? 'w-20' : 'w-64'
                }`}
                style={{
                    transitionProperty: 'transform, width, box-shadow',
                    boxShadow: (isMobile && showMobileMenu) || !isMobile ? '0 0 25px rgba(0, 128, 0, 0.15)' : 'none'
                }}
            >
                <div className="h-full flex flex-col bg-white bg-opacity-80 backdrop-blur-lg border-r border-green-400/30 overflow-hidden">
                    {/* Logo and collapse toggle */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-green-400/30 backdrop-blur-md bg-white bg-opacity-50">
                        {!isCollapsed && (
                            <div className="font-bold text-xl text-green-600 transition-all duration-300 opacity-100">Admin Panel</div>
                        )}
                        {isCollapsed && (
                            <div className="mx-auto font-bold text-xl text-green-600 transition-all duration-300">AP</div>
                        )}
                        {!isMobile && (
                            <button 
                                onClick={() => setIsCollapsed(!isCollapsed)} 
                                className="p-1 rounded-full hover:bg-green-100 transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {isCollapsed ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                                    )}
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* User profile section */}
                    <div className={`flex flex-col px-4 py-5 border-b border-green-400/30`}>
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} mb-3`}>
                            <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full p-2 flex items-center justify-center shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            {!isCollapsed && (
                                <div className="ml-3 transition-all duration-300">
                                    <p className="font-medium text-gray-800">{name}</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Profile link */}
                        {!isCollapsed ? (
                            <a 
                                onClick={() => router.push('/profile')}
                                className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                    pathname === '/profile' 
                                        ? 'bg-gradient-to-r from-green-400/50 to-green-600/50 text-white shadow-sm' 
                                        : 'text-gray-700 hover:bg-green-50 hover:scale-102'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <polyline points="17 11 19 13 23 9"></polyline>
                                </svg>
                                <span className="ml-2 text-sm font-medium">Edit Profile</span>
                            </a>
                        ) : (
                            <a 
                                onClick={() => router.push('/profile')}
                                className={`flex justify-center items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                    pathname === '/profile' 
                                        ? 'bg-gradient-to-r from-green-400/50 to-green-600/50 text-white shadow-sm' 
                                        : 'text-gray-700 hover:bg-green-50 hover:scale-102'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <polyline points="17 11 19 13 23 9"></polyline>
                                </svg>
                            </a>
                        )}
                    </div>

                    {/* Navigation section */}
                    <div className="flex-grow overflow-y-auto py-6">
                        <ul className="space-y-3 px-3">
                            {navItems.map((item, index) => (
                                <li key={index}>
                                    <a
                                        onClick={() => router.push(item.path)}
                                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                                            pathname === item.path 
                                                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md shadow-green-400/20 scale-105' 
                                                : 'text-gray-700 hover:bg-green-50 hover:scale-102'
                                        } ${isCollapsed ? 'justify-center' : ''}`}
                                        style={{
                                            backdropFilter: pathname === item.path ? 'blur(10px)' : 'none',
                                            transform: pathname === item.path ? 'translateY(-2px)' : 'none'
                                        }}
                                    >
                                        <span className="flex-shrink-0">{item.icon}</span>
                                        {!isCollapsed && (
                                            <span className="ml-3 transition-opacity duration-300">{item.name}</span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Logout section */}
                    <div className="border-t border-green-400/30 p-4 backdrop-blur-sm bg-white bg-opacity-30">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center p-3 w-full rounded-xl text-red-500 hover:bg-red-50 hover:scale-102 cursor-pointer transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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
                            {!isCollapsed && <span className="ml-3 transition-opacity duration-300">Logout</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content container - push content over when sidebar is open */}
            <div className={`transition-all duration-500 ease-in-out ${isMobile ? 'ml-0' : (isCollapsed ? 'ml-20' : 'ml-64')}`}>
                {/* This is where your main content will go */}
            </div>
        </>
    );
};

export default Sidebar;