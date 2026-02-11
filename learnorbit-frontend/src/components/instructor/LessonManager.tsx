import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    getInstructorLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    Lesson,
    CreateLessonPayload
} from '@/lib/services/lessons.service';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import {
    ChevronUp, ChevronDown, Trash2, Edit2,
    PlayCircle, FileText, Link as LinkIcon, File,
    Plus, GripVertical, Clock, Video
} from 'lucide-react';

interface LessonManagerProps {
    courseId: number;
}

export function LessonManager({ courseId }: LessonManagerProps) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<CreateLessonPayload>({
        title: '',
        type: 'video',
        content: '',
        duration_seconds: 0,
        completion_required: true,
        order_index: 0
    });

    useEffect(() => {
        fetchLessons();
    }, [courseId]);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const res: any = await getInstructorLessons(courseId);
            if (res.success && Array.isArray(res.data)) {
                setLessons(res.data);
            }
        } catch (err: any) {
            toast.error("Failed to load lessons");
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setFormData({
            title: '',
            type: 'video',
            content: '',
            duration_seconds: 0,
            completion_required: true,
            order_index: lessons.length
        });
        setIsAdding(true);
        setEditingLessonId(null);
    };

    const handleEditClick = (lesson: Lesson) => {
        setFormData({
            title: lesson.title,
            type: lesson.type,
            content: lesson.content || '',
            duration_seconds: lesson.duration_seconds || 0,
            completion_required: lesson.completion_required,
            order_index: lesson.order_index
        });
        setEditingLessonId(lesson.id);
        setIsAdding(false);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingLessonId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingLessonId) {
                // Update
                const res: any = await updateLesson(editingLessonId, formData);
                if (res.success) {
                    toast.success("Lesson updated");
                    fetchLessons();
                    setEditingLessonId(null);
                }
            } else {
                // Create
                const res: any = await createLesson(courseId, formData);
                if (res.success) {
                    toast.success("Lesson added");
                    fetchLessons();
                    setIsAdding(false);
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to save lesson");
        }
    };

    const handleDelete = async (lessonId: number) => {
        if (!confirm("Are you sure you want to delete this lesson?")) return;
        try {
            await deleteLesson(lessonId);
            toast.success("Lesson deleted");
            // Optimistic update
            setLessons(prev => prev.filter(l => l.id !== lessonId));
        } catch (err: any) {
            toast.error("Failed to delete lesson");
        }
    };

    const handleReorder = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === lessons.length - 1) return;

        const newLessons = [...lessons];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap locally
        const temp = newLessons[index];
        newLessons[index] = newLessons[swapIndex];
        newLessons[swapIndex] = temp;

        // Optimistic Update
        setLessons(newLessons);

        try {
            // Update order logic - simple swap request or batch update
            // For MVP, update both lessons
            const lessonA = newLessons[index];
            const lessonB = newLessons[swapIndex];

            // Only update indices if they actually swapped positions in array
            // Assuming array index implies order for simplistic UI, but we must save actual order_index
            // Let's assume backend respects order_index
            await Promise.all([
                updateLesson(lessonA.id, { order_index: index }),
                updateLesson(lessonB.id, { order_index: swapIndex })
            ]);

            // Re-fetch to confirm consistency
            // fetchLessons();
        } catch (err) {
            toast.error("Failed to reorder");
            fetchLessons(); // Revert
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video className="w-5 h-5 text-blue-600" />;
            case 'pdf': return <File className="w-5 h-5 text-red-600" />;
            case 'external': return <LinkIcon className="w-5 h-5 text-purple-600" />;
            default: return <FileText className="w-5 h-5 text-gray-600" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'video': return 'Video Lesson';
            case 'pdf': return 'PDF Resource';
            case 'external': return 'External Link';
            default: return 'Text Content';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-borderLight pb-6">
                <div>
                    <h3 className="text-lg font-semibold text-textPrimary">
                        Course Curriculum
                    </h3>
                    <p className="text-sm text-mutedText">
                        Manage lessons and organize content order.
                    </p>
                </div>
                {!isAdding && !editingLessonId && (
                    <PrimaryButton onClick={handleAddClick} className="text-sm py-2 px-4 shadow-sm">
                        <Plus className="w-4 h-4 mr-2" /> Add Lesson
                    </PrimaryButton>
                )}
            </div>

            {/* Form Area with better styling */}
            {(isAdding || editingLessonId) && (
                <div className="bg-white border border-borderLight rounded-xl shadow-lg p-6 mb-8 relative animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-xl" />
                    <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        {editingLessonId ? <Edit2 className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                        {editingLessonId ? 'Edit Lesson Details' : 'Add New Lesson'}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-textPrimary mb-1.5">Lesson Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-borderLight px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="e.g., Introduction to React Hooks"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-textPrimary mb-1.5">Content Type</label>
                                <select
                                    className="w-full rounded-lg border border-borderLight px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    <option value="video">Video</option>
                                    <option value="text">Text / Article</option>
                                    <option value="pdf">PDF Document</option>
                                    <option value="external">External Link</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-textPrimary mb-1.5">Duration (Seconds)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 w-4 h-4 text-mutedText" />
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full rounded-lg border border-borderLight pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        value={formData.duration_seconds}
                                        onChange={e => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-textPrimary mb-1.5">
                                    {formData.type === 'video' ? 'Video URL' : formData.type === 'text' ? 'Content Body' : 'Resource Link'}
                                </label>
                                {formData.type === 'text' ? (
                                    <textarea
                                        className="w-full rounded-lg border border-borderLight px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[150px] resize-y"
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Write your lesson content here..."
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-borderLight px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        placeholder={formData.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://example.com/resource'}
                                    />
                                )}
                                <p className="text-xs text-mutedText mt-1.5">
                                    {formData.type === 'video'
                                        ? 'Supported: YouTube, Vimeo, .mp4 links'
                                        : 'Provide a valid URL or content body.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-dashed border-borderLight">
                            <SecondaryButton
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                {editingLessonId ? 'Save Changes' : 'Create Lesson'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            )}

            {/* Lesson List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : lessons.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-xl border-2 border-dashed border-borderLight flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-textPrimary mb-1">No lessons yet</h3>
                    <p className="text-mutedText mb-6 max-w-sm mx-auto">
                        Start building your course curriculum by adding your first lesson.
                    </p>
                    <PrimaryButton onClick={handleAddClick}>
                        <Plus className="w-4 h-4 mr-2" /> Add First Lesson
                    </PrimaryButton>
                </div>
            ) : (
                <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                        <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-4 bg-white border border-borderLight rounded-xl transition-all duration-200 group hover:shadow-md hover:border-primary/20 ${editingLessonId === lesson.id ? 'ring-2 ring-primary border-primary' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="cursor-move text-gray-300 hover:text-gray-500 transition-colors p-1">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="h-10 w-10 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                                    {getIcon(lesson.type)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-textPrimary group-hover:text-primary transition-colors">
                                        {lesson.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-mutedText font-medium">
                                            {getTypeLabel(lesson.type)}
                                        </span>
                                        {(lesson.duration_seconds ?? 0) > 0 && (
                                            <span className="flex items-center text-xs text-mutedText">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {Math.round((lesson.duration_seconds ?? 0) / 60)}m
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <div className="flex flex-col gap-0.5 mr-2">
                                    <button
                                        className="p-1 hover:bg-gray-100 rounded text-mutedText hover:text-textPrimary disabled:opacity-20 transition-colors"
                                        onClick={() => handleReorder(index, 'up')}
                                        disabled={index === 0}
                                        title="Move Up"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        className="p-1 hover:bg-gray-100 rounded text-mutedText hover:text-textPrimary disabled:opacity-20 transition-colors"
                                        onClick={() => handleReorder(index, 'down')}
                                        disabled={index === lessons.length - 1}
                                        title="Move Down"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="h-8 w-px bg-borderLight mx-2" />
                                <button
                                    className="p-2 hover:bg-blue-50 rounded-lg text-mutedText hover:text-blue-600 transition-colors"
                                    onClick={() => handleEditClick(lesson)}
                                    title="Edit Lesson"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    className="p-2 hover:bg-red-50 rounded-lg text-mutedText hover:text-red-600 transition-colors"
                                    onClick={() => handleDelete(lesson.id)}
                                    title="Delete Lesson"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
