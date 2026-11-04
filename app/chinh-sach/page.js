'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  RotateCcw, Truck, ShieldCheck, FileText, 
  ChevronRight, Phone, Mail, ArrowLeft, Clock,
  CheckCircle2, Sparkles
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
      title: 'Chính Sách Đổi Trả "Bao Ăn 1 Đổi 1 Trong 24 Giờ"',
      shortTitle: 'Chính sách đổi trả',
      icon: RotateCcw,
      badge: 'Cam kết 24h',
      content: siteSettings?.exchange_policy || 'Chính sách bao ăn 1 đổi 1 trong vòng 24 giờ kể từ khi nhận hàng nếu trái cây có dấu hiệu sâu hỏng, dập nát, chua gắt hoặc không đúng cam kết chất lượng. Quý khách vui lòng chụp ảnh hoặc quay video gửi hotline để được hỗ trợ ngay lập tức.',
      highlights: [
        'Đổi trả 100% miễn phí nếu trái cây không ngọt, bị sượng hoặc dập nát.',
        'Thời gian tiếp nhận và xử lý đổi hàng mới trong vòng 24 giờ.',
        'Hỗ trợ thu hồi tận nhà hoặc đổi trực tiếp tại hệ thống chi nhánh.'
      ]
    },
    {
      key: 'giao-hang',
      title: 'Chính Sách Giao Hàng "Siêu Tốc 2 Giờ Nội Thành"',
      shortTitle: 'Chính sách giao hàng',
      icon: Truck,
      badge: `Đội xe ${siteSettings?.shipping_partner || 'GreenSM'}`,
      content: siteSettings?.shipping_policy || `Giao hàng siêu tốc trong vòng 2 giờ nội thành qua đối tác ${siteSettings?.shipping_partner || 'GreenSM'}. Miễn phí vận chuyển cho đơn hàng đạt hạn mức theo quy định. Trái cây được đóng gói bằng thùng carton chuyên dụng và bọc xốp lưới chống dập nát.`,
      highlights: [
        `Vận chuyển bằng đội xe điện ${siteSettings?.shipping_partner || 'GreenSM'} êm ái, giữ trọn độ tươi mát.`,
        'Được quyền đồng kiểm trái cây trước khi thanh toán tiền.',
        'Cam kết đóng gói đúng quy chuẩn chống va đập.'
      ]
    },
    {
      key: 'bao-mat',
      title: 'Chính Sách Bảo Mật Thông Tin Khách Hàng',
      shortTitle: 'Chính sách bảo mật',
      icon: ShieldCheck,
      badge: 'Bảo mật 100%',
      content: siteSettings?.privacy_policy || 'Hệ thống cam kết bảo mật tuyệt đối 100% dữ liệu cá nhân, số điện thoại và địa chỉ nhận hàng của quý khách. Mọi thông tin chỉ được sử dụng cho mục đích xác nhận và xử lý giao nhận đơn hàng.',
      highlights: [
        'Mã hóa thông tin tài khoản và mật khẩu theo chuẩn bảo mật cao.',
        'Không bao giờ chia sẻ thông tin cho bất kỳ bên thứ ba nào.',
        'Khách hàng có toàn quyền cập nhật hoặc xóa thông tin cá nhân.'
      ]
    },
    {
      key: 'dieu-khoan',
      title: 'Điều Khoản Sử Dụng Dịch Vụ Mua Hàng',
      shortTitle: 'Điều khoản sử dụng',
      icon: FileText,
      badge: 'Quy chế mua bán',
      content: siteSettings?.terms_of_service || 'Khách hàng có quyền đồng kiểm tra hàng cùng nhân viên giao hàng trước khi thanh toán. Mọi đơn hàng đều có thể thanh toán trực tuyến qua VietQR tự động hoặc thanh toán tiền mặt khi nhận hàng (COD).',
      highlights: [
        'Hỗ trợ đa dạng phương thức thanh toán: COD, VietQR quét mã tức thì.',
        'Quy định rõ ràng về quyền hủy đơn hàng trước khi chuyển trạng thái giao hàng.',
        'Cam kết nguồn gốc xuất xứ trái cây rõ ràng theo chuẩn VietGAP.'
      ]
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
            <span className="text-brand-700 font-extrabold">{currentPolicy.shortTitle}</span>
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
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Trung Tâm Hỗ Trợ & Pháp Lý Khách Hàng</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight leading-tight">
              Chính Sách & Điều Khoản Hoạt Động
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              Cam kết minh bạch về chất lượng trái cây, quyền lợi đổi trả 24h, bảo mật thông tin và dịch vụ giao hàng nhanh nội thành của {siteSettings?.site_name || 'Đổ Đống 4 Mùa'}.
            </p>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Policy Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                Danh Mục Chính Sách
              </h2>
              <div className="space-y-1">
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
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-brand-700'
                          }`}
                        >
                          <ItemIcon className="w-4.5 h-4.5" />
                        </div>
                        <div className="truncate text-xs sm:text-sm">
                          {p.shortTitle}
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
            </div>

            {/* Quick Contact Box */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-brand-900 font-black text-sm">
                <Phone className="w-4 h-4 text-brand-600" />
                <span>Cần Hỗ Trợ Trực Tiếp?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Nếu quý khách có thắc mắc hoặc cần giải quyết sự cố đơn hàng ngay lập tức, vui lòng liên hệ:
              </p>
              <div className="space-y-2 text-xs pt-1">
                {siteSettings?.hotline && (
                  <div className="flex items-center gap-2 font-bold text-brand-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                    <span>Hotline: <strong className="text-brand-900 font-black">{siteSettings.hotline}</strong></span>
                  </div>
                )}
                {siteSettings?.contact_email && (
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Mail className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="truncate">{siteSettings.contact_email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>07:00 - 21:30 (Cả thứ 7 & CN)</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-bold border border-brand-100">
                  <IconComp className="w-3.5 h-3.5 text-brand-600" />
                  <span>{currentPolicy.badge}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Hệ thống cập nhật thời gian thực từ Admin
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading leading-snug">
                {currentPolicy.title}
              </h2>
            </div>

            {/* Policy Main Text Content */}
            <div className="space-y-4">
              <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                Văn Bản Quy Định Chi Tiết
              </div>
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Đang tải nội dung văn bản chính sách...
                </div>
              ) : (
                <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/70 text-slate-800 text-sm leading-relaxed font-medium whitespace-pre-line">
                  {currentPolicy.content}
                </div>
              )}
            </div>

            {/* Policy Highlights / Key Commitments */}
            {currentPolicy.highlights && currentPolicy.highlights.length > 0 && (
              <div className="p-5 sm:p-6 bg-brand-50/40 rounded-2xl border border-brand-100/80 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-brand-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Điểm Nhấn Cam Kết Của Hệ Thống</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {currentPolicy.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 mt-2"></span>
                      <span className="leading-relaxed font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                © {siteSettings?.site_name || 'Đổ Đống 4 Mùa'} • Tất cả các quyền được bảo lưu.
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/lich-su-don-hang"
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition text-center cursor-pointer"
                >
                  Tra cứu đơn hàng
                </Link>
                <Link
                  href="/"
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm text-center cursor-pointer"
                >
                  Mua sắm ngay
                </Link>
              </div>
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
        Đang tải trang chính sách...
      </div>
    }>
      <PolicyContent />
    </Suspense>
  );
}
