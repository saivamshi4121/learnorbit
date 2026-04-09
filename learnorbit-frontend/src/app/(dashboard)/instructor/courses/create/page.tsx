"use client";

import React, { useState } from "react";
import CourseForm from "@/components/instructor/CourseForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { InstructorCourse } from "@/types/instructor";
import { post } from "@/lib/api";

export default function CreateCoursePage() {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [aiData, setAiData] = useState<Partial<InstructorCourse> | null>(null);

    const generateWithAI = async () => {
        if (!topic.trim()) {
            toast.error("Please enter a topic first.");
            return;
        }

        setLoading(true);
        try {
            const data = await post<{ title: string; modules: any[] }>("/ai/course-outline", { topic });
            
            // Format modules into description
            let description = `Course outline for ${data.title}:\n\n`;
            if (data.modules && Array.isArray(data.modules)) {
                data.modules.forEach((mod: any, index: number) => {
                    description += `Module ${index + 1}: ${mod.moduleTitle}\n`;
                    if (mod.lessons && Array.isArray(mod.lessons)) {
                        mod.lessons.forEach((lesson: string) => {
                            description += `  - ${lesson}\n`;
                        });
                    }
                    description += `\n`;
                });
            }

            setAiData({
                title: data.title,
                description: description.trim(),
                is_published: false,
                thumbnail_url: ""
            });
            toast.success("Course outline generated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to generate course outline");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto py-10 px-4">
            <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm">
                <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI Course Outline Generator
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input 
                        placeholder="e.g. Machine Learning for Beginners" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={loading}
                        className="flex-1"
                    />
                    <Button 
                        onClick={generateWithAI} 
                        disabled={loading || !topic.trim()} 
                        className="bg-purple-600 hover:bg-purple-700 text-white min-w-[200px]"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        {loading ? "Generating Outline..." : "Generate with AI"}
                    </Button>
                </div>
            </div>

            {/* We recreate CourseForm to inject the initial data easily without refactoring CourseForm entirely */}
            {/* The 'key' ensures that CourseForm is remounted when aiData is updated. */}
            <div key={aiData ? aiData.title : 'default'}>
                <CourseForm initialData={aiData as any} isCustomEdit={false} />
            </div>
        </div>
    );
}
