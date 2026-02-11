"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { getCourse, updateCourse, toggleCoursePublish } from '@/lib/services/instructor.service';
import { InstructorCourse } from '@/types/instructor';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/Switch';
import { LessonManager } from '@/components/instructor/LessonManager';
import { LayoutDashboard, BookOpen, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

/**
 * Edit Course Page Workspace
 */
export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const { courseId } = params;

    const [course, setCourse] = useState<InstructorCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Tab state: 'details' | 'lessons'
    const [activeTab, setActiveTab] = useState<'details' | 'lessons'>('details');

    // Form state for details
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail_url: '',
    });

    useEffect(() => {
        if (courseId) {
            fetchCourse(courseId as string);
        }
    }, [courseId]);

    const fetchCourse = async (id: string) => {
        try {
            setLoading(true);
            const res: any = await getCourse(id);
            if (res.success && res.data) {
                setCourse(res.data);
                setFormData({
                    title: res.data.title,
                    description: res.data.description || '',
                    thumbnail_url: res.data.thumbnail_url || '',
                });
            }
        } catch (err: any) {
            toast.error("Failed to load course");
            router.push('/instructor');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDetails = async () => {
        try {
            setSaving(true);
            const res: any = await updateCourse(Number(courseId), formData);
            if (res.success) {
                toast.success("Course details updated");
                // Update local state
                setCourse(prev => prev ? { ...prev, ...formData } : null);
            }
        } catch (err: any) {
            toast.error("Failed to update course");
        } finally {
            setSaving(false);
        }
    };

    const handleTogglePublish = async () => {
        if (!course) return;
        const newStatus = !course.is_published;

        // Optimistic update
        setCourse({ ...course, is_published: newStatus });

        try {
            await toggleCoursePublish(course.id, newStatus);
            toast.success(newStatus ? "Course published" : "Course unpublished");
        } catch (err) {
            setCourse({ ...course, is_published: !newStatus });
            toast.error("Failed to update publish status");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-mutedText">Loading Editor...</div>;
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <SecondaryButton onClick={() => router.push('/instructor')} className="px-2 py-1 h-8 text-xs">
                                <ArrowLeft className="w-3 h-3 mr-1" /> Back
                            </SecondaryButton>
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${course.is_published
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}>
                                {course.is_published ? 'Published' : 'Draft Mode'}
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
                            {course.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-borderLight shadow-sm">
                        <div className="flex items-center gap-3 px-2">
                            <span className="text-sm font-medium text-textPrimary">Publish Status</span>
                            <Switch
                                checked={course.is_published}
                                onCheckedChange={handleTogglePublish}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs & Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Tabs */}
                    <div className="lg:col-span-1 space-y-1">
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'details'
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-mutedText hover:bg-gray-100 hover:text-textPrimary'
                                }`}
                            onClick={() => setActiveTab('details')}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Course Details
                        </button>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'lessons'
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-mutedText hover:bg-gray-100 hover:text-textPrimary'
                                }`}
                            onClick={() => setActiveTab('lessons')}
                        >
                            <BookOpen className="w-4 h-4" />
                            Curriculum & Lessons
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-borderLight rounded-xl shadow-sm min-h-[500px] p-6 sm:p-8">
                            {activeTab === 'details' ? (
                                <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-textPrimary">Basic Information</h3>
                                        <PrimaryButton onClick={handleSaveDetails} disabled={saving} className="px-4 py-2">
                                            <Save className="w-4 h-4 mr-2" />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </PrimaryButton>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-textPrimary mb-1.5">
                                                Course Title
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-borderLight px-4 py-2.5 text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g. Advanced React Patterns"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-textPrimary mb-1.5">
                                                Description
                                            </label>
                                            <textarea
                                                className="w-full rounded-lg border border-borderLight px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[150px] transition-all resize-y"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Describe what students will learn..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-textPrimary mb-1.5">
                                                Thumbnail Image
                                            </label>
                                            <div className="flex gap-4 items-start">
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-mutedText" />
                                                        <input
                                                            type="text"
                                                            className="w-full rounded-lg border border-borderLight pl-10 pr-4 py-2.5 text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                            value={formData.thumbnail_url}
                                                            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                    <p className="text-xs text-mutedText mt-1.5">
                                                        Better results with 16:9 aspect ratio images.
                                                    </p>
                                                </div>
                                                {/* Preview Thumbnail */}
                                                <div className="w-32 h-20 bg-gray-100 rounded-lg border border-borderLight overflow-hidden shrink-0">
                                                    {formData.thumbnail_url ? (
                                                        <img src={formData.thumbnail_url} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                            No Preview
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in duration-300">
                                    <LessonManager courseId={Number(courseId)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

