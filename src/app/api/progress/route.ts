import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserProgress, saveUserProgress } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { user } = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    if (user.status !== 'approved') {
      return NextResponse.json(
        { error: 'Access denied: Account pending admin approval' },
        { status: 403 }
      );
    }

    const progress = getUserProgress(user.id);
    if (!progress) {
      return NextResponse.json({
        user_id: user.id,
        exam_scores: {},
        topic_practice_history: {},
        section_progress: {},
        study_progress: {},
        streak_flame: 0,
        diamonds: 0,
      });
    }

    let parsedExams = {};
    let parsedTopics = {};
    let parsedSections = {};
    let parsedStudy = {};

    try { parsedExams = JSON.parse(progress.exam_scores || '{}'); } catch {}
    try { parsedTopics = JSON.parse(progress.topic_practice_history || '{}'); } catch {}
    try { parsedSections = JSON.parse(progress.section_progress || '{}'); } catch {}
    try { parsedStudy = JSON.parse(progress.study_progress || '{}'); } catch {}

    return NextResponse.json({
      user_id: user.id,
      exam_scores: parsedExams,
      topic_practice_history: parsedTopics,
      section_progress: parsedSections,
      study_progress: parsedStudy,
      streak_flame: progress.streak_flame,
      diamonds: progress.diamonds,
      updated_at: progress.updated_at,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    if (user.status !== 'approved') {
      return NextResponse.json(
        { error: 'Access denied: Account pending admin approval' },
        { status: 403 }
      );
    }

    let body: any;
    try {
      body = await request.json();
      if (!body || typeof body !== 'object') {
        return NextResponse.json({ error: 'Invalid or missing JSON payload' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid or missing JSON payload' }, { status: 400 });
    }

    const serialize = (val: any) => {
      if (val === undefined || val === null) return undefined;
      return typeof val === 'string' ? val : JSON.stringify(val);
    };

    const parseCounter = (val: any) => {
      if (val === undefined || val === null) return undefined;
      if (typeof val !== 'number' && typeof val !== 'string') return undefined;
      const num = Number(val);
      if (isNaN(num)) return undefined;
      return Math.max(0, Math.floor(num));
    };

    saveUserProgress(user.id, {
      exam_scores: serialize(body.exam_scores),
      topic_practice_history: serialize(body.topic_practice_history),
      section_progress: serialize(body.section_progress),
      study_progress: serialize(body.study_progress),
      streak_flame: parseCounter(body.streak_flame),
      diamonds: parseCounter(body.diamonds),
    });

    const updated = getUserProgress(user.id);

    return NextResponse.json({
      success: true,
      updated_at: updated?.updated_at || new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
