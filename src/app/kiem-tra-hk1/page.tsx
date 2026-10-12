'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, XCircle, AlertCircle, Clock, Flag, Award, 
  RotateCcw, ArrowRight, ArrowLeft, Check, BookOpen, Share2, 
  Printer, User, School, Sparkles, HelpCircle, ChevronRight, ListOrdered
} from 'lucide-react';
import { HK1_EXAMS, HK1Exam, ExamQuestion } from '@/data/exams_hk1';

export default function KiemTraHK1Page() {
  const [selectedExamId, setSelectedExamId] = useState<string>('de-1');
  const [studentName, setStudentName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('');
  const [testState, setTestState] = useState<'intro' | 'testing' | 'submitted'>('intro');
  
  // In-test states
  const [answers, setAnswers] = useState<{ [qId: number]: string }>({});
  const [flagged, setFlagged] = useState<{ [qId: number]: boolean }>({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(3600); // 60 mins
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  
  // Results & Review
  const [score, setScore] = useState<number>(0);
  const [scoreOutOf10, setScoreOutOf10] = useState<number>(0);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const [examHistory, setExamHistory] = useState<any[]>([]);

  const questionListRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeExam = HK1_EXAMS.find((e) => e.id === selectedExamId) || HK1_EXAMS[0];
  const currentQuestion: ExamQuestion = activeExam.questions[activeQuestionIdx] || activeExam.questions[0];

  // Load student profile & history from localStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('hk1_student_name');
      const savedClass = localStorage.getItem('hk1_student_class');
      const savedHistory = localStorage.getItem('hk1_exam_history');
      if (savedName) setStudentName(savedName);
      if (savedClass) setStudentClass(savedClass);
      if (savedHistory) setExamHistory(JSON.parse(savedHistory));
    } catch {}
  }, []);

  // Timer effect during test
  useEffect(() => {
    if (testState === 'testing') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState]);

  // Keyboard navigation & answering
  useEffect(() => {
    if (testState !== 'testing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectOption(currentQuestion.id, key);
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevQuestion();
      } else if (e.key.toLowerCase() === 'f') {
        handleToggleFlag(currentQuestion.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testState, activeQuestionIdx, currentQuestion]);

  const handleStartTest = () => {
    if (studentName.trim()) {
      try {
        localStorage.setItem('hk1_student_name', studentName.trim());
        localStorage.setItem('hk1_student_class', studentClass.trim());
      } catch {}
    }
    setAnswers({});
    setFlagged({});
    setActiveQuestionIdx(0);
    setTimeRemaining(activeExam.durationMinutes * 60);
    setTimeElapsed(0);
    setTestState('testing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (qId: number, optId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optId,
    }));
  };

  const handleToggleFlag = (qId: number) => {
    setFlagged((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleNextQuestion = () => {
    if (activeQuestionIdx < activeExam.questions.length - 1) {
      setActiveQuestionIdx((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIdx > 0) {
      setActiveQuestionIdx((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitTest = () => {
    setShowSubmitModal(false);
    let correctCount = 0;
    activeExam.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const calculatedScoreOutOf10 = Number(((correctCount / activeExam.questions.length) * 10).toFixed(2));
    setScore(correctCount);
    setScoreOutOf10(calculatedScoreOutOf10);
    setTestState('submitted');

    // Save history
    const newRecord = {
      examId: activeExam.id,
      examCode: activeExam.code,
      examTitle: activeExam.title,
      score: correctCount,
      total: activeExam.questions.length,
      scoreOutOf10: calculatedScoreOutOf10,
      studentName: studentName.trim() || 'Học sinh',
      studentClass: studentClass.trim() || 'Lớp 9',
      date: new Date().toLocaleDateString('vi-VN'),
      timeElapsed,
    };

    try {
      const updatedHistory = [newRecord, ...examHistory.slice(0, 9)];
      setExamHistory(updatedHistory);
      localStorage.setItem('hk1_exam_history', JSON.stringify(updatedHistory));
    } catch {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = activeExam.questions.length - answeredCount;

  // Filter questions in review screen
  const filteredQuestions = activeExam.questions.filter((q) => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (reviewFilter === 'wrong') return !isCorrect;
    if (reviewFilter === 'correct') return isCorrect;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1a1d1a] text-slate-800 dark:text-slate-100 transition-colors pb-16">
      
      {/* ============================================================ */}
      {/* SCREEN 1: INTRO & EXAM SELECTOR                              */}
      {/* ============================================================ */}
      {testState === 'intro' && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phòng Thi Trực Tuyến Học Sinh Lớp 9</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              BỘ 3 ĐỀ KIỂM TRA HỌC KÌ 1 — 6 UNIT ĐẦU
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed mb-4">
              Hệ thống kiểm tra trực tuyến dành cho học sinh lớp 9 chuẩn bị thi tuyển sinh vào lớp 10. 
              Làm bài ngay trên điện thoại hoặc máy tính, tự động chấm điểm, hiển thị lời giải chi tiết và phân tích bẫy thi điểm liệt!
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-100 border-t border-white/20 pt-4">
              <span className="flex items-center gap-1.5">⏱️ Thời gian: 60 phút / đề</span>
              <span className="flex items-center gap-1.5">📝 Quy mô: 40 câu trắc nghiệm</span>
              <span className="flex items-center gap-1.5">🎯 Phạm vi: Unit 1 đến Unit 6 SGK Global Success 9</span>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-emerald-600" />
              <span>Thông Tin Học Sinh Làm Bài</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Họ và tên của em:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Hoàng Nam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1a1d1a] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Lớp / Trường học (tùy chọn):
                </label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="Ví dụ: Lớp 9A - THCS Chu Văn An"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#1a1d1a] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 italic">
              * Tên và kết quả của em sẽ được lưu trên máy để em có thể chụp lại gửi thầy/cô giáo hoặc in ra giấy.
            </p>
          </div>

          {/* 3 Exams Selector */}
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <ListOrdered className="w-5 h-5 text-emerald-600" />
            <span>Chọn 1 Trong 3 Đề Kiểm Tra Để Làm Bài:</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {HK1_EXAMS.map((exam) => {
              const isSelected = exam.id === selectedExamId;
              return (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-400/30'
                      : 'border-slate-200 dark:border-[#383c38] bg-white dark:bg-[#242824] hover:border-emerald-300 hover:shadow-sm'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full p-1">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2">
                      MÃ ĐỀ: {exam.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                      {exam.title.replace('ĐỀ SỐ ', 'Đề ')}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-3">
                      {exam.description}
                    </p>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700/60 pt-3 mt-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-700 dark:text-emerald-400">{exam.difficulty}</span>
                    <span className="text-slate-500">{exam.durationMinutes} phút</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Start Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl p-6 shadow-md">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Đề đang chọn: <span className="text-emerald-600">{activeExam.title}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                40 câu trắc nghiệm • Thời gian làm bài 60 phút • Tự động chấm điểm ngay sau khi nộp
              </div>
            </div>
            <button
              onClick={handleStartTest}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Vào Làm Bài Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Test History Section */}
          {examHistory.length > 0 && (
            <div className="mt-10 bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Lịch Sử Làm Bài Gần Đây Của Em Trên Thiết Bị Này:</span>
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {examHistory.map((rec, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">{rec.examCode}</span>
                      <span className="text-slate-500">{rec.studentName} ({rec.studentClass})</span>
                    </div>
                    <div className="flex items-center gap-3 font-semibold">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{rec.scoreOutOf10}/10 điểm</span>
                      <span className="text-slate-400 text-[11px]">{rec.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 2: ACTIVE TESTING ROOM                                */}
      {/* ============================================================ */}
      {testState === 'testing' && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          
          {/* Top Sticky Test Bar */}
          <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#242824]/95 backdrop-blur-md border border-slate-200 dark:border-[#383c38] rounded-2xl p-3 sm:p-4 shadow-md mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {activeExam.code} • {activeExam.title.replace('ĐỀ SỐ ', 'Đề ')}
                </div>
                <div className="text-[11px] text-slate-500">
                  {studentName || 'Học sinh'} {studentClass ? `(${studentClass})` : ''}
                </div>
              </div>
              <div className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                Đã làm: {answeredCount}/{activeExam.questions.length}
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm sm:text-base font-bold shadow-inner ${
                timeRemaining < 300 
                  ? 'bg-red-100 text-red-600 animate-pulse border border-red-300' 
                  : timeRemaining < 600
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-slate-100 dark:bg-[#1a1d1a] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}>
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{formatTime(timeRemaining)}</span>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Nộp Bài
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left: Current Question Area (3 cols) */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl p-6 sm:p-8 shadow-sm">
                
                {/* Part & Instruction Header */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    {currentQuestion.part}
                  </span>
                  {currentQuestion.instruction && (
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 italic">
                      👉 {currentQuestion.instruction}
                    </p>
                  )}
                </div>

                {/* Reading Text Box if available */}
                {currentQuestion.readingText && (
                  <div className="bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 mb-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-sans flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đoạn Văn Đọc Hiểu / Điền Từ:</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: currentQuestion.readingText }} />
                  </div>
                )}

                {/* Question Prompt */}
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
                  <span className="text-emerald-600 mr-2">Câu {currentQuestion.id}:</span>
                  <span dangerouslySetInnerHTML={{ __html: currentQuestion.content }} />
                </div>

                {/* Options Cards */}
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-semibold shadow-sm'
                            : 'border-slate-200 dark:border-[#383c38] hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-[#2a2e2a]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            {opt.id}
                          </span>
                          <span className="text-sm sm:text-base leading-snug">{opt.content}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={activeQuestionIdx === 0}
                    className={`px-4 py-2.5 rounded-xl border font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                      activeQuestionIdx === 0
                        ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                        : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-[#2e332e] text-slate-700 dark:text-slate-200 cursor-pointer'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Câu Trước</span>
                  </button>

                  <button
                    onClick={() => handleToggleFlag(currentQuestion.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      flagged[currentQuestion.id]
                        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${flagged[currentQuestion.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{flagged[currentQuestion.id] ? 'Đã Gắn Cờ' : 'Gắn Cờ Xem Lại'}</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    disabled={activeQuestionIdx === activeExam.questions.length - 1}
                    className={`px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all ${
                      activeQuestionIdx === activeExam.questions.length - 1
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    <span>Câu Sau</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Right: Question Palette Grid (1 col) */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl p-5 shadow-sm sticky top-36">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Danh Sách Câu Hỏi (40)
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {answeredCount}/40
                  </span>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Đã làm
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-400" /> Gắn cờ
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-700" /> Chưa làm
                  </span>
                </div>

                {/* Palette 8x5 */}
                <div className="grid grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-1">
                  {activeExam.questions.map((q, idx) => {
                    const isAnswered = Boolean(answers[q.id]);
                    const isFlagged = Boolean(flagged[q.id]);
                    const isCurrent = idx === activeQuestionIdx;

                    let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                    if (isAnswered) {
                      btnClass = 'bg-emerald-600 text-white border-emerald-600';
                    }
                    if (isFlagged) {
                      btnClass = 'bg-amber-400 text-amber-950 border-amber-500 font-bold';
                    }
                    if (isCurrent) {
                      btnClass += ' ring-2 ring-emerald-500 ring-offset-2';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setActiveQuestionIdx(idx);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`h-9 rounded-lg font-bold text-xs border transition-all flex items-center justify-center cursor-pointer ${btnClass}`}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Hoàn Thành & Nộp Bài
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Submit Confirmation Modal */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#242824] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-[#383c38] animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto mb-3 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">
                  Xác Nhận Nộp Bài Thi?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 text-center mb-4 leading-relaxed">
                  Em đã trả lời <strong className="text-emerald-600">{answeredCount}/{activeExam.questions.length}</strong> câu hỏi.
                  {unansweredCount > 0 && (
                    <span className="block text-red-500 font-semibold mt-1">
                      ⚠️ Còn {unansweredCount} câu hỏi em chưa chọn đáp án!
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-semibold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
                  >
                    Tiếp Tục Làm Bài
                  </button>
                  <button
                    onClick={handleSubmitTest}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white shadow-md cursor-pointer"
                  >
                    Nộp Bài Ngay
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 3: RESULTS & FULL EXPLANATION REVIEW                  */}
      {/* ============================================================ */}
      {testState === 'submitted' && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Result Score Card */}
          <div className="bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl p-6 sm:p-8 shadow-xl text-center mb-8 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              🎉 KẾT QUẢ BÀI THI: {activeExam.code}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Chúc mừng {studentName || 'Học sinh'} đã hoàn thành bài thi!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Thời gian hoàn thành: {formatTime(timeElapsed)} • Ngày làm bài: {new Date().toLocaleDateString('vi-VN')}
            </p>

            {/* Score Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-slate-800">
                <div className="text-3xl font-extrabold text-emerald-600 font-mono">{scoreOutOf10}</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase mt-1">Điểm Thang 10</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-slate-800">
                <div className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono">{score}/40</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase mt-1">Số Câu Đúng</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-slate-800">
                <div className="text-3xl font-extrabold text-red-500 font-mono">{40 - score}</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase mt-1">Số Câu Sai</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-slate-800">
                <div className="text-base font-bold text-emerald-600 mt-2">
                  {scoreOutOf10 >= 9.0 ? '🌟 Xuất Sắc' : scoreOutOf10 >= 8.0 ? '👏 Giỏi' : scoreOutOf10 >= 6.5 ? '👍 Khá' : '📚 Cần Ôn Lại'}
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase mt-1">Xếp Loại</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In Kết Quả / Lưu PDF</span>
              </button>
              <button
                onClick={handleStartTest}
                className="px-4 py-2.5 rounded-xl border border-emerald-400 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm Lại Đề Này</span>
              </button>
              <button
                onClick={() => {
                  const nextExamId = selectedExamId === 'de-1' ? 'de-2' : selectedExamId === 'de-2' ? 'de-3' : 'de-1';
                  setSelectedExamId(nextExamId);
                  setTestState('intro');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Chuyển Sang Đề Khác</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detailed Question Review Header & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Xem Lại Đáp Án & Lời Giải Chi Tiết Từng Câu:</span>
            </h2>

            {/* Filter Pills */}
            <div className="inline-flex rounded-xl p-1 bg-slate-200 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  reviewFilter === 'all' ? 'bg-white dark:bg-[#242824] shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Tất cả (40)
              </button>
              <button
                onClick={() => setReviewFilter('wrong')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  reviewFilter === 'wrong' ? 'bg-white dark:bg-[#242824] shadow-sm text-red-600' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Câu sai ({40 - score})
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  reviewFilter === 'correct' ? 'bg-white dark:bg-[#242824] shadow-sm text-emerald-600' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Câu đúng ({score})
              </button>
            </div>
          </div>

          {/* Question Review Cards List */}
          <div className="space-y-6">
            {filteredQuestions.map((q) => {
              const studentAnswer = answers[q.id];
              const isCorrect = studentAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-[#242824] border rounded-2xl p-6 shadow-sm transition-all ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/50'
                      : 'border-red-200 dark:border-red-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">Câu {q.id}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {q.unitTopic || q.part}
                      </span>
                    </div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" /> Chính xác (+0.25đ)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                        <XCircle className="w-4 h-4" /> Sai (0.00đ)
                      </span>
                    )}
                  </div>

                  {/* Reading Passage if any */}
                  {q.readingText && (
                    <div className="bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 mb-3 text-xs text-slate-600 dark:text-slate-300 font-serif leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: q.readingText }} />
                    </div>
                  )}

                  {/* Prompt */}
                  <div className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                    <span dangerouslySetInnerHTML={{ __html: q.content }} />
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {q.options.map((opt) => {
                      const isUserChoice = studentAnswer === opt.id;
                      const isCorrectKey = q.correctAnswer === opt.id;

                      let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1d1a] text-slate-700 dark:text-slate-300';
                      if (isCorrectKey) {
                        optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-bold ring-1 ring-emerald-500';
                      } else if (isUserChoice && !isCorrect) {
                        optStyle = 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 line-through';
                      }

                      return (
                        <div key={opt.id} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}>
                          <span><b>{opt.id}.</b> {opt.content}</span>
                          {isCorrectKey && <span className="text-[10px] text-emerald-600 font-bold">Đáp án chuẩn</span>}
                          {isUserChoice && !isCorrect && <span className="text-[10px] text-red-500 font-bold">Em đã chọn</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>💡 Giải Thích Ngữ Pháp & Dịch Nghĩa:</span>
                    </div>
                    <div className="mb-1">{q.explanation}</div>
                    {q.translation && (
                      <div className="text-slate-500 dark:text-slate-400 italic text-[11px]">
                        ➔ {q.translation}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
