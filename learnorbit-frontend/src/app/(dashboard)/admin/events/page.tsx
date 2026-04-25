"use client";

import { useState, useEffect } from "react";
import { post, get, del, patch, upload } from "@/lib/api";
import { format } from "date-fns";
import { Calendar, MapPin, Plus, Trash2, Edit, X, Check, Eye, DollarSign, QrCode, ClipboardList, Users, Upload, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdminEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingEvent, setEditingEvent] = useState<string | null>(null);
    const [viewingRegistrations, setViewingRegistrations] = useState<string | null>(null);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [regLoading, setRegLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    
    // Search and Pagination state
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // CSV Download helper
    const downloadAttendees = (eventId: string, eventTitle: string, data: any[]) => {
        if (data.length === 0) {
            toast.error("No attendees to download");
            return;
        }

        // Prepare headers (ID, Name, Email, Status, Custom Fields, Date)
        const allFormKeys = new Set<string>();
        data.forEach(reg => {
            Object.keys(reg.form_data || {}).forEach(k => allFormKeys.add(k));
        });
        const formKeys = Array.from(allFormKeys);

        const headers = ["Registration ID", "Status", "User Name", "User Email", "Transaction ID", ...formKeys, "Registration Date"];
        
        const rows = data.map(reg => [
            reg.id,
            reg.status,
            reg.user_name || (reg.form_data['Full Name'] || reg.form_data['name'] || "Guest"),
            reg.user_email || (reg.form_data['Email Address'] || reg.form_data['email'] || "N/A"),
            reg.transaction_id || "N/A",
            ...formKeys.map(k => {
                const val = reg.form_data[k];
                // Escape commas and quotes for CSV
                return typeof val === 'string' ? val.replace(/"/g, '""').replace(/,/g, ';') : val;
            }),
            format(new Date(reg.created_at), 'yyyy-MM-dd HH:mm:ss')
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(val => `"${val}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Attendees_${eventTitle.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Attendee list downloaded");
    };
    
    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState("upcoming");
    
    // Form Builder state
    const [fields, setFields] = useState<any[]>([
        { label: "Full Name", type: "text", required: true },
        { label: "Email Address", type: "email", required: true }
    ]);
    
    // Payment state
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState("0");
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await get<any>('/events');
            if (res.success) {
                setEvents(res.events || []);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Helper for file uploads
    const handleFileUpload = async (file: File, type: 'image' | 'qr') => {
        try {
            setUploading(type);
            const res = await upload<any>('/upload', file);
            if (res.success) {
                if (type === 'image') setImageUrl(res.url);
                else setQrCodeUrl(res.url);
                toast.success("File uploaded successfully");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(null);
        }
    };

    const addField = () => {
        setFields([...fields, { label: "", type: "text", required: false }]);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index: number, key: string, value: any) => {
        const newFields = [...fields];
        newFields[index][key] = value;
        setFields(newFields);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const eventData = {
                title, 
                description, 
                date, 
                location, 
                image_url: imageUrl, 
                status,
                registration_fields: fields,
                is_paid: isPaid,
                price: parseFloat(price),
                qr_code_url: qrCodeUrl
            };

            let res;
            if (editingEvent) {
                res = await patch<any>(`/events/${editingEvent}`, eventData);
            } else {
                res = await post<any>('/events', eventData);
            }

            if (res.success) {
                toast.success(editingEvent ? "Event updated successfully" : "Event created successfully");
                setIsCreating(false);
                setEditingEvent(null);
                resetForm();
                fetchEvents();
            }
        } catch (err) {
            console.error("Failed to save event:", err);
            toast.error("Failed to save event");
        }
    };

    const handleEdit = (event: any) => {
        setEditingEvent(event.id);
        setTitle(event.title);
        setDescription(event.description);
        // Format date for datetime-local input
        const d = new Date(event.date);
        const formattedDate = d.toISOString().slice(0, 16);
        setDate(formattedDate);
        setLocation(event.location || "");
        setImageUrl(event.image_url || "");
        setStatus(event.status);
        setFields(event.registration_fields || []);
        setIsPaid(event.is_paid);
        setPrice(event.price.toString());
        setQrCodeUrl(event.qr_code_url || "");
        setIsCreating(true);
        setViewingRegistrations(null);
    };

    const resetForm = () => {
        setTitle(""); setDescription(""); setDate(""); setLocation(""); setImageUrl(""); setStatus("upcoming");
        setFields([{ label: "Full Name", type: "text", required: true }, { label: "Email Address", type: "email", required: true }]);
        setIsPaid(false); setPrice("0"); setQrCodeUrl("");
        setEditingEvent(null);
    };

    const handleDelete = async (id: string, eventTitle: string) => {
        const confirmMsg = `Are you sure you want to delete "${eventTitle}"? \n\nCRITICAL: This will permanently delete ALL registration data and attendee records from the database. \n\nPlease download the attendee list first if you need to keep a record.`;
        if (!window.confirm(confirmMsg)) return;
        
        try {
            const res = await del<any>(`/events/${id}`);
            if (res.success) {
                toast.success("Event and all related data deleted");
                fetchEvents();
            }
        } catch (err) {
            console.error("Failed to delete event:", err);
            toast.error("Failed to delete event");
        }
    };

    const fetchRegistrations = async (eventId: string) => {
        try {
            setRegLoading(true);
            setViewingRegistrations(eventId);
            setSearchTerm("");
            setCurrentPage(1);
            const res = await get<any>(`/events/${eventId}/registrations`);
            if (res.success) {
                setRegistrations(res.registrations || []);
            }
        } catch (error) {
            toast.error("Failed to load registrations");
        } finally {
            setRegLoading(false);
        }
    };

    // Filtered and Paginated Registrations
    const filteredRegistrations = registrations.filter(reg => {
        const search = searchTerm.toLowerCase();
        const nameMatch = (reg.user_name || "").toLowerCase().includes(search);
        const emailMatch = (reg.user_email || "").toLowerCase().includes(search);
        const phoneMatch = (reg.user_phone || "").toLowerCase().includes(search);
        const formDataMatch = Object.values(reg.form_data || {}).some(val => 
            String(val).toLowerCase().includes(search)
        );
        return nameMatch || emailMatch || phoneMatch || formDataMatch;
    });

    const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
    const paginatedRegistrations = filteredRegistrations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const updateRegStatus = async (regId: string, status: string) => {
        try {
            const res = await patch<any>(`/events/registrations/${regId}/status`, { status });
            if (res.success) {
                toast.success(`Status updated to ${status}`);
                setRegistrations(registrations.map(r => r.id === regId ? { ...r, status } : r));
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Events & Form Builder</h1>
                    <p className="text-sm text-gray-500 mt-1">Design registration forms and manage payments.</p>
                </div>
                <button 
                    onClick={() => { 
                        if (isCreating) resetForm();
                        setIsCreating(!isCreating); 
                        setViewingRegistrations(null); 
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    {isCreating ? 'Back to List' : <><Plus className="w-4 h-4" /> Create Event</>}
                </button>
            </div>

            {isCreating ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" /> {editingEvent ? 'Edit Event' : 'Basic Information'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title *</label>
                                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g. Annual Tech Summit 2024" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time *</label>
                                    <input type="datetime-local" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Online or Venue Address" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Cover Image</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image')}
                                                className="hidden" 
                                                id="event-image-upload" 
                                            />
                                            <label 
                                                htmlFor="event-image-upload"
                                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                                            >
                                                {uploading === 'image' ? (
                                                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                ) : <Upload className="w-5 h-5 text-gray-400" />}
                                                <span className="text-sm font-medium text-gray-600">
                                                    {imageUrl ? 'Change Image' : 'Upload Cover Image'}
                                                </span>
                                            </label>
                                        </div>
                                        {imageUrl && (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                    <textarea rows={4} required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="What is this event about?"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="upcoming">Upcoming</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Form Builder */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-between">
                                <span className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-purple-600" /> Custom Registration Form</span>
                                <button type="button" onClick={addField} className="text-sm bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1.5">
                                    <Plus className="w-4 h-4" /> Add Field
                                </button>
                            </h2>
                            <div className="space-y-4">
                                {fields.map((field, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex-1 w-full">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Field Label</label>
                                            <input type="text" value={field.label} onChange={e => updateField(idx, 'label', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="e.g. WhatsApp Number" />
                                        </div>
                                        <div className="w-full md:w-40">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                                            <select value={field.type} onChange={e => updateField(idx, 'type', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white">
                                                <option value="text">Text</option>
                                                <option value="email">Email</option>
                                                <option value="number">Number</option>
                                                <option value="textarea">Textarea</option>
                                                <option value="select">Dropdown</option>
                                                <option value="radio">Radio Buttons</option>
                                                <option value="checkbox">Checkboxes</option>
                                            </select>
                                        </div>
                                        {['select', 'radio', 'checkbox'].includes(field.type) && (
                                            <div className="flex-1 w-full">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Options (Comma separated)</label>
                                                <input type="text" value={field.options || ""} onChange={e => updateField(idx, 'options', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Option 1, Option 2, Option 3" />
                                            </div>
                                        )}
                                        <div className="flex items-center h-10 gap-2 px-2">
                                            <input type="checkbox" checked={field.required} onChange={e => updateField(idx, 'required', e.target.checked)} className="w-4 h-4 text-purple-600 rounded" id={`req-${idx}`} />
                                            <label htmlFor={`req-${idx}`} className="text-sm text-gray-600">Required</label>
                                        </div>
                                        <button type="button" onClick={() => removeField(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors h-10">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: Payment Settings */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" /> Payment Settings
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <input type="checkbox" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="w-5 h-5 text-green-600 rounded" id="isPaid" />
                                    <label htmlFor="isPaid" className="font-semibold text-green-800">This is a Paid Event</label>
                                </div>
                                
                                {isPaid && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-200">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
                                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500" placeholder="0.00" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                                <QrCode className="w-4 h-4" /> QR Code
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'qr')}
                                                        className="hidden" 
                                                        id="qr-upload" 
                                                    />
                                                    <label 
                                                        htmlFor="qr-upload"
                                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all"
                                                    >
                                                        {uploading === 'qr' ? (
                                                            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : <Upload className="w-5 h-5 text-gray-400" />}
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {qrCodeUrl ? 'Change QR' : 'Upload QR Code'}
                                                        </span>
                                                    </label>
                                                </div>
                                                {qrCodeUrl && (
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                                                        <img src={qrCodeUrl} className="w-full h-full object-contain" alt="QR Preview" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={() => { setIsCreating(false); resetForm(); }} className="px-8 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95">
                                {editingEvent ? 'Update Event' : 'Launch Event'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : viewingRegistrations ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setViewingRegistrations(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-xl font-bold">Registrations for {events.find(e => e.id === viewingRegistrations)?.title}</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search name, email, phone..." 
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-9 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-72 transition-all outline-none"
                                />
                                <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            {registrations.length > 0 && (
                                <button 
                                    onClick={() => downloadAttendees(viewingRegistrations!, events.find(e => e.id === viewingRegistrations)?.title, registrations)}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-green-500/20"
                                >
                                    <Download className="w-4 h-4" /> CSV
                                </button>
                            )}
                        </div>

                    {regLoading ? (
                        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Form Data</th>
                                        <th className="px-6 py-4">Payment</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedRegistrations.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">{searchTerm ? 'No results found.' : 'No registrations yet.'}</td></tr>
                                    ) : paginatedRegistrations.map(reg => (
                                        <tr key={reg.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{reg.user_name || 'Guest'}</div>
                                                <div className="text-sm text-gray-500">{reg.user_email || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs space-y-1">
                                                    {Object.entries(reg.form_data || {}).map(([k, v]: any) => (
                                                        <div key={k}><span className="font-bold">{k}:</span> {v}</div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {reg.transaction_id && (
                                                    <div className="text-[10px] font-mono text-gray-500 mb-1 bg-gray-100 px-1.5 py-0.5 rounded inline-block">ID: {reg.transaction_id}</div>
                                                )}
                                                {reg.payment_screenshot_url ? (
                                                    <a href={reg.payment_screenshot_url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-medium">
                                                        <Eye className="w-4 h-4" /> View Proof
                                                    </a>
                                                ) : <span className="text-gray-400 text-xs italic">No proof</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    reg.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    reg.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {reg.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => updateRegStatus(reg.id, 'approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve"><Check className="w-4 h-4" /></button>
                                                <button onClick={() => updateRegStatus(reg.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject"><X className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Registrations View */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {paginatedRegistrations.length === 0 ? (
                                <div className="px-6 py-10 text-center text-gray-500">{searchTerm ? 'No results found.' : 'No registrations yet.'}</div>
                            ) : paginatedRegistrations.map(reg => (
                                <div key={reg.id} className="p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-gray-900">{reg.user_name || 'Guest'}</div>
                                            <div className="text-xs text-gray-500">{reg.user_email || 'N/A'}</div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            reg.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            reg.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {reg.status}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                                        {Object.entries(reg.form_data || {}).map(([k, v]: any) => (
                                            <div key={k}><span className="font-bold">{k}:</span> {v}</div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            {reg.payment_screenshot_url ? (
                                                <a href={reg.payment_screenshot_url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 text-xs font-medium">
                                                    <Eye className="w-3.5 h-3.5" /> View Proof
                                                </a>
                                            ) : <span className="text-gray-400 text-[10px] italic">No proof</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => updateRegStatus(reg.id, 'approved')} className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">Approve</button>
                                            <button onClick={() => updateRegStatus(reg.id, 'rejected')} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">Reject</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredRegistrations.length)}</span> of <span className="font-medium">{filteredRegistrations.length}</span> results
                                </p>
                                <div className="flex gap-2">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Event Details</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Registrations</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No events found.</td></tr>
                                ) : events.map(event => (
                                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{event.title}</div>
                                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {format(new Date(event.date), 'MMM d, h:mm a')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {event.is_paid ? (
                                                <div className="text-sm text-green-600 font-bold flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" /> ₹{event.price}
                                                </div>
                                            ) : <span className="text-sm text-blue-600 font-medium">Free</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => fetchRegistrations(event.id)} className="text-sm font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                                                <Users className="w-4 h-4" /> View List
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 
                                                event.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleEdit(event)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(event.id, event.title)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Events View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {events.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-500">No events found.</div>
                        ) : events.map(event => (
                            <div key={event.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 pr-2">
                                        <div className="font-bold text-gray-900 leading-tight">{event.title}</div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {format(new Date(event.date), 'MMM d, h:mm a')}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 
                                        event.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    {event.is_paid ? (
                                        <div className="text-sm text-green-600 font-bold flex items-center gap-1">
                                            <DollarSign className="w-3.5 h-3.5" /> ₹{event.price}
                                        </div>
                                    ) : <span className="text-xs text-blue-600 font-medium">Free</span>}
                                    <button onClick={() => fetchRegistrations(event.id)} className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Registrations
                                    </button>
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                                    <button onClick={() => handleEdit(event)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(event.id, event.title)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
