import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const admin = await requireAdminSession(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin session required' },
      { status: 401 }
    );
  }

  try {
    const db = getDatabase();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    let sql = `
      SELECT 
        u.id, u.google_id, u.email, u.name, u.avatar_url, u.status,
        u.created_at, u.approved_at, u.last_login_at,
        p.exam_scores, p.streak_flame, p.diamonds,
        CASE WHEN w.email IS NOT NULL THEN 1 ELSE 0 END as is_whitelisted
      FROM users u
      LEFT JOIN user_progress p ON u.id = p.user_id
      LEFT JOIN pre_whitelist w ON LOWER(u.email) = LOWER(w.email)
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status !== 'all') {
      sql += ' AND u.status = ?';
      params.push(status);
    }

    if (search.trim()) {
      sql += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    sql += ' ORDER BY u.created_at DESC';

    const rows = db.prepare(sql).all(...params) as any[];

    const users = rows.map((r) => {
      let examsCount = 0;
      let avgScore = 0;
      try {
        const scores = JSON.parse(r.exam_scores || '{}');
        const keys = Object.keys(scores);
        examsCount = keys.length;
        if (examsCount > 0) {
          const sum = keys.reduce((acc, k) => acc + (scores[k]?.score || 0), 0);
          avgScore = Number((sum / examsCount).toFixed(1));
        }
      } catch {
        // ignore
      }

      return {
        id: r.id,
        google_id: r.google_id,
        email: r.email,
        name: r.name,
        avatar_url: r.avatar_url,
        status: r.status,
        created_at: r.created_at,
        approved_at: r.approved_at,
        last_login_at: r.last_login_at,
        is_whitelisted: Boolean(r.is_whitelisted),
        progress: {
          exams_completed: examsCount,
          avg_score: avgScore,
          streak_flame: r.streak_flame || 0,
          diamonds: r.diamonds || 0,
        },
      };
    });

    // Compute status counts
    const countRow = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM users
    `).get() as any;

    return NextResponse.json({
      success: true,
      users,
      counts: {
        all: countRow.total || 0,
        approved: countRow.approved || 0,
        pending: countRow.pending || 0,
        rejected: countRow.rejected || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdminSession(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin session required' },
      { status: 401 }
    );
  }

  try {
    const db = getDatabase();
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ success: false, error: 'Thiếu userId hoặc action' }, { status: 400 });
    }

    let newStatus: string;
    let setApprovedAt = false;

    if (action === 'approve') {
      newStatus = 'approved';
      setApprovedAt = true;
    } else if (action === 'revoke' || action === 'reject') {
      newStatus = 'rejected';
      setApprovedAt = false;
    } else if (action === 'pending') {
      newStatus = 'pending';
      setApprovedAt = false;
    } else {
      return NextResponse.json({ success: false, error: 'Hành động không hợp lệ' }, { status: 400 });
    }

    const stmt = db.prepare(`
      UPDATE users SET
        status = ?,
        approved_at = CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END
      WHERE id = ?
    `);

    const result = stmt.run(newStatus, setApprovedAt ? 1 : 0, userId);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    const updatedUser = db.prepare('SELECT id, email, name, status, approved_at FROM users WHERE id = ?').get(userId);

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật trạng thái người dùng thành: ${newStatus}`,
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
