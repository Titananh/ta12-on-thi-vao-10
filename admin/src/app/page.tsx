'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Stats {
  total_users: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
  whitelist_count: number;
  avg_exams_completed: number;
  avg_exam_score: number;
  active_streaks_count: number;
}

interface UserItem {
  id: string;
  google_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at: string | null;
  last_login_at: string;
  is_whitelisted: boolean;
  progress: {
    exams_completed: number;
    avg_score: number;
    streak_flame: number;
    diamonds: number;
  };
}

interface WhitelistItem {
  id: number;
  email: string;
  created_at: string;
  notes: string;
  registered_user: {
    id: string;
    name: string;
    status: string;
  } | null;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'whitelist'>('users');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [counts, setCounts] = useState({ all: 0, approved: 0, pending: 0, rejected: 0 });
  const [whitelist, setWhitelist] = useState<WhitelistItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Single whitelist form state
  const [wlEmail, setWlEmail] = useState('');
  const [wlNotes, setWlNotes] = useState('');
  const [wlAutoApprove, setWlAutoApprove] = useState(true);
  const [isAddingWl, setIsAddingWl] = useState(false);

  // Batch whitelist state
  const [batchText, setBatchText] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch summary stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Fetch users with search & filter
  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
    }
  }, [statusFilter, searchQuery]);

  // Fetch whitelist
  const fetchWhitelist = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/whitelist');
      const data = await res.json();
      if (data.success) {
        setWhitelist(data.whitelist || []);
      }
    } catch (err: any) {
      console.error('Error fetching whitelist:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchUsers(), fetchWhitelist()]);
    setLoading(false);
  }, [fetchStats, fetchUsers, fetchWhitelist]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // 1-Click Action Handler
  const handleUserAction = async (userId: string, action: 'approve' | 'revoke' | 'reject') => {
    setActionLoadingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || `Đã cập nhật trạng thái: ${action}`, 'success');
        await Promise.all([fetchUsers(), fetchStats()]);
      } else {
        showToast(data.error || 'Cập nhật thất bại', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi mạng khi cập nhật', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Add Single Pre-whitelist Email
  const handleAddWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlEmail.trim()) {
      showToast('Vui lòng nhập địa chỉ email hợp lệ', 'error');
      return;
    }

    setIsAddingWl(true);
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: wlEmail.trim(),
          notes: wlNotes.trim(),
          autoApprovePending: wlAutoApprove,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setWlEmail('');
        setWlNotes('');
        await Promise.all([fetchWhitelist(), fetchUsers(), fetchStats()]);
      } else {
        showToast(data.error || 'Thêm vào Whitelist thất bại', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối', 'error');
    } finally {
      setIsAddingWl(false);
    }
  };

  // Add Batch Pre-whitelist
  const handleBatchWhitelist = async () => {
    if (!batchText.trim()) {
      showToast('Vui lòng dán danh sách email', 'error');
      return;
    }

    const emailList = batchText
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && e.includes('@') && e.includes('.'));

    if (emailList.length === 0) {
      showToast('Không tìm thấy định dạng email hợp lệ nào', 'error');
      return;
    }

    setIsSubmittingBatch(true);
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: emailList,
          notes: 'Batch Import qua Web Admin',
          autoApprovePending: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setBatchText('');
        setShowBatchModal(false);
        await Promise.all([fetchWhitelist(), fetchUsers(), fetchStats()]);
      } else {
        showToast(data.error || 'Import batch thất bại', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối', 'error');
    } finally {
      setIsSubmittingBatch(false);
    }
  };

  // Delete Whitelist Entry
  const handleDeleteWhitelist = async (id: number, email: string) => {
    if (!confirm(`Xác nhận xóa email ${email} khỏi danh sách Whitelist?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/whitelist?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa ${email} khỏi Whitelist`, 'success');
        await Promise.all([fetchWhitelist(), fetchUsers(), fetchStats()]);
      } else {
        showToast(data.error || 'Xóa thất bại', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi mạng khi xóa', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#121412] text-[#e8ece8]">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium transition-all animate-bounce ${
            toast.type === 'success'
              ? 'bg-[#1b2b1b] border-emerald-500/50 text-emerald-300'
              : 'bg-[#2b1b1b] border-rose-500/50 text-rose-300'
          }`}
        >
          <span>{toast.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#161a16]/95 backdrop-blur-md border-b border-[#283228] px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-emerald-900/30">
                TA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">TA12 ADMIN</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    PORTAL
                  </span>
                </div>
                <p className="text-xs text-[#8c9c8c]">Hệ thống Phê duyệt & Quản trị Học sinh Ôn thi vào 10</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e241e] border border-[#2a362a] text-xs text-[#a0b0a0]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SQLite WAL: <code className="text-emerald-300 font-mono">data/ta12_users.sqlite</code></span>
            </div>

            <button
              onClick={refreshAll}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-lg bg-[#222a22] hover:bg-[#2b362b] border border-[#344434] text-xs font-semibold text-[#d0ded0] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Làm mới dữ liệu từ SQLite"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{loading ? 'Đang tải...' : 'Làm mới'}</span>
            </button>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              <span>Vào Web Học sinh</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 4 Summary Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Approved Card */}
          <div className="p-5 rounded-2xl bg-[#181e18] border border-[#263226] shadow-sm hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Đã Phê Duyệt</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                ✓
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{stats?.approved_count ?? counts.approved}</span>
              <span className="text-xs text-[#8c9c8c]">học sinh truy cập 100%</span>
            </div>
            <div className="mt-3 text-xs text-emerald-400/80 flex items-center gap-1">
              <span>● Mở khóa đầy đủ 4 chế độ & 138 đề</span>
            </div>
          </div>

          {/* Pending Card */}
          <div className={`p-5 rounded-2xl bg-[#1e1c14] border shadow-sm transition-all ${
            (stats?.pending_count ?? counts.pending) > 0 ? 'border-amber-500/60 shadow-amber-900/10' : 'border-[#332c1c]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Chờ Phê Duyệt</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                ⏳
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{stats?.pending_count ?? counts.pending}</span>
              {(stats?.pending_count ?? counts.pending) > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/30 text-amber-300 animate-pulse">
                  Cần duyệt ngay
                </span>
              )}
            </div>
            <div className="mt-3 text-xs text-amber-300/80">
              <span>● Đang ở màn hình ApprovalWaitingScreen</span>
            </div>
          </div>

          {/* Pre-whitelist Card */}
          <div className="p-5 rounded-2xl bg-[#161a20] border border-[#242e3a] shadow-sm hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Pre-Whitelist</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                🛡
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{stats?.whitelist_count ?? whitelist.length}</span>
              <span className="text-xs text-[#8c9c8c]">email ưu tiên</span>
            </div>
            <div className="mt-3 text-xs text-blue-400/80">
              <span>● Tự động duyệt ngay khi đăng nhập Google</span>
            </div>
          </div>

          {/* Average Engagement Card */}
          <div className="p-5 rounded-2xl bg-[#1c1822] border border-[#2f243a] shadow-sm hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Tiến Độ Trung Bình</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                📊
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <div>
                <span className="text-3xl font-extrabold text-white">{stats?.avg_exam_score ?? 8.5}</span>
                <span className="text-xs text-[#8c9c8c]"> / 10 điểm</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                {stats?.avg_exams_completed ?? 0} đề/hs
              </span>
            </div>
            <div className="mt-3 text-xs text-purple-300/80 flex items-center gap-1.5">
              <span>🔥 {stats?.active_streaks_count ?? 0} học sinh có chuỗi streak học tập</span>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#263226] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-[#1a201a] text-[#a0b0a0] hover:text-white hover:bg-[#222a22]'
              }`}
            >
              <span>👥 Quản lý Người dùng</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-black/30">
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('whitelist')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'whitelist'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-[#1a201a] text-[#a0b0a0] hover:text-white hover:bg-[#222a22]'
              }`}
            >
              <span>🛡 Cấu hình Pre-Whitelist</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-black/30">
                {stats?.whitelist_count ?? whitelist.length}
              </span>
            </button>
          </div>

          {activeTab === 'whitelist' && (
            <button
              onClick={() => setShowBatchModal(true)}
              className="px-4 py-2 rounded-xl bg-[#202a20] hover:bg-[#283628] border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <span>+ Nhập danh sách nhiều email</span>
            </button>
          )}
        </div>

        {/* TAB 1: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-5">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#161a16] border border-[#252f25]">
              {/* Search Box */}
              <div className="relative flex-1">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708070]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo Tên học sinh hoặc Google Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a201a] border border-[#2a362a] text-sm text-white placeholder-[#708070] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1b221b] border border-[#283228]">
                {(
                  [
                    { id: 'all' as const, label: 'Tất cả', count: counts.all, alert: false },
                    { id: 'pending' as const, label: 'Chờ duyệt', count: counts.pending, alert: counts.pending > 0 },
                    { id: 'approved' as const, label: 'Đã duyệt', count: counts.approved, alert: false },
                    { id: 'rejected' as const, label: 'Đã từ chối', count: counts.rejected, alert: false },
                  ]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      statusFilter === tab.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-[#90a090] hover:text-white hover:bg-[#252e25]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        tab.alert ? 'bg-amber-500 text-black font-extrabold' : 'bg-black/30 text-inherit'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#252f25] bg-[#161a16] shadow-xl">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#252f25] bg-[#1a201a]/70 text-[#8c9c8c] text-xs uppercase tracking-wider font-semibold">
                    <th className="py-4 px-5">Học sinh / Tài khoản Google</th>
                    <th className="py-4 px-4">Ngày đăng ký</th>
                    <th className="py-4 px-4">Tiến độ làm bài</th>
                    <th className="py-4 px-4 text-center">Trạng thái</th>
                    <th className="py-4 px-5 text-right">Thao tác 1-Click</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222a22]">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#708070]">
                        <p className="text-base font-semibold">Không tìm thấy tài khoản nào phù hợp</p>
                        <p className="text-xs mt-1">Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const isPending = u.status === 'pending';
                      const isApproved = u.status === 'approved';
                      const isRejected = u.status === 'rejected';
                      const isLoading = actionLoadingId === u.id;

                      return (
                        <tr key={u.id} className="hover:bg-[#1a221a]/60 transition-colors">
                          {/* Student Info */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#243024] border border-[#344434] flex items-center justify-center font-bold text-emerald-400 text-sm overflow-hidden flex-shrink-0">
                                {u.avatar_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" />
                                ) : (
                                  u.name.substring(0, 2).toUpperCase()
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-white flex items-center gap-2">
                                  <span>{u.name}</span>
                                  {u.is_whitelisted && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                      PRE-WHITELIST
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-[#8c9c8c] flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono">{u.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Timestamps */}
                          <td className="py-4 px-4 text-xs text-[#a0b0a0]">
                            <div>{u.created_at || 'Mới đây'}</div>
                            {u.approved_at && (
                              <div className="text-[11px] text-emerald-400/80 mt-0.5">
                                Duyệt: {u.approved_at.split(' ')[0]}
                              </div>
                            )}
                          </td>

                          {/* Progress */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3 text-xs">
                              <div className="bg-[#1b221b] px-2.5 py-1 rounded-lg border border-[#283228]">
                                <span className="text-[#8c9c8c]">Đề: </span>
                                <span className="font-bold text-white">{u.progress?.exams_completed || 0}</span>
                              </div>
                              <div className="bg-[#1b221b] px-2.5 py-1 rounded-lg border border-[#283228]">
                                <span className="text-[#8c9c8c]">TB: </span>
                                <span className="font-bold text-emerald-400">
                                  {u.progress?.avg_score ? `${u.progress.avg_score}` : '-'}
                                </span>
                              </div>
                              {u.progress?.streak_flame > 0 && (
                                <div className="flex items-center gap-1 text-amber-400 font-bold">
                                  <span>🔥</span>
                                  <span>{u.progress.streak_flame}</span>
                                </div>
                              )}
                              {u.progress?.diamonds > 0 && (
                                <div className="flex items-center gap-1 text-cyan-400 font-bold">
                                  <span>💎</span>
                                  <span>{u.progress.diamonds}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4 text-center">
                            {isApproved && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                                <span>✓</span> Đã duyệt
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse">
                                <span>⏳</span> Chờ duyệt
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm">
                                <span>✕</span> Đã từ chối
                              </span>
                            )}
                          </td>

                          {/* 1-Click Action Buttons */}
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Pending user actions */}
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleUserAction(u.id, 'approve')}
                                    disabled={isLoading}
                                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all disabled:opacity-50"
                                    title="Phê duyệt ngay lập tức cho học sinh truy cập web"
                                  >
                                    <span>✓ Duyệt (Approve)</span>
                                  </button>
                                  <button
                                    onClick={() => handleUserAction(u.id, 'reject')}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 rounded-lg bg-[#2b1f1f] hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-semibold text-xs transition-colors disabled:opacity-50"
                                    title="Từ chối truy cập"
                                  >
                                    <span>✕ Từ chối</span>
                                  </button>
                                </>
                              )}

                              {/* Approved user actions */}
                              {isApproved && (
                                <button
                                  onClick={() => handleUserAction(u.id, 'revoke')}
                                  disabled={isLoading}
                                  className="px-3 py-1.5 rounded-lg bg-[#292218] hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-colors disabled:opacity-50"
                                  title="Khóa / Thu hồi quyền truy cập học sinh này"
                                >
                                  <span>✕ Thu hồi (Revoke)</span>
                                </button>
                              )}

                              {/* Rejected user actions */}
                              {isRejected && (
                                <button
                                  onClick={() => handleUserAction(u.id, 'approve')}
                                  disabled={isLoading}
                                  className="px-3 py-1.5 rounded-lg bg-[#1a281a] hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-colors disabled:opacity-50"
                                  title="Kích hoạt lại tài khoản này"
                                >
                                  <span>⟲ Kích hoạt lại</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRE-WHITELIST MANAGEMENT */}
        {activeTab === 'whitelist' && (
          <div className="space-y-6">
            {/* Single Add Form */}
            <form onSubmit={handleAddWhitelist} className="p-6 rounded-2xl bg-[#161a16] border border-[#252f25] space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>🛡 Thêm Email vào Pre-Whitelist</span>
                </h3>
                <p className="text-xs text-[#8c9c8c] mt-1">
                  Khi tài khoản Google dùng email này đăng nhập lần đầu vào TA12, hệ thống sẽ tự động cấp quyền
                  <code className="text-emerald-400 font-mono ml-1 font-bold">approved</code> ngay mà không cần Admin duyệt thủ công.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-[#b0c0b0] mb-1.5">Địa chỉ Google Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="vd: hocsinh.lop10@gmail.com"
                    value={wlEmail}
                    onChange={(e) => setWlEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b221b] border border-[#2a362a] text-sm text-white placeholder-[#708070] focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-[#b0c0b0] mb-1.5">Ghi chú (Tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="vd: Lớp chọn 10A1, VIP, Đăng ký sớm..."
                    value={wlNotes}
                    onChange={(e) => setWlNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b221b] border border-[#2a362a] text-sm text-white placeholder-[#708070] focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-1 flex flex-col justify-end">
                  <button
                    type="submit"
                    disabled={isAddingWl}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-colors disabled:opacity-50"
                  >
                    {isAddingWl ? 'Đang thêm...' : '+ Thêm vào Whitelist'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoApprove"
                  checked={wlAutoApprove}
                  onChange={(e) => setWlAutoApprove(e.target.checked)}
                  className="rounded border-[#344434] bg-[#1a221a] text-emerald-600 focus:ring-0"
                />
                <label htmlFor="autoApprove" className="text-xs text-[#a0b0a0] cursor-pointer">
                  Tự động kích hoạt ngay lập tức nếu email này đã đăng ký và đang ở trạng thái Chờ duyệt (Pending)
                </label>
              </div>
            </form>

            {/* Whitelist Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#252f25] bg-[#161a16] shadow-xl">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#252f25] bg-[#1a201a]/70 text-[#8c9c8c] text-xs uppercase tracking-wider font-semibold">
                    <th className="py-4 px-5">Email được Whitelist</th>
                    <th className="py-4 px-4">Ghi chú</th>
                    <th className="py-4 px-4">Ngày thêm</th>
                    <th className="py-4 px-4 text-center">Tài khoản liên kết</th>
                    <th className="py-4 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222a22]">
                  {whitelist.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#708070]">
                        <p className="text-base font-semibold">Danh sách Pre-whitelist đang trống</p>
                        <p className="text-xs mt-1">Thêm email học sinh ưu tiên để tự động phê duyệt</p>
                      </td>
                    </tr>
                  ) : (
                    whitelist.map((w) => (
                      <tr key={w.id} className="hover:bg-[#1a221a]/60 transition-colors">
                        <td className="py-4 px-5 font-mono font-bold text-white text-sm">
                          {w.email}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#a0b0a0]">
                          {w.notes || <span className="text-[#607060] italic">Không có ghi chú</span>}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#8c9c8c]">
                          {w.created_at || 'Mới đây'}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {w.registered_user ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <span>✓</span> Đã kích hoạt ({w.registered_user.name})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#222a22] text-[#8c9c8c] border border-[#303c30]">
                              <span>⏳</span> Chưa đăng nhập
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleDeleteWhitelist(w.id, w.email)}
                            className="px-3 py-1.5 rounded-lg bg-[#2b1f1f] hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-semibold text-xs transition-colors"
                            title="Xóa khỏi danh sách Whitelist"
                          >
                            <span>🗑 Xóa</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Batch Import Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-[#161a16] border border-[#2c382c] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>📋 Nhập danh sách nhiều Email (Batch Whitelist)</span>
              </h3>
              <button
                onClick={() => setShowBatchModal(false)}
                className="w-8 h-8 rounded-lg bg-[#222a22] hover:bg-[#2e3a2e] text-[#a0b0a0] hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#8c9c8c]">
              Dán danh sách email cần whitelist (phân cách bằng dấu phẩy, chấm phẩy hoặc xuống dòng).
              Hệ thống sẽ lọc trùng và tự động kích hoạt tài khoản đang chờ nếu có.
            </p>

            <textarea
              rows={6}
              placeholder="student1@gmail.com&#10;student2@gmail.com&#10;student3@ta12.edu.vn"
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#1b221b] border border-[#2a362a] text-sm text-white font-mono placeholder-[#708070] focus:outline-none focus:border-emerald-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 rounded-xl bg-[#222a22] hover:bg-[#2b362b] text-xs font-semibold text-[#a0b0a0]"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleBatchWhitelist}
                disabled={isSubmittingBatch}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 disabled:opacity-50"
              >
                {isSubmittingBatch ? 'Đang xử lý...' : 'Thêm danh sách vào Whitelist'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
