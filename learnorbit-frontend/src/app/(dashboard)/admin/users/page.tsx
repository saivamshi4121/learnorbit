"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Search, Shield, ShieldOff } from 'lucide-react';
import {
    getAdminUsers,
    blockUser,
    unblockUser,
    AdminUser,
} from '@/lib/services/admin.service';
import { getCurrentUser } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';

export default function AdminUserManagement() {
    const router = useRouter();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // Filters
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');

    useEffect(() => {
        // Role-based access control
        const user = getCurrentUser();
        if (!user || user.role !== 'admin') {
            router.push('/login');
            return;
        }
        setCurrentUserId(user.id);
    }, [router]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch users when filters change
    useEffect(() => {
        if (currentUserId !== null) {
            fetchUsers();
        }
    }, [roleFilter, debouncedSearch, currentUserId]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getAdminUsers({
                role: roleFilter,
                search: debouncedSearch,
            });

            if (response.success) {
                setUsers(response.data);
            }
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async (user: AdminUser) => {
        // Prevent admin from blocking themselves
        if (user.id === currentUserId) {
            alert('You cannot block yourself.');
            return;
        }

        const isBlocking = user.status === 'active';

        // Optimistic update
        setUsers(prev => prev.map(u =>
            u.id === user.id ? { ...u, status: isBlocking ? 'blocked' : 'active' } : u
        ));

        try {
            if (isBlocking) {
                await blockUser(user.id);
            } else {
                await unblockUser(user.id);
            }
        } catch (err) {
            // Revert on error
            setUsers(prev => prev.map(u =>
                u.id === user.id ? { ...u, status: user.status } : u
            ));
            console.error('Failed to update user status:', err);
            alert('Failed to update user status. Please try again.');
        }
    };

    if (loading && users.length === 0) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                        User Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage platform users
                    </p>
                </div>

                {/* Thin divider */}
                <div className="h-px w-full bg-gray-200 mb-8" />

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="sm:w-48"
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                    </Select>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="border border-red-200 bg-red-50 text-red-800 px-4 py-3 rounded mb-6">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* User Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="p-6">
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                                ))}
                            </div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-sm text-gray-500">No users found.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <p className="text-sm text-gray-600">{user.email}</p>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <RoleBadge role={user.role} />
                                                </td>
                                                <td className="px-6 py-3">
                                                    <StatusBadge status={user.status} />
                                                </td>
                                                <td className="px-6 py-3">
                                                    <p className="text-sm text-gray-500 tabular-nums">
                                                        {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleBlockToggle(user)}
                                                            disabled={user.id === currentUserId}
                                                            className={`
                                text-sm px-3 py-1.5 rounded border transition-colors
                                ${user.status === 'active'
                                                                    ? 'border-red-200 text-red-700 hover:bg-red-50'
                                                                    : 'border-green-200 text-green-700 hover:bg-green-50'
                                                                }
                                ${user.id === currentUserId ? 'opacity-40 cursor-not-allowed' : ''}
                              `}
                                                        >
                                                            {user.status === 'active' ? (
                                                                <span className="flex items-center gap-1.5">
                                                                    <ShieldOff className="h-3.5 w-3.5" />
                                                                    Block
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1.5">
                                                                    <Shield className="h-3.5 w-3.5" />
                                                                    Unblock
                                                                </span>
                                                            )}
                                                        </button>
                                                        {/* Placeholder for future role change */}
                                                        <button
                                                            disabled
                                                            className="text-sm px-3 py-1.5 rounded border border-gray-200 text-gray-400 cursor-not-allowed"
                                                        >
                                                            Change Role
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden divide-y divide-gray-200">
                                {users.map((user) => (
                                    <div key={user.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <RoleBadge role={user.role} />
                                                <StatusBadge status={user.status} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">
                                                Joined {formatDistanceToNow(new Date(user.joinedAt))} ago
                                            </p>
                                            <button
                                                onClick={() => handleBlockToggle(user)}
                                                disabled={user.id === currentUserId}
                                                className={`
                          text-xs px-2.5 py-1 rounded border transition-colors
                          ${user.status === 'active'
                                                        ? 'border-red-200 text-red-700'
                                                        : 'border-green-200 text-green-700'
                                                    }
                          ${user.id === currentUserId ? 'opacity-40 cursor-not-allowed' : ''}
                        `}
                                            >
                                                {user.status === 'active' ? 'Block' : 'Unblock'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * RoleBadge Component
 */
interface RoleBadgeProps {
    role: 'student' | 'instructor' | 'admin';
}

function RoleBadge({ role }: RoleBadgeProps) {
    const styles = {
        student: 'bg-blue-50 text-blue-700 border-blue-200',
        instructor: 'bg-purple-50 text-purple-700 border-purple-200',
        admin: 'bg-orange-50 text-orange-700 border-orange-200',
    };

    return (
        <span
            className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
        ${styles[role]}
      `}
        >
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
}

/**
 * StatusBadge Component
 */
interface StatusBadgeProps {
    status: 'active' | 'blocked';
}

function StatusBadge({ status }: StatusBadgeProps) {
    const isActive = status === 'active';

    return (
        <span
            className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
        ${isActive
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }
      `}
        >
            {isActive ? 'Active' : 'Blocked'}
        </span>
    );
}

/**
 * Loading Skeleton
 */
function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 rounded mt-2 animate-pulse" />
                </div>

                <div className="h-px w-full bg-gray-200 mb-8" />

                <div className="flex gap-4 mb-6">
                    <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
                    <div className="w-48 h-10 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
