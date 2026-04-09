"use client";

import React, { useState } from "react";
import { Loader2, Sparkles, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { post } from "@/lib/api";
import { createLesson } from "@/lib/services/lessons.service";
import { useRouter } from "next/navigation";

interface QuizGeneratorProps {
    courseId: number | string;
    onQuizSaved: () => void;
}

export default function QuizGenerator({ courseId, onQuizSaved }: QuizGeneratorProps) {
    const router = useRouter();
    const [lessonText, setLessonText] = useState("");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    const generateQuiz = async () => {
        if (!lessonText.trim()) {
            toast.error("Please enter some lesson text first.");
            return;
        }

        setLoading(true);
        try {
            const data = await post<{ questions: any[] }>("/ai/generate-quiz", { lessonText });
            if (data && data.questions) {
                setQuestions(data.questions);
                toast.success("Quiz generated successfully!");
            } else {
                toast.error("Invalid format received from AI");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to generate quiz");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionChange = (index: number, field: string, value: string) => {
        const newQs = [...questions];
        newQs[index][field] = value;
        setQuestions(newQs);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQs = [...questions];
        newQs[qIndex].options[oIndex] = value;
        setQuestions(newQs);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "", explanation: "" }]);
    };

    const removeQuestion = (index: number) => {
        const newQs = [...questions];
        newQs.splice(index, 1);
        setQuestions(newQs);
    };

    const saveQuiz = async () => {
        if (questions.length === 0) return;
        setSaving(true);
        try {
            // Validate all options are filled
            for (let q of questions) {
                if (!q.question || !q.answer || q.options.some((o: string) => !o.trim())) {
                    toast.error("Please fill all fields before saving.");
                    setSaving(false);
                    return;
                }
            }

            // Save as a JSON string inside the text lesson or we can save it as formatted markdown
            const quizContent = JSON.stringify(questions);
            
            const result = await createLesson(courseId as number, {
                title: "AI Generated Quiz",
                type: "text",
                content: quizContent,
                is_published: true,
                completion_rule: "manual",
                duration_seconds: 600
            });

            if (result.success) {
                toast.success("Quiz saved successfully to curriculum!");
                setQuestions([]);
                setLessonText("");
                onQuizSaved(); // Trigger refresh of curriculum
            } else {
                toast.error("Failed to save quiz");
            }
        } catch (error) {
            toast.error("An error occurred while saving the quiz");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Quiz Generator
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Paste your lesson content below, and the AI will automatically generate multiple-choice questions for you. You can review and edit them before saving.
            </p>

            <div className="space-y-4">
                <Label>Lesson Content</Label>
                <Textarea 
                    placeholder="Enter lesson text here..." 
                    className="min-h-[150px] resize-y"
                    value={lessonText}
                    onChange={(e) => setLessonText(e.target.value)}
                    disabled={loading || saving}
                />

                <Button 
                    onClick={generateQuiz} 
                    disabled={loading || !lessonText.trim() || saving} 
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    {loading ? "Generating Quiz..." : "Generate Quiz with AI"}
                </Button>
            </div>

            {questions.length > 0 && (
                <div className="mt-8 space-y-6">
                    <h4 className="text-lg font-semibold border-b pb-2">Generated Questions</h4>
                    
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-slate-50 border p-4 rounded-md relative">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700" 
                                onClick={() => removeQuestion(qIndex)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            <div className="space-y-3 mr-8">
                                <div>
                                    <Label>Question {qIndex + 1}</Label>
                                    <Input 
                                        value={q.question} 
                                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)} 
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {q.options.map((opt: string, oIndex: number) => (
                                        <div key={oIndex}>
                                            <Label className="text-xs text-gray-500">Option {oIndex + 1}</Label>
                                            <Input 
                                                value={opt} 
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <Label>Correct Answer</Label>
                                        <Input 
                                            value={q.answer} 
                                            onChange={(e) => handleQuestionChange(qIndex, 'answer', e.target.value)} 
                                            placeholder="Must exactly match one option"
                                        />
                                    </div>
                                    <div>
                                        <Label>Explanation</Label>
                                        <Input 
                                            value={q.explanation} 
                                            onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between border-t pt-4">
                        <Button variant="outline" onClick={addQuestion}>
                            <Plus className="h-4 w-4 mr-2" /> Add Question
                        </Button>
                        <Button onClick={saveQuiz} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {saving ? "Saving..." : "Save Quiz to Curriculum"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
