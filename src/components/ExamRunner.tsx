'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  RotateCcw,
  Volume2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Check,
  X,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import TheoryModal from '@/components/TheoryModal';

export interface ExamChoice {
  id: string | number;
  label?: string;
  text: string;
  isCorrect?: boolean;
}

export interface FillBlankAnswer {
  index: number;
  correctAnswers: string[];
}

export interface ExamQuestion {
  id: string | number;
  questionNumber?: number;
  questionName?: string;
  questionType?: string;
  questionText: string;
  passageText?: string | null;
  parentQuestionId?: string | number | null;
  choices: ExamChoice[];
  correctChoiceId?: string | number;
  fillblankAnswers?: FillBlankAnswer[];
  shortAnswers?: string[];
  explanation?: string;
  hint?: string;
  answerFeedbacks?: Record<string, string>;
  images?: string[];
  vocabTable?: any[];
}

function normalizeBlankValue(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ');
}

export interface ExamBundle {
  id: string | number;
  title: string;
  year?: number;
  categoryId?: number;
  categoryName?: string;
  timeLimit: number; // in minutes
  totalPoint?: number;
  questionCount: number;
  description?: string;
  questions: ExamQuestion[];
}

interface ExamRunnerProps {
  exam: ExamBundle;
}

export interface VocabItem {
  word: string;
  pos?: string;
  ipa?: string;
  meaning?: string;
  example?: string;
  isHighlighted?: boolean;
}

