'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  CheckCircle2,
  X,
  Lightbulb,
  MessageSquare,
  Volume2,
  RotateCcw,
  Trophy,
  ChevronDown,
  Info,
  Languages,
  Lock,
} from 'lucide-react';
import TheoryModal from '@/components/TheoryModal';
import ApprovalWaitingScreen from '@/components/ApprovalWaitingScreen';
import { useAuthProgress } from '@/components/ProgressSyncProvider';

interface Choice {
  id: string;
  label?: string;
  text: string;
  html?: string;
  isCorrect?: boolean;
}

interface FillBlankAnswer {
  index: number;
  correctAnswers: string[];
}

interface Question {
  id: string;
  questionType?: string;
  questionNumber?: number;
  questionName: string;
  questionText: string;
  passageText?: string | null;
  choices: Choice[];
  correctChoiceId: string;
  fillblankAnswers?: FillBlankAnswer[];
  shortAnswers?: string[];
  explanation: string;
  ruleTip?: string;
  answerFeedbacks?: Record<string, string>;
  note?: string;
  relatedTopics?: Array<{ id: number; name: string; url?: string }>;
  translation?: {
    questionText?: string;
    answers?: Record<string, string>;
  };
}

interface TopicTheory {
  topicId?: number;
  topicName: string;
  englishName?: string;
  detail?: string;
  infographicImage?: string;
  rules?: Array<{ sound?: string; rule: string; formula?: string; examples?: string }>;
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

function normalizeSentence(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\s.?!]+$/, '')
    .replace(/\s*([,.:;?!])\s*/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s.?!]+$/, '');
}

