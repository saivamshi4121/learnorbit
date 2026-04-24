"use client";

import { useState, useEffect } from "react";
import { get, post, upload } from "@/lib/api";
import { format } from "date-fns";
import { Calendar, MapPin, X, CheckCircle, ArrowRight, DollarSign, QrCode, UploadCloud, Info, Upload } from "lucide-react";
import { toast } from "sonner";

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [registeringFor, setRegisteringFor] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    
    // Dynamic Form state
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [screenshotUrl, setScreenshotUrl] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Helper for file uploads
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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await get<any>('/events');
                if (res.success) setEvents(res.events || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleRegisterClick = (event: any) => {
        setRegisteringFor(event);
        setFormData({});
        setScreenshotUrl("");
        setTransactionId("");
        setSuccess(false);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation for paid events
        if (registeringFor.is_paid && (!screenshotUrl || !transactionId)) {
            toast.error("Please provide payment screenshot and transaction ID");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await post<any>('/events/register', {
                event_id: registeringFor.id,
                form_data: formData,
                payment_screenshot_url: screenshotUrl,
                transaction_id: transactionId
            });
            if (res.success) {
                setSuccess(true);
                toast.success("Registration submitted successfully!");
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "";
            if (errorMsg.includes('DUPLICATE_TRANSACTION')) {
                toast.error("This Transaction ID has already been used!");
            } else {
                toast.error("Failed to submit registration");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Events</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore upcoming webinars, workshops, and meetups. Join our community to learn and grow together.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.length === 0 ? (
                        <div className="col-span-full text-center p-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                            <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl text-gray-500 font-medium">No upcoming events scheduled yet.</p>
                        </div>
                    ) : events.map((event) => (
                        <div key={event.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                {event.image_url ? (
                                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                        <Calendar className="w-12 h-12 text-blue-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg ${
                                        event.status === 'upcoming' ? 'bg-white/90 text-green-600 backdrop-blur' : 'bg-gray-800/80 text-white'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{event.title}</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium">{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <span className="text-sm font-medium">{event.location || 'Online Session'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">
                                            {event.is_paid ? `₹${event.price}` : <span className="text-green-600">FREE</span>}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleRegisterClick(event)}
                                    className="w-full mt-auto py-4 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Register Now <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Registration Modal */}
            {registeringFor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[92vh]">
                        <button 
                            onClick={() => setRegisteringFor(null)}
                            className="absolute top-8 right-8 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-30 shadow-sm"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="overflow-y-auto p-8 md:p-16 custom-scrollbar">
                            {success ? (
                                <div className="text-center py-10 space-y-6">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900">Registration Received!</h3>
                                    <p className="text-gray-600 text-lg">
                                        Thank you for registering for <span className="font-bold text-blue-600">{registeringFor.title}</span>. 
                                        Our team will review your application and update you shortly.
                                    </p>
                                    <button onClick={() => setRegisteringFor(null)} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold">
                                        Got it
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Event Registration</span>
                                        <h3 className="text-3xl font-black text-gray-900 mt-2">{registeringFor.title}</h3>
                                        <p className="text-gray-500 mt-2">Please fill out the details below to secure your spot.</p>
                                    </div>

                                    <form onSubmit={handleFormSubmit} className="space-y-8">
                                        {/* Dynamic Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {registeringFor.registration_fields?.map((field: any, idx: number) => (
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
                                                    ) : field.type === 'radio' ? (
                                                        <div className="space-y-2 mt-2">
                                                            {field.options?.split(',').map((opt: string) => (
                                                                <label key={opt.trim()} className="flex items-center gap-3 cursor-pointer group">
                                                                    <input 
                                                                        type="radio" 
                                                                        name={field.label}
                                                                        required={field.required}
                                                                        value={opt.trim()}
                                                                        onChange={e => setFormData({ ...formData, [field.label]: e.target.value })}
                                                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                                    />
                                                                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{opt.trim()}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    ) : field.type === 'checkbox' ? (
                                                        <div className="space-y-2 mt-2">
                                                            {field.options?.split(',').map((opt: string) => (
                                                                <label key={opt.trim()} className="flex items-center gap-3 cursor-pointer group">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        value={opt.trim()}
                                                                        onChange={e => {
                                                                            const current = formData[field.label] ? formData[field.label].split(', ') : [];
                                                                            let updated;
                                                                            if (e.target.checked) {
                                                                                updated = [...current, opt.trim()];
                                                                            } else {
                                                                                updated = current.filter(o => o !== opt.trim());
                                                                            }
                                                                            setFormData({ ...formData, [field.label]: updated.join(', ') });
                                                                        }}
                                                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                    />
                                                                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{opt.trim()}</span>
                                                                </label>
                                                            ))}
                                                        </div>
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

                                        {/* Payment Section */}
                                        {/* Improved Payment Section */}
                                        {registeringFor.is_paid && (
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
                                                        <div className="text-4xl font-black text-blue-600 tracking-tighter">₹{registeringFor.price}</div>
                                                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Entry Fee</div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col lg:flex-row gap-8 items-start">
                                                    {/* QR Code Card */}
                                                    <div className="w-full lg:w-44 h-44 bg-white rounded-[2rem] p-4 border border-blue-100 shadow-2xl shadow-blue-100/50 flex-shrink-0 transition-all hover:scale-105">
                                                        <img 
                                                            src={registeringFor.qr_code_url || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LearnOrbitPayment"} 
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
            )}
        </div>
    );
}
