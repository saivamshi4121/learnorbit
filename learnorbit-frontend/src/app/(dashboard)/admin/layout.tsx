"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, BookOpen, LogOut } from 'lucide-react';
import { logout, getCurrentUser } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState<string>('Admin');

    useEffect(() => {
        const user = getCurrentUser();
        if (!user || user.role !== 'admin') {
            router.push('/login');
            return;
        }
        setUserName(user.name);
    }, [router]);

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: Users,
        },
        {
            name: 'Courses',
            href: '/admin/courses',
            icon: BookOpen,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16">
                <div className="max-w-7xl mx-auto px-6 h-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Left: Logo/Brand */}
                        <div className="flex items-center gap-8 h-full py-2">
                            <Link href="/admin/dashboard" className="flex items-center h-full">
                                <Image
                                    src="/learnorbit.png"
                                    alt="LearnOrbit"
                                    width={200}
                                    height={56}
                                    className="max-h-full w-auto object-contain"
                                    priority
                                />
                            </Link>

                            {/* Navigation Links */}
                            <div className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                }
                      `}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden border-t border-gray-200 py-2">
                        <div className="flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                      flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                      ${isActive
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
