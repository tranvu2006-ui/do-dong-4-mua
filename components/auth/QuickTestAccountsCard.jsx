'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function QuickTestAccountsCard({ onSelectAccount }) {
  return (
    <div className="bg-brand-50/80 p-4 rounded-2xl border border-brand-200/60 text-xs space-y-2">
      <div className="flex items-center justify-between font-bold text-brand-900">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent-500" /> Tài khoản mẫu thử nghiệm (Bấm để điền):
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelectAccount('0929894248', 'Admin@123456')}
          className="p-2 bg-white rounded-xl border border-brand-200 hover:border-brand-600 text-left transition cursor-pointer"
        >
          <div className="font-bold text-brand-700">👑 Admin Tổng</div>
          <div className="text-[10px] text-gray-500">0929894248 (Chuyển Dashboard)</div>
        </button>
        <button
          type="button"
          onClick={() => onSelectAccount('0912345678', 'Admin@123456')}
          className="p-2 bg-white rounded-xl border border-brand-200 hover:border-brand-600 text-left transition cursor-pointer"
        >
          <div className="font-bold text-emerald-700">🏢 Admin Chi Nhánh</div>
          <div className="text-[10px] text-gray-500">0912345678 (Chuyển Dashboard)</div>
        </button>
        <button
          type="button"
          onClick={() => onSelectAccount('0901234567', 'password123')}
          className="p-2 bg-white rounded-xl border border-brand-200 hover:border-brand-600 text-left transition cursor-pointer"
        >
          <div className="font-bold text-blue-700">🛒 Khách Hàng</div>
          <div className="text-[10px] text-gray-500">0901234567 (Về Trang chủ)</div>
        </button>
        <button
          type="button"
          onClick={() => onSelectAccount('0900000000', '123456')}
          className="p-2 bg-white rounded-xl border border-red-200 hover:border-red-600 text-left transition cursor-pointer"
        >
          <div className="font-bold text-red-600">🔒 Tài Khoản Khóa</div>
          <div className="text-[10px] text-gray-500">0900000000 (Test TH4)</div>
        </button>
      </div>
    </div>
  );
}
