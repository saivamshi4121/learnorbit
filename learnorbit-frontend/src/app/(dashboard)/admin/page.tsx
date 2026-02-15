"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is admin
        const user = getCurrentUser();

        if (!user || user.role !== 'admin') {
            router.push('/login');
            return;
        }

        // Redirect to dashboard
        router.push('/admin/dashboard');
    }, [router]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto"></div>
                <p className="mt-4 text-sm text-gray-500">Redirecting to admin dashboard...</p>
            </div>
        </div>
    );
}
