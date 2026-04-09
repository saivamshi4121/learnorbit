"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Pencil, Trash2, Link as LinkIcon, Video, FileText, File, ArrowUp, ArrowDown, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/Switch";
import { Lesson, CreateLessonPayload, createLesson, updateLesson, deleteLesson, reorderLesson } from "@/lib/services/lessons.service";

// ==========================================
// Types & Schemas
// ==========================================

const lessonSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    type: z.enum(["video", "text", "pdf", "external"]),
    duration_seconds: z.coerce.number().min(0).optional(),
    completion_rule: z.enum(["manual", "percentage"]),
    content: z.string().optional(),
    url: z.string().optional(),
    thumbnail_url: z.string().optional(),
    is_published: z.boolean().default(true),
}).superRefine((data, ctx) => {
    if (["video", "pdf", "external"].includes(data.type)) {
        if (!data.url || data.url.length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["url"],
                message: "URL is required for this lesson type",
            });
        }
    }
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface CurriculumProps {
    courseId: number | string;
    initialLessons: Lesson[];
}

// ==========================================
// Simple Components (Replacing missing UI)
// ==========================================

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "outline" }) => {
    const classes = variant === "outline"
        ? "border border-gray-200 text-gray-500 bg-gray-50"
        : "bg-primary text-primary-foreground hover:bg-primary/80";
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${classes}`}>
            {children}
        </span>
    );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Main Curriculum Component
// ==========================================
export default function Curriculum({ courseId, initialLessons }: CurriculumProps) {
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [deleteLessonId, setDeleteLessonId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LessonFormValues>({
        resolver: zodResolver(lessonSchema) as any,
        defaultValues: {
            title: "",
            type: "video",
            duration_seconds: 0,
            completion_rule: "manual",
            content: "",
            url: "",
            thumbnail_url: "",
            is_published: true,
        }
    });

    const lessonType = watch("type");

    const onOpenModal = (lesson?: Lesson) => {
        if (lesson) {
            setEditingLesson(lesson);
            reset({
                title: lesson.title,
                type: lesson.type,
                duration_seconds: lesson.duration_seconds || 0,
                completion_rule: lesson.completion_rule || 'manual',
                content: lesson.content || "",
                url: lesson.url || "",
                thumbnail_url: lesson.thumbnail_url || "",
                is_published: lesson.is_published,
            });
        } else {
            setEditingLesson(null);
            reset({
                title: "",
                type: "video",
                duration_seconds: 0,
                completion_rule: "manual",
                content: "",
                url: "",
                thumbnail_url: "",
                is_published: true,
            });
        }
        setIsModalOpen(true);
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            if (editingLesson) {
                await updateLesson(editingLesson.id, data);
                setLessons((prev) => prev.map((l) => (l.id === editingLesson.id ? { ...l, ...data } : l)));
                toast.success("Lesson updated");
            } else {
                const newOrderIndex = lessons.length;
                const result = await createLesson(courseId, { ...data, order_index: newOrderIndex });
                if (result.success) {
                    // Re-fetch entire list to be safe or append with ID
                    // Since result.data likely contains the full object including ID:
                    setLessons((prev) => [...prev, result.data]);
                    toast.success("Lesson created");
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to save lesson");
        } finally {
            setLoading(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (!deleteLessonId) return;
        try {
            await deleteLesson(deleteLessonId);
            setLessons((prev) => prev.filter((l) => l.id !== deleteLessonId));
            toast.success("Lesson deleted");
        } catch (error) {
            toast.error("Failed to delete lesson");
        } finally {
            setDeleteLessonId(null);
        }
    };

    const moveLesson = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === lessons.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const lessonToMove = lessons[index];
        const lessonToSwap = lessons[newIndex];

        const newLessons = [...lessons];
        newLessons[index] = lessonToSwap;
        newLessons[newIndex] = lessonToMove;

        // Optimistic update
        setLessons(newLessons);

        try {
            // Send reorder request for the moved item
            // The API might expect us to send reorder commands for both or the system handles shifts?
            // Assuming strict backend logic: we tell it "Lesson X is now at index Y"
            await reorderLesson(lessonToMove.id, newIndex);
            // If the backend doesn't auto-shift others, we might need to call it for the swapped one too.
            // For simplicity/robustness in MVP, we might want to just re-fetch or assume backend handles "insert at index" logic.
        } catch (error) {
            toast.error("Failed to reorder");
            setLessons(lessons); // Revert
        }
    };

    const Icon = ({ type }: { type: string }) => {
        switch (type) {
            case 'video': return <Video className="h-4 w-4 text-blue-500" />;
            case 'text': return <FileText className="h-4 w-4 text-green-500" />;
            case 'pdf': return <File className="h-4 w-4 text-red-500" />;
            default: return <LinkIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="mt-12 pt-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Curriculum</h2>
                    <p className="text-sm text-gray-500">Manage your course lessons and content.</p>
                </div>
                <Button onClick={() => onOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lesson
                </Button>
            </div>

            {lessons.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No lessons yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Start building your structured curriculum.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {lessons.map((lesson, index) => (
                        <div
                            key={lesson.id}
                            className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 group hover:border-gray-300 transition-colors"
                        >
                            <div className="flex flex-col gap-1 text-gray-400">
                                <button
                                    disabled={index === 0}
                                    onClick={() => moveLesson(index, 'up')}
                                    className="hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                    disabled={index === lessons.length - 1}
                                    onClick={() => moveLesson(index, 'down')}
                                    className="hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-xs font-medium text-gray-500 shrink-0">
                                {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Icon type={lesson.type} />
                                    <h4 className="text-sm font-medium text-gray-900 truncate">{lesson.title}</h4>
                                    {!lesson.is_published && (
                                        <Badge variant="outline">Draft</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>{lesson.duration_seconds ? `${Math.round(lesson.duration_seconds)}m` : '0m'}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="capitalize">{lesson.type}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>{lesson.completion_rule === 'percentage' ? 'Watch 90%' : 'Manual'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-gray-900" onClick={() => onOpenModal(lesson)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-red-600" onClick={() => setDeleteLessonId(lesson.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingLesson ? "Edit Lesson" : "Add Lesson"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Title</Label>
                            <Input {...register("title")} placeholder="e.g. Introduction to Variables" />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <Label>Type</Label>
                            <div className="mt-1">
                                <select
                                    {...register("type")}
                                    disabled={!!editingLesson} // Maybe prevent type change on edit to avoid data loss issues? or allow it.
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="video">Video</option>
                                    <option value="text">Text</option>
                                    <option value="pdf">PDF</option>
                                    <option value="external">External Link</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label>Completion Rule</Label>
                            <div className="mt-1">
                                <select
                                    {...register("completion_rule")}
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="manual">Manual Complete</option>
                                    <option value="percentage">Watch 90%</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label>Duration (minutes)</Label>
                            <Input type="number" {...register("duration_seconds")} placeholder="e.g. 10" />
                        </div>

                        <div className="flex items-center space-x-2 pt-8">
                            <Label>Published</Label>
                            <Switch
                                checked={watch('is_published')}
                                onCheckedChange={(c) => setValue('is_published', c)}
                            />
                        </div>

                        {/* Dynamic Fields */}
                        <div className="col-span-2 space-y-4 pt-2 border-t border-gray-100">
                            {lessonType === 'video' && (
                                <>
                                    <div>
                                        <Label>Video URL</Label>
                                        <div className="relative">
                                            <Video className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input className="pl-9" {...register("url")} placeholder="https://vimeo.com/..." />
                                        </div>
                                        {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
                                    </div>
                                    <div>
                                        <Label>Thumbnail URL (Optional)</Label>
                                        <Input {...register("thumbnail_url")} placeholder="https://..." />
                                    </div>
                                </>
                            )}

                            {lessonType === 'text' && (
                                <div>
                                    <Label>Content (Markdown)</Label>
                                    <Textarea
                                        {...register("content")}
                                        className="font-mono text-sm min-h-[200px]"
                                        placeholder="# Lesson Content..."
                                    />
                                </div>
                            )}

                            {(lessonType === 'pdf' || lessonType === 'external') && (
                                <div>
                                    <Label>{lessonType === 'pdf' ? 'PDF URL' : 'Link URL'}</Label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input className="pl-9" {...register("url")} placeholder="https://..." />
                                    </div>
                                    {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingLesson ? "Update Lesson" : "Add Lesson"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Dialog - Simple Modal */}
            <Modal
                isOpen={deleteLessonId !== null}
                onClose={() => setDeleteLessonId(null)}
                title="Delete Lesson?"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete this lesson? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setDeleteLessonId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={onDeleteConfirm}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
