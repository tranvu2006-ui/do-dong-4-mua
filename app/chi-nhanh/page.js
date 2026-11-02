'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ShieldCheck, Truck, ArrowLeft, Navigation } from 'lucide-react';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/branches')
      .then(r => r.json())
      .then(d => {
        if (d.success) setBranches(d.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" /> Hệ Thống Cửa Hàng
        </div>
        <h1 className="text-3xl font-black text-gray-900">
          Chi Nhánh Trái Cây Đổ Đống 4 Mùa
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          Đón tiếp quý khách đến trực tiếp trải nghiệm lựa chọn từng quả tươi ngon hoặc giao hỏa tốc 2 giờ qua xe điện GreenSM từ chi nhánh gần nhất.
        </p>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {branches.map((b) => (
          <div key={b.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
              <img
                src={b.id === 1 
                  ? 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'}
                alt={b.branch_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                {b.id === 1 ? '🌟 Trụ Sở Chính' : '📍 Chi Nhánh Trung Tâm'}
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-extrabold text-lg text-gray-900">{b.branch_name}</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong>Địa chỉ:</strong> {b.address}</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                    <span><strong>Điện thoại:</strong> <a href={`tel:${b.phone}`} className="text-brand-700 font-bold hover:underline">{b.phone}</a></span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                    <span><strong>Giờ mở cửa:</strong> 07:00 – 21:30 (Tất cả các ngày trong tuần)</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Điểm xuất hàng hỏa tốc GreenSM
                </span>
                <Link
                  href="/"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Mua hàng tại đây
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back button */}
      <div className="text-center pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}

