'use client';

import { useEffect, useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function useBreadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  // Load breadcrumbs from localStorage on component mount
  useEffect(() => {
    const storedBreadcrumbs = localStorage.getItem('currentBreadcrumbs');
    if (storedBreadcrumbs) {
      try {
        setBreadcrumbs(JSON.parse(storedBreadcrumbs));
      } catch (error) {
        console.error('Error parsing breadcrumbs:', error);
        setBreadcrumbs([]);
      }
    }
  }, []);

  // Function to update breadcrumbs
  const updateBreadcrumbs = (newBreadcrumbs: BreadcrumbItem[]) => {
    setBreadcrumbs(newBreadcrumbs);
    localStorage.setItem('currentBreadcrumbs', JSON.stringify(newBreadcrumbs));
  };

  // Function to add a breadcrumb
  const addBreadcrumb = (item: BreadcrumbItem) => {
    const newBreadcrumbs = [...breadcrumbs, item];
    updateBreadcrumbs(newBreadcrumbs);
  };

  // Function to remove the last breadcrumb
  const removeLastBreadcrumb = () => {
    if (breadcrumbs.length > 0) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      updateBreadcrumbs(newBreadcrumbs);
    }
  };

  // Function to clear all breadcrumbs
  const clearBreadcrumbs = () => {
    setBreadcrumbs([]);
    localStorage.removeItem('currentBreadcrumbs');
  };

  return {
    breadcrumbs,
    updateBreadcrumbs,
    addBreadcrumb,
    removeLastBreadcrumb,
    clearBreadcrumbs
  };
}