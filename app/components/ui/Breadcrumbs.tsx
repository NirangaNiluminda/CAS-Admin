'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      <Link 
        href="/dashboard" 
        className="flex items-center hover:text-green-600 transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Dashboard</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-green-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-green-700">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}