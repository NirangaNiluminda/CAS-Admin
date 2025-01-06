'use client'; // Add this at the top

import React, { createContext, useContext, useState } from "react";

interface Admin {
    _id: string;
    name: string;
    email: string;
    role:string;
}

interface AdminContextType {
    admin: Admin | null;
    setAdmin: React.Dispatch<React.SetStateAction<Admin | null>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);

    return (
        <AdminContext.Provider value={{ admin, setAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};