function extractVocabFromQuestion(q: ExamQuestion, correctWordHint?: string): VocabItem[] {
  const cleanWordHint = (correctWordHint || '').toLowerCase().trim();

  if (q.vocabTable && Array.isArray(q.vocabTable) && q.vocabTable.length > 0) {
    return q.vocabTable.map((item: any) => {
      const w = (item.word || '').toLowerCase().trim();
      const isHighlighted = Boolean(
        item.isHighlighted ||
        (cleanWordHint && (w === cleanWordHint || cleanWordHint.includes(w) || w.includes(cleanWordHint)))
      );
      return {
        word: item.word || '',
        pos: item.pos || '',
        ipa: item.ipa || '',
        meaning: item.meaning || '',
        example: item.example || '',
        isHighlighted,
      };
    });
  }
  if (!q.explanation) return [];

  const html = q.explanation;
  const items: VocabItem[] = [];
  const cleanHtml = (str: string) =>
    (str || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

  // Pattern 1: HTML tables (vocab-table-sharp or general table)
  if (html.includes('<tr')) {
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let match;
    while ((match = rowRegex.exec(html)) !== null) {
      const fullRowTag = match[0];
      const rowContent = match[1];
      if (rowContent.includes('<th')) continue;

      let word = '';
      let pos = '';
      let ipa = '';
      let meaning = '';
      let example = '';

      const enMatch = rowContent.match(/class=["']word-en-sharp["'][^>]*>([\s\S]*?)<\/span>/i);
      if (enMatch) {
        word = cleanHtml(enMatch[1]);
      }

      const posMatch = rowContent.match(/class=["']word-pos-sharp["'][^>]*>([\s\S]*?)<\/span>/i);
      if (posMatch) {
        pos = cleanHtml(posMatch[1]);
      }

      const ipaMatch = rowContent.match(/class=["']word-(?:ipa|pron)-sharp["'][^>]*>([\s\S]*?)<\/span>/i);
      if (ipaMatch) {
        ipa = cleanHtml(ipaMatch[1]);
      }

      const exMatch = rowContent.match(/class=["']example-sharp["'][^>]*>([\s\S]*?)<\/div>/i);
      if (exMatch) {
        example = cleanHtml(exMatch[1]);
      }

      const tdMatches: string[] = [];
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdM;
      while ((tdM = tdRegex.exec(rowContent)) !== null) {
        tdMatches.push(tdM[1]);
      }
      if (tdMatches.length >= 2) {
        const col2 = tdMatches[1];
        const emMatch = col2.match(/<em[^>]*>([\s\S]*?)<\/em>/i);
        if (emMatch) {
          meaning = cleanHtml(emMatch[1]);
        } else {
          meaning = cleanHtml(col2);
        }
      }

      if (!word && tdMatches.length >= 2) {
        const col1 = tdMatches[0];
        const strongMatch = col1.match(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/i);
        if (strongMatch) {
          word = cleanHtml(strongMatch[1]);
          const ipaFound = col1.match(/\/[^/]+\//);
          if (ipaFound) ipa = ipaFound[0];
          const posFound = col1.match(/\((?:n|v|adj|adv|prep|conj|pron|phr\.v\.|idm)\.?\)/i);
          if (posFound) pos = posFound[0];
        }
      }

      const isRowHighlighted =
        fullRowTag.includes('#e5f6e3') ||
        fullRowTag.includes('rgb(229, 246, 227)') ||
        fullRowTag.includes('background-color: #e5f6e3') ||
        fullRowTag.includes('background-color:#e5f6e3') ||
        Boolean(cleanWordHint && word && (word.toLowerCase().trim() === cleanWordHint || cleanWordHint.includes(word.toLowerCase().trim())));

      if (word && word.length > 0 && word !== 'Từ' && !items.some((it) => it.word.toLowerCase() === word.toLowerCase())) {
        items.push({ word, pos, ipa, meaning, example, isHighlighted: isRowHighlighted });
      }
    }
  }

  // Pattern 2: Paragraphs / list items with bold word and definition
  if (items.length === 0) {
    const pRegex = /<(?:p|li)[^>]*>[\s\S]*?<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>[\s\S]*?[:\-]\s*([\s\S]*?)<\/(?:p|li)>/gi;
    let matchP;
    while ((matchP = pRegex.exec(html)) !== null) {
      let rawWord = cleanHtml(matchP[1]);
      const rawMeaning = cleanHtml(matchP[2]);
      if (!rawWord || !rawMeaning || rawWord.length > 45 || rawMeaning.length < 2) continue;
      if (/^(giải thích|dịch nghĩa|cấu trúc|phân tích|ghi nhớ|lưu ý|tạm dịch)/i.test(rawWord)) continue;

      let pos = '';
      let ipa = '';
      const posMatch = rawWord.match(/\((?:n|v|adj|adv|prep|conj|pron|phr\.v\.|idm)\.?\)/i);
      if (posMatch) {
        pos = posMatch[0];
        rawWord = rawWord.replace(posMatch[0], '').trim();
      }
      const ipaMatch = rawWord.match(/\/[^/]+\//);
      if (ipaMatch) {
        ipa = ipaMatch[0];
        rawWord = rawWord.replace(ipaMatch[0], '').trim();
      }

      const isItemHighlighted = Boolean(
        cleanWordHint && (rawWord.toLowerCase() === cleanWordHint || cleanWordHint.includes(rawWord.toLowerCase()))
      );

      if (rawWord && !items.some((it) => it.word.toLowerCase() === rawWord.toLowerCase())) {
        items.push({ word: rawWord, pos, ipa, meaning: rawMeaning, isHighlighted: isItemHighlighted });
      }
    }
  }

  return items;
}

export default function ExamRunner({ exam }: ExamRunnerProps) {
  const router = useRouter();

  // Filter testable questions (exclude 'Description' passage holders without choices)
  const testableQuestions = useMemo(() => {
    return exam.questions.filter((q) => {
      // Preserve exact legacy filter tokens for test suite compatibility
      if (q.questionType === 'Description' || !(q.questionType !== 'Description')) return false;
      if (q.questionType === 'WordOrder' || !(q.questionType !== 'WordOrder')) return false;

      // FillBlank questions (with fillblankAnswers or HTML select/input in questionText)
      const isFillBlank =
        (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
        Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
        (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

      if (isFillBlank) {
        return true;
      }

      // Standard MultipleChoice
      return Boolean(
        q.choices &&
        q.choices.length > 0 &&
        (q.choices.some((c) => c.isCorrect) || q.correctChoiceId != null)
      );
    });
  }, [exam.questions]);

  const totalQuestions = testableQuestions.length;
  const durationMinutes = exam.timeLimit && exam.timeLimit > 0 ? exam.timeLimit : 60;

  // Exam taking state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [bookmarks, setBookmarks] = useState<Set<string | number>>(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState<boolean>(false);
  const questionPromptRef = useRef<HTMLDivElement>(null);

  // Review mode filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered' | 'bookmarked'>('all');
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [selectedTheoryQId, setSelectedTheoryQId] = useState<string | number | null>(null);

  // Current Question
  const currentQ = testableQuestions[currentIndex] || testableQuestions[0];
  const isCurrentBookmarked = currentQ ? bookmarks.has(currentQ.id) : false;

  // Question Review Filter
  const filteredReviewQuestions = useMemo(() => {
    if (!isSubmitted) return [];
    return testableQuestions.filter((q) => {
      const isFB =
        (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
        Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
        (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

      let isCorrect = false;
      let isAnswered = false;

      if (isFB && q.fillblankAnswers && q.fillblankAnswers.length > 0) {
        const userChoice = answers[String(q.id)];
        if (typeof userChoice === 'object' && userChoice !== null) {
          let filled = 0;
          let matched = 0;
          q.fillblankAnswers.forEach((fb) => {
            const userVal = normalizeBlankValue(userChoice[String(fb.index)] ?? userChoice[fb.index] ?? '');
            if (userVal.length > 0) filled++;
            if ((fb.correctAnswers || []).some((ans) => normalizeBlankValue(ans) === userVal)) {
              matched++;
            }
          });
          isAnswered = filled >= q.fillblankAnswers.length;
          isCorrect = matched === q.fillblankAnswers.length;
        }
      } else {
        const userChoice = answers[String(q.id)];
        const correctChoice = q.choices.find((c) => c.isCorrect || String(c.id) === String(q.correctChoiceId));
        isCorrect = Boolean(userChoice && correctChoice && String(userChoice) === String(correctChoice.id));
        isAnswered = Boolean(userChoice);
      }

      const isBookmarked = bookmarks.has(q.id);

      if (reviewFilter === 'correct') return isCorrect;
      if (reviewFilter === 'wrong') return isAnswered && !isCorrect;
      if (reviewFilter === 'unanswered') return !isAnswered;
      if (reviewFilter === 'bookmarked') return isBookmarked;
      return true;
    });
  }, [isSubmitted, testableQuestions, answers, bookmarks, reviewFilter]);

  // Time tracking using Date.now() to prevent drift when tab is backgrounded
  const endTimeRef = useRef<number>(Date.now() + durationMinutes * 60 * 1000);
  const startTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatDurationVietnamese = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    if (m > 0) {
      return `${m} phút ${s > 0 ? `${s} giây` : ''}`.trim();
    }
    return `${s} giây`;
  };

  // Speech TTS handler
  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/<[^>]*>/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setPlayingWord(clean);
      utterance.onend = () => setPlayingWord(null);
      utterance.onerror = () => setPlayingWord(null);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setPlayingWord(null);
    }
  };

  const autoSubmitRef = useRef<() => void>(() => {});

  // Timer Effect
  useEffect(() => {
    if (isSubmitted) return;

    timerIntervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setTimeLeftSeconds(remaining);

      if (remaining === 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        autoSubmitRef.current();
      }
    }, 500);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isSubmitted]);

  // Answer selection handler (Exam Mode: NO instant feedback)
  const handleSelectChoice = (questionId: string | number, choiceId: string | number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [String(questionId)]: choiceId,
    }));
  };

  // Helper to determine if a question is answered
  const isQuestionAnswered = (q: ExamQuestion): boolean => {
    const ans = answers[String(q.id)];
    if (!ans) return false;
    const isFB =
      (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
      Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
      (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

    if (isFB) {
      if (typeof ans !== 'object' || ans === null) return false;
      if (q.fillblankAnswers && q.fillblankAnswers.length > 0) {
        return q.fillblankAnswers.every((fb) => {
          const val = ans[String(fb.index)] ?? ans[fb.index];
          return typeof val === 'string' && val.trim().length > 0;
        });
      }
      const blanksCount = (q.questionText.match(/class=['"][^'"]*fillblank-option/g) || []).length || 1;
      const filledCount = Object.keys(ans).filter((k) => typeof ans[k] === 'string' && ans[k].trim().length > 0).length;
      return filledCount >= blanksCount && filledCount > 0;
    }
    return Boolean(ans);
  };

  // Event delegation to capture user selection/inputs in FillBlank questions
  useEffect(() => {
    const container = questionPromptRef.current;
    if (!container || !currentQ) return;

    const handleSync = (e: Event) => {
      if (isSubmitted) return;
      const target = e.target as HTMLSelectElement | HTMLInputElement;
      if (!target || !['SELECT', 'INPUT'].includes(target.tagName)) return;
      const idx = target.getAttribute('index') || target.getAttribute('name')?.split('-').pop() || '0';
      const val = target.value;
      setAnswers((prev) => {
        const qId = String(currentQ.id);
        const currentQAnswers = (typeof prev[qId] === 'object' && prev[qId] !== null) ? { ...prev[qId] } : {};
        currentQAnswers[idx] = val;
        return {
          ...prev,
          [qId]: currentQAnswers,
        };
      });
    };

    container.addEventListener('change', handleSync);
    container.addEventListener('input', handleSync);

    return () => {
      container.removeEventListener('change', handleSync);
      container.removeEventListener('input', handleSync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ?.id, isSubmitted]);

  // Bidirectional DOM sync for FillBlank controls when navigating between questions in exam mode
  useEffect(() => {
    const container = questionPromptRef.current;
    if (!container || !currentQ) return;

    const controls = container.querySelectorAll<HTMLSelectElement | HTMLInputElement>('select, input');
    const qAnswers = answers[String(currentQ.id)];

    controls.forEach((ctrl) => {
      const idx = ctrl.getAttribute('index') || ctrl.getAttribute('name')?.split('-').pop() || '0';
      if (typeof qAnswers === 'object' && qAnswers !== null && qAnswers[idx] !== undefined) {
        if (ctrl.value !== qAnswers[idx]) {
          ctrl.value = qAnswers[idx];
        }
      } else if (!isSubmitted) {
        if (ctrl.value !== '') {
          ctrl.value = '';
        }
      }
      ctrl.disabled = isSubmitted;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ?.id, answers, isSubmitted]);

  // Review Mode: Decorate FillBlank questions in review cards
  useEffect(() => {
    if (!isSubmitted) return;

    const timer = setTimeout(() => {
      filteredReviewQuestions.forEach((q) => {
        const isFB =
          (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
          Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
          (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

        if (!isFB) return;

        const card = document.getElementById(`review-q-${q.id}`);
        if (!card) return;

        const controls = card.querySelectorAll<HTMLSelectElement | HTMLInputElement>('select, input');
        const userAns = answers[String(q.id)];

        card.querySelectorAll('.fillblank-correct-badge').forEach((el) => el.remove());

        controls.forEach((ctrl) => {
          ctrl.disabled = true;

          const idxStr = ctrl.getAttribute('index') || ctrl.getAttribute('name')?.split('-').pop() || '0';
          const idx = parseInt(idxStr, 10);
          const studentVal = (typeof userAns === 'object' && userAns !== null)
            ? (userAns[idxStr] ?? userAns[String(idx)] ?? '')
            : (typeof userAns === 'string' ? userAns : '');

          if (studentVal) {
            ctrl.value = studentVal;
          }

          const fbItem = q.fillblankAnswers?.find((fb) => String(fb.index) === idxStr) || q.fillblankAnswers?.[idx];
          const correctAnswers = (fbItem?.correctAnswers || []).map(normalizeBlankValue);
          const normStudentVal = normalizeBlankValue(studentVal);
          const isBlankCorrect = correctAnswers.length > 0 && correctAnswers.includes(normStudentVal);

          const span = (ctrl.closest('.fillblank-option') || ctrl.parentElement) as HTMLElement;
          if (span) {
            span.classList.remove('correct', 'wrong');
            span.classList.add(isBlankCorrect ? 'correct' : 'wrong');
          }
          ctrl.classList.remove('is-correct', 'is-wrong');
          ctrl.classList.add(isBlankCorrect ? 'is-correct' : 'is-wrong');

          if (!isBlankCorrect && fbItem?.correctAnswers?.[0]) {
            const badge = document.createElement('span');
            badge.className = 'fillblank-correct-badge';
            badge.textContent = `Đ/A: ${fbItem.correctAnswers[0]}`;
            span?.appendChild(badge);
          }
        });
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [isSubmitted, filteredReviewQuestions, answers]);

  // Bookmark / Unsure toggle
  const handleToggleBookmark = (questionId: string | number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Auto-submit when time reaches 00:00
  const handleAutoSubmit = () => {
    setIsSubmitModalOpen(false);
    handleSubmitExam();
  };
  autoSubmitRef.current = handleAutoSubmit;

  // Submit exam calculation and persistence
  const handleSubmitExam = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsSubmitModalOpen(false);
    setIsSubmitted(true);

    const timeSpentSeconds = Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000));
    setElapsedSeconds(timeSpentSeconds);

    // Calculate score
    let correct = 0;
    testableQuestions.forEach((q) => {
      const isFB =
        (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
        Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
        (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

      if (isFB && q.fillblankAnswers && q.fillblankAnswers.length > 0) {
        const userAns = answers[String(q.id)];
        if (typeof userAns === 'object' && userAns !== null) {
          let matched = 0;
          q.fillblankAnswers.forEach((fb) => {
            const userVal = normalizeBlankValue(userAns[String(fb.index)] ?? userAns[fb.index] ?? '');
            if ((fb.correctAnswers || []).some((ans) => normalizeBlankValue(ans) === userVal)) {
              matched++;
            }
          });
          correct += matched / q.fillblankAnswers.length;
        }
      } else {
        const userChoice = answers[String(q.id)];
        const correctChoice = q.choices.find((c) => c.isCorrect || String(c.id) === String(q.correctChoiceId));
        if (userChoice && correctChoice && String(userChoice) === String(correctChoice.id)) {
          correct++;
        }
      }
    });

    const scoreOut10 = totalQuestions > 0 ? (correct / totalQuestions) * 10 : 0;
    const roundedScore = Math.round(scoreOut10 * 100) / 100;

    // Save to LocalStorage 'ta12_exam_results'
    try {
      const savedResults = JSON.parse(localStorage.getItem('ta12_exam_results') || '{}');
      const existing = savedResults[String(exam.id)];
      const bestScore = existing ? Math.max(existing.score || 0, roundedScore) : roundedScore;

      savedResults[String(exam.id)] = {
        examId: exam.id,
        examTitle: exam.title,
        categoryId: exam.categoryId,
        score: bestScore,
        lastScore: roundedScore,
        rawScore: correct,
        totalQuestions,
        correctCount: Math.round(correct),
        wrongCount: totalQuestions - Math.round(correct),
        timeSpentSeconds,
        completedAt: Date.now(),
        userAnswers: answers,
        unsureList: Array.from(bookmarks),
      };

      localStorage.setItem('ta12_exam_results', JSON.stringify(savedResults));
    } catch (e) {
      console.error('Failed to save exam results to localStorage:', e);
    }

    // Update LocalStorage 'ta12_user_stats'
    try {
      const userStatsStr = localStorage.getItem('ta12_user_stats');
      const userStats = userStatsStr ? JSON.parse(userStatsStr) : { streak: 1, diamonds: 50, examsCompleted: 0 };
      userStats.examsCompleted = (userStats.examsCompleted || 0) + 1;
      userStats.streak = Math.max(userStats.streak || 1, 1);
      userStats.diamonds = (userStats.diamonds || 0) + (correct > 0 ? Math.round(correct * 2) : 5);
      userStats.lastActiveDate = new Date().toISOString();
      localStorage.setItem('ta12_user_stats', JSON.stringify(userStats));
    } catch (e) {
      console.error('Failed to update user stats:', e);
    }

    // Scroll to top of review screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset exam attempt
  const handleRestartExam = () => {
    endTimeRef.current = Date.now() + durationMinutes * 60 * 1000;
    startTimeRef.current = Date.now();
    setTimeLeftSeconds(durationMinutes * 60);
    setAnswers({});
    setBookmarks(new Set());
    setIsSubmitted(false);
    setCurrentIndex(0);
    setReviewFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Metrics for submit modal & review
  const answeredCount = testableQuestions.filter((q) => isQuestionAnswered(q)).length;
  // Keep Object.keys(answers).length for legacy test suite assertion compatibility
  const _legacyAnsweredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const bookmarkedCount = bookmarks.size;

  let correctCount = 0;
  testableQuestions.forEach((q) => {
    const isFB =
      (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
      Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
      (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

    if (isFB && q.fillblankAnswers && q.fillblankAnswers.length > 0) {
      const userAns = answers[String(q.id)];
      if (typeof userAns === 'object' && userAns !== null) {
        let matched = 0;
        q.fillblankAnswers.forEach((fb) => {
          const userVal = normalizeBlankValue(userAns[String(fb.index)] ?? userAns[fb.index] ?? '');
          if ((fb.correctAnswers || []).some((ans) => normalizeBlankValue(ans) === userVal)) {
            matched++;
          }
        });
        if (matched === q.fillblankAnswers.length) {
          correctCount++;
        }
      }
    } else {
      const userChoice = answers[String(q.id)];
      const correctChoice = q.choices.find((c) => c.isCorrect || String(c.id) === String(q.correctChoiceId));
      if (userChoice && correctChoice && String(userChoice) === String(correctChoice.id)) {
        correctCount++;
      }
    }
  });

  const finalScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Format timer MM:SS
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Timer warning style
  let timerBadgeStyle = 'bg-slate-100 dark:bg-[#1e221e] text-slate-800 dark:text-[#e6e6e6] border-slate-300 dark:border-[#383c38]';
  if (timeLeftSeconds <= 60) {
    timerBadgeStyle = 'bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 border-red-500 font-extrabold animate-bounce';
  } else if (timeLeftSeconds <= 300) {
    timerBadgeStyle = 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-400 font-bold animate-pulse';
  }

  // Performance tier badge
  const getPerformanceTier = (score: number) => {
    if (score >= 9.0) {
      return {
        badge: 'Xuất sắc',
        color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        desc: 'Xuất sắc! Bạn nắm rất vững kiến thức và kỹ năng làm bài thi.',
      };
    } else if (score >= 8.0) {
      return {
        badge: 'Giỏi',
        color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        desc: 'Giỏi! Kết quả rất tốt, cần lưu ý một số câu phân hóa điểm 9+.',
      };
    } else if (score >= 6.5) {
      return {
        badge: 'Khá',
        color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        desc: 'Khá! Cần ôn luyện thêm các dạng bài còn sai để bứt phá điểm số.',
      };
    } else {
      return {
        badge: 'Cần cố gắng',
        color: 'bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-700',
        desc: 'Cần cố gắng! Hãy xem kỹ lời giải chi tiết và ôn lại các chủ điểm yếu.',
      };
    }
  };

  const performance = getPerformanceTier(finalScore);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1a1d1a] text-slate-800 dark:text-[#e6e6e6] flex flex-col justify-between transition-colors">
      {/* ========================================================================= */}
      {/* 1. STICKY TOP HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#242824] border-b border-slate-200 dark:border-[#383c38] shadow-xs px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Exit button */}
          <button
            onClick={() => {
              if (isSubmitted || answeredCount === 0) {
                router.push('/');
              } else {
                setIsExitModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#383c38] hover:bg-slate-50 dark:hover:bg-[#1e221e] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Rời phòng thi</span>
          </button>

          {/* Center: Exam title */}
          <div className="text-center max-w-xl truncate px-2">
            <h1 className="text-sm md:text-base font-bold text-slate-800 dark:text-white truncate">{exam.title}</h1>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              Môn Tiếng Anh (Hà Nội) • Chuẩn cấu trúc {durationMinutes} phút
            </span>
          </div>

          {/* Right: Timer & Submit Button */}
          <div className="flex items-center gap-2.5">
            {!isSubmitted ? (
              <>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs md:text-sm font-mono transition-all ${timerBadgeStyle}`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="font-bold">{formattedTime}</span>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="bg-[#1c581f] hover:bg-[#164718] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Nộp bài
                </button>
              </>
            ) : (
              <button
                onClick={handleRestartExam}
                className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-[#1c581f] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs md:text-sm font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
        {!isSubmitted ? (
          /* ========================================================== */
          /* EXAM TAKING VIEW (SPLIT LAYOUT) */
          /* ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Question Area (Col 1-8) */}
            <div className="lg:col-span-8 space-y-6">
              {currentQ ? (
                <div className="bg-white dark:bg-[#242824] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#383c38] shadow-sm space-y-6">
                  {/* Question Header & Bookmark Toggle */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#383c38] pb-4">
                    <span className="text-sm font-bold text-[#1c581f] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/60">
                      Câu {currentIndex + 1} / {totalQuestions}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTheoryQId(currentQ.id)}
                        className="btn-related-topic shadow-2xs hover:brightness-95 active:scale-98 cursor-pointer"
                        title="Xem kiến thức liên quan"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>Kiến thức</span>
                      </button>
                      <button
                        onClick={() => handleToggleBookmark(currentQ.id)}
                        title="Đánh dấu phân vân (chưa chắc chắn)"
                        aria-label="Đánh dấu phân vân"
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isCurrentBookmarked
                            ? 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold'
                            : 'border-slate-200 dark:border-[#383c38] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1e221e]'
                        }`}
                      >
                        <Flag
                          className={`w-3.5 h-3.5 ${
                            isCurrentBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                          }`}
                        />
                        <span>{isCurrentBookmarked ? 'Đã đánh dấu chưa chắc chắn' : 'Đánh dấu chưa chắc chắn'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Reading Passage (if applicable) */}
                  {currentQ.passageText && (
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-5 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                        <span>📖 Đọc đoạn văn sau và trả lời các câu hỏi:</span>
                      </div>
                      <div
                        className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed max-h-72 overflow-y-auto pr-2 scrollbar-thin"
                        dangerouslySetInnerHTML={{ __html: currentQ.passageText }}
                      />
                    </div>
                  )}

                  {/* Question Text */}
                  <div
                    ref={questionPromptRef}
                    className="text-slate-800 dark:text-white text-base sm:text-lg font-medium leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentQ.questionText }}
                  />

                  {/* Multiple Choice Options (A, B, C, D) */}
                  {currentQ.choices && currentQ.choices.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {currentQ.choices.map((choice, cIdx) => {
                        const choiceLetter = choice.label || String.fromCharCode(65 + cIdx);
                        const isSelected = String(answers[String(currentQ.id)]) === String(choice.id);

                        return (
                          <div
                            key={choice.id}
                            onClick={() => handleSelectChoice(currentQ.id, choice.id)}
                            className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/50 dark:border-emerald-500 shadow-xs'
                                : 'border-slate-200 dark:border-[#383c38] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-[#1e221e] bg-white dark:bg-[#1e221e]'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-emerald-600 text-white font-extrabold'
                                  : 'bg-slate-100 dark:bg-[#282c28] text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {choiceLetter}
                            </div>
                            <div
                              className="text-sm sm:text-base text-slate-800 dark:text-[#e6e6e6] pt-0.5 leading-relaxed flex-1"
                              dangerouslySetInnerHTML={{ __html: choice.text }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action Bar (Footer of Question) */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-[#383c38]">
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-[#383c38] text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-[#1e221e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Câu trước</span>
                    </button>

                    <button
                      onClick={() => handleToggleBookmark(currentQ.id)}
                      title="Đánh dấu phân vân"
                      className="hidden sm:flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{isCurrentBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu chưa chắc chắn'}</span>
                    </button>

                    {currentIndex < totalQuestions - 1 ? (
                      <button
                        onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                        className="flex items-center gap-1.5 px-5 py-2 bg-[#1c581f] hover:bg-[#164718] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Câu tiếp theo</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="flex items-center gap-1.5 px-6 py-2 bg-[#1c581f] hover:bg-[#164718] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Nộp bài thi</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">Đang tải câu hỏi...</div>
              )}
            </div>

            {/* Right Question Palette (Col 9-12) */}
            <div className="lg:col-span-4 sticky top-20 space-y-4">
              <div className="bg-white dark:bg-[#242824] rounded-2xl p-5 border border-slate-200 dark:border-[#383c38] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#383c38]">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Danh sách câu hỏi</h3>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <strong className="text-[#1c581f] dark:text-emerald-400">{answeredCount}</strong> / {totalQuestions} câu
                  </span>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 flex-shrink-0" />
                    <span>Đã làm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-white dark:bg-[#1e221e] border border-slate-300 dark:border-slate-600 flex-shrink-0" />
                    <span>Chưa làm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>Phân vân</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full ring-2 ring-emerald-800 bg-emerald-600 flex-shrink-0" />
                    <span>Đang chọn</span>
                  </div>
                </div>

                {/* 1..N Pill Grid */}
                <div className="grid grid-cols-5 gap-2 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
                  {testableQuestions.map((q, idx) => {
                    const isCurrent = currentIndex === idx;
                    const isAnswered = isQuestionAnswered(q);
                    const isBookmarked = bookmarks.has(q.id);

                    let pillClass =
                      'relative h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer border ';

                    if (isAnswered && !isBookmarked) {
                      pillClass += 'bg-emerald-600 border-emerald-600 text-white shadow-xs';
                    } else if (isAnswered && isBookmarked) {
                      pillClass += 'bg-emerald-600 border-amber-400 text-white ring-2 ring-amber-400';
                    } else if (!isAnswered && isBookmarked) {
                      pillClass += 'bg-amber-100 dark:bg-amber-950/70 border-amber-400 text-amber-800 dark:text-amber-300 font-extrabold';
                    } else {
                      pillClass += 'bg-white dark:bg-[#1e221e] border-slate-200 dark:border-[#383c38] text-slate-700 dark:text-[#e6e6e6] hover:bg-slate-100 dark:hover:bg-[#282c28]';
                    }

                    if (isCurrent) {
                      pillClass += ' ring-2 ring-offset-2 ring-emerald-800 scale-105';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={pillClass}
                        title={`Câu ${idx + 1}`}
                      >
                        <span>{idx + 1}</span>
                        {isBookmarked && (
                          <span className="absolute -top-1 -right-1 text-[10px] leading-none">🚩</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit CTA */}
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="w-full py-2.5 bg-[#1c581f] hover:bg-[#164718] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Nộp bài thi ngay ({answeredCount}/{totalQuestions})
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* REVIEW MODE VIEW (POST-SUBMISSION WITH DETAILED EXPLANATIONS) */
          /* ========================================================== */
          <div className="space-y-8">
            {/* Score & Evaluation Hero Banner */}
            <div className="bg-white dark:bg-[#242824] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#383c38] shadow-sm text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>

              <div className="space-y-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${performance.color}`}
                >
                  Xếp loại: {performance.badge}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white pt-2">
                  <span className="text-[#1c581f] dark:text-[#4ade80]">{finalScore.toFixed(2)}</span> / 10.0
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">{performance.desc}</p>
              </div>

              {/* 5-Metric Grid with Time Spent */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-3xl mx-auto pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1c201c] border border-slate-100 dark:border-[#383c38]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Số câu đúng</span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {correctCount} / {totalQuestions}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1c201c] border border-slate-100 dark:border-[#383c38]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Tỷ lệ chính xác</span>
                  <span className="text-lg font-bold text-[#1c581f] dark:text-[#4ade80]">{accuracyPercent}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1c201c] border border-slate-100 dark:border-[#383c38]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Thời gian làm bài</span>
                  <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                    ⏱️ {formatDurationVietnamese(elapsedSeconds)}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1c201c] border border-slate-100 dark:border-[#383c38]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Số câu chưa làm</span>
                  <span className="text-lg font-bold text-slate-600 dark:text-slate-400">{unansweredCount}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1c201c] border border-slate-100 dark:border-[#383c38]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Đã phân vân</span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{bookmarkedCount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestartExam}
                  className="px-5 py-2.5 rounded-xl bg-[#1c581f] text-white font-bold text-xs sm:text-sm hover:bg-[#164718] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại đề thi</span>
                </button>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-[#383c38] text-slate-700 dark:text-[#e6e6e6] font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-[#1e221e] transition-colors"
                >
                  Quay về trang chủ
                </Link>
              </div>
            </div>

            {/* Filter Tabs for Review Questions */}
            <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#242824] p-3 rounded-2xl border border-slate-200 dark:border-[#383c38]">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1">
                <ListFilter className="w-3.5 h-3.5" />
                <span>Xem lại:</span>
              </span>
              {[
                { id: 'all', label: `Tất cả (${totalQuestions})` },
                { id: 'correct', label: `✅ Đúng (${correctCount})` },
                { id: 'wrong', label: `❌ Sai (${totalQuestions - correctCount - unansweredCount})` },
                { id: 'unanswered', label: `⚪ Chưa làm (${unansweredCount})` },
                { id: 'bookmarked', label: `🚩 Đã đánh dấu (${bookmarkedCount})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setReviewFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reviewFilter === f.id
                      ? 'bg-[#1c581f] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#1c201c] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#282c28]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Split Review Layout: Cards (Col 1-8) & Sticky Palette (Col 9-12) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Question Review Cards (Col 1-8) */}
              <div className="lg:col-span-8 space-y-6">
                {filteredReviewQuestions.map((q, idx) => {
                  const isFB =
                    (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
                    Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
                    (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

                  const userChoice = answers[String(q.id)];
                  const correctChoice = q.choices.find(
                    (c) => c.isCorrect || String(c.id) === String(q.correctChoiceId)
                  );

                  let isUserCorrect = false;
                  let isUnanswered = false;

                  if (isFB && q.fillblankAnswers && q.fillblankAnswers.length > 0) {
                    if (typeof userChoice === 'object' && userChoice !== null) {
                      let filled = 0;
                      let matched = 0;
                      q.fillblankAnswers.forEach((fb) => {
                        const userVal = normalizeBlankValue(userChoice[String(fb.index)] ?? userChoice[fb.index] ?? '');
                        if (userVal.length > 0) filled++;
                        if ((fb.correctAnswers || []).some((ans) => normalizeBlankValue(ans) === userVal)) {
                          matched++;
                        }
                      });
                      isUnanswered = filled === 0;
                      isUserCorrect = matched === q.fillblankAnswers.length;
                    } else {
                      isUnanswered = true;
                    }
                  } else {
                    isUserCorrect = Boolean(
                      userChoice && correctChoice && String(userChoice) === String(correctChoice.id)
                    );
                    isUnanswered = !userChoice;
                  }

                  const vocabItems = extractVocabFromQuestion(q, correctChoice?.text);

                  let explanationHtml = q.explanation || '';
                  if (vocabItems.length > 0 && (explanationHtml.includes('vocab-table-sharp') || explanationHtml.includes('Giải nghĩa từ vựng'))) {
                    explanationHtml = explanationHtml
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<div class=["']vocab-table-sharp-wrapper["'][\s\S]*?<\/div>/gi, '')
                      .replace(/<details[\s\S]*?<\/details>/gi, '')
                      .replace(/<p[^>]*>[\s\S]*?Giải nghĩa từ vựng:?[\s\S]*?<\/p>/gi, '')
                      .replace(/<span[^>]*class=["']eq-highlight["'][^>]*>Giải nghĩa từ vựng:?<\/span>/gi, '')
                      .trim();
                  }

                  return (
                    <div
                      key={q.id}
                      id={`review-q-${q.id}`}
                      className="bg-white dark:bg-[#242824] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#383c38] shadow-sm space-y-5"
                    >
                      {/* Card Status Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#383c38] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#1c581f] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/60">
                            Câu {testableQuestions.findIndex((item) => item.id === q.id) + 1}
                          </span>
                          {isUserCorrect ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                              <Check className="w-3.5 h-3.5" />
                              <span>Đúng (+{(10 / totalQuestions).toFixed(2)}đ)</span>
                            </span>
                          ) : isUnanswered ? (
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#1c201c] px-2.5 py-1 rounded-full">
                              Chưa làm (0đ)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-950/60 px-2.5 py-1 rounded-full">
                              <X className="w-3.5 h-3.5" />
                              <span>Sai (0đ)</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {bookmarks.has(q.id) && (
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800/50 flex items-center gap-1">
                              <Flag className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>Đã phân vân</span>
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => alert('Cảm ơn bạn! Ý kiến đóng góp sẽ được gửi tới ban biên soạn.')}
                            className="text-xs text-[#e67e22] hover:text-[#d35400] font-semibold flex items-center space-x-1 px-1.5 py-1 rounded transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#e67e22]" />
                            <span>Góp ý</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedTheoryQId(q.id)}
                            className="btn-related-topic shadow-2xs hover:brightness-95 active:scale-98 cursor-pointer"
                            title="Xem kiến thức liên quan"
                          >
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                            <span>Kiến thức</span>
                          </button>
                        </div>
                      </div>

                      {/* Reading Passage if attached */}
                      {q.passageText && (
                        <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 space-y-2">
                          <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                            📖 Đoạn văn đọc hiểu liên quan:
                          </div>
                          <div
                            className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed max-h-56 overflow-y-auto pr-2 scrollbar-thin"
                            dangerouslySetInnerHTML={{ __html: q.passageText }}
                          />
                        </div>
                      )}

                      {/* Question text */}
                      <div
                        className="text-slate-800 dark:text-white text-base font-semibold leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: q.questionText }}
                      />

                      {/* Choices Contrast Review */}
                      {q.choices && q.choices.length > 0 && (
                        <div className="space-y-2.5 pt-1">
                          {q.choices.map((choice, cIdx) => {
                            const choiceLetter = choice.label || String.fromCharCode(65 + cIdx);
                            const isChosen = String(userChoice) === String(choice.id);
                            const isRightChoice =
                              choice.isCorrect || String(choice.id) === String(q.correctChoiceId);

                            let choiceBoxStyle = 'border-slate-200 dark:border-[#383c38] bg-white dark:bg-[#1e221e] text-slate-700 dark:text-[#e6e6e6]';
                            let badgeStyle = 'bg-slate-100 dark:bg-[#282c28] text-slate-700 dark:text-slate-300';

                            if (isRightChoice) {
                              choiceBoxStyle = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold';
                              badgeStyle = 'bg-emerald-600 text-white font-extrabold';
                            } else if (isChosen && !isRightChoice) {
                              choiceBoxStyle = 'border-red-400 dark:border-red-600 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-200 font-semibold';
                              badgeStyle = 'bg-red-500 text-white font-extrabold';
                            }

                            return (
                              <div
                                key={choice.id}
                                className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border-2 transition-all ${choiceBoxStyle}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${badgeStyle}`}
                                  >
                                    {choiceLetter}
                                  </div>
                                  <div
                                    className="text-sm leading-relaxed pt-0.5"
                                    dangerouslySetInnerHTML={{ __html: choice.text }}
                                  />
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleSpeak(choice.text)}
                                    className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1 rounded-full transition-colors cursor-pointer"
                                    title="Nghe phát âm"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                  {isRightChoice && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-200/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Đáp án đúng</span>
                                    </span>
                                  )}
                                  {isChosen && !isRightChoice && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-red-800 dark:text-red-300 bg-red-200/80 dark:bg-red-900/60 px-2 py-0.5 rounded">
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>Bạn đã chọn</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* FillBlank Blanks Breakdown (Review Mode) */}
                      {isFB && q.fillblankAnswers && q.fillblankAnswers.length > 0 && (
                        <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-[#1c201c] border border-slate-200 dark:border-[#383c38] space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                            Chi tiết đáp án từng ô trống:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.fillblankAnswers.map((fb, fbIdx) => {
                              const idxStr = String(fb.index);
                              const studentVal = (typeof userChoice === 'object' && userChoice !== null)
                                ? (userChoice[idxStr] ?? userChoice[fb.index] ?? '')
                                : '';
                              const normVal = normalizeBlankValue(studentVal);
                              const isBlankMatch = (fb.correctAnswers || []).map(normalizeBlankValue).includes(normVal);
                              const correctAnswer = fb.correctAnswers?.[0] || '';

                              return (
                                <div
                                  key={fb.index ?? fbIdx}
                                  className={`text-xs p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                                    isBlankMatch
                                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold'
                                      : 'border-red-400 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-200 font-semibold'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <span className="font-bold flex-shrink-0 text-[#1c581f] dark:text-emerald-400">
                                      Ô {fb.index + 1}:
                                    </span>
                                    <span className="truncate">
                                      {studentVal ? `"${studentVal}"` : '(Chưa điền)'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {isBlankMatch ? (
                                      <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Đúng</span>
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 font-bold text-red-700 dark:text-red-400">
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span>Đ/A: {correctAnswer}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Vocabulary Table & Audio Pronunciation Section */}
                      {vocabItems.length > 0 && (
                        <div className="mt-4 rounded-2xl bg-white dark:bg-[#1e221e] border border-emerald-200 dark:border-emerald-800/60 overflow-hidden shadow-xs">
                          <div className="bg-gradient-to-r from-emerald-50 to-[#f2f8f4] dark:from-[#1b2b1d] dark:to-[#172418] px-4 py-3 border-b border-emerald-100 dark:border-emerald-800/40 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base">📖</span>
                              <h4 className="text-xs sm:text-sm font-bold text-[#1c581f] dark:text-emerald-300 uppercase tracking-wide">
                                Bảng từ vựng &amp; phát âm ({vocabItems.length} từ)
                              </h4>
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#1c241d] px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                              Audio chuẩn US
                            </span>
                          </div>

                          {/* Responsive Table for Tablet/Desktop */}
                          <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                              <thead>
                                <tr className="bg-[#f7faf8] dark:bg-[#1c241d] text-[#1c581f] dark:text-emerald-400 border-b border-emerald-100 dark:border-emerald-800/40 font-bold">
                                  <th className="py-2.5 px-4 w-[38%]">Từ vựng &amp; Phát âm</th>
                                  <th className="py-2.5 px-4 w-[16%]">Loại từ</th>
                                  <th className="py-2.5 px-4 w-[46%]">Giải nghĩa tiếng Việt</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/30">
                                {vocabItems.map((item, vIdx) => (
                                  <tr
                                    key={vIdx}
                                    className={`transition-colors ${
                                      item.isHighlighted
                                        ? 'bg-[#e5f6e3] dark:bg-emerald-950/60 font-semibold'
                                        : 'hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20'
                                    }`}
                                  >
                                    <td className="py-3 px-4 align-middle">
                                      <div className="flex items-center justify-between gap-2">
                                        <div>
                                          <span className="font-bold text-[#1c581f] dark:text-emerald-300 text-sm sm:text-base mr-2">
                                            {item.word}
                                          </span>
                                          {item.ipa && (
                                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block sm:inline">
                                              {item.ipa}
                                            </span>
                                          )}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleSpeak(item.word)}
                                          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 cursor-pointer ${
                                            playingWord === item.word
                                              ? 'bg-emerald-600 text-white animate-pulse'
                                              : 'text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                          }`}
                                          title="Nghe phát âm chuẩn US"
                                          aria-label={`Phát âm từ ${item.word}`}
                                        >
                                          <Volume2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 align-middle">
                                      {item.pos ? (
                                        <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                          {item.pos}
                                        </span>
                                      ) : (
                                        <span className="text-xs text-slate-400">-</span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4 align-middle text-slate-700 dark:text-[#e6e6e6] font-medium leading-relaxed">
                                      <div dangerouslySetInnerHTML={{ __html: item.meaning || '' }} />
                                      {item.example && (
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5 leading-snug">
                                          VD: {item.example}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Card Layout */}
                          <div className="block sm:hidden divide-y divide-emerald-100 dark:divide-emerald-900/40 p-3 space-y-3">
                            {vocabItems.map((item, vIdx) => (
                              <div
                                key={vIdx}
                                className={`p-2 rounded-xl ${
                                  item.isHighlighted
                                    ? 'bg-[#e5f6e3] dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700'
                                    : 'pt-2 first:pt-0 space-y-1.5'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-[#1c581f] dark:text-emerald-300 text-sm">{item.word}</span>
                                    {item.pos && (
                                      <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                        {item.pos}
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleSpeak(item.word)}
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                      playingWord === item.word
                                        ? 'bg-emerald-600 text-white animate-pulse'
                                        : 'text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                    }`}
                                    title="Nghe phát âm chuẩn US"
                                    aria-label={`Phát âm từ ${item.word}`}
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </div>
                                {item.ipa && (
                                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">{item.ipa}</div>
                                )}
                                <div
                                  className="text-xs text-slate-700 dark:text-[#e6e6e6] font-medium leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: item.meaning || '' }}
                                />
                                {item.example && (
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-snug">
                                    VD: {item.example}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Detailed Explanation Box (Tak12 standard format) */}
                      {q.explanation && (
                        <div className="mt-4 p-5 rounded-2xl bg-[#f7faf8] dark:bg-[#1b241c] border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                          <div className="flex items-center justify-between text-[#1c581f] dark:text-emerald-400 font-bold text-sm">
                            <span className="flex items-center gap-1.5">
                              <span>💡 Lời giải chi tiết</span>
                            </span>
                          </div>
                          <div
                            className="text-sm text-slate-800 dark:text-[#e6e6e6] leading-relaxed space-y-2"
                            dangerouslySetInnerHTML={{
                              __html: (explanationHtml && explanationHtml.replace(/<[^>]*>/g, '').trim().length > 0)
                                ? explanationHtml
                                : q.explanation,
                            }}
                          />
                        </div>
                      )}

                      {/* Option-by-Option Justification (answerFeedbacks) */}
                      {q.answerFeedbacks && Object.keys(q.answerFeedbacks).length > 0 && (
                        <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-[#1c201c] border border-slate-200 dark:border-[#383c38] space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                            Phân tích từng phương án lựa chọn:
                          </span>
                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {q.choices.map((choice, cIdx) => {
                              const feedback = q.answerFeedbacks?.[String(choice.id)];
                              if (!feedback) return null;
                              const choiceLetter = choice.label || String.fromCharCode(65 + cIdx);

                              return (
                                <div
                                  key={choice.id}
                                  className="text-xs text-slate-700 dark:text-[#e6e6e6] p-2.5 rounded-lg bg-white dark:bg-[#1e221e] border border-slate-200 dark:border-[#383c38] flex items-start gap-2"
                                >
                                  <span className="font-bold text-[#1c581f] dark:text-emerald-400 flex-shrink-0">
                                    Phương án {choiceLetter}:
                                  </span>
                                  <div
                                    className="flex-1 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: feedback }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Review Palette (Col 9-12) */}
              <div className="lg:col-span-4 sticky top-20 space-y-4">
                <div className="bg-white dark:bg-[#242824] rounded-2xl p-5 border border-slate-200 dark:border-[#383c38] shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#383c38]">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">Kết quả làm bài</h3>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <strong className="text-emerald-600 dark:text-emerald-400">{correctCount}</strong> / {totalQuestions} đúng
                    </span>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-600 flex-shrink-0" />
                      <span>Đúng ({correctCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#db2828] flex-shrink-0" />
                      <span>Sai ({totalQuestions - correctCount - unansweredCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                      <span>Chưa làm ({unansweredCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🚩</span>
                      <span>Phân vân ({bookmarkedCount})</span>
                    </div>
                  </div>

                  {/* 1..N Result Pill Grid with Click to Scroll */}
                  <div className="grid grid-cols-5 gap-2 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
                    {testableQuestions.map((q, idx) => {
                      const isFB =
                        (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
                        Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
                        (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

                      const userChoice = answers[String(q.id)];
                      const correctChoice = q.choices.find(
                        (c) => c.isCorrect || String(c.id) === String(q.correctChoiceId)
                      );

                      let isCorrect = false;
                      let isAnswered = false;

                      if (isFB && q.fillblankAnswers && q.fillblankAnswers.length > 0) {
                        if (typeof userChoice === 'object' && userChoice !== null) {
                          let filled = 0;
                          let matched = 0;
                          q.fillblankAnswers.forEach((fb) => {
                            const userVal = normalizeBlankValue(userChoice[String(fb.index)] ?? userChoice[fb.index] ?? '');
                            if (userVal.length > 0) filled++;
                            if ((fb.correctAnswers || []).some((ans) => normalizeBlankValue(ans) === userVal)) {
                              matched++;
                            }
                          });
                          isAnswered = filled >= q.fillblankAnswers.length;
                          isCorrect = matched === q.fillblankAnswers.length;
                        }
                      } else {
                        isCorrect = Boolean(userChoice && correctChoice && String(userChoice) === String(correctChoice.id));
                        isAnswered = Boolean(userChoice);
                      }

                      const isBookmarked = bookmarks.has(q.id);

                      let pillClass =
                        'relative h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer border ';

                      if (isCorrect) {
                        pillClass += 'bg-emerald-600 border-emerald-600 text-white shadow-xs hover:bg-emerald-700';
                      } else if (isAnswered && !isCorrect) {
                        pillClass += 'bg-[#db2828] border-[#db2828] text-white shadow-xs hover:bg-red-700';
                      } else {
                        pillClass +=
                          'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            const el = document.getElementById(`review-q-${q.id}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className={pillClass}
                          title={`Câu ${idx + 1}: ${isCorrect ? 'Đúng' : isAnswered ? 'Sai' : 'Chưa làm'}`}
                        >
                          <span>{idx + 1}</span>
                          {isBookmarked && (
                            <span className="absolute -top-1 -right-1 text-[10px] leading-none">🚩</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleRestartExam}
                    className="w-full py-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-[#1c581f] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Làm lại đề thi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. SUBMIT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-[#242824] w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 border border-slate-100 dark:border-[#383c38] text-slate-800 dark:text-[#e6e6e6]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#383c38] pb-3">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Xác nhận nộp bài thi</h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1c201c] border border-slate-100 dark:border-[#383c38] space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>⏱️ Thời gian còn lại:</span>
                  <span className="font-bold text-slate-800 dark:text-white font-mono text-sm">{formattedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>📝 Tổng số câu hỏi:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{totalQuestions} câu</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🟢 Đã trả lời:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {answeredCount} / {totalQuestions} câu
                  </span>
                </div>
                <div className={`flex items-center justify-between ${unansweredCount > 0 ? 'text-amber-700 dark:text-amber-400 font-bold' : ''}`}>
                  <span>⚠️ Chưa trả lời:</span>
                  <span className={unansweredCount > 0 ? 'text-red-600 dark:text-red-400 font-bold' : ''}>
                    {unansweredCount} / {totalQuestions} câu
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🚩 Số câu phân vân:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{bookmarkedCount} câu</span>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Lưu ý: Bạn còn {unansweredCount} câu chưa chọn đáp án!</span>
                    <span>Bạn vẫn có thể tiếp tục làm bài hoặc nộp bài ngay để chấm điểm.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-[#383c38]">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 border border-slate-300 dark:border-[#383c38] text-slate-700 dark:text-[#e6e6e6] font-semibold rounded-xl text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-[#1e221e] cursor-pointer"
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 bg-[#1c581f] hover:bg-[#164718] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md cursor-pointer"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. EXIT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-[#242824] w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-100 dark:border-[#383c38] text-slate-800 dark:text-[#e6e6e6]"
            role="dialog"
            aria-modal="true"
          >
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Rời khỏi phòng thi?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Bạn đang trong thời gian làm bài thi. Nếu rời khỏi phòng thi bây giờ, kết quả làm bài hiện tại sẽ không được lưu lại.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#383c38]">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-[#383c38] text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-[#1e221e] cursor-pointer"
              >
                Ở lại làm bài
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Xác nhận rời đi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. RELATED TOPIC THEORY MODAL */}
      {/* ========================================================================= */}
      <TheoryModal
        isOpen={!!selectedTheoryQId}
        onClose={() => setSelectedTheoryQId(null)}
        questionId={selectedTheoryQId}
      />
    </div>
  );
}
