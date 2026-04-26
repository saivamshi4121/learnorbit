"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { get } from "@/lib/api";
import { format } from "date-fns";
import { Download, Share2, Award, Printer, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificatePage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const certRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await get<any>(`/events/registrations/${id}/details`);
                if (res.success) {
                    setData(res.data);
                } else {
                    toast.error("Certificate not found or not issued yet.");
                }
            } catch (err) {
                console.error("Failed to fetch certificate data:", err);
                toast.error("Error loading certificate");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const downloadCertificate = async () => {
        if (!certRef.current) return;
        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save(`Certificate_${data?.registration?.user_name || 'Participant'}.pdf`);
            toast.success("Certificate downloaded!");
        } catch (err) {
            console.error("Download failed:", err);
            toast.error("Failed to download certificate");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
            <div>
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Certificate Not Found</h1>
                <p className="text-gray-500 mt-2">This registration may not be approved or certificates are not enabled for this event.</p>
            </div>
        </div>
    );

    const { event, registration } = data;
    const certSettings = event.certificate_settings || {};
    const formData = registration.form_data || {};

    // Extract fields
    const name = registration.user_name || formData["Full Name"] || formData["name"] || "Participant";
    const college = formData["College Name"] || formData["college"] || "N/A";
    const branch = formData["Branch"] || formData["branch"] || "N/A";
    const year = formData["Year"] || formData["year"] || "N/A";

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 flex flex-col items-center">
            <div className="max-w-5xl w-full flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Verified Certificate</h2>
                        <p className="text-xs text-gray-500">ID: {registration.id.slice(0, 8)}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button onClick={downloadCertificate} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all">
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Certificate Template */}
            <div className="w-full flex justify-center overflow-x-auto pb-8 scrollbar-hide">
                <div 
                    ref={certRef}
                    className="relative w-[1123px] h-[794px] bg-white shadow-2xl overflow-hidden select-none flex-shrink-0 origin-top lg:scale-100 md:scale-[0.8] sm:scale-[0.6] scale-[0.35] mb-[-400px] md:mb-[-150px] lg:mb-0"
                    style={{
                        backgroundImage: certSettings.background_url ? `url(${certSettings.background_url})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                {/* Decorative Borders (if no background) */}
                {!certSettings.background_url && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                        <div className="absolute top-0 left-0 h-full w-8 bg-blue-600" />
                        <div className="absolute top-0 right-0 h-full w-8 bg-purple-600" />
                        <div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-gray-100" />
                    </>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-between py-20 px-32 text-center">
                    {/* Header: Logos */}
                    <div className="w-full flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3">
                            <img src="/learnorbit.png" alt="LearnOrbit" className="h-14 object-contain" onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/3135/3135664.png"; // Fallback
                            }} />
                            <span className="text-2xl font-black tracking-tighter text-gray-900">LearnOrbit</span>
                        </div>
                        
                        <div className="flex gap-6 items-center">
                            {certSettings.sponsor_logos?.map((url: string, idx: number) => (
                                <img key={idx} src={url} alt="Sponsor" className="h-12 object-contain opacity-80" />
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <h4 className="text-xl font-bold tracking-[0.2em] text-blue-600 uppercase mb-4">Certificate of Excellence</h4>
                        <p className="text-gray-500 italic text-lg mb-8">This is to certify that</p>
                        
                        <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">{name}</h1>
                        
                        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />
                        
                        <p className="text-gray-700 text-xl leading-relaxed max-w-3xl">
                            of <span className="font-bold text-gray-900">{college}</span>, 
                            studying <span className="font-bold text-gray-900">{branch}</span> ({year} Year), 
                            has successfully participated in the event
                        </p>
                        
                        <h2 className="text-4xl font-black text-blue-600 mt-6 mb-10 tracking-tight">{event.title}</h2>
                        
                        <p className="text-gray-500 text-lg">
                            Held on <span className="font-bold text-gray-900">{event.date ? format(new Date(event.date), 'do MMMM, yyyy') : 'N/A'}</span>
                        </p>
                    </div>

                    {/* Footer: Signature & QR */}
                    <div className="w-full flex justify-between items-end mt-16">
                        <div className="text-left">
                            <div className="w-48 border-b-2 border-gray-900 mb-2" />
                            <p className="font-bold text-gray-900 text-lg">{certSettings.issued_by || 'LearnOrbit Team'}</p>
                            <p className="text-gray-500 text-sm">Authorized Signature</p>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}`} alt="Verification QR" className="w-20 h-20" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verify Authenticity</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none; }
                    body { margin: 0; padding: 0; background: white; }
                    .min-h-screen { background: white; padding: 0; }
                }
            `}</style>
        </div>
    );
}
