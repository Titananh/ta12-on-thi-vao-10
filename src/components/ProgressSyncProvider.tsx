'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_at: string | null;
  created_at: string;
}

interface ProgressSyncContextType {
  user: AuthUser | null;
  isLoading: boolean;
  syncNow: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const ProgressSyncContext = createContext<ProgressSyncContextType>({
  user: null,
  isLoading: true,
  syncNow: async () => {},
  refreshSession: async () => {},
});

export function useAuthProgress() {
  return useContext(ProgressSyncContext);
}

export default function ProgressSyncProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  const mergeRemoteToLocal = useCallback((remote: any) => {
    try {
      // 1. ta12_progress (Topic practice scores)
      if (remote.topic_practice_history && Object.keys(remote.topic_practice_history).length > 0) {
        const localProgStr = localStorage.getItem('ta12_progress');
        const localProg = localProgStr ? JSON.parse(localProgStr) : {};
        const mergedProg = { ...remote.topic_practice_history, ...localProg };
        for (const k of Object.keys(remote.topic_practice_history)) {
          if (localProg[k] !== undefined) {
            mergedProg[k] = Math.max(localProg[k], remote.topic_practice_history[k]);
          }
        }
        localStorage.setItem('ta12_progress', JSON.stringify(mergedProg));
      }

      // 2. ta12_exam_results
      if (remote.exam_scores && Object.keys(remote.exam_scores).length > 0) {
        const localExamsStr = localStorage.getItem('ta12_exam_results');
        const localExams = localExamsStr ? JSON.parse(localExamsStr) : {};
        const mergedExams = { ...remote.exam_scores, ...localExams };
        localStorage.setItem('ta12_exam_results', JSON.stringify(mergedExams));
      }

      // 3. ta12_section_progress
      if (remote.section_progress && Object.keys(remote.section_progress).length > 0) {
        const localSecStr = localStorage.getItem('ta12_section_progress');
        const localSec = localSecStr ? JSON.parse(localSecStr) : {};
        const mergedSec = { ...remote.section_progress, ...localSec };
        localStorage.setItem('ta12_section_progress', JSON.stringify(mergedSec));
      }

      // 4. ta12_study_progress
      if (remote.study_progress && Object.keys(remote.study_progress).length > 0) {
        const localStudyStr = localStorage.getItem('ta12_study_progress');
        const localStudy = localStudyStr ? JSON.parse(localStudyStr) : {};
        const mergedStudy = { ...remote.study_progress, ...localStudy };
        localStorage.setItem('ta12_study_progress', JSON.stringify(mergedStudy));
      }

      // 5. ta12_user_stats (streak & diamonds)
      const localStatsStr = localStorage.getItem('ta12_user_stats');
      const localStats = localStatsStr ? JSON.parse(localStatsStr) : { streak: 0, diamonds: 0 };
      const mergedStats = {
        streak: Math.max(localStats.streak || 0, remote.streak || 0),
        diamonds: Math.max(localStats.diamonds || 0, remote.diamonds || 0),
      };
      localStorage.setItem('ta12_user_stats', JSON.stringify(mergedStats));

      window.dispatchEvent(new Event('ta12_progress_updated'));
    } catch {
      // safe fallback
    }
  }, []);

  // Fetch session
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (data.progress) {
            mergeRemoteToLocal(data.progress);
          }
        } else {
          setUser(null);
        }
      }
    } catch {
      // offline or network error
    } finally {
      setIsLoading(false);
    }
  }, [mergeRemoteToLocal]);

  // Sync client localStorage to SQLite /api/progress
  const syncNow = useCallback(async () => {
    if (isSyncingRef.current) return;
    try {
      isSyncingRef.current = true;

      const examScores = JSON.parse(localStorage.getItem('ta12_exam_results') || '{}');
      const topicHistory = JSON.parse(localStorage.getItem('ta12_progress') || '{}');
      const sectionProg = JSON.parse(localStorage.getItem('ta12_section_progress') || '{}');
      const studyProg = JSON.parse(localStorage.getItem('ta12_study_progress') || '{}');
      const userStats = JSON.parse(localStorage.getItem('ta12_user_stats') || '{"streak":0,"diamonds":0}');

      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_scores: examScores,
          topic_practice_history: topicHistory,
          section_progress: sectionProg,
          study_progress: studyProg,
          streak_flame: userStats.streak || 0,
          diamonds: userStats.diamonds || 0,
        }),
      });
    } catch {
      // offline resilience
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const scheduleDebouncedSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      syncNow();
    }, 1200);
  }, [syncNow]);

  useEffect(() => {
    refreshSession();

    const handleProgressUpdate = () => {
      scheduleDebouncedSync();
    };

    window.addEventListener('ta12_progress_updated', handleProgressUpdate);
    window.addEventListener('storage', handleProgressUpdate);

    return () => {
      window.removeEventListener('ta12_progress_updated', handleProgressUpdate);
      window.removeEventListener('storage', handleProgressUpdate);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [refreshSession, scheduleDebouncedSync]);

  return (
    <ProgressSyncContext.Provider value={{ user, isLoading, syncNow, refreshSession }}>
      {children}
    </ProgressSyncContext.Provider>
  );
}
