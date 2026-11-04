'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Captured Admin Error:', error);
    try {
      fetch('/api/system/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLIENT_ERROR',
          module: 'ADMIN',
          description: `Sự cố giao diện Quản Trị: ${error?.message || String(error)} | Tab/Trang: ${typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : ''}`
        })
      }).catch(() => {});
    } catch (e) {}
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div>
          <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
            Lỗi phân hệ Quản Trị
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Phân hệ quản trị gặp sự cố khi xử lý dữ liệu. Vui lòng bấm thử lại hoặc quay lại trang tổng quan.
          </p>
        </div>

        {error?.message && (
          <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-left border border-slate-800 font-mono text-xs overflow-auto max-h-40">
            <p className="text-rose-400 font-bold mb-1">Chi tiết lỗi:</p>
            <p className="break-words">{error.message}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/admin?tab=orders';
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Về Tab Đơn Hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
}

