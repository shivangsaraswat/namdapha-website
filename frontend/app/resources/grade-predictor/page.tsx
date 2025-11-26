'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUBJECTS, Subject, ComponentId, COMPONENTS, getGrade, getRequiredMarks, DegreeType } from './data';

import { GraduationCap, BookOpen, AlertCircle, CheckCircle2, XCircle, TrendingUp, Layers, School } from 'lucide-react';

export default function GradePredictor() {
    const [selectedDegreeType, setSelectedDegreeType] = useState<DegreeType | ''>('');
    const [selectedLevel, setSelectedLevel] = useState<'Foundation' | 'Diploma' | 'Degree' | ''>('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

    // Custom Dropdown State
    const [openDropdown, setOpenDropdown] = useState<'degree' | 'level' | 'subject' | null>(null);

    // Ref to track openDropdown without triggering re-renders in useEffect
    const openDropdownRef = useRef(openDropdown);

    useEffect(() => {
        openDropdownRef.current = openDropdown;
    }, [openDropdown]);

    const [scores, setScores] = useState<Record<ComponentId, number>>({
        gaa: 0, quiz1: 0, quiz2: 0, endTerm: 0, bonus: 0,
        gp1: 0, gp2: 0, pp: 0, cp: 0,
        grpa: 0, oppe: 0, oppe1: 0, oppe2: 0,
        roe: 0, project1: 0, project2: 0,
        gla: 0, bpta: 0,
        gaa_sql: 0, gaa_prog: 0, gaa_obj: 0,
        vmt: 0, nppe: 0, le: 0, lv: 0, d: 0, we: 0, id: 0
    });
    const [searchTerm, setSearchTerm] = useState('');


    const selectedSubject = useMemo(() =>
        SUBJECTS.find(s => s.id === selectedSubjectId),
        [selectedSubjectId]);


    // Filter subjects based on selected Degree Type and Level
    const filteredSubjects = useMemo(() => {
        if (!selectedDegreeType || !selectedLevel) return [];
        return SUBJECTS.filter(s => s.degreeType === selectedDegreeType && s.level === selectedLevel);
    }, [selectedDegreeType, selectedLevel]);

    const currentScore = useMemo(() => {
        if (!selectedSubject) return 0;
        return selectedSubject.schema.calculateScore(scores);
    }, [selectedSubject, scores]);

    const currentGrade = getGrade(currentScore);
    const isPassed = currentScore >= 40; // Simplified pass check

    const [touchedFields, setTouchedFields] = useState<Set<ComponentId>>(new Set());

    const areAllFieldsFilled = useMemo(() => {
        if (!selectedSubject) return false;
        // Check if all components (EXCEPT bonus and endTerm) are in touchedFields
        return selectedSubject.schema.components.every(c => {
            if (c === 'bonus' || c === 'endTerm') return true; // Optional
            return touchedFields.has(c);
        });
    }, [selectedSubject, touchedFields]);

    const handleScoreChange = (id: ComponentId, value: string) => {
        const numValue = Math.min(Math.max(Number(value) || 0, 0), COMPONENTS[id].maxScore);
        setScores(prev => ({ ...prev, [id]: numValue }));
        setTouchedFields(prev => new Set(prev).add(id));
    };

    // Reset scores when subject changes
    useEffect(() => {
        setScores({
            gaa: 0, quiz1: 0, quiz2: 0, endTerm: 0, bonus: 0,
            gp1: 0, gp2: 0, pp: 0, cp: 0,
            grpa: 0, oppe: 0, oppe1: 0, oppe2: 0,
            roe: 0, project1: 0, project2: 0,
            gla: 0, bpta: 0,
            gaa_sql: 0, gaa_prog: 0, gaa_obj: 0,
            vmt: 0, nppe: 0, le: 0, lv: 0, d: 0, we: 0, id: 0
        });
        setTouchedFields(new Set());
    }, [selectedSubjectId]);

    // Reset subject when level or degree type changes
    useEffect(() => {
        setSelectedSubjectId('');
    }, [selectedLevel, selectedDegreeType]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (openDropdownRef.current && !target.closest('.dropdown-wrapper')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30 relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Fog Effect - Emerald Themed */}
                <div className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden">
                    <motion.div
                        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_50%)] blur-[100px]"
                        animate={{ transform: ["translate(0,0)", "translate(10%, 10%)", "translate(-5%, 5%)", "translate(0,0)"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute top-[20%] left-[20%] w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(16,185,129,0.03)_0%,transparent_60%)] blur-[120px]"
                        animate={{ transform: ["translate(0,0)", "translate(-10%, -5%)", "translate(5%, -10%)", "translate(0,0)"] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

                {/* Elegant Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {/* Vignette / Black Shadows */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#000000_120%)] opacity-80"></div>
            </div>

            <div className="relative z-10 px-4 pb-4 md:px-8 md:pb-8 pt-24 md:pt-32">

                <div className="max-w-6xl mx-auto space-y-12">

                    {/* Header Section */}
                    <div className="text-center space-y-4 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
                        >
                            <TrendingUp className="w-4 h-4" />
                            <span>Academic Performance Calculator</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent tracking-tight"
                        >
                            Grade Predictor
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
                        >
                            Plan your academic success with precision. Select your course details below to calculate potential grades and requirements.
                        </motion.p>
                    </div>

                    {/* Selection Section - Redesigned with Custom Dropdowns */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative" // Removed styling that might cause clipping
                    >
                        {/* Card Background & Styling - Absolute & Clipped */}
                        <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                            {/* Removed foggy blobs as per previous request, keeping just the subtle top line */}
                        </div>

                        {/* Content - Relative & Visible Overflow */}
                        <div className="relative p-8 md:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                {/* Degree Type Selection */}
                                <div className={`space-y-3 relative ${openDropdown === 'degree' ? 'z-50' : 'z-30'}`}>
                                    <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest ml-1">Degree Type</label>
                                    <div
                                        className="relative dropdown-wrapper"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown(openDropdown === 'degree' ? null : 'degree')}
                                            className={`w-full relative bg-black/40 border ${openDropdown === 'degree' ? 'border-emerald-500/50 ring-1 ring-emerald-500/50' : 'border-white/10'} rounded-xl flex items-center hover:border-emerald-500/50 transition-all cursor-pointer py-4 px-4 text-left focus:outline-none`}
                                        >
                                            <School className={`w-5 h-5 mr-3 transition-colors ${selectedDegreeType ? 'text-emerald-400' : 'text-gray-500'}`} />
                                            <span className={`flex-1 font-medium ${selectedDegreeType ? 'text-white' : 'text-gray-500'}`}>
                                                {selectedDegreeType === 'BS_DS' ? 'BS in Data Science' :
                                                    selectedDegreeType === 'BS_ES' ? 'BS in Electronic Systems' :
                                                        'Select Degree Type...'}
                                            </span>
                                            <div className={`transition-transform duration-200 ${openDropdown === 'degree' ? 'rotate-180' : ''}`}>
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {openDropdown === 'degree' && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                                                >
                                                    <div
                                                        className="px-4 py-3 hover:bg-white/5 cursor-pointer text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                                                        onClick={() => { setSelectedDegreeType('BS_DS'); setOpenDropdown(null); }}
                                                    >
                                                        <div className={`w-2 h-2 rounded-full ${selectedDegreeType === 'BS_DS' ? 'bg-emerald-500' : 'bg-transparent'}`} />
                                                        BS in Data Science
                                                    </div>
                                                    <div
                                                        className="px-4 py-3 hover:bg-white/5 cursor-pointer text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                                                        onClick={() => { setSelectedDegreeType('BS_ES'); setOpenDropdown(null); }}
                                                    >
                                                        <div className={`w-2 h-2 rounded-full ${selectedDegreeType === 'BS_ES' ? 'bg-emerald-500' : 'bg-transparent'}`} />
                                                        BS in Electronic Systems
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Level Selection */}
                                <div className={`space-y-3 relative ${openDropdown === 'level' ? 'z-50' : 'z-20'}`}>
                                    <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest ml-1">Course Level</label>
                                    <div
                                        className={`relative dropdown-wrapper ${!selectedDegreeType ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
                                            className={`w-full relative bg-black/40 border ${openDropdown === 'level' ? 'border-emerald-500/50 ring-1 ring-emerald-500/50' : 'border-white/10'} rounded-xl flex items-center hover:border-emerald-500/50 transition-all cursor-pointer py-4 px-4 text-left focus:outline-none`}
                                        >
                                            <Layers className={`w-5 h-5 mr-3 transition-colors ${selectedLevel ? 'text-emerald-400' : 'text-gray-500'}`} />
                                            <span className={`flex-1 font-medium ${selectedLevel ? 'text-white' : 'text-gray-500'}`}>
                                                {selectedLevel || 'Select Level...'}
                                            </span>
                                            <div className={`transition-transform duration-200 ${openDropdown === 'level' ? 'rotate-180' : ''}`}>
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {openDropdown === 'level' && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                                                >
                                                    {['Foundation', 'Diploma', 'Degree'].map((level) => (
                                                        <div
                                                            key={level}
                                                            className="px-4 py-3 hover:bg-white/5 cursor-pointer text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                                                            onClick={() => { setSelectedLevel(level as any); setOpenDropdown(null); }}
                                                        >
                                                            <div className={`w-2 h-2 rounded-full ${selectedLevel === level ? 'bg-emerald-500' : 'bg-transparent'}`} />
                                                            {level} Level
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Subject Selection */}
                                <div className={`space-y-3 relative ${openDropdown === 'subject' ? 'z-50' : 'z-10'}`}>
                                    <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest ml-1">Subject</label>
                                    <div
                                        className={`relative dropdown-wrapper ${!selectedLevel ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown(openDropdown === 'subject' ? null : 'subject')}
                                            className={`w-full relative bg-black/40 border ${openDropdown === 'subject' ? 'border-emerald-500/50 ring-1 ring-emerald-500/50' : 'border-white/10'} rounded-xl flex items-center hover:border-emerald-500/50 transition-all cursor-pointer py-4 px-4 text-left focus:outline-none`}
                                        >
                                            <BookOpen className={`w-5 h-5 mr-3 transition-colors ${selectedSubjectId ? 'text-emerald-400' : 'text-gray-500'}`} />
                                            <span className={`flex-1 font-medium truncate ${selectedSubjectId ? 'text-white' : 'text-gray-500'}`}>
                                                {SUBJECTS.find(s => s.id === selectedSubjectId)?.name || 'Select Subject...'}
                                            </span>
                                            <div className={`transition-transform duration-200 ${openDropdown === 'subject' ? 'rotate-180' : ''}`}>
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {openDropdown === 'subject' && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-64 overflow-y-auto custom-scrollbar"
                                                >
                                                    {filteredSubjects.length > 0 ? (
                                                        filteredSubjects.map(subject => (
                                                            <div
                                                                key={subject.id}
                                                                className="px-4 py-3 hover:bg-white/5 cursor-pointer text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                                                                onClick={() => { setSelectedSubjectId(subject.id); setOpenDropdown(null); }}
                                                            >
                                                                <div className={`w-2 h-2 rounded-full ${selectedSubjectId === subject.id ? 'bg-emerald-500' : 'bg-transparent'} shrink-0`} />
                                                                <span className="truncate">{subject.name}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-gray-500 text-sm italic">
                                                            No subjects available
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    <AnimatePresence mode="wait">
                        {selectedSubject ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                            >
                                {/* Left Column: Inputs */}
                                <div className="lg:col-span-7 space-y-6">
                                    <section className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                                Enter Your Scores
                                            </h2>
                                            <button
                                                onClick={() => {
                                                    setScores({
                                                        gaa: 0, quiz1: 0, quiz2: 0, endTerm: 0, bonus: 0,
                                                        gp1: 0, gp2: 0, pp: 0, cp: 0,
                                                        grpa: 0, oppe: 0, oppe1: 0, oppe2: 0,
                                                        roe: 0, project1: 0, project2: 0,
                                                        gla: 0, bpta: 0,
                                                        gaa_sql: 0, gaa_prog: 0, gaa_obj: 0,
                                                        vmt: 0, nppe: 0, le: 0, lv: 0, d: 0, we: 0, id: 0
                                                    });
                                                    setTouchedFields(new Set());
                                                }}
                                                className="text-xs text-gray-400 hover:text-white transition-colors underline"
                                            >
                                                Reset All
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {selectedSubject.schema.components.map((componentId) => {
                                                const component = COMPONENTS[componentId];
                                                return (
                                                    <div key={componentId} className="space-y-2 group">
                                                        <div className="flex justify-between items-center ml-1">
                                                            <label className="text-sm font-medium text-gray-300 group-hover:text-emerald-400 transition-colors">
                                                                {component.label}
                                                            </label>
                                                            <span className="text-xs text-gray-500">Max: {component.maxScore}</span>
                                                        </div>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={component.maxScore}
                                                                value={scores[componentId] || ''}
                                                                onChange={(e) => handleScoreChange(componentId, e.target.value)}
                                                                placeholder="0"
                                                                className={`w-full bg-black/50 border rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${touchedFields.has(componentId)
                                                                    ? 'border-emerald-500/30 focus:ring-emerald-500/50'
                                                                    : 'border-white/10 focus:ring-emerald-500/50'
                                                                    }`}
                                                            />
                                                            {component.description && (
                                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 group/tooltip">
                                                                    <AlertCircle className="w-4 h-4 text-gray-600 cursor-help" />
                                                                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-xs text-gray-300 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl border border-white/10">
                                                                        {component.description}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {!areAllFieldsFilled && (
                                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                                <p className="text-sm text-blue-200">
                                                    Please fill in all the fields above to see your predicted grade and pass status.
                                                </p>
                                            </div>
                                        )}
                                    </section>
                                </div>

                                {/* Right Column: Results */}
                                <div className="lg:col-span-5 space-y-8">
                                    <AnimatePresence>
                                        {areAllFieldsFilled && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="space-y-6"
                                            >
                                                {/* Main Score Card */}
                                                <div className={`relative overflow-hidden rounded-3xl p-8 border ${isPassed ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                                        {isPassed ? <CheckCircle2 className="w-32 h-32" /> : <XCircle className="w-32 h-32" />}
                                                    </div>

                                                    <div className="relative z-10">
                                                        <h3 className="text-gray-400 font-medium mb-1">Predicted Total Score</h3>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-6xl font-bold text-white tracking-tighter">
                                                                {currentScore.toFixed(1)}
                                                            </span>
                                                            <span className="text-xl text-gray-400">/ 100</span>
                                                        </div>

                                                        <div className="mt-6 flex items-center gap-4">
                                                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${isPassed
                                                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                                                : 'bg-red-500/20 border-red-500/50 text-red-400'
                                                                }`}>
                                                                Grade: {currentGrade}
                                                            </div>
                                                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${isPassed
                                                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                                                : 'bg-red-500/20 border-red-500/50 text-red-400'
                                                                }`}>
                                                                {isPassed ? 'PASSED' : 'NOT PASSED'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Passing Requirement Alert */}
                                                {!isPassed && (
                                                    (() => {
                                                        const marksToPass = getRequiredMarks(scores, 'E', selectedSubject);
                                                        const isPossible = typeof marksToPass === 'number';

                                                        return (
                                                            <div className={`rounded-2xl p-6 border ${isPossible ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'} flex items-start gap-4`}>
                                                                <div className={`p-3 rounded-full ${isPossible ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                    {isPossible ? <TrendingUp className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                                                </div>
                                                                <div>
                                                                    <h4 className={`text-lg font-semibold ${isPossible ? 'text-blue-100' : 'text-red-100'}`}>
                                                                        {isPossible ? 'Path to Passing' : 'Passing Impossible'}
                                                                    </h4>
                                                                    <p className={`mt-1 text-sm ${isPossible ? 'text-blue-200' : 'text-red-200'}`}>
                                                                        {isPossible ? (
                                                                            <>
                                                                                You need <span className="font-bold text-white text-lg">{marksToPass}</span> marks in the <span className="font-medium">End Term Exam</span> to achieve a passing Grade E.
                                                                            </>
                                                                        ) : (
                                                                            "Based on your current scores, it is mathematically impossible to reach the passing threshold (40%) even with a full score in the End Term Exam."
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()
                                                )}

                                                {/* Required Marks Table */}
                                                <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-sm">
                                                    <div className="p-6 border-b border-white/10">
                                                        <h3 className="text-lg font-semibold text-white">Required for Grades</h3>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            Marks needed in <span className="text-emerald-400 font-medium">End Term</span> to achieve:
                                                        </p>
                                                    </div>
                                                    <div className="divide-y divide-white/5">
                                                        {['S', 'A', 'B', 'C', 'D', 'E'].map((grade) => {
                                                            const required = getRequiredMarks(scores, grade, selectedSubject);
                                                            const isPossible = typeof required === 'number';
                                                            const isAchieved = required === 'Already Achieved';

                                                            return (
                                                                <div key={grade} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${grade === currentGrade ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/10 text-gray-400'
                                                                            }`}>
                                                                            {grade}
                                                                        </div>
                                                                        <span className="text-sm text-gray-400">
                                                                            {grade === 'S' ? '>= 90' :
                                                                                grade === 'A' ? '>= 80' :
                                                                                    grade === 'B' ? '>= 70' :
                                                                                        grade === 'C' ? '>= 60' :
                                                                                            grade === 'D' ? '>= 50' : '>= 40'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        {isAchieved ? (
                                                                            <span className="text-emerald-400 font-medium text-sm flex items-center gap-1">
                                                                                <CheckCircle2 className="w-4 h-4" /> Achieved
                                                                            </span>
                                                                        ) : isPossible ? (
                                                                            <span className="text-white font-mono font-bold">
                                                                                {required} <span className="text-gray-500 text-xs font-sans font-normal">marks</span>
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-red-400/70 text-sm font-medium flex items-center gap-1">
                                                                                <XCircle className="w-4 h-4" /> Impossible
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {!areAllFieldsFilled && (
                                        <div className="h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-3xl text-gray-500">
                                            <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">Results Pending</p>
                                            <p className="text-sm mt-2">Fill all fields to see your prediction</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: 0.4 }}
                                className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-12 text-center"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                                <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <BookOpen className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white">Ready to Predict?</h3>
                                        <p className="text-gray-400 max-w-md mx-auto">
                                            Select your degree, level, and subject from the panel above to unlock the grade calculator.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );

}
