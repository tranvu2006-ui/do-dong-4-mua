'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingBag, Search, Phone, ShieldCheck, MapPin, 
  Sparkles, Menu, X, User, LogOut, Package,
  Leaf, Sun, Flower2, Wind, Snowflake
} from 'lucide-react';
import { useCart } from './CartContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const loadUser = () => {
    try {
      const saved = localStorage.getItem('dodong4mua_user');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('auth-change', loadUser);
    return () => window.removeEventListener('auth-change', loadUser);
  }, []);

  const handleLogout = async () => {
    try {
      if (currentUser?.id) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id, phone: currentUser.phone })
        });
      }
    } catch (e) {
      console.warn('Lỗi gọi API đăng xuất:', e);
    }
    localStorage.removeItem('dodong4mua_user');
    setCurrentUser(null);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const seasons = [
    { key: '', label: 'Tất cả 4 Mùa', icon: Sparkles },
    { key: 'xuan', label: 'Mùa Xuân', icon: Flower2 },
    { key: 'ha', label: 'Mùa Hạ', icon: Sun },
    { key: 'thu', label: 'Mùa Thu', icon: Wind },
    { key: 'dong', label: 'Mùa Đông', icon: Snowflake },
  ];

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Top announcement bar */}
      <div className="bg-brand-900 text-white py-1.5 px-4 border-b border-brand-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <Link href="/chi-nhanh" className="flex items-center gap-1 font-semibold hover:text-brand-200 transition cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-accent-400 shrink-0" />
              <span>Hệ thống 2 Chi nhánh (Thủ Đức & Q.1)</span>
            </Link>
            <span className="hidden md:inline-block text-brand-700">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>Bao ăn 1 đổi 1 trong 24h & Giao hỏa tốc GreenSM</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/lich-su-don-hang" className="flex items-center gap-1 text-emerald-100 hover:text-white transition font-semibold cursor-pointer">
              <Package className="w-3.5 h-3.5 text-accent-400 shrink-0" />
              <span>Tra cứu đơn hàng</span>
            </Link>
            {currentUser?.isAdmin && (
              <Link href="/admin" className="flex items-center gap-1 text-yellow-300 hover:text-yellow-200 transition font-black bg-white/10 px-2 py-0.5 rounded-full cursor-pointer">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span>Cổng Quản Trị</span>
              </Link>
            )}
            <a href="tel:0901234567" className="flex items-center gap-1 font-bold text-yellow-300 hover:text-yellow-200 cursor-pointer">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>Hotline: 0901.234.567</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-brand-900 flex items-center gap-1">
                <span>ĐỔ ĐỐNG</span>
                <span className="text-accent-500 font-extrabold">4 MÙA</span>
              </div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Trái Cây Tươi Ngon Chuẩn Vị</p>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-lg relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm xoài cát, táo Envy, sầu riêng, bưởi..."
              className="w-full pl-4 pr-12 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition flex items-center justify-center cursor-pointer shadow-sm"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action buttons & User status */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/thong-tin-ca-nhan"
                  title="Xem và chỉnh sửa thông tin cá nhân"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-brand-50 text-gray-800 hover:text-brand-700 text-xs font-bold border border-gray-200 transition cursor-pointer"
                >
                  <User className="w-4 h-4 text-brand-600" />
                  <span className="truncate max-w-[120px]">{currentUser.full_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition cursor-pointer"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/dang-nhap"
                  className="px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 hover:text-brand-700 text-xs font-bold transition cursor-pointer"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/dang-ky"
                  className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition flex items-center gap-2 border border-brand-200 cursor-pointer shadow-sm hover:shadow"
              aria-label="Mở giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 text-brand-700" />
              <span className="hidden sm:inline-block font-extrabold text-sm text-brand-800">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="bg-accent-500 text-white font-black text-xs px-2 py-0.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-brand-700 lg:hidden rounded-xl hover:bg-gray-100 cursor-pointer"
              aria-label="Mở danh mục"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Four Seasons Filter Sub-navigation */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 hidden sm:flex items-center justify-between gap-3 overflow-x-auto text-xs pb-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-extrabold text-brand-900 uppercase tracking-wider mr-1 text-[11px]">Mùa Vụ:</span>
            {seasons.map((s) => {
              const IconComp = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => router.push(s.key ? `/?season=${s.key}` : '/', { scroll: false })}
                  className="px-3 py-1 rounded-full bg-gray-100 hover:bg-brand-100 hover:text-brand-700 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 font-semibold text-gray-700"
                >
                  <IconComp className="w-3.5 h-3.5 text-brand-600" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 shrink-0 text-gray-600 font-semibold text-xs">
            <Link href="/?category=trai-cay-nhap-khau" scroll={false} className="hover:text-brand-600 transition cursor-pointer">Trái Cây Nhập Khẩu</Link>
            <Link href="/?category=gio-qua-trai-cay" scroll={false} className="hover:text-brand-600 transition cursor-pointer">Giỏ Quà Cao Cấp</Link>
            <Link href="/?category=combo-trai-cay-tiet-kiem" scroll={false} className="hover:text-brand-600 transition cursor-pointer">Combo Tiết Kiệm</Link>
            <Link href="/chi-nhanh" className="hover:text-brand-600 transition font-black text-brand-700 cursor-pointer">Chi Nhánh</Link>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 space-y-3 pb-3 text-sm">
            <form onSubmit={handleSearch} className="flex relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm trái cây..."
                className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <button type="submit" className="absolute right-1 top-1 bottom-1 px-3 bg-brand-600 text-white rounded-lg cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="grid grid-cols-2 gap-2">
              {seasons.map((s) => {
                const IconComp = s.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => {
                      router.push(s.key ? `/?season=${s.key}` : '/', { scroll: false });
                      setMobileMenuOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-brand-50 text-brand-900 font-bold flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <IconComp className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2 text-xs">
              {currentUser && (
                <Link href="/thong-tin-ca-nhan" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-brand-50 rounded-xl text-brand-900 font-bold flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Hồ sơ cá nhân ({currentUser.full_name})</span>
                </Link>
              )}
              <Link href="/lich-su-don-hang" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-xl text-gray-800 font-bold flex items-center gap-2 cursor-pointer">
                <Package className="w-4 h-4 text-brand-600" />
                <span>Tra cứu lịch sử đơn hàng</span>
              </Link>
              <Link href="/chi-nhanh" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-xl text-gray-800 font-bold flex items-center gap-2 cursor-pointer">
                <MapPin className="w-4 h-4 text-accent-500" />
                <span>Hệ thống 2 chi nhánh</span>
              </Link>
              {currentUser ? (
                <button onClick={handleLogout} className="p-2.5 text-red-600 font-bold text-left flex items-center gap-2 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              ) : (
                <Link href="/dang-nhap" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-brand-600 text-white text-center rounded-xl font-bold cursor-pointer">
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
