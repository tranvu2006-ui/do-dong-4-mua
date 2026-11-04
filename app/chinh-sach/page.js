'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  RotateCcw, Truck, ShieldCheck, FileText, 
  ChevronRight, Phone, Mail, ArrowLeft
} from 'lucide-react';

function PolicyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'doi-tra';

  const [activeTab, setActiveTab] = useState(tabParam);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tabParam && ['doi-tra', 'giao-hang', 'bao-mat', 'dieu-khoan'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/system/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSiteSettings(data.data);
      }
    } catch (e) {
      console.warn('Lỗi tải cấu hình chính sách:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('settings-change', loadSettings);
    return () => window.removeEventListener('settings-change', loadSettings);
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    router.push(`/chinh-sach?tab=${key}`, { scroll: false });
  };

  const policies = [
    {
      key: 'doi-tra',
      title: 'Chính sách đổi trả',
      icon: RotateCcw,
      content: siteSettings?.exchange_policy || '',
    },
    {
      key: 'giao-hang',
      title: 'Chính sách giao hàng',
      icon: Truck,
      content: siteSettings?.shipping_policy || '',
    },
    {
      key: 'bao-mat',
      title: 'Chính sách bảo mật',
      icon: ShieldCheck,
      content: siteSettings?.privacy_policy || '',
    },
    {
      key: 'dieu-khoan',
      title: 'Điều khoản sử dụng dịch vụ',
      icon: FileText,
      content: siteSettings?.terms_of_service || '',
    }
  ];

  const currentPolicy = policies.find((p) => p.key === activeTab) || policies[0];
  const IconComp = currentPolicy.icon;

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* Breadcrumb & Navigation Back */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Link href="/" className="hover:text-brand-600 transition flex items-center gap-1 cursor-pointer">
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">Chính Sách & Quy Định</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-brand-700 font-extrabold">{currentPolicy.title}</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-300 font-bold transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-brand-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Chính Sách & Điều Khoản
          </h1>
          {siteSettings?.site_name && (
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 font-medium">
              {siteSettings.site_name}
            </p>
          )}
        </div>

        {/* Main Content Layout: Sidebar + Policy Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-sm space-y-1">
              {policies.map((p) => {
                const ItemIcon = p.icon;
                const isActive = activeTab === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => handleTabChange(p.key)}
                    className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between gap-3 transition cursor-pointer ${
                      isActive
                        ? 'bg-brand-600 text-white font-extrabold shadow-md shadow-brand-600/20'
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-brand-700'
                        }`}
                      >
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div className="truncate text-xs sm:text-sm">
                        {p.title}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'text-white translate-x-0.5' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Contact Box (chỉ hiện thông tin khi CSDL có) */}
            {(siteSettings?.hotline || siteSettings?.contact_email) && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-brand-900 font-black text-xs uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-brand-600" />
                  <span>Hỗ Trợ Khách Hàng</span>
                </div>
                <div className="space-y-2 text-xs">
                  {siteSettings?.hotline && (
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>Hotline: <strong className="text-brand-700 font-black">{siteSettings.hotline}</strong></span>
                    </div>
                  )}
                  {siteSettings?.contact_email && (
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Mail className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">{siteSettings.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                <IconComp className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                {currentPolicy.title}
              </h2>
            </div>

            {/* Policy Main Text Content */}
            <div>
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Đang tải...
                </div>
              ) : currentPolicy.content ? (
                <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/70 text-slate-800 text-sm leading-relaxed font-medium whitespace-pre-line">
                  {currentPolicy.content}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs italic">
                  (Chưa có nội dung cấu hình cho mục này)
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function PolicyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-slate-400">
        Đang tải...
      </div>
    }>
      <PolicyContent />
    </Suspense>
  );
}
