'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, Phone, MapPin, Lock, Save, ShieldCheck, 
  CheckCircle2, AlertCircle, KeyRound, Clock, 
  ShoppingBag, ArrowRight, LogOut, ChevronRight
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile Form States (FR-005)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  // Password Form States (FR-004)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Alert Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const saved = localStorage.getItem('dodong4mua_user');
        if (!saved) {
          setLoading(false);
          return;
        }
        const userObj = JSON.parse(saved);
        setCurrentUser(userObj);

        // Fetch fresh profile from API
        const res = await fetch(`/api/customer/profile?user_id=${userObj.id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setFullName(data.data.full_name || userObj.full_name || '');
          setPhone(data.data.phone || userObj.phone || '');
          setAddress(data.data.address || userObj.address || '');
          setCreatedAt(data.data.created_at || '');
        } else {
          setFullName(userObj.full_name || '');
          setPhone(userObj.phone || '');
          setAddress(userObj.address || '');
        }
      } catch (err) {
        console.error('Lỗi tải thông tin cá nhân:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Xử lý Cập nhật thông tin cá nhân (FR-005)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Kiểm tra tính hợp lệ
    if (!fullName.trim()) {
      setErrorMsg('Họ và tên không được để trống.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Địa chỉ nhận hàng không được để trống.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          full_name: fullName.trim(),
          address: address.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Cập nhật thông tin cá nhân thành công!');
        // Cập nhật lại localStorage
        const updatedUser = {
          ...currentUser,
          full_name: fullName.trim(),
          address: address.trim(),
        };
        localStorage.setItem('dodong4mua_user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        // Bắn event để Header Navbar cập nhật họ tên mới
        window.dispatchEvent(new Event('auth-change'));
      } else {
        setErrorMsg(data.message || 'Cập nhật thông tin thất bại');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  // Xử lý Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Hai mật khẩu mới không trùng nhau.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          old_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Sau 2s tự động logout và chuyển về trang đăng nhập
        setTimeout(() => {
          localStorage.removeItem('dodong4mua_user');
          window.dispatchEvent(new Event('auth-change'));
          router.push('/dang-nhap');
        }, 2000);
      } else {
        setErrorMsg(data.message || 'Mật khẩu hiện tại không chính xác.');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  // Xử lý Đăng xuất (FR-002)
  const handleLogout = async () => {
    try {
      if (currentUser?.id) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id, phone: currentUser.phone })
        });
      }
    } catch (e) {}
    localStorage.removeItem('dodong4mua_user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500 font-medium">Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  // Khi chưa đăng nhập
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto border border-brand-100 shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Bạn chưa đăng nhập</h2>
        <p className="text-xs text-gray-500">Vui lòng đăng nhập để xem và quản lý thông tin cá nhân của bạn theo chuẩn SRS.</p>
        <Link
          href="/dang-nhap"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs shadow-md transition"
        >
          <span>Đăng Nhập Ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
            <Link href="/" className="hover:text-brand-600">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-700 font-bold">Thông tin cá nhân</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5 font-heading">
            <User className="w-7 h-7 text-brand-600" />
            <span>Quản Lý Thông Tin Cá Nhân</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Cập nhật hồ sơ nhận hàng và bảo mật tài khoản theo đúng đặc tả SRS</p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/lich-su-don-hang"
            className="px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200 transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Lịch Sử Đơn Hàng</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-xl border border-red-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: User Profile Badge */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto shadow-lg shadow-brand-600/20">
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">{fullName || 'Khách Hàng'}</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{phone}</p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>{currentUser.role_name || (currentUser.isAdmin ? 'Quản Trị Viên' : 'Khách Hàng Thành Viên')}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Trạng thái:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
              </span>
            </div>
            {createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tham gia:</span>
                <span className="font-medium text-gray-700">{new Date(createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Mã khách hàng:</span>
              <span className="font-mono font-bold text-gray-700">#{currentUser.id}</span>
            </div>
          </div>

          {/* Navigation Tab Buttons */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <button
              onClick={() => { setActiveTab('profile'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Hồ Sơ Cá Nhân</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => { setActiveTab('password'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                <span>Đổi Mật Khẩu</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Alerts */}
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: FORM CẬP NHẬT THÔNG TIN CÁ NHÂN */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} noValidate className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-600" />
                  <span>Cập Nhật Thông Tin Cá Nhân</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Thông tin này sẽ được dùng mặc định khi bạn thực hiện các đơn đặt hàng</p>
              </div>

              {/* Họ và tên */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Quy tắc nghiệp vụ: Không được để trống họ tên.</p>
              </div>

              {/* Số điện thoại */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">Số điện thoại đăng nhập</label>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Đã định danh
                  </span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    disabled
                    value={phone}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 text-xs font-mono cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Số điện thoại là mã định danh chính của tài khoản (DUY NHẤT).</p>
              </div>

              {/* Địa chỉ nhận hàng mặc định */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Địa chỉ nhận hàng mặc định <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Quy tắc nghiệp vụ: Địa chỉ nhận hàng không được để trống.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: FORM ĐỔI MẬT KHẨU */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} noValidate className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-brand-600" />
                  <span>Đổi Mật Khẩu Tài Khoản</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Mật khẩu mới phải có độ dài tối thiểu 6 ký tự</p>
              </div>

              {/* Mật khẩu hiện tại */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu hiện tại *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu mới (tối thiểu 6 ký tự) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nhập lại mật khẩu mới *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{saving ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu Mới'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

