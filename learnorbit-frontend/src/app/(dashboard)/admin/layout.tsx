"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, BookOpen, LogOut, Building2, Calendar, Menu, X } from 'lucide-react';
import { logout, getCurrentUser } from '@/lib/auth';
import { useEffect, useState } from 'react';
import CourseAgent from '@/components/dashboard/CourseAgent';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState<string>('Admin');
    const [userRole, setUserRole] = useState<string>('admin');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();
        if (!user || !['admin', 'super_admin'].includes(user.role)) {
            router.push('/login');
            return;
        }
        setUserName(user.name);
        setUserRole(user.role);
    }, [router]);

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        ...(userRole === 'super_admin' ? [{ name: 'Institutes', href: '/admin/institutes', icon: Building2 }] : []),
        { name: 'Events', href: '/admin/events', icon: Calendar },
    ];

    // Close mobile menu when pathname changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        {/* Left: Logo/Brand */}
                        <div className="flex items-center gap-4 md:gap-8 h-full py-2">
                            <Link href="/admin/dashboard" className="flex items-center h-full">
                                <Image
                                    src="/learnorbit.png"
                                    alt="LearnOrbit"
                                    width={150}
                                    height={42}
                                    className="max-h-10 w-auto object-contain"
                                    priority
                                />
                            </Link>

                            {/* Desktop Navigation Links */}
                            <div className="hidden lg:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
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

                        {/* Right: User Menu & Mobile Toggle */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500 capitalize">{userRole.replace('_', ' ')}</p>
                            </div>
                            
                            <button
                                onClick={handleLogout}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors
                      ${isActive
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <div className="px-4 py-3 sm:hidden">
                                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                    <p className="text-xs text-gray-500 capitalize">{userRole.replace('_', ' ')}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* AI Course Agent */}
            <CourseAgent />
        </div>
    );
}
