'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../context/AdminContext';
import { motion } from 'framer-motion';

// Define the props interface with children
interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const { admin, loading } = useAdmin();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-green-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    ); // Custom spinner using Framer Motion
  }

  if (!admin) {
    router.push('/'); // Redirect to signin page
    return null;
  }

  return children;
}