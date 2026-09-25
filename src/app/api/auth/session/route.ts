import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { user, progress } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null, progress: null });
    }

    let parsedExams = {};
    let parsedTopics = {};
    let parsedSections = {};
    let parsedStudy = {};

    if (progress) {
      try { parsedExams = JSON.parse(progress.exam_scores || '{}'); } catch {}
      try { parsedTopics = JSON.parse(progress.topic_practice_history || '{}'); } catch {}
      try { parsedSections = JSON.parse(progress.section_progress || '{}'); } catch {}
      try { parsedStudy = JSON.parse(progress.study_progress || '{}'); } catch {}
    }

    const isSuperadmin = user.email?.toLowerCase() === 'dot71714@gmail.com';
    return NextResponse.json({
      user: {
        id: user.id,
        email: isSuperadmin ? 'ADMIN' : user.email,
        name: isSuperadmin ? 'ADMIN' : user.name,
        role: isSuperadmin ? 'superadmin' : 'student',
        avatar_url: user.avatar_url,
        status: user.status,
        approved_at: user.approved_at,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
      },
      progress: {
        streak: progress ? progress.streak_flame : 0,
        diamonds: progress ? progress.diamonds : 0,
        exam_scores: parsedExams,
        topic_practice_history: parsedTopics,
        section_progress: parsedSections,
        study_progress: parsedStudy,
        updated_at: progress ? progress.updated_at : null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ user: null, progress: null, error: error.message }, { status: 500 });
  }
}
