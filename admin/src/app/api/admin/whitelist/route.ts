import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT 
        w.id, w.email, w.created_at, w.notes,
        u.id as user_id, u.name as user_name, u.status as user_status
      FROM pre_whitelist w
      LEFT JOIN users u ON LOWER(w.email) = LOWER(u.email)
      ORDER BY w.created_at DESC
    `).all() as any[];

    return NextResponse.json({
      success: true,
      whitelist: rows.map((r) => ({
        id: r.id,
        email: r.email,
        created_at: r.created_at,
        notes: r.notes || '',
        registered_user: r.user_id ? {
          id: r.user_id,
          name: r.user_name,
          status: r.user_status,
        } : null,
      })),
      total: rows.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();
    const body = await request.json();
    const { email, notes = '', emails, autoApprovePending = true } = body;

    // Support both single email and batch array of emails
    const emailList: string[] = [];
    if (Array.isArray(emails)) {
      emailList.push(...emails);
    } else if (typeof email === 'string') {
      emailList.push(email);
    }

    if (emailList.length === 0) {
      return NextResponse.json({ success: false, error: 'Email không hợp lệ' }, { status: 400 });
    }

    const results = [];
    let totalAutoApproved = 0;

    const insertStmt = db.prepare(`
      INSERT INTO pre_whitelist (email, notes) VALUES (?, ?)
      ON CONFLICT(email) DO UPDATE SET notes = excluded.notes
    `);

    for (const rawEmail of emailList) {
      const normalizedEmail = (rawEmail || '').trim().toLowerCase();
      if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
        continue;
      }

      insertStmt.run(normalizedEmail, notes);

      let autoApproved = false;
      if (autoApprovePending) {
        const pendingUser = db.prepare('SELECT id, status FROM users WHERE email = ? COLLATE NOCASE').get(normalizedEmail) as any;
        if (pendingUser && pendingUser.status === 'pending') {
          db.prepare(`
            UPDATE users SET status = 'approved', approved_at = datetime('now') WHERE id = ?
          `).run(pendingUser.id);
          autoApproved = true;
          totalAutoApproved++;
        }
      }

      const item = db.prepare('SELECT * FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get(normalizedEmail);
      results.push({ item, autoApproved });
    }

    if (results.length === 0) {
      return NextResponse.json({ success: false, error: 'Không có email hợp lệ nào được thêm' }, { status: 400 });
    }

    const primaryResult = results[0];

    return NextResponse.json({
      success: true,
      message: totalAutoApproved > 0
        ? `Đã thêm ${results.length} email vào Whitelist và tự động kích hoạt ${totalAutoApproved} tài khoản đang chờ!`
        : `Đã thêm ${results.length} email vào Whitelist thành công!`,
      autoApproved: totalAutoApproved > 0,
      item: primaryResult.item,
      items: results.map(r => r.item),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDatabase();
    const searchParams = request.nextUrl.searchParams;
    let id = searchParams.get('id');
    let email = searchParams.get('email');

    if (!id && !email) {
      try {
        const body = await request.json();
        if (body.id) id = String(body.id);
        if (body.email) email = String(body.email);
      } catch {
        // ignore body parse error
      }
    }

    if (!id && !email) {
      return NextResponse.json({ success: false, error: 'Thiếu id hoặc email để xóa' }, { status: 400 });
    }

    if (id) {
      db.prepare('DELETE FROM pre_whitelist WHERE id = ?').run(id);
    } else if (email) {
      db.prepare('DELETE FROM pre_whitelist WHERE email = ? COLLATE NOCASE').run(email.trim().toLowerCase());
    }

    return NextResponse.json({
      success: true,
      message: 'Đã xóa email khỏi danh sách Whitelist',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
