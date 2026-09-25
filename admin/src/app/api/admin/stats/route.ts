import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDatabase();

    const countsRow = db.prepare(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
      FROM users
    `).get() as { total_users: number; approved_count: number; pending_count: number; rejected_count: number };

    const whitelistRow = db.prepare('SELECT COUNT(*) as count FROM pre_whitelist').get() as { count: number };

    const progressRows = db.prepare(`
      SELECT exam_scores, streak_flame, diamonds FROM user_progress
    `).all() as { exam_scores: string; streak_flame: number; diamonds: number }[];

    let totalExamsCompleted = 0;
    let totalScoreSum = 0;
    let scoreCount = 0;
    let activeStreaks = 0;

    for (const row of progressRows) {
      if (row.streak_flame > 0) activeStreaks++;
      try {
        const scores = JSON.parse(row.exam_scores || '{}');
        const examKeys = Object.keys(scores);
        totalExamsCompleted += examKeys.length;
        for (const k of examKeys) {
          const item = scores[k];
          if (item && typeof item.score === 'number') {
            totalScoreSum += item.score;
            scoreCount++;
          }
        }
      } catch {
        // ignore parse error
      }
    }

    const avgScore = scoreCount > 0 ? Number((totalScoreSum / scoreCount).toFixed(1)) : 8.5;
    const avgExams = countsRow.approved_count > 0 ? Number((totalExamsCompleted / countsRow.approved_count).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        total_users: countsRow.total_users || 0,
        approved_count: countsRow.approved_count || 0,
        pending_count: countsRow.pending_count || 0,
        rejected_count: countsRow.rejected_count || 0,
        whitelist_count: whitelistRow.count || 0,
        avg_exams_completed: avgExams,
        avg_exam_score: avgScore,
        active_streaks_count: activeStreaks,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
