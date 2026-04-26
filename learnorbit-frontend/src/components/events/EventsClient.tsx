"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, MapPin, ArrowRight, DollarSign, Share2, ChevronLeft, Info } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Event } from "@/lib/services/events.service";

// Defer loading the heavy modal until needed
const RegistrationModal = dynamic(() => import("@/components/events/RegistrationModal"), { ssr: false });

export default function EventsClient({ initialEvents }: { initialEvents: Event[] }) {
    const router = useRouter();
    const [registeringFor, setRegisteringFor] = useState<Event | null>(null);

    const handleShare = async (event: Event) => {
        const shareData = {
            title: event.title,
            text: `Check out this event: ${event.title} on LearnOrbit!`,
            url: typeof window !== 'undefined' ? window.location.href : '', 
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                toast.success("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-24 px-6 relative overflow-hidden">
            {/* Background Orbs for WOW factor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto relative">
                <button 
                    onClick={() => router.back()}
                    className="absolute -top-12 left-0 group flex items-center gap-1.5 text-gray-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back</span>
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">
                        Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Events.</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Explore upcoming webinars, workshops, and meetups. Join our community to learn and grow together.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {initialEvents.length === 0 ? (
                        <div className="col-span-full text-center py-32 px-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Info className="w-10 h-10 text-gray-300" />
                            </div>
                            <p className="text-2xl text-gray-400 font-bold tracking-tight">No upcoming events yet.</p>
                            <p className="text-gray-400 mt-2">Check back soon for exciting updates!</p>
                        </div>
                    ) : initialEvents.map((event) => (
                        <div key={event.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col hover:-translate-y-2">
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                {event.image_url ? (
                                    <Image 
                                        src={event.image_url} 
                                        alt={event.title} 
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                        <Calendar className="w-16 h-16 text-blue-200" />
                                    </div>
                                )}
                                
                                <div className="absolute top-5 right-5">
                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${
                                        event.status === 'upcoming' ? 'bg-white/90 text-green-600' : 'bg-gray-900/90 text-white'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                                
                                <div className="absolute top-5 left-5">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare(event);
                                        }}
                                        className="p-3 bg-white/90 hover:bg-white text-gray-700 rounded-full backdrop-blur-md shadow-lg transition-all active:scale-90"
                                        title="Share Event"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-10 flex-1 flex flex-col">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-blue-600 transition-colors leading-tight">{event.title}</h2>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold">{event.date ? format(new Date(event.date), 'MMMM d, yyyy') : 'Date TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold">{event.location || 'Online Session'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-black text-gray-900">
                                            {event.is_paid ? `₹${event.price}` : <span className="text-green-600">FREE</span>}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setRegisteringFor(event)}
                                    className="w-full py-5 bg-gray-900 hover:bg-blue-600 text-white rounded-[1.5rem] font-black transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                                >
                                    Register Now <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Registration Modal - Only rendered on client, only loaded when needed */}
            {registeringFor && (
                <RegistrationModal 
                    event={registeringFor} 
                    onClose={() => setRegisteringFor(null)} 
                    handleShare={handleShare}
                />
            )}
        </div>
    );
}
