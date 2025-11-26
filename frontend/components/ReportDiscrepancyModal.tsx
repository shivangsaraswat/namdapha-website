'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlertCircle, CheckCircle2, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';

interface ReportDiscrepancyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReportDiscrepancyModal({ isOpen, onClose }: ReportDiscrepancyModalProps) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(file => {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`File ${file.name} exceeds 5MB limit.`);
                    return false;
                }
                return true;
            });

            if (images.length + validFiles.length > 3) {
                alert('You can only upload up to 3 images.');
                return;
            }

            setImages(prev => [...prev, ...validFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const formData = new FormData();
        formData.append('email', email);
        formData.append('message', message);
        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            const response = await fetch('/api/report-discrepancy', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit report');
            }

            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setEmail('');
                setMessage('');
                setImages([]);
            }, 6000);

        } catch (error: unknown) {
            setStatus('error');
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unexpected error occurred');
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none"
                    >
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-emerald-400" />
                                    Report Discrepancy
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {status === 'success' ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Report Submitted!</h3>
                                        <p className="text-gray-400 max-w-xs">
                                            Thank you for your feedback. We will review the discrepancy and fix it as soon as possible.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Email Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">
                                                Student Email <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="student@ds.study.iitm.ac.in"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Must be a valid @ds.study.iitm.ac.in or @es.study.iitm.ac.in email.
                                            </p>
                                        </div>

                                        {/* Message Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">
                                                Describe the Issue <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Please describe the discrepancy you found..."
                                                rows={5}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                                            />
                                        </div>

                                        {/* Image Upload */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-gray-300 flex justify-between">
                                                <span>Attachments (Optional)</span>
                                                <span className="text-xs text-gray-500">{images.length}/3</span>
                                            </label>

                                            <div className="grid grid-cols-3 gap-3">
                                                {images.map((file, index) => (
                                                    <div key={index} className="relative group aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10">
                                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                                            <ImageIcon className="w-6 h-6" />
                                                        </div>
                                                        {/* Preview would go here if we created object URLs, but for simplicity just showing icon/name */}
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="p-1.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/80 text-[10px] text-gray-300 truncate text-center">
                                                            {file.name}
                                                        </div>
                                                    </div>
                                                ))}

                                                {images.length < 3 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="aspect-square rounded-lg border border-dashed border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-emerald-400"
                                                    >
                                                        <Upload className="w-5 h-5" />
                                                        <span className="text-xs">Upload</span>
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Max 3 images, 5MB each.
                                            </p>
                                        </div>

                                        {/* Error Message */}
                                        {status === 'error' && (
                                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-300">
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                {errorMessage}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Report'
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