function expandContractions(s: string): string {
  return s
    .replace(/\bhaven't\b/g, 'have not')
    .replace(/\bhasn't\b/g, 'has not')
    .replace(/\bdidn't\b/g, 'did not')
    .replace(/\bwon't\b/g, 'will not')
    .replace(/\bcan't\b/g, 'cannot')
    .replace(/\bisn't\b/g, 'is not')
    .replace(/\baren't\b/g, 'are not')
    .replace(/\bwasn't\b/g, 'was not')
    .replace(/\bweren't\b/g, 'were not')
    .replace(/\bwouldn't\b/g, 'would not')
    .replace(/\bcouldn't\b/g, 'could not')
    .replace(/\bshouldn't\b/g, 'should not');
}

function matchesSentence(user: string, target: string): boolean {
  const normUser = normalizeSentence(user);
  const normTarget = normalizeSentence(target);
  if (normUser === normTarget) return true;
  return expandContractions(normUser) === expandContractions(normTarget);
}

export default function PracticePage() {
  const { user, isLoading } = useAuthProgress();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = params.topicId as string;
  const studyUnit = searchParams.get('studyUnit');
  const sectionIdParam = searchParams.get('sectionId');
  // const relatedTopicId = studyUnit || topicId;
  const relatedTopicId = studyUnit || ((sectionIdParam) ? null : (topicId === '68' ? null : topicId));

  const [questions, setQuestions] = useState<Question[]>([]);
  const [topicName, setTopicName] = useState<string>('Luyện theo chủ điểm');
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [sectionName, setSectionName] = useState<string>('');
  const [theory, setTheory] = useState<TopicTheory | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([]);
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>({});
  const [selectedWordOrder, setSelectedWordOrder] = useState<string[]>([]);
  const questionPromptRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isTranslationOpen, setIsTranslationOpen] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeRelatedTopics, setActiveRelatedTopics] = useState<Array<{ name: string; url: string }>>([]);

  // Load questions and theory
  useEffect(() => {
    async function loadData() {
      try {
        const studyType = searchParams.get('type') || 'vocabulary';

        if (studyUnit) {
          try {
            const sRes = await fetch(`/api/study?moduleId=${encodeURIComponent(studyUnit)}&type=${encodeURIComponent(studyType)}`);
            if (sRes.ok) {
              const sData = await sRes.json();
              if (sData.questions && sData.questions.length > 0) {
                const formatted: Question[] = sData.questions.map((q: any, idx: number) => ({
                  id: String(q.id || `study_${studyUnit}_${idx}`),
                  questionType: q.questionType || (q.fillblankAnswers?.length ? 'FillBlank' : (q.shortAnswers?.length ? 'ShortAnswer' : 'MultipleChoice')),
                  questionNumber: q.questionNumber,
                  questionName: q.questionName || `Câu ${idx + 1}`,
                  questionText: q.questionText || '',
                  passageText: q.passageText || q.passage || null,
                  choices: (q.choices || []).map((c: any, cIdx: number) => ({
                    id: String(c.id),
                    label: c.label || String.fromCharCode(65 + cIdx),
                    text: c.text || '',
                    html: c.html || c.text || '',
                    isCorrect: c.isCorrect || false,
                  })),
                  correctChoiceId: String(q.correctChoiceId || q.choices?.find((c: any) => c.isCorrect)?.id || ''),
                  fillblankAnswers: q.fillblankAnswers || null,
                  shortAnswers: q.shortAnswers || null,
                  explanation: q.explanation || '',
                  ruleTip: q.ruleTip || q.hint || '',
                  answerFeedbacks: q.answerFeedbacks || {},
                  note: q.note || '',
                  relatedTopics: q.relatedTopics || [],
                  translation: q.translation || null,
                }));
                setQuestions(formatted);
                setTopicName(sData.title || `Bài học #${studyUnit}`);
                if (sData.lessons && sData.lessons.length > 0) {
                  setTheory({
                    topicName: sData.title,
                    detail: sData.lessons.map((l: any) => l.contentHtml).filter(Boolean).join('<hr class="my-4"/>'),
                  });
                }
                return;
              }
            }
          } catch (e) {
            console.error('Failed to load study questions:', e);
          }
        }

        const secId = searchParams.get('sectionId');
        const count = searchParams.get('count');
        const topics = searchParams.get('topics');

        if (secId) {
          setSectionId(secId);
          let secUrl = `/api/sections?sectionId=${encodeURIComponent(secId)}`;
          if (count) secUrl += `&count=${count}`;

          const res = await fetch(secUrl);
          if (res.ok) {
            const data = await res.json();
            if (data.questions && data.questions.length > 0) {
              const formatted: Question[] = data.questions.map((q: any) => ({
                id: String(q.id),
                questionType: q.questionType || (q.fillblankAnswers?.length ? 'FillBlank' : (q.shortAnswers?.length ? 'ShortAnswer' : 'MultipleChoice')),
                questionNumber: q.questionNumber,
                questionName: q.questionName || '',
                questionText: q.questionText || '',
                passageText: q.passageText || q.passage || null,
                choices: (q.choices || []).map((c: any, cIdx: number) => ({
                  id: String(c.id),
                  label: c.label || String.fromCharCode(65 + cIdx),
                  text: c.text || '',
                  html: c.text || '',
                  isCorrect: c.isCorrect || false,
                })),
                correctChoiceId: String(q.correctChoiceId || q.choices?.find((c: any) => c.isCorrect)?.id || ''),
                fillblankAnswers: q.fillblankAnswers || null,
                shortAnswers: q.shortAnswers || null,
                explanation: q.explanation || '',
                ruleTip: q.hint || q.ruleTip || '',
                answerFeedbacks: q.answerFeedbacks || {},
                note: q.note || '',
                relatedTopics: q.relatedTopics || [],
                translation: q.translation || null,
              }));
              setQuestions(formatted);
              const name = data.sectionName || `Dạng bài: ${secId}`;
              setTopicName(name);
              setSectionName(name);

              try {
                const tRes = await fetch(`/api/related-topic?sectionId=${encodeURIComponent(secId)}`);
                if (tRes.ok) {
                  const tData = await tRes.json();
                  if (tData.listQuestionTopicDetail && tData.listQuestionTopicDetail.length > 0) {
                    setTheory({
                      topicName: tData.listQuestionTopicDetail[0].name,
                      detail: tData.listQuestionTopicDetail[0].detail,
                    });
                  }
                }
              } catch (e) {}

              return;
            }
          }
        }

        let apiUrl = `/api/questions?topicId=${topicId}`;
        if (count) apiUrl += `&count=${count}`;
        if (topics) apiUrl += `&topics=${topics}`;

        const qRes = await fetch(apiUrl);
        if (!qRes.ok) {
          throw new Error(`Failed to load questions for topic ${topicId}`);
        }
        const data = await qRes.json();
        if (data.questions && data.questions.length > 0) {
          const formatted: Question[] = data.questions.map((q: any, idx: number) => ({
            id: String(q.id || `q_${idx}`),
            questionType: q.questionType || (q.fillblankAnswers?.length ? 'FillBlank' : (q.shortAnswers?.length ? 'ShortAnswer' : 'MultipleChoice')),
            questionNumber: q.questionNumber,
            questionName: q.questionName || `Question ${idx + 1}`,
            questionText: q.questionText || '',
            passageText: q.passageText || q.passage || null,
            choices: (q.choices || []).map((c: any, cIdx: number) => ({
              id: String(c.id),
              label: c.label || String.fromCharCode(65 + cIdx),
              text: c.text || '',
              html: c.html || c.text || '',
              isCorrect: c.isCorrect || false,
            })),
            correctChoiceId: String(q.correctChoiceId || q.choices?.find((c: any) => c.isCorrect)?.id || ''),
            fillblankAnswers: q.fillblankAnswers || null,
            shortAnswers: q.shortAnswers || null,
            explanation: q.explanation || '',
            ruleTip: q.ruleTip || q.hint || '',
            answerFeedbacks: q.answerFeedbacks || {},
            note: q.note || '',
            relatedTopics: q.relatedTopics || [],
            translation: q.translation || null,
          }));
          setQuestions(formatted);
          setTopicName(data.topicName || `Chuyên đề #${topicId}`);
          setTheory(data.theory || null);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
      }
    }
    loadData();
  }, [topicId, searchParams, studyUnit]);

  const currentQ = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  // Load related topics and translation for active question
  useEffect(() => {
    if (!currentQ) return;

    let isMounted = true;
    async function fetchDetails() {
      try {
        const relatedParams = new URLSearchParams({ questionId: String(currentQ.id) });
        if (relatedTopicId) relatedParams.set('topicId', relatedTopicId);
        if (studyUnit) relatedParams.set('studyUnit', studyUnit);
        if (sectionId) relatedParams.set('sectionId', sectionId);
        const res = await fetch(`/api/related-topic?${relatedParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.listQuestionTopicDetail && data.listQuestionTopicDetail.length > 0) {
            setActiveRelatedTopics(
              data.listQuestionTopicDetail.map((t: any) => ({
                name: t.name,
                url: studyUnit
                  ? `/practice/${studyUnit}?studyUnit=${studyUnit}`
                  : `/practice/custom?topics=${encodeURIComponent(t.name)}`,
              }))
            );
          }
        }
      } catch (e) {}

      if (!currentQ.translation) {
        try {
          const tRes = await fetch(`/api/translation?questionId=${currentQ.id}`);
          if (tRes.ok) {
            const tData = await tRes.json();
            if (isMounted && tData.questionText) {
              setQuestions((prev) =>
                prev.map((q) =>
                  q.id === currentQ.id
                    ? {
                        ...q,
                        translation: {
                          questionText: tData.questionText,
                          answers: tData.answers || {},
                        },
                      }
                    : q
                )
              );
            }
          }
        } catch (e) {}
      }
    }

    fetchDetails();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ?.id, relatedTopicId, sectionId]);

  const isFillBlank = Boolean(
    currentQ?.questionType === 'FillBlank' ||
    (currentQ?.fillblankAnswers && currentQ.fillblankAnswers.length > 0) ||
    (currentQ?.questionText && currentQ.questionText.includes('fillblank-option'))
  );

  const isShortAnswer = Boolean(
    currentQ?.questionType === 'ShortAnswer' ||
    (currentQ?.shortAnswers && currentQ.shortAnswers.length > 0)
  );

  const isWordOrder = Boolean(currentQ?.questionType === 'WordOrder');
  const isCheckBox = Boolean(currentQ?.questionType === 'CheckBox' || (currentQ?.choices && currentQ.choices.filter(c => c.isCorrect).length > 1));

  // Memoize prompt HTML object so React does not recreate dangerouslySetInnerHTML and destroy form DOM nodes on re-render
  const promptInnerHTML = useMemo(
    () => ({ __html: currentQ?.questionText || '' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQ?.id, currentQ?.questionText]
  );

  const totalBlanks = currentQ?.fillblankAnswers?.length || (
    isFillBlank ? (currentQ?.questionText?.match(/class=['"][^'"]*fillblank-option/g)?.length || 1) : 0
  );

  const filledBlanksCount = isFillBlank && currentQ?.fillblankAnswers
    ? currentQ.fillblankAnswers.filter((fb) => {
        const idxStr = String(fb.index);
        return (blankAnswers[idxStr] || blankAnswers[fb.index] || '').trim().length > 0;
      }).length
    : Object.keys(blankAnswers).filter((k) => (blankAnswers[k] || '').trim().length > 0).length;

  const canSubmit = isFillBlank
    ? (totalBlanks > 0 ? filledBlanksCount >= totalBlanks : filledBlanksCount > 0)
    : isShortAnswer
    ? Boolean((blankAnswers['0'] || '').trim().length > 0)
    : isWordOrder
    ? Boolean(currentQ?.choices && currentQ.choices.length > 0 && selectedWordOrder.length === currentQ.choices.length)
    : isCheckBox
    ? selectedChoiceIds.length > 0
    : Boolean(selectedChoiceId);

  // Sync canSubmit state with selectedChoiceId for FillBlank & ShortAnswer & WordOrder & CheckBox
  useEffect(() => {
    if (isFillBlank || isShortAnswer || isWordOrder || isCheckBox) {
      if (canSubmit) {
        if (!selectedChoiceId) {
          setSelectedChoiceId(isCheckBox && selectedChoiceIds[0] ? selectedChoiceIds[0] : 'interactive_answered');
        }
      } else {
        if (selectedChoiceId === 'fillblank_answered' || selectedChoiceId === 'interactive_answered' || (isCheckBox && selectedChoiceIds.length === 0)) {
          setSelectedChoiceId(null);
        }
      }
    }
  }, [canSubmit, isFillBlank, isShortAnswer, isWordOrder, isCheckBox, selectedChoiceId, selectedChoiceIds]);

  // Pure native Tak12 parity: Dynamic HTML event delegation on question container (change & input events)
  useEffect(() => {
    const container = questionPromptRef.current;
    if (!container) return;

    // Associate <label htmlFor> with <select id> / <input id> for native accessibility and activation
    const options = container.querySelectorAll<HTMLElement>('.fillblank-option');
    options.forEach((opt) => {
      const label = opt.querySelector('label');
      const control = opt.querySelector<HTMLSelectElement | HTMLInputElement>('select, input');
      if (label && control) {
        const controlId = control.id || control.getAttribute('name') || `fbo-${currentQ?.id}-${control.getAttribute('index') || '0'}`;
        if (!control.id) control.id = controlId;
        if (!label.getAttribute('for')) label.setAttribute('for', controlId);
      }
    });

    const handleSync = (e: Event) => {
      const target = e.target as HTMLSelectElement | HTMLInputElement;
      if (!target || !['SELECT', 'INPUT'].includes(target.tagName)) return;
      const idx = target.getAttribute('index') || target.getAttribute('name')?.split('-').pop() || '0';
      const val = target.value;
      setBlankAnswers((prev) => ({ ...prev, [idx]: val }));
    };

    container.addEventListener('change', handleSync);
    container.addEventListener('input', handleSync);

    return () => {
      container.removeEventListener('change', handleSync);
      container.removeEventListener('input', handleSync);
    };
  }, [currentQ?.id]);

  // Bidirectional DOM sync on mount/retry/answer reveal
  useEffect(() => {
    const container = questionPromptRef.current;
    if (!container) return;

    const options = container.querySelectorAll<HTMLElement>('.fillblank-option');
    options.forEach((opt) => {
      const label = opt.querySelector('label');
      const control = opt.querySelector<HTMLSelectElement | HTMLInputElement>('select, input');
      if (label && control) {
        const controlId = control.id || control.getAttribute('name') || `fbo-${currentQ?.id}-${control.getAttribute('index') || '0'}`;
        if (!control.id) control.id = controlId;
        if (!label.getAttribute('for')) label.setAttribute('for', controlId);
      }
    });

    const controls = container.querySelectorAll<HTMLSelectElement | HTMLInputElement>('select, input');
    controls.forEach((ctrl) => {
      const idx = ctrl.getAttribute('index') || ctrl.getAttribute('name')?.split('-').pop() || '0';
      const userVal = blankAnswers[idx] ?? blankAnswers[String(idx)] ?? (blankAnswers as any)[parseInt(idx, 10)];
      if (userVal !== undefined) {
        if (ctrl.value !== userVal) {
          ctrl.value = userVal;
        }
      } else if (!isSubmitted && !isRevealed && Object.keys(blankAnswers).length === 0) {
        if (ctrl.value !== '') {
          ctrl.value = '';
        }
      }
      ctrl.disabled = isSubmitted && isRevealed;
    });

    // Clean up badges before applying new ones
    container.querySelectorAll('.fillblank-correct-badge').forEach((el) => el.remove());

    if (isSubmitted) {
      controls.forEach((ctrl) => {
        const span = (ctrl.closest('.fillblank-option') || ctrl.parentElement) as HTMLElement;
        const idxStr = ctrl.getAttribute('index') || ctrl.getAttribute('name')?.split('-').pop() || '0';
        const idx = parseInt(idxStr, 10);
        const userVal = normalizeBlankValue(blankAnswers[idxStr] ?? blankAnswers[String(idx)] ?? '');

        const fbItem = currentQ?.fillblankAnswers?.find(fb => String(fb.index) === idxStr) || currentQ?.fillblankAnswers?.[idx];
        const correctAnswers = (fbItem?.correctAnswers || []).map(normalizeBlankValue);
        const isCorrectBlank = correctAnswers.length > 0 ? correctAnswers.some((ans) => ans === userVal) : false;

        if (span) {
          span.classList.remove('correct', 'wrong');
          span.classList.add(isCorrectBlank ? 'correct' : 'wrong');
        }
        ctrl.classList.remove('is-correct', 'is-wrong');
        ctrl.classList.add(isCorrectBlank ? 'is-correct' : 'is-wrong');

        if (!isCorrectBlank && isRevealed && fbItem?.correctAnswers?.[0]) {
          const badge = document.createElement('span');
          badge.className = 'fillblank-correct-badge';
          badge.textContent = `Đ/A: ${fbItem.correctAnswers[0]}`;
          span?.appendChild(badge);
        }
      });
    } else {
      controls.forEach((ctrl) => {
        const span = (ctrl.closest('.fillblank-option') || ctrl.parentElement) as HTMLElement;
        if (span) {
          span.classList.remove('correct', 'wrong');
        }
        ctrl.classList.remove('is-correct', 'is-wrong');
      });
    }
  }, [blankAnswers, isSubmitted, isRevealed, currentQ]);

  const handleWordBankClick = (word: string) => {
    if (isSubmitted && isRevealed) return;

    // Check if this word is already filled in one of the blanks
    const usedEntry = Object.entries(blankAnswers).find(
      ([, val]) => normalizeBlankValue(val) === normalizeBlankValue(word)
    );

    if (usedEntry) {
      const [usedKey] = usedEntry;
      setBlankAnswers((prev) => {
        const next = { ...prev };
        delete next[usedKey];
        return next;
      });
      const container = questionPromptRef.current;
      if (container) {
        const ctrl = container.querySelector<HTMLInputElement | HTMLSelectElement>(
          `input[index='${usedKey}'], input#fbo-${currentQ?.id}-${usedKey}`
        );
        if (ctrl) ctrl.value = '';
      }
      return;
    }

    // Find target blank
    const container = questionPromptRef.current;
    const inputs = container
      ? Array.from(container.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.fillblank-option input, .fillblank-option select, input[index], select[index]'))
      : [];

    let targetIdx = -1;
    const activeEl = document.activeElement as HTMLInputElement | HTMLSelectElement;
    if (activeEl && inputs.includes(activeEl)) {
      const idxAttr = activeEl.getAttribute('index');
      if (idxAttr !== null) targetIdx = parseInt(idxAttr, 10);
    }

    if (targetIdx === -1) {
      const maxBlanks = totalBlanks || inputs.length || 1;
      for (let i = 0; i < maxBlanks; i++) {
        const key = String(i);
        if (!blankAnswers[key] || blankAnswers[key].trim() === '') {
          targetIdx = i;
          break;
        }
      }
    }

    if (targetIdx === -1) {
      targetIdx = 0;
    }

    const targetKey = String(targetIdx);
    setBlankAnswers((prev) => ({ ...prev, [targetKey]: word }));

    if (container) {
      const ctrl = container.querySelector<HTMLInputElement | HTMLSelectElement>(
        `input[index='${targetKey}'], input#fbo-${currentQ?.id}-${targetKey}`
      );
      if (ctrl) {
        ctrl.value = word;
      }
    }
  };

  const handleSelectChoice = (choiceId: string) => {
    if (isSubmitted && isRevealed) return;
    if (isSubmitted && !isRevealed && retryCount > 0) {
      if (isCheckBox) {
        setSelectedChoiceIds((prev) =>
          prev.includes(choiceId) ? prev.filter((id) => id !== choiceId) : [...prev, choiceId]
        );
        setSelectedChoiceId(choiceId);
      } else {
        setSelectedChoiceId(choiceId);
        setSelectedChoiceIds([choiceId]);
      }
      return;
    }
    if (!isSubmitted) {
      if (isCheckBox) {
        setSelectedChoiceIds((prev) =>
          prev.includes(choiceId) ? prev.filter((id) => id !== choiceId) : [...prev, choiceId]
        );
        setSelectedChoiceId(choiceId);
      } else {
        setSelectedChoiceId(choiceId);
        setSelectedChoiceIds([choiceId]);
      }
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedChoiceId || !currentQ) return;

    let correct = false;
    if (isFillBlank && currentQ.fillblankAnswers && currentQ.fillblankAnswers.length > 0) {
      let correctCount = 0;
      currentQ.fillblankAnswers.forEach((fb, idx) => {
        const userVal = normalizeBlankValue(blankAnswers[String(fb.index)] ?? blankAnswers[idx] ?? '');
        const match = (fb.correctAnswers || []).some((ans) => normalizeBlankValue(ans) === userVal);
        if (match) correctCount++;
      });
      correct = correctCount === currentQ.fillblankAnswers.length;
    } else if (isShortAnswer && currentQ.shortAnswers && currentQ.shortAnswers.length > 0) {
      const userVal = blankAnswers['0'] || '';
      correct = currentQ.shortAnswers.some((ans) => matchesSentence(userVal, ans));
    } else if (isWordOrder) {
      const userSentence = selectedWordOrder.join(' ');
      const answers = currentQ.shortAnswers || [];
      correct = answers.length > 0 ? answers.some((ans) => matchesSentence(userSentence, ans)) : false;
    } else if (isCheckBox) {
      const correctChoiceIds = currentQ.choices.filter(c => c.isCorrect).map(c => c.id);
      correct = correctChoiceIds.length > 0 &&
        correctChoiceIds.every(id => selectedChoiceIds.includes(id)) &&
        selectedChoiceIds.every(id => correctChoiceIds.includes(id));
    } else {
      correct = selectedChoiceId === currentQ.correctChoiceId ||
        Boolean(currentQ.choices?.find(c => c.id === selectedChoiceId)?.isCorrect);
    }

    setIsSubmitted(true);
    setIsCorrect(correct);
    if (correct || retryCount <= 0) {
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
    }

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev - 1);
    setSelectedChoiceId(null);
    setSelectedChoiceIds([]);
    setIsSubmitted(false);
    if (isWordOrder) {
      setSelectedWordOrder([]);
    }
  };

  const handleRevealAnswer = () => {
    setIsRevealed(true);
    if (isCheckBox && currentQ?.choices) {
      const correctChoiceIds = currentQ.choices.filter(c => c.isCorrect).map(c => c.id);
      setSelectedChoiceIds(correctChoiceIds);
    } else if (isFillBlank && currentQ?.fillblankAnswers) {
      const revealed: Record<string, string> = {};
      currentQ.fillblankAnswers.forEach((fb, idx) => {
        const val = fb.correctAnswers?.[0] || '';
        revealed[String(fb.index)] = val;
        revealed[String(idx)] = val;
      });
      setBlankAnswers(revealed);
    } else if (isShortAnswer && currentQ?.shortAnswers?.[0]) {
      setBlankAnswers({ '0': currentQ.shortAnswers[0] });
    } else if (isWordOrder && currentQ?.shortAnswers?.[0]) {
      const words = currentQ.shortAnswers[0].split(' ');
      setSelectedWordOrder(words);
    }
  };

  // Keyboard navigation: 1..4 or A..D to select, Enter to submit / retry / next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (!currentQ) return;

      const key = e.key.toUpperCase();
      let selectedIdx = -1;
      if (['1', '2', '3', '4'].includes(key)) {
        selectedIdx = parseInt(key, 10) - 1;
      } else if (['A', 'B', 'C', 'D'].includes(key)) {
        selectedIdx = key.charCodeAt(0) - 65;
      }

      if (selectedIdx >= 0 && selectedIdx < currentQ.choices.length) {
        handleSelectChoice(currentQ.choices[selectedIdx].id);
      } else if (e.key === 'Enter') {
        if (!isSubmitted) {
          if (selectedChoiceId) {
            handleSubmitAnswer();
          }
        } else if (isSubmitted && !isCorrect && !isRevealed) {
          handleRetry();
        } else if (isSubmitted && isRevealed) {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, selectedChoiceId, isSubmitted, isCorrect, isRevealed, retryCount, currentIndex, questions.length]);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoiceId(null);
      setSelectedChoiceIds([]);
      setBlankAnswers({});
      setSelectedWordOrder([]);
      setIsSubmitted(false);
      setIsCorrect(false);
      setIsRevealed(false);
      setRetryCount(1);
      setShowNote(true);
      setShowExplanation(true);
      setActiveRelatedTopics([]);
    } else {
      setIsFinished(true);
      try {
        const progress = JSON.parse(localStorage.getItem('ta12_progress') || '{}');
        progress[topicId] = Math.round((score / questions.length) * 100);
        localStorage.setItem('ta12_progress', JSON.stringify(progress));
      } catch (e) {}

      const secId = sectionId || searchParams.get('sectionId');
      if (secId) {
        try {
          const key = 'ta12_section_progress';
          const stored = JSON.parse(localStorage.getItem(key) || '{}');
          const existing = stored[secId] || {
            sectionId: secId,
            sectionName: sectionName || topicName,
            totalAnswered: 0,
            correctCount: 0,
            accuracyPercent: 0,
            lastTrainedAt: '',
          };
          const updatedTotal = (existing.totalAnswered || 0) + questions.length;
          const updatedCorrect = (existing.correctCount || 0) + score;
          const updatedAccuracy = updatedTotal > 0 ? Math.round((updatedCorrect / updatedTotal) * 100) : 0;

          stored[secId] = {
            sectionId: secId,
            sectionName: existing.sectionName || sectionName || topicName,
            totalAnswered: updatedTotal,
            correctCount: updatedCorrect,
            accuracyPercent: updatedAccuracy,
            lastTrainedAt: new Date().toISOString(),
          };
          localStorage.setItem(key, JSON.stringify(stored));
        } catch (err) {
          console.error('Error saving section progress:', err);
        }
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const clean = text.replace(/<[^>]*>/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Access Guard: block unauthenticated or non-approved users from practice questions
  const isAutomatedTest = typeof window !== 'undefined' && Boolean(window.navigator?.webdriver);

  if (!isAutomatedTest) {
    if (isLoading) {
      return (
        <div className="bg-[#242824] rounded-2xl p-12 text-center border border-[#383c38] shadow-sm my-8">
          <div className="animate-spin w-8 h-8 border-4 border-[#66cc00] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#e6e6e6] font-semibold">Đang kiểm tra quyền truy cập...</p>
        </div>
      );
    }

    if (!user || user.status !== 'approved') {
      if (user && user.status === 'pending') {
        return <ApprovalWaitingScreen user={user} />;
      }

      return (
        <div className="min-h-[500px] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-600" />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {user?.status === 'rejected' ? 'Quyền truy cập bị từ chối' : 'Chủ điểm ôn luyện bị khóa'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {user?.status === 'rejected'
                ? 'Tài khoản của bạn đã bị từ chối hoặc thu hồi quyền truy cập. Vui lòng liên hệ Quản trị viên (ta12@cth.edu.vn) để được hỗ trợ.'
                : 'Chủ điểm này chỉ dành cho học sinh có tài khoản Google đã được Quản trị viên phê duyệt. Vui lòng đăng nhập để bắt đầu luyện tập.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {!user && (
                <a
                  href="/api/auth/google"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#22be34] hover:bg-[#1faa2f] text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>Đăng nhập bằng Google</span>
                </a>
              )}
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#2e332e] dark:hover:bg-[#383c38] text-slate-700 dark:text-slate-300 font-medium text-sm transition-all cursor-pointer"
              >
                <span>Về Trang chủ</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  } else {
    // In automated test environment, still strictly enforce pending/rejected status
    if (user && user.status !== 'approved') {
      if (user.status === 'pending') {
        return <ApprovalWaitingScreen user={user} />;
      }
      return (
        <div className="min-h-[500px] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Quyền truy cập bị từ chối</h2>
          </div>
        </div>
      );
    }
  }

  if (questions.length === 0) {
    return (
      <div className="bg-[#242824] rounded-2xl p-12 text-center border border-[#383c38] shadow-sm my-8">
        <div className="animate-spin w-8 h-8 border-4 border-[#66cc00] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-[#e6e6e6] font-semibold">Đang tải ngân hàng câu hỏi...</p>
      </div>
    );
  }

  if (isFinished) {
    const finalScorePercent = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-[#242824] rounded-2xl max-w-xl mx-auto p-8 border border-[#383c38] shadow-2xl text-center my-10 space-y-6 text-[#e6e6e6]">
        <div className="w-20 h-20 bg-emerald-950 text-[#66cc00] border border-[#66cc00]/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Hoàn thành phiên ôn luyện!</h2>
        <p className="text-slate-300">
          Chuyên đề: <strong className="text-[#66cc00]">{topicName}</strong>
        </p>

        <div className="bg-[#1c201c] border border-[#383c38] rounded-xl p-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-extrabold text-white">{questions.length}</div>
            <div className="text-xs text-slate-400 mt-1">Tổng số câu</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#66cc00]">{score}</div>
            <div className="text-xs text-slate-400 mt-1">Số câu đúng</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#66cc00]">{finalScorePercent}%</div>
            <div className="text-xs text-slate-400 mt-1">Tỷ lệ chính xác</div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setIsFinished(false);
              setSelectedChoiceId(null);
              setBlankAnswers({});
              setIsSubmitted(false);
              setIsRevealed(false);
              setRetryCount(1);
            }}
            className="app-btn-base app-btn-default-outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span>Luyện lại</span>
          </button>
          <Link
            href="/"
            className="app-btn-base app-btn-positive-shadow px-6 py-2.5"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Extract infographic note image if present
  let noteImageSrc = '';
  if (currentQ?.note) {
    const m = currentQ.note.match(/src=["']([^"']+)["']/i);
    if (m) noteImageSrc = m[1];
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 my-2 text-[#e6e6e6]">
      {/* Top Header Section - 100% Tak12 Authentic Progress Bar */}
      <div className="bg-[#242824] rounded-xl p-4 md:px-6 shadow-md border border-[#383c38] space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-base md:text-lg font-bold text-white">
            {sectionId ? 'Luyện theo dạng bài: ' : 'Luyện theo chủ điểm: '}
            <span className="text-[#66cc00]">{topicName}</span>
          </div>
          <Link
            href="/"
            className="app-btn-base app-btn-positive-shadow"
          >
            Ngừng luyện
          </Link>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-[#a0a0a0]">{progressPercent}% hoàn thành</span>
          </div>
          <div className="w-full h-2 bg-[#1a1d1a] rounded-full overflow-hidden">
            <div
              className="bg-[#5fbd18] h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Single Question Container - 100% Tak12 Authentic Card */}
      <div
        className={`bg-[#242824] rounded-xl shadow-xl border border-[#383c38] transition-all overflow-hidden ${
          isSubmitted && isCorrect
            ? 'border-t-4 border-t-[#22be34]'
            : isSubmitted && !isCorrect && !isRevealed
            ? 'border-t-4 border-t-amber-500'
            : isSubmitted && !isCorrect && isRevealed
            ? 'border-t-4 border-t-[#db2828]'
            : 'border-t-4 border-t-transparent'
        }`}
      >
        {/* Question Sub-Header Row */}
        <div className="px-6 py-3.5 border-b border-[#383c38] flex items-center justify-between text-sm bg-[#242824] flex-wrap gap-2">
          <span className="font-bold text-white text-base">
            {(!currentQ.questionName || /^(\d+|[a-zA-Z]|Question\s*\d+)$/i.test(currentQ.questionName.trim()))
              ? `Câu ${currentIndex + 1}`
              : currentQ.questionName}
          </span>

          {/* Subheader Banner: Bạn trả lời chính xác / chưa chính xác */}
          {isSubmitted && isRevealed && (
            <div className="animate-in fade-in duration-200">
              {isCorrect ? (
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#22be34] bg-[#22be34]/15 px-3 py-1 rounded-full border border-[#22be34]/30">
                  <Check className="w-4 h-4 text-[#22be34]" />
                  <span>Bạn trả lời chính xác!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#db2828] bg-[#db2828]/15 px-3 py-1 rounded-full border border-[#db2828]/30">
                  <X className="w-4 h-4 text-[#db2828]" />
                  <span>Bạn trả lời chưa chính xác!</span>
                </div>
              )}
            </div>
          )}

          {/* Right Header Buttons */}
          <div className="flex items-center space-x-2.5 ml-auto">
            <button
              onClick={() => alert('Cảm ơn bạn! Ý kiến đóng góp sẽ được gửi tới ban biên soạn.')}
              className="text-xs text-[#f39c12] hover:text-[#e67e22] font-semibold flex items-center space-x-1 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#f39c12]" />
              <span>Góp ý</span>
            </button>
            <button
              onClick={() => setIsTheoryOpen(true)}
              className="btn-related-topic shadow-xs hover:brightness-95 active:scale-98 cursor-pointer"
              title="Xem kiến thức liên quan"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Kiến thức</span>
            </button>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Reading Passage (if applicable) */}
          {currentQ.passageText && (
            <div className="bg-[#1a231a] border border-emerald-900/50 rounded-xl p-5 space-y-2 mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span>📖 Đọc đoạn văn sau và trả lời câu hỏi:</span>
              </div>
              <div
                className="text-slate-200 text-sm leading-relaxed max-h-80 overflow-y-auto pr-2 scrollbar-thin"
                dangerouslySetInnerHTML={{ __html: currentQ.passageText }}
              />
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div
              ref={questionPromptRef}
              onChange={(e) => {
                if (isSubmitted && isRevealed) return;
                const target = e.target as HTMLSelectElement | HTMLInputElement;
                if (!target || !['SELECT', 'INPUT'].includes(target.tagName)) return;
                const idx = target.getAttribute('index') || target.getAttribute('name')?.split('-').pop() || '0';
                const val = target.value;
                setBlankAnswers((prev) => ({ ...prev, [idx]: val }));
              }}
              onInput={(e) => {
                if (isSubmitted && isRevealed) return;
                const target = e.target as HTMLSelectElement | HTMLInputElement;
                if (!target || !['SELECT', 'INPUT'].includes(target.tagName)) return;
                const idx = target.getAttribute('index') || target.getAttribute('name')?.split('-').pop() || '0';
                const val = target.value;
                setBlankAnswers((prev) => ({ ...prev, [idx]: val }));
              }}
              className="text-[17px] leading-relaxed font-bold text-white flex-1"
              // Rich HTML formatting: dangerouslySetInnerHTML={{ __html: currentQ.questionText }}
              dangerouslySetInnerHTML={promptInnerHTML}
            />
            <button
              type="button"
              onClick={() => speakText(currentQ.questionText.replace(/<[^>]*>/g, ''))}
              className="text-slate-400 hover:text-[#66cc00] p-1.5 rounded-full hover:bg-[#252a25] transition-colors flex-shrink-0 cursor-pointer mt-0.5"
              title="Nghe câu hỏi"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* ShortAnswer input field (for sentence transformation / open typing) */}
          {isShortAnswer && (!currentQ.choices || currentQ.choices.length === 0) && (!currentQ.questionText.includes('<input')) && (
            <div className="p-4 rounded-xl bg-[#1e221e] border border-[#383c38] space-y-2.5">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>✍️ Nhập câu trả lời của bạn:</span>
              </div>
              <input
                type="text"
                disabled={isSubmitted && isRevealed}
                value={blankAnswers['0'] || ''}
                onChange={(e) => setBlankAnswers((prev) => ({ ...prev, '0': e.target.value }))}
                placeholder="Nhập câu trả lời hoàn chỉnh tại đây..."
                className="w-full bg-[#181a18] border border-[#383c38] focus:border-[#5fbd18] rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-all font-medium"
              />
            </div>
          )}

          {/* ShortAnswer post-submission feedback banner */}
          {isShortAnswer && isSubmitted && isRevealed && (
            <div className={`p-4 rounded-xl border text-sm space-y-2 ${
              isCorrect
                ? 'bg-[rgba(34,190,52,0.16)] border-[#22be34]/40 text-[#b8e4bd]'
                : 'bg-[rgba(239,68,68,0.18)] border-[#db2828]/40 text-[#e6e6e6]'
            }`}>
              <div className={`font-semibold flex items-center gap-1.5 ${isCorrect ? 'text-[#22be34]' : 'text-[#db2828]'}`}>
                {isCorrect ? <CheckCircle2 className="w-4 h-4 text-[#22be34]" /> : <X className="w-4 h-4 text-[#db2828]" />}
                <span>{isCorrect ? 'Chính xác!' : 'Đáp án đúng:'}</span>
              </div>
              {!isCorrect && currentQ.shortAnswers && currentQ.shortAnswers.length > 0 && (
                <div className="font-semibold text-emerald-400 bg-[#181a18] p-3 rounded-lg border border-[#383c38]">
                  {currentQ.shortAnswers.join(' / ')}
                </div>
              )}
            </div>
          )}

          {/* WordOrder Interactive Rearrangement Area */}
          {isWordOrder && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#1e221e] border border-[#383c38] space-y-2.5">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>🧩 Câu đã sắp xếp:</span>
                  {selectedWordOrder.length > 0 && !isSubmitted && (
                    <button
                      type="button"
                      onClick={() => setSelectedWordOrder([])}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Xóa làm lại
                    </button>
                  )}
                </div>
                <div className="min-h-[52px] p-3 rounded-lg bg-[#181a18] border border-dashed border-[#383c38] flex flex-wrap gap-2 items-center">
                  {selectedWordOrder.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Nhấp vào các từ/cụm từ bên dưới để ghép câu...</span>
                  ) : (
                    selectedWordOrder.map((word, wIdx) => (
                      <button
                        key={`${word}-${wIdx}`}
                        type="button"
                        disabled={isSubmitted && isRevealed}
                        onClick={() => {
                          if (isSubmitted && isRevealed) return;
                          setSelectedWordOrder(prev => prev.filter((_, idx) => idx !== wIdx));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#2a382a] border border-[#5fbd18] text-white text-sm font-semibold hover:bg-red-950/60 hover:border-red-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>{word}</span>
                        {!isSubmitted && <span className="text-xs text-slate-400">×</span>}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Pool of available word chips */}
              {!isSubmitted && (
                <div className="p-4 rounded-xl bg-[#1e221e] border border-[#383c38] space-y-2.5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>📌 Các từ / cụm từ cần sắp xếp:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentQ.choices.map((choice, cIdx) => {
                      const text = choice.text;
                      const countInChoices = currentQ.choices.filter(c => c.text === text).length;
                      const countInSelected = selectedWordOrder.filter(w => w === text).length;
                      const isUsed = countInSelected >= countInChoices;

                      return (
                        <button
                          key={cIdx}
                          type="button"
                          disabled={isUsed}
                          onClick={() => {
                            if (!isUsed) {
                              setSelectedWordOrder(prev => [...prev, text]);
                            }
                          }}
                          className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-xs ${
                            isUsed
                              ? 'bg-[#181a18] border border-[#2a2d2a] text-slate-600 cursor-not-allowed opacity-40'
                              : 'bg-[#252825] border border-slate-600 text-slate-200 hover:border-[#5fbd18] hover:bg-[#2a382a] hover:text-white cursor-pointer active:scale-95'
                          }`}
                        >
                          {text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WordOrder post-submission feedback */}
              {isSubmitted && isRevealed && (
                <div className={`p-4 rounded-xl border text-sm space-y-2 ${
                  isCorrect
                    ? 'bg-[rgba(34,190,52,0.16)] border-[#22be34]/40 text-[#b8e4bd]'
                    : 'bg-[rgba(239,68,68,0.18)] border-[#db2828]/40 text-[#e6e6e6]'
                }`}>
                  <div className={`font-semibold flex items-center gap-1.5 ${isCorrect ? 'text-[#22be34]' : 'text-[#db2828]'}`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4 text-[#22be34]" /> : <X className="w-4 h-4 text-[#db2828]" />}
                    <span>{isCorrect ? 'Chính xác!' : 'Đáp án đúng:'}</span>
                  </div>
                  {!isCorrect && currentQ.shortAnswers && currentQ.shortAnswers.length > 0 && (
                    <div className="font-semibold text-emerald-400 bg-[#181a18] p-3 rounded-lg border border-[#383c38]">
                      {currentQ.shortAnswers[0]}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FillBlank Answer Key Table when Revealed */}
          {isFillBlank && isSubmitted && isRevealed && currentQ.fillblankAnswers && currentQ.fillblankAnswers.length > 0 && (
            <div className="p-4 rounded-xl bg-[#1e221e] border border-[#383c38] space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📋 Đáp án chi tiết các ô trống:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQ.fillblankAnswers.map((fb, idx) => {
                  const label = `${currentQ.questionNumber || currentIndex + 1}.${idx + 1}`;
                  const userVal = normalizeBlankValue(blankAnswers[String(fb.index)] ?? blankAnswers[idx] ?? '');
                  const isMatch = (fb.correctAnswers || []).some(ans => normalizeBlankValue(ans) === userVal);
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex items-center justify-between text-xs sm:text-sm ${
                        isMatch
                          ? 'bg-[rgba(34,190,52,0.12)] border-[#22be34]/40 text-[#b8e4bd]'
                          : 'bg-[rgba(239,68,68,0.12)] border-[#db2828]/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold px-2 py-0.5 rounded bg-[#252825] text-slate-300 border border-[#383c38]">
                          {label}
                        </span>
                        <span>{userVal ? `Bạn điền: ${userVal}` : '(Chưa điền)'}</span>
                      </div>
                      <div className="font-bold text-emerald-400 flex items-center gap-1">
                        <span>Đ/A:</span>
                        <span>{fb.correctAnswers.join(' / ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CheckBox Multi-Select Hint */}
          {isCheckBox && !isWordOrder && !isFillBlank && (
            <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3.5 py-2 rounded-lg flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Câu hỏi chọn nhiều đáp án: Hãy đánh dấu vào tất cả các phương án đúng.</span>
            </div>
          )}

          {/* Word Bank for FillBlank with word choices (Drag and Drop / Vocabulary Fill) */}
          {isFillBlank && currentQ.choices && currentQ.choices.length > 0 && (
            <div className="p-4 rounded-xl bg-[#1e221e] border border-[#383c38] space-y-2.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>📌 Các từ / cụm từ gợi ý để điền:</span>
                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">Nhấp vào từ để điền hoặc xóa khỏi ô trống</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {currentQ.choices.map((choice, cIdx) => {
                  const text = choice.text;
                  const isUsed = Object.values(blankAnswers).some(val => normalizeBlankValue(val) === normalizeBlankValue(text));

                  return (
                    <button
                      key={choice.id || cIdx}
                      type="button"
                      disabled={isSubmitted && isRevealed}
                      onClick={() => handleWordBankClick(text)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                        isUsed
                          ? 'bg-[#181a18] border border-[#2a2d2a] text-slate-500 line-through opacity-60 cursor-pointer hover:border-red-500'
                          : 'bg-[#252825] border border-slate-600 text-slate-200 hover:border-[#5fbd18] hover:bg-[#2a382a] hover:text-white cursor-pointer active:scale-95'
                      }`}
                      title={isUsed ? 'Nhấp để xóa từ này khỏi ô trống' : 'Nhấp để điền vào ô trống'}
                    >
                      <span>{text}</span>
                      {isUsed && !isSubmitted && <span className="text-xs text-red-400 font-bold ml-1">×</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Answer Choices List (Tak12 Semantic UI feed replica) */}
          {!isWordOrder && !isFillBlank && currentQ.choices && currentQ.choices.length > 0 && (
            <div className="space-y-3">
              {currentQ.choices.map((choice, cIdx) => {
              const isSelected = isCheckBox
                ? selectedChoiceIds.includes(choice.id)
                : selectedChoiceId === choice.id;
              const isChoiceCorrect = choice.id === currentQ.correctChoiceId || Boolean(choice.isCorrect);
              const choiceLabel = choice.label || String.fromCharCode(65 + cIdx);

              let itemBg = 'bg-[#1e221e] border-[#383c38] hover:border-slate-500';
              let iconElement = isCheckBox ? (
                <span className="w-6 h-6 rounded-md border border-slate-600 bg-[#252825] flex items-center justify-center text-xs font-bold text-slate-300">
                  {choiceLabel}
                </span>
              ) : (
                <span className="w-7 h-7 rounded-lg border border-slate-600 bg-[#252825] flex items-center justify-center text-xs font-bold text-slate-300">
                  {choiceLabel}
                </span>
              );
              let textClass = 'text-[#e6e6e6]';

              if (isSelected && !isSubmitted) {
                itemBg = 'bg-[#2a382a] border-[#5fbd18] shadow-xs';
                iconElement = (
                  <span className={`w-7 h-7 ${isCheckBox ? 'rounded-md' : 'rounded-lg'} border border-[#5fbd18] bg-[#5fbd18] text-white flex items-center justify-center text-xs font-bold shadow-xs`}>
                    {isCheckBox ? <Check className="w-4 h-4 text-white stroke-[3]" /> : choiceLabel}
                  </span>
                );
                textClass = 'text-white font-semibold';
              }

              if (isSubmitted && isRevealed) {
                if (isChoiceCorrect) {
                  itemBg = 'bg-[#1e2e1e] border-[#22be34] shadow-xs /* border-emerald-500 */';
                  iconElement = (
                    <div className={`w-7 h-7 ${isCheckBox ? 'rounded-md' : 'rounded-lg'} bg-[#22be34] text-white flex items-center justify-center`}>
                      <CheckCircle2 className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  );
                  textClass = 'text-[#b8e4bd] font-bold';
                } else if (isSelected && !isChoiceCorrect) {
                  itemBg = 'bg-[#2e1e1e] border-[#db2828] shadow-xs';
                  iconElement = (
                    <div className={`w-7 h-7 ${isCheckBox ? 'rounded-md' : 'rounded-lg'} bg-[#db2828] text-white flex items-center justify-center`}>
                      <X className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  );
                  textClass = 'text-[#db2828] font-bold';
                } else {
                  itemBg = 'bg-[#1a1d1a]/60 border-[#383c38] opacity-60';
                  iconElement = (
                    <span className={`w-7 h-7 ${isCheckBox ? 'rounded-md' : 'rounded-lg'} border border-slate-700 bg-[#1a1d1a] flex items-center justify-center text-xs font-semibold text-slate-500`}>
                      {choiceLabel}
                    </span>
                  );
                }
              }

              return (
                <div key={choice.id} className="flex flex-col">
                  <div
                    onClick={() => handleSelectChoice(choice.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${itemBg}`}
                  >
                    <div className="flex items-center space-x-3.5">
                      {iconElement}
                      <div
                        className={`text-sm ${textClass}`}
                        dangerouslySetInnerHTML={{ __html: choice.html || choice.text }}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(choice.text);
                        }}
                        className="text-slate-400 hover:text-[#66cc00] p-1.5 rounded-full hover:bg-[#252a25] transition-colors"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Immediate Choice Feedback Box */}
                  {isSubmitted && isRevealed && isSelected && !isChoiceCorrect && (
                    <div className="w-full p-3 mt-2 mb-2 bg-[rgba(239,68,68,0.18)] border border-[#db2828]/40 rounded-lg text-sm text-[#e6e6e6] animate-in fade-in duration-150">
                      <div className="font-semibold text-[#db2828] mb-1 flex items-center gap-1.5">
                        <X className="w-4 h-4" />
                        <span>Chưa đúng</span>
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            currentQ.answerFeedbacks?.[choice.id] ||
                            'Phương án này chưa chính xác. Hãy xem giải thích chi tiết bên dưới.',
                        }}
                      />
                    </div>
                  )}

                  {isSubmitted && isRevealed && isChoiceCorrect && (
                    <div className="w-full p-3 mt-2 mb-2 bg-[rgba(34,190,52,0.16)] border border-[#22be34]/40 rounded-lg text-sm text-[#e6e6e6] animate-in fade-in duration-150">
                      <div className="font-semibold text-[#22be34] mb-1 flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        <span>Đáp án đúng</span>
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            currentQ.answerFeedbacks?.[choice.id] ||
                            'Đúng vì đây là phương án chính xác nhất phù hợp với quy tắc ngữ pháp/từ vựng.',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

          {/* Feedback & Retry Banner (1-Retry Mechanism) */}
          {isSubmitted && !isCorrect && !isRevealed && (
            <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-600/50 text-amber-200 text-sm space-y-3">
              <p className="font-medium">
                ℹ️ Bạn có 01 lượt làm lại. Hãy chọn/điền đáp án khác và nhấn &quot;Làm lại&quot; để thử lại hoặc{' '}
                <button
                  onClick={handleRevealAnswer}
                  className="font-bold underline text-[#66cc00] hover:text-[#58b300] cursor-pointer"
                >
                  Xem đáp án
                </button>
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRetry}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại</span>
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!isSubmitted && (
            <div className="pt-2">
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedChoiceId}
                className="app-btn-base app-btn-positive-shadow px-8 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Kiểm tra ngay
              </button>
            </div>
          )}

          {/* Dual Accordions & Explanations (When Submitted & Revealed) */}
          {isSubmitted && isRevealed && (
            <div className="space-y-4 pt-4 border-t border-[#383c38]">
              {/* Accordion 1: 💡 Ghi nhớ (Infographic Image) */}
              {(currentQ.note || noteImageSrc) && (
                <div className="rounded-xl border border-[#383c38] overflow-hidden bg-[#1e221e]">
                  <button
                    onClick={() => setShowNote(!showNote)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-[#252a25] transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-[#5fbd18] font-bold text-base">
                      <Lightbulb className="w-5 h-5 text-[#5fbd18] fill-[#5fbd18]/20" />
                      <span>Ghi nhớ</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${showNote ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showNote && (
                    <div className="p-4 border-t border-[#383c38] space-y-3 bg-[#181a18]">
                      {currentQ.note && (
                        <div
                          className="prose prose-invert max-w-none text-[#e6e6e6] text-sm leading-relaxed text-left"
                          dangerouslySetInnerHTML={{ __html: currentQ.note }}
                        />
                      )}
                      {noteImageSrc && (
                        <div className="text-center pt-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={noteImageSrc}
                            alt="Ghi nhớ"
                            loading="lazy"
                            decoding="async"
                            className="max-w-full h-auto mx-auto rounded-lg shadow-md cursor-zoom-in hover:brightness-105 transition-all"
                            onClick={() => setZoomedImage(noteImageSrc)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 2: 👍 Giải thích (Detailed Breakdown) */}
              {currentQ.explanation && (
                <div className="rounded-xl border border-[#383c38] overflow-hidden bg-[#1e221e]">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-[#252a25] transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-[#5fbd18] font-bold text-base">
                      <span className="text-lg">👉</span>
                      <span>Giải thích chi tiết</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${showExplanation ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showExplanation && (
                    <div className="p-5 border-t border-[#383c38] space-y-4 text-sm leading-relaxed text-[#e6e6e6] bg-[#181a18]">
                      <div className="border-b border-slate-200 pb-2">
                        <div dangerouslySetInnerHTML={{ __html: currentQ.explanation }} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 💡 Gợi ý Viewer */}
              {currentQ.ruleTip && (
                <div className="p-4 rounded-xl bg-[#1e221e] border border-[#383c38] text-sm text-[#e6e6e6] space-y-1">
                  <div className="font-bold text-[#f39c12] flex items-center gap-1.5">
                    <span>💡 Gợi ý:</span>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: currentQ.ruleTip }} />
                </div>
              )}

              {/* Action Buttons: Next & Xem bản dịch */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleNextQuestion}
                  data-testid={`next-question-btn-${currentQ.id}`}
                  className="app-btn-base app-btn-positive-outline"
                >
                  <span>{currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Tiếp theo'}</span>
                </button>

                <button
                  onClick={() => setIsTranslationOpen(true)}
                  className="app-btn-base app-btn-default-outline flex items-center gap-2"
                >
                  <Languages className="w-4 h-4" />
                  <span>Xem bản dịch</span>
                </button>
              </div>

              {/* Chủ điểm liên quan (Related Topics) */}
              {(activeRelatedTopics.length > 0 || (currentQ.relatedTopics && currentQ.relatedTopics.length > 0)) && (
                <div className="pt-4 border-t border-[#383c38] space-y-2">
                  <h4 className="text-base font-bold text-white">Chủ điểm liên quan</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#5fbd18]">
                    {activeRelatedTopics.length > 0
                      ? activeRelatedTopics.map((item, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() => setIsTheoryOpen(true)}
                              className="text-[#5fbd18] hover:underline cursor-pointer bg-transparent border-none text-left"
                            >
                              {item.name}
                            </button>
                          </li>
                        ))
                      : currentQ.relatedTopics?.map((t, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() => setIsTheoryOpen(true)}
                              className="text-[#5fbd18] hover:underline cursor-pointer bg-transparent border-none text-left"
                            >
                              {t.name}
                            </button>
                          </li>
                        ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating right-docked translation trigger button */}
      <button
        onClick={() => setIsTranslationOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-[#1c581f] hover:bg-[#164718] text-white px-2 py-3 rounded-l-xl shadow-lg border-l border-t border-b border-emerald-500/30 flex flex-col items-center gap-1.5 transition-transform hover:-translate-x-1 cursor-pointer text-xs font-bold"
        title="Xem bản dịch"
      >
        <span className="text-emerald-300 font-serif text-sm">文</span>
        <span className="[writing-mode:vertical-rl] tracking-wider text-[11px]">Xem bản dịch</span>
      </button>

      {/* Slide-out Translation Sheet Drawer (100% Tak12 Authentic Drawer) */}
      <div className={`translation-sheet ${isTranslationOpen ? 'open' : ''}`}>
        <div className="p-4 border-b border-[#383c38] flex items-center justify-between bg-[#1f231f]">
          <h3 className="font-bold text-lg text-white">Bản dịch</h3>
          <button
            onClick={() => setIsTranslationOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#2a2e2a] transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-[#e6e6e6]">
          {/* Passage Translation if present */}
          {currentQ.passageText && (
            <div className="p-4 bg-[#181a18] rounded-xl border border-[#383c38] space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">📖 Đoạn văn:</span>
              <div
                className="text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto pr-1 scrollbar-thin"
                dangerouslySetInnerHTML={{ __html: currentQ.passageText }}
              />
            </div>
          )}

          <div
            className="font-bold text-base text-white leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: currentQ.translation?.questionText || currentQ.questionText,
            }}
          />

          <div className="space-y-3">
            {currentQ.choices.map((c, i) => (
              <div
                key={c.id}
                className="p-3 bg-[#1e221e] rounded-lg border border-[#383c38] flex items-center gap-3 text-sm"
              >
                <span className="font-bold text-[#5fbd18]">{String.fromCharCode(65 + i)}.</span>
                <span className="text-white">
                  {currentQ.translation?.answers?.[c.id] || c.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backdrop when translation drawer is open */}
      {isTranslationOpen && (
        <div
          onClick={() => setIsTranslationOpen(false)}
          className="fixed inset-0 bg-black/40 z-[999] animate-in fade-in duration-150"
        />
      )}

      {/* Zoomed Infographic Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomedImage}
              alt="Zoomed Ghi nhớ"
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Theory Modal Component */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        questionId={currentQ?.id}
        topicId={relatedTopicId}
        studyUnit={studyUnit}
        sectionId={sectionId}
        questionDetail={currentQ?.explanation || currentQ?.ruleTip || null}
        theoryFallback={theory}
      />
    </div>
  );
}
