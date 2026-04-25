"use client";

import { useState } from "react";
import { X, CheckCircle, QrCode, UploadCloud, Share2 } from "lucide-react";
import { toast } from "sonner";
import { upload } from "@/lib/api";
import { registerForEvent, Event } from "@/lib/services/events.service";

interface RegistrationModalProps {
    event: Event;
    onClose: () => void;
    handleShare: (event: Event) => void;
}

export default function RegistrationModal({ event, onClose, handleShare }: RegistrationModalProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [screenshotUrl, setScreenshotUrl] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const res = await upload<any>('/upload', file);
            if (res.success) {
                setScreenshotUrl(res.url);
                toast.success("Screenshot uploaded");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (event.is_paid && (!screenshotUrl || !transactionId)) {
            toast.error("Please provide payment screenshot and transaction ID");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await registerForEvent({
                event_id: event.id,
                form_data: formData,
                payment_screenshot_url: screenshotUrl,
                transaction_id: transactionId
            });
            if (res.success) {
                setSuccess(true);
                toast.success("Registration submitted successfully!");
            }
        } catch (error: any) {
            const errorData = error.response?.data || {};
            const errorMsg = errorData.error || "";
            
            if (errorMsg === 'ALREADY_REGISTERED') {
                setAlreadyRegistered(true);
                setStatusMessage(errorData.message || "You are already registered! 🌟");
            } else if (errorMsg.includes('DUPLICATE_TRANSACTION')) {
                toast.error("This Transaction ID has already been used!");
            } else {
                toast.error("Failed to submit registration");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[92vh]">
                <div className="absolute top-8 right-8 flex gap-2 z-30">
                    <button 
                        onClick={() => handleShare(event)}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shadow-sm"
                        title="Share Event"
                    >
                        <Share2 className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={onClose}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shadow-sm"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-8 md:p-16 custom-scrollbar">
                    {success ? (
                        <div className="text-center py-10 space-y-6">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900">Registration Received!</h3>
                            <p className="text-gray-600 text-lg">
                                Thank you for registering for <span className="font-bold text-blue-600">{event.title}</span>. 
                                Our team will review your application and update you shortly.
                            </p>
                            <button onClick={onClose} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold">
                                Got it
                            </button>
                        </div>
                    ) : alreadyRegistered ? (
                        <div className="text-center py-6 md:py-10 space-y-6 md:space-y-8">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <QrCode className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">Already with us! 🌟</h3>
                                <p className="text-gray-600 text-base md:text-xl px-2 md:px-4 max-w-lg mx-auto">
                                    {statusMessage}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-blue-100 mx-auto max-w-lg">
                                <p className="text-blue-700 text-sm md:text-base font-medium leading-relaxed">
                                    We have your details securely saved. You'll receive all updates for <span className="font-bold text-blue-800">{event.title}</span> directly in your inbox.
                                </p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="w-full md:w-auto px-10 py-4 md:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl md:rounded-3xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                            >
                                Perfect, thanks!
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10">
                                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Event Registration</span>
                                <h3 className="text-3xl font-black text-gray-900 mt-2">{event.title}</h3>
                                <p className="text-gray-500 mt-2">Please fill out the details below to secure your spot.</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {event.registration_fields?.map((field: any, idx: number) => (
                                        <div key={idx} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            {field.type === 'textarea' ? (
                                                <textarea 
                                                    required={field.required}
                                                    onChange={e => setFormData({ ...formData, [field.label]: e.target.value })}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all"
                                                    rows={3}
                                                />
                                            ) : field.type === 'select' ? (
                                                <select 
                                                    required={field.required}
                                                    onChange={e => setFormData({ ...formData, [field.label]: e.target.value })}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                                                >
                                                    <option value="">Select an option</option>
                                                    {field.options?.split(',').map((opt: string) => (
                                                        <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input 
                                                    type={field.type}
                                                    required={field.required}
                                                    onChange={e => setFormData({ ...formData, [field.label]: e.target.value })}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {event.is_paid && (
                                    <div className="mt-8 bg-blue-50/50 rounded-[2.5rem] p-8 border border-blue-100 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 text-white">
                                                    <QrCode className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 text-xl tracking-tight">Secure Payment</h4>
                                                    <p className="text-sm text-gray-500">Scan QR and enter details below</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-4xl font-black text-blue-600 tracking-tighter">₹{event.price}</div>
                                                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Entry Fee</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                                            <div className="w-full lg:w-44 h-44 bg-white rounded-[2rem] p-4 border border-blue-100 shadow-2xl shadow-blue-100/50 flex-shrink-0 transition-all hover:scale-105">
                                                <img 
                                                    src={event.qr_code_url || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LearnOrbitPayment"} 
                                                    className="w-full h-full object-contain rounded-2xl"
                                                    alt="Payment QR"
                                                />
                                            </div>

                                            <div className="flex-1 space-y-6 w-full">
                                                <div className="space-y-2.5">
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">UPI Transaction ID *</label>
                                                    <input 
                                                        type="text" 
                                                        required 
                                                        value={transactionId}
                                                        onChange={e => setTransactionId(e.target.value)}
                                                        placeholder="12-digit transaction ID"
                                                        className="w-full px-7 py-4.5 bg-white border border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-mono text-sm shadow-inner"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2.5">
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Payment Confirmation *</label>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                                        className="hidden" 
                                                        id="screenshot-upload" 
                                                    />
                                                    <label 
                                                        htmlFor="screenshot-upload"
                                                        className={`flex items-center justify-center gap-4 w-full px-7 py-4.5 border-2 border-dashed rounded-2xl cursor-pointer transition-all shadow-sm ${
                                                            screenshotUrl ? 'border-green-500 bg-green-50/50 text-green-700' : 'border-blue-200 bg-white hover:border-blue-500 hover:bg-blue-50 text-blue-500'
                                                        }`}
                                                    >
                                                        {uploading ? (
                                                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : screenshotUrl ? (
                                                            <CheckCircle className="w-6 h-6" />
                                                        ) : <UploadCloud className="w-6 h-6 opacity-70" />}
                                                        <span className="text-sm font-black tracking-tight">
                                                            {screenshotUrl ? 'Screenshot Attached' : 'Upload Payment Screenshot'}
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-500/30 transition-all transform active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing...' : 'Submit Registration'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
