'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RotateCcw, 
  CreditCard, Leaf, Flower2, Sun, Wind, Snowflake, Gift
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-brand-950 text-emerald-100 border-t-4 border-accent-500 pt-16 pb-12">
      {/* 4 Value Propositions / Commitments */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-brand-900/70 p-6 rounded-3xl border border-brand-800/80 flex items-start gap-4">
            <div className="p-3.5 bg-brand-800 rounded-2xl text-yellow-300 shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-1 font-heading">Giao Hỏa Tốc GreenSM</h4>
              <p className="text-emerald-200 font-medium">Giao nhanh nội thành trong 2 giờ, cam kết trái cây mát lạnh không dập nát.</p>
            </div>
          </div>

          <div className="bg-brand-900/70 p-6 rounded-3xl border border-brand-800/80 flex items-start gap-4">
            <div className="p-3.5 bg-brand-800 rounded-2xl text-yellow-300 shrink-0">
              <RotateCcw className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-1 font-heading">Bao Ăn 1 Đổi 1 Trong 24H</h4>
              <p className="text-emerald-200 font-medium">Sượng, nhạt hay không ngọt đổi trả 100% không mất phí, bảo vệ tối đa quyền lợi.</p>
            </div>
          </div>

          <div className="bg-brand-900/70 p-6 rounded-3xl border border-brand-800/80 flex items-start gap-4">
            <div className="p-3.5 bg-brand-800 rounded-2xl text-yellow-300 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-1 font-heading">VietGAP & Nguồn Gốc Rõ Ràng</h4>
              <p className="text-emerald-200 font-medium">100% trái cây thu hoạch trực tiếp tại các nhà vườn liên kết uy tín trên cả nước.</p>
            </div>
          </div>

          <div className="bg-brand-900/70 p-6 rounded-3xl border border-brand-800/80 flex items-start gap-4">
            <div className="p-3.5 bg-brand-800 rounded-2xl text-yellow-300 shrink-0">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-1 font-heading">Thanh Toán Linh Hoạt</h4>
              <p className="text-emerald-200 font-medium">Hỗ trợ COD nhận hàng trả tiền, quét mã VietQR tự động và ví điện tử MoMo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-900">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-md">
              <Leaf className="w-7 h-7" />
            </div>
            <div className="text-2xl font-black text-white font-heading">
              ĐỔ ĐỐNG <span className="text-accent-400">4 MÙA</span>
            </div>
          </div>
          <p className="text-emerald-200 leading-relaxed mb-6 font-medium">
            Hệ thống cung cấp trái cây đặc sản 4 mùa Xuân - Hạ - Thu - Đông, trái cây nhập khẩu cao cấp và giỏ quà biếu sang trọng.
          </p>
          <div className="text-emerald-300 space-y-2 font-medium">
            <p className="flex items-center gap-2"><Clock className="w-5 h-5 text-accent-400 shrink-0" /> Giờ mở cửa: 07:00 - 21:30 hàng ngày</p>
            <p className="flex items-center gap-2"><Phone className="w-5 h-5 text-accent-400 shrink-0" /> Hotline CSKH: 0901.234.567</p>
            <p className="flex items-center gap-2"><Mail className="w-5 h-5 text-accent-400 shrink-0" /> Email: cskh@dodongbonmua.vn</p>
          </div>
        </div>

        <div>
          <h3 className="text-white font-black text-xl mb-4 border-l-4 border-accent-500 pl-3 font-heading">Hệ Thống Chi Nhánh</h3>
          <ul className="text-emerald-200 space-y-4 font-medium">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-accent-400 shrink-0 mt-1" />
              <div>
                <strong className="text-white block font-bold">Chi nhánh Thủ Đức (Trụ sở chính)</strong>
                53 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP.HCM
                <br /><span className="text-emerald-400 font-bold">SĐT: 0901 234 567</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-accent-400 shrink-0 mt-1" />
              <div>
                <strong className="text-white block font-bold">Chi nhánh Quận 1</strong>
                12 Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM
                <br /><span className="text-emerald-400 font-bold">SĐT: 0907 654 321</span>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-black text-xl mb-4 border-l-4 border-accent-500 pl-3 font-heading">Danh Mục 4 Mùa</h3>
          <ul className="text-emerald-200 space-y-3 font-medium">
            <li>
              <Link href="/?season=xuan" className="hover:text-white transition flex items-center gap-2 cursor-pointer">
                <Flower2 className="w-4 h-4 text-pink-400" />
                <span>Trái cây vụ Xuân (Xoài Cát, Dưa Hấu)</span>
              </Link>
            </li>
            <li>
              <Link href="/?season=ha" className="hover:text-white transition flex items-center gap-2 cursor-pointer">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Trái cây vụ Hạ (Sầu Riêng Ri6, Vải Thiều)</span>
              </Link>
            </li>
            <li>
              <Link href="/?season=thu" className="hover:text-white transition flex items-center gap-2 cursor-pointer">
                <Wind className="w-4 h-4 text-orange-400" />
                <span>Trái cây vụ Thu (Hồng Giòn, Na Dai)</span>
              </Link>
            </li>
            <li>
              <Link href="/?season=dong" className="hover:text-white transition flex items-center gap-2 cursor-pointer">
                <Snowflake className="w-4 h-4 text-sky-400" />
                <span>Trái cây vụ Đông (Cam Sành, Nho Mẫu Đơn)</span>
              </Link>
            </li>
            <li>
              <Link href="/?category=gio-qua-trai-cay" className="hover:text-white transition flex items-center gap-2 cursor-pointer">
                <Gift className="w-4 h-4 text-yellow-400" />
                <span>Giỏ quà trái cây thiết kế cao cấp</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-black text-xl mb-4 border-l-4 border-accent-500 pl-3 font-heading">Thông Tin Đồ Án</h3>
          <div className="bg-brand-900/90 p-5 rounded-3xl space-y-2 border border-brand-800 text-emerald-200">
            <p className="text-emerald-400 font-extrabold">Tài liệu: SRS V1.0 - 18 Bảng CSDL</p>
            <p className="text-white font-bold">Sinh viên thực hiện:</p>
            <p className="text-accent-400 font-bold">• Trần Vũ (24211TT2515)</p>
            <p className="text-accent-400 font-bold">• Hồ Thị Vân Anh (24211TT3786)</p>
            <div className="pt-3 border-t border-brand-800 flex items-center justify-between text-emerald-300 font-bold">
              <span>Next.js 16 + React 19</span>
              <span>MySQL 8.4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-400 font-medium">
        <div>
          © 2026 ĐỔ ĐỐNG 4 MÙA. Tất cả các quyền được bảo lưu.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="hover:text-white transition cursor-pointer">Cổng quản trị nội bộ</Link>
          <span>•</span>
          <Link href="/" className="hover:text-white transition cursor-pointer">Chính sách bảo mật</Link>
          <span>•</span>
          <Link href="/" className="hover:text-white transition cursor-pointer">Điều khoản dịch vụ</Link>
        </div>
      </div>
    </footer>
  );
}
