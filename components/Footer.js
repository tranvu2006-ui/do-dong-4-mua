'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RotateCcw, 
  CreditCard, Leaf, FileText, ChevronRight, Store, ArrowRight,
  Package
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [siteSettings, setSiteSettings] = useState(null);
  const [branches, setBranches] = useState([]);

  const loadData = async () => {
    try {
      const [settingsRes, branchesRes] = await Promise.all([
        fetch('/api/system/settings'),
        fetch('/api/branches?all=true')
      ]);
      const [settingsData, branchesData] = await Promise.all([
        settingsRes.json(),
        branchesRes.json()
      ]);
      if (settingsData.success && settingsData.data) setSiteSettings(settingsData.data);
      if (branchesData.success && Array.isArray(branchesData.data)) setBranches(branchesData.data);
    } catch (e) {
      console.warn('Lỗi tải footer data:', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('settings-change', loadData);
    window.addEventListener('branches-change', loadData);
    return () => {
      window.removeEventListener('settings-change', loadData);
      window.removeEventListener('branches-change', loadData);
    };
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const activeBranches = branches.filter((b) => b.status === 1);

  return (
    <footer className="bg-brand-950 text-emerald-100 border-t-4 border-accent-500 pt-14 pb-10">
      {/* 4 Value Propositions / Commitments */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/chinh-sach?tab=giao-hang"
            className="bg-brand-900/70 hover:bg-brand-900 p-5 rounded-3xl border border-brand-800/80 hover:border-brand-700 flex items-start gap-3.5 transition group cursor-pointer"
          >
            <div className="p-3 bg-brand-800 rounded-2xl text-yellow-300 shrink-0 group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-black text-base mb-1 font-heading group-hover:text-yellow-300 transition-colors flex items-center gap-1">
                <span>Giao Hỏa Tốc {siteSettings?.shipping_partner || 'GreenSM'}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-emerald-200/90 text-xs font-medium leading-relaxed">
                Giao nhanh nội thành trong 2 giờ, cam kết trái cây mát lạnh không dập nát.
              </p>
            </div>
          </Link>

          <Link
            href="/chinh-sach?tab=doi-tra"
            className="bg-brand-900/70 hover:bg-brand-900 p-5 rounded-3xl border border-brand-800/80 hover:border-brand-700 flex items-start gap-3.5 transition group cursor-pointer"
          >
            <div className="p-3 bg-brand-800 rounded-2xl text-yellow-300 shrink-0 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-black text-base mb-1 font-heading group-hover:text-yellow-300 transition-colors flex items-center gap-1">
                <span>Bao Ăn 1 Đổi 1 Trong 24H</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-emerald-200/90 text-xs font-medium leading-relaxed">
                Sượng, nhạt hay không ngọt đổi trả 100% không mất phí, bảo vệ tối đa quyền lợi.
              </p>
            </div>
          </Link>

          <div className="bg-brand-900/70 p-5 rounded-3xl border border-brand-800/80 flex items-start gap-3.5">
            <div className="p-3 bg-brand-800 rounded-2xl text-yellow-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-black text-base mb-1 font-heading">VietGAP & Nguồn Gốc Chuẩn</h4>
              <p className="text-emerald-200/90 text-xs font-medium leading-relaxed">
                100% trái cây thu hoạch trực tiếp tại các nhà vườn liên kết uy tín trên cả nước.
              </p>
            </div>
          </div>

          <div className="bg-brand-900/70 p-5 rounded-3xl border border-brand-800/80 flex items-start gap-3.5">
            <div className="p-3 bg-brand-800 rounded-2xl text-yellow-300 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-black text-base mb-1 font-heading">Thanh Toán Linh Hoạt</h4>
              <p className="text-emerald-200/90 text-xs font-medium leading-relaxed">
                Hỗ trợ COD nhận hàng kiểm tra rồi trả tiền, quét mã VietQR tự động tiện lợi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3 Columns Layout (Strictly per user's specification) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pb-12 border-b border-brand-900">
        {/* Cột 1 - Thương hiệu & Liên hệ */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            {siteSettings?.logo_url ? (
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-1 shadow-md shrink-0 flex items-center justify-center">
                <img
                  src={siteSettings.logo_url}
                  alt={siteSettings?.site_name || "Logo"}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0">
                <Leaf className="w-7 h-7" />
              </div>
            )}
            <div>
              <div className="text-2xl font-black text-white font-heading tracking-tight leading-none">
                {siteSettings?.site_name?.trim() ? (
                  <span>{siteSettings.site_name.trim()}</span>
                ) : (
                  <>ĐỔ ĐỐNG <span className="text-accent-400">4 MÙA</span></>
                )}
              </div>
              <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider mt-1">
                {siteSettings?.site_slogan || 'Trái Cây Tươi Ngon Chuẩn Vị'}
              </p>
            </div>
          </div>

          <p className="text-emerald-200/90 text-xs sm:text-sm leading-relaxed font-medium">
            Hệ thống cung cấp trái cây đặc sản tươi ngon đạt chuẩn VietGAP, combo trái cây ăn gia đình và giỏ quà biếu sang trọng theo đúng đặc tả SRS.
          </p>

          <div className="text-emerald-300 space-y-2.5 text-xs sm:text-sm font-medium pt-1">
            {siteSettings?.company_address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Trụ sở: {siteSettings.company_address}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-accent-400 shrink-0" />
              <span>Giờ mở cửa: 07:00 - 21:30 hàng ngày</span>
            </div>
            {siteSettings?.hotline && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <span>Hotline CSKH: <strong className="text-yellow-300 font-black">{siteSettings.hotline}</strong></span>
              </div>
            )}
            {siteSettings?.contact_email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <span>Email hỗ trợ: {siteSettings.contact_email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cột 2 - Chính Sách & Khách Hàng (Mới) */}
        <div>
          <h3 className="text-white font-black text-lg mb-4 border-l-4 border-accent-500 pl-3 font-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-400" />
            <span>Chính Sách & Khách Hàng</span>
          </h3>
          <ul className="text-emerald-200 space-y-3 text-xs sm:text-sm font-medium">
            <li>
              <Link
                href="/chinh-sach?tab=doi-tra"
                className="hover:text-yellow-300 transition flex items-center gap-2 group cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
                <span>Chính sách đổi trả ("Bao ăn 1 đổi 1 trong 24h")</span>
              </Link>
            </li>
            <li>
              <Link
                href="/chinh-sach?tab=giao-hang"
                className="hover:text-yellow-300 transition flex items-center gap-2 group cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
                <span>Chính sách giao hàng (Siêu tốc 2 giờ nội thành)</span>
              </Link>
            </li>
            <li>
              <Link
                href="/chinh-sach?tab=bao-mat"
                className="hover:text-yellow-300 transition flex items-center gap-2 group cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
                <span>Chính sách bảo mật thông tin khách hàng</span>
              </Link>
            </li>
            <li>
              <Link
                href="/chinh-sach?tab=dieu-khoan"
                className="hover:text-yellow-300 transition flex items-center gap-2 group cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
                <span>Điều khoản sử dụng dịch vụ</span>
              </Link>
            </li>
            <li className="pt-2 border-t border-brand-900/80">
              <Link
                href="/lich-su-don-hang"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-900 text-yellow-300 hover:bg-brand-800 transition font-bold text-xs cursor-pointer"
              >
                <Package className="w-4 h-4 text-yellow-300" />
                <span>Hướng dẫn tra cứu đơn hàng</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3 - Hệ Thống Chi Nhánh */}
        <div>
          <h3 className="text-white font-black text-lg mb-4 border-l-4 border-accent-500 pl-3 font-heading flex items-center gap-2">
            <Store className="w-5 h-5 text-accent-400" />
            <span>Hệ Thống Chi Nhánh</span>
          </h3>

          <ul className="text-emerald-200 space-y-3.5 text-xs sm:text-sm font-medium">
            {activeBranches.slice(0, 3).map((b) => (
              <li key={b.id} className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold text-xs">{b.branch_name}</strong>
                  <span className="text-emerald-300/90 text-xs block leading-relaxed">{b.address}</span>
                  {b.phone && (
                    <span className="text-emerald-400 font-mono text-[11px] font-bold">Hotline: {b.phone}</span>
                  )}
                </div>
              </li>
            ))}

            {activeBranches.length === 0 && (
              <li className="text-xs text-emerald-400/80">Đang cập nhật danh sách chi nhánh...</li>
            )}
          </ul>

          <div className="pt-4">
            <Link
              href="/chi-nhanh"
              className="inline-flex items-center gap-1.5 text-xs text-yellow-300 hover:text-white font-extrabold hover:underline cursor-pointer"
            >
              <span>Xem tất cả {activeBranches.length} chi nhánh trên bản đồ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Admin Portal, Academic Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-400/90 text-xs font-medium">
        <div>
          © 2026 {siteSettings?.site_name || 'ĐỔ ĐỐNG 4 MÙA'}. Tất cả các quyền được bảo lưu.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <Link href="/admin" className="hover:text-yellow-300 transition cursor-pointer font-bold">
            Cổng quản trị nội bộ
          </Link>
          <span>•</span>
          <span className="text-emerald-300">
            SRS V1.0 • Đồ án tốt nghiệp: Trần Vũ & Hồ Thị Vân Anh
          </span>
        </div>
      </div>
    </footer>
  );
}
