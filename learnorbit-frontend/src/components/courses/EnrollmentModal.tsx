"use client";

import { X } from "lucide-react";

interface EnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    price?: number;
    isLoading: boolean;
}

export function EnrollmentModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    price,
    isLoading,
}: EnrollmentModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Confirm Enrollment</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                            disabled={isLoading}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-2">
                            You are about to enroll in <span className="font-medium text-gray-900">{title}</span>.
                        </p>
                        {price && price > 0 ? (
                            <p className="text-lg font-semibold text-gray-900">
                                Price: <span className="text-blue-600">${price.toFixed(2)}</span>
                            </p>
                        ) : (
                            <p className="text-lg font-semibold text-green-600">Free Course</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                "Confirm & Enroll"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
