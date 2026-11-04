'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Captured Application Error:', error);
    try {
      fetch('/api/system/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLIENT_ERROR',
          module: 'STOREFRONT',
          description: `Sự cố giao diện người dùng: ${error?.message || String(error)} | Trang: ${typeof window !== 'undefined' ? window.location.pathname : ''}`
        })
      }).catch(() => {});
    } catch (e) {}
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div>
          <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
            Có lỗi xảy ra khi tải trang
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Hệ thống đã tự động ghi nhận sự cố. Bạn có thể nhấn thử lại hoặc quay về trang chủ.
          </p>
        </div>

        {error?.message && (
          <div className="p-3.5 bg-slate-100 rounded-xl text-left border border-slate-200">
            <p className="text-[11px] font-mono text-slate-700 break-words line-clamp-3">
              {error.message}
            </p>
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
          <Link
            href="/"
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

