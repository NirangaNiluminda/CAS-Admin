'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/app/context/AdminContext';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname(); // Get the current pathname
    const { admin, setAdmin } = useAdmin(); // Assuming setAdmin is available from context
    const [apiUrl, setApiUrl] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        console.log("Admin object:", admin);
        if (admin?.name) {
            setName(admin.name);
        } else {
            setName(''); // Clear name if admin is not available
        }
    }, [admin]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost') {
                setApiUrl('http://localhost:4000');
            } else {
                setApiUrl('http://13.228.36.212');
            }
        }
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('name');
        console.log("logging out");
        
        // Clear admin state here
        setAdmin(null); // Assuming setAdmin is a method to clear the admin context

        router.push('/');
    };

    // Determine if the current route is the sign-in page
    const isSignInPage = pathname === '/sign-in'; // Use pathname instead of router.pathname

    return (
        <div className="w-full h-[60px] sm:h-[80px] lg:h-[100px] flex justify-between items-center px-3 sm:px-6 lg:px-8 mt-2 z-50 relative">
            <div className="w-full h-[60px] sm:h-[80px] lg:h-[100px] border-2 border-green-500 rounded-lg sm:rounded-xl lg:rounded-3xl flex justify-between items-center px-3 sm:px-6 lg:px-8">
                
                {/* Only show username if logged in and not on the sign-in page */}
                {admin && !isSignInPage && (
                    <div 
                        className="text-sm sm:text-base lg:text-lg font-semibold cursor-pointer" 
                        onClick={() => router.push('#')}
                    >
                        {name}
                    </div>
                )}

                {/* Conditionally render Dashboard and Create Assignment links only if logged in and not on sign-in page */}
                {admin && !isSignInPage && (
                    <>
                        <div 
                            className="text-sm sm:text-base lg:text-lg font-semibold cursor-pointer ml-2" 
                            onClick={() => router.push('/dashboard')} // Navigate to dashboard
                        >
                            Dashboard
                        </div>
                        <div 
                            className="text-sm sm:text-base lg:text-lg font-semibold cursor-pointer ml-2" 
                            onClick={() => router.push('/addingquiz')} // Navigate to create assignment
                        >
                            Create Assignment
                        </div>
                    </>
                )}

                {/* Render logout icon only if not on sign-in page */}
                {!isSignInPage && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10">
                        <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            onClick={handleLogout}
                            className="cursor-pointer hover:scale-110 transition-transform duration-300"
                        >
                            <path
                                fill="#000"
                                fillRule="evenodd"
                                d="M21.593 10.943c.584.585.584 1.53 0 2.116L18.71 15.95c-.39.39-1.03.39-1.42 0a.996.996 0 010-1.41 9.552 9.552 0 011.689-1.345l.387-.242-.207-.206a10 10 0 01-2.24.254H8.998a1 1 0 110-2h7.921a10 10 0 012.24.254l.207-.206-.386-.241a9.562 9.562 0 01-1.69-1.348.996.996 0 010-1.41c.39-.39 1.03-.39 1.42 0l2.883 2.893zM14 16a1 1 0 00-1 1v1.5a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-13a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v1.505a1 1 0 102 0V5.5A2.5 2.5 0 0012.5 3h-7A2.5 2.5 0 003 5.5v13A2.5 2.5 0 005.5 21h7a2.5 2.5 0 002.5-2.5V17a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
