"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, UploadCloud, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/Switch";
import { createCourse, updateCourse, uploadFile } from "@/lib/services/instructor.service";
import { InstructorCourse } from "@/types/instructor";

// Schema Validation
const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    thumbnail_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    is_published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
    initialData?: InstructorCourse;
    isCustomEdit?: boolean; // To distinguish edit mode
}

export default function CourseForm({ initialData }: CourseFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadMode, setUploadMode] = useState<"link" | "upload">("link");
    const isEditing = !!initialData;

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            thumbnail_url: initialData?.thumbnail_url || "",
            is_published: initialData?.is_published || false,
        },
    });

    const [imageError, setImageError] = useState(false);
    const thumbnailUrl = watch("thumbnail_url");

    // Switch to link mode if loaded image URL is external (though uploaded is also URL)
    React.useEffect(() => {
        if (initialData?.thumbnail_url && !initialData.thumbnail_url.includes("/uploads/")) {
            setUploadMode("link");
        } else if (initialData?.thumbnail_url) {
            setUploadMode("upload"); // Or link, really doesn't matter much as both end up as URL
        }
    }, [initialData]);

    // Handle File Upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        try {
            setUploadingFile(true);
            const response = await uploadFile(file);
            console.log("Upload response:", response);
            if (response.success) {
                setValue("thumbnail_url", response.url);
                toast.success("Image uploaded successfully");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error uploading image");
        } finally {
            setUploadingFile(false);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            if (isEditing && initialData) {
                await updateCourse(initialData.id, data);
                toast.success("Course updated successfully");
            } else {
                // Assuming createCourse handles is_published or we default it
                // The service signature might strictly define fields, we'll cast or just pass it
                // But for now we try to pass it.
                await createCourse(data as any);
                toast.success("Course created successfully");
            }
            router.push("/instructor/courses");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            if (error?.response?.status === 403) {
                toast.error("You do not have permission to perform this action.");
            } else {
                toast.error(isEditing ? "Failed to update course" : "Failed to create course");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/instructor/courses" className="text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        {isEditing ? "Edit Course" : "Create New Course"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditing ? "Update your course content and settings." : "Fill in the details to launch your new course."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Section 1: Basic Information */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Advanced React Patterns"
                                {...register("title")}
                                disabled={loading}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Write a brief description of your course..."
                                className="min-h-[120px] resize-y"
                                {...register("description")}
                                disabled={loading}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 2: Thumbnail */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-medium text-gray-900">Thumbnail</h3>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setUploadMode("link")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${uploadMode === "link" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Link
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode("upload")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${uploadMode === "upload" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Upload
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail_url">
                                {uploadMode === "link" ? "Thumbnail URL" : "Upload Image"}
                            </Label>

                            {uploadMode === "link" ? (
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="thumbnail_url"
                                            placeholder="https://..."
                                            className="pl-9"
                                            {...register("thumbnail_url")}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileUpload}
                                        disabled={uploadingFile}
                                    />
                                    {uploadingFile ? (
                                        <>
                                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                            <span className="text-sm text-gray-500">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-8 w-8 text-gray-400" />
                                            <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                                            <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                                        </>
                                    )}
                                </div>
                            )}

                            {errors.thumbnail_url && (
                                <p className="text-sm text-red-500">{errors.thumbnail_url.message}</p>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="mt-4">
                            <Label className="mb-2 block">Preview</Label>
                            <div className="relative aspect-video w-full max-w-sm rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                                {thumbnailUrl && !imageError ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={thumbnailUrl}
                                        alt="Course thumbnail"
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <ImageIcon className="h-8 w-8 mb-2" />
                                        <span className="text-xs">
                                            {thumbnailUrl && imageError ? "Invalid Image URL" : "No image provided"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Publishing */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-medium text-gray-900">Publishing</h3>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_published" className="text-base">Publish Course</Label>
                            <p className="text-sm text-gray-500">
                                Draft courses are only visible to you. Published courses are visible to students.
                            </p>
                        </div>
                        <Controller
                            control={control}
                            name="is_published"
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={loading}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <Link href="/instructor/courses">
                        <Button type="button" variant="outline" disabled={loading}>
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="min-w-[120px]">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Course"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
