'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, User, Phone, Lock, MapPin, ArrowRight, CheckCircle2, AlertCircle, Sparkles, KeyRound, MessageSquare, Loader2 } from 'lucide-react';
import { auth, formatPhoneForE164, initRecaptchaVerifier, resetRecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'forgot' ? 'forgot' : 'login';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tự động chuyển sang trang /dang-ky nếu truy cập tab=register
  useEffect(() => {
    if (searchParams.get('tab') === 'register') {
      router.replace('/dang-ky');
    }
  }, [searchParams, router]);

  // Login form
  const [loginPhone, setLoginPhone] = useState(searchParams.get('phone') || '');
  const [loginPassword, setLoginPassword] = useState('');

  // FR-003: Quên mật khẩu form states (Firebase SMS OTP thực tế)
  const [forgotStep, setForgotStep] = useState(1); // 1: nhập SĐT, 2: nhập OTP, 3: mật khẩu mới
  const [forgotPhone, setForgotPhone] = useState(searchParams.get('phone') || '');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotConfirmationResult, setForgotConfirmationResult] = useState(null);
  const [forgotCountdown, setForgotCountdown] = useState(0);

  // Đếm ngược thời gian gửi lại mã SMS
  useEffect(() => {
    let timer;
    if (forgotCountdown > 0) {
      timer = setTimeout(() => setForgotCountdown(forgotCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [forgotCountdown]);

  const fillQuickAccount = (phone, pass) => {
    setLoginPhone(phone);
    setLoginPassword(pass);
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // TH1: Bỏ trống số điện thoại
    if (!loginPhone || !loginPhone.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại.');
      return;
    }

    // TH2: Bỏ trống mật khẩu
    if (!loginPassword || !loginPassword.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone, password: loginPassword }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('dodong4mua_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));
        if (data.user.isAdmin) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setErrorMsg(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  // FR-003: Luồng xử lý Quên mật khẩu qua Firebase Phone Auth SMS OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = (forgotPhone || '').trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg('Vui lòng nhập số điện thoại Việt Nam hợp lệ (yêu cầu 10 chữ số, ví dụ: 0912345678).');
      return;
    }

    setLoading(true);
    try {
      // 1. Kiểm tra số điện thoại có tồn tại trong hệ thống users hay không
      const checkRes = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(cleanPhone)}`);
      const checkData = await checkRes.json();
      if (!checkData.exists) {
        setErrorMsg('Số điện thoại này chưa được đăng ký tài khoản trong hệ thống.');
        setLoading(false);
        return;
      }

      // 2. Gửi mã OTP SMS thực tế qua Google Firebase Phone Auth
      const verifier = initRecaptchaVerifier('recaptcha-container');
      const e164Phone = formatPhoneForE164(cleanPhone);
      const confirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);

      setForgotConfirmationResult(confirmation);
      setForgotCountdown(60);
      setForgotStep(2);
      setSuccessMsg(`Đã gửi mã SMS xác thực đến ${cleanPhone}. Quý khách vui lòng kiểm tra tin nhắn.`);
    } catch (err) {
      console.error('Firebase send OTP forgot password error:', err);
      resetRecaptchaVerifier('recaptcha-container');
      if (err.code === 'auth/billing-not-enabled') {
        setErrorMsg('Dự án Firebase chưa kích hoạt gói Blaze (Cloud Billing). Vui lòng nâng cấp gói Blaze trên Firebase Console để gửi SMS thật.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Vùng Việt Nam (+84) chưa được cấp phép trong Firebase SMS Region Policy hoặc chưa bật Phone Auth.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setErrorMsg('Số điện thoại không hợp lệ đối với mạng viễn thông.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Bạn đã yêu cầu gửi mã quá nhiều lần trong thời gian ngắn. Vui lòng thử lại sau ít phút.');
      } else if (err.code === 'auth/quota-exceeded') {
        setErrorMsg('Hạn mức gửi tin nhắn SMS của dự án đã tạm hết trong ngày.');
      } else {
        setErrorMsg(err.message || 'Không thể gửi mã SMS xác thực. Vui lòng thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotOtp || forgotOtp.trim().length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    if (!forgotConfirmationResult) {
      setErrorMsg('Phiên xác thực đã hết hạn hoặc chưa được gửi. Vui lòng bấm nhận lại mã.');
      return;
    }

    setLoading(true);
    try {
      await forgotConfirmationResult.confirm(forgotOtp.trim());
      setSuccessMsg('Xác thực số điện thoại thành công! Quý khách vui lòng thiết lập mật khẩu mới.');
      setForgotStep(3);
    } catch (err) {
      console.error('Verify OTP error:', err);
      setErrorMsg('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại tin nhắn SMS!');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotNewPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMsg('Hai mật khẩu không trùng khớp.');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = (forgotPhone || '').trim().replace(/\s+/g, '');
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          new_password: forgotNewPassword,
          confirm_password: forgotConfirmPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Đặt lại mật khẩu thành công! Quý khách có thể đăng nhập ngay với mật khẩu mới.');
        setActiveTab('login');
        setLoginPhone(cleanPhone);
        setLoginPassword(forgotNewPassword);
        setForgotStep(1);
        setForgotOtp('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
      } else {
        setErrorMsg(data.message || 'Đặt lại mật khẩu thất bại.');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md">
            🍉
          </div>
          <span className="text-xl font-black text-brand-700">
            ĐỔ ĐỐNG <span className="text-accent-500">4 MÙA</span>
          </span>
        </Link>
      </div>

      {/* Quick Test Accounts Card */}
      <div className="bg-brand-50/80 p-4 rounded-2xl border border-brand-200/60 text-xs space-y-2">
        <div className="flex items-center justify-between font-bold text-brand-900">
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent-500" /> Tài khoản mẫu thử nghiệm (Bấm để điền):</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillQuickAccount('0929894248', 'Admin@123456')}
            className="p-2 bg-white rounded-xl border border-brand-200 hover:border-brand-600 text-left transition"
          >
            <div className="font-bold text-brand-700">👑 Admin Tổng</div>
            <div className="text-[10px] text-gray-500">0929894248 (Chuyển Dashboard)</div>
          </button>
          <button
            type="button"
            onClick={() => fillQuickAccount('0912345678', 'Admin@123456')}
            className="p-2 bg-white rounded-xl border border-brand-200 hover:border-brand-600 text-left transition"
          >
            <div className="font-bold text-emerald-700">🏢 Admin Chi Nhánh</div>
            <div className="text-[10px] text-gray-500">0912345678 (Chuyển Dashboard)</div>
          </button>
          <button
            type="button"
            onClick={() => fillQuickAccount('0901234567', 'password123')}
            className="p-2 bg-white rounded-xl border border-brand-200 hover:border-brand-600 text-left transition"
          >
            <div className="font-bold text-blue-700">🛒 Khách Hàng</div>
            <div className="text-[10px] text-gray-500">0901234567 (Về Trang chủ)</div>
          </button>
          <button
            type="button"
            onClick={() => fillQuickAccount('0900000000', '123456')}
            className="p-2 bg-white rounded-xl border border-red-200 hover:border-red-600 text-left transition"
          >
            <div className="font-bold text-red-600">🔒 Tài Khoản Khóa</div>
            <div className="text-[10px] text-gray-500">0900000000 (Test TH4)</div>
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-2xl border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Login Form */}
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} noValidate className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                placeholder="0988888888"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700">Mật khẩu</label>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('forgot');
                  setForgotStep(1);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-[11px] text-brand-600 hover:text-brand-700 font-medium hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <span>Đang xác thực...</span> : (
              <>
                <span>Đăng Nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2 text-xs text-gray-500">
            Chưa có tài khoản?{' '}
            <Link href="/dang-ky" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
              Đăng ký tài khoản mới &rarr;
            </Link>
          </div>
        </form>
      )}

      {/* Forgot Password Form */}
      {activeTab === 'forgot' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-brand-600" />
                <span>Khôi Phục Mật Khẩu</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Xác thực an toàn qua mã OTP SMS từ Firebase</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              <span>Bước {forgotStep}/3</span>
            </div>
          </div>

          {/* Step 1: Nhập Số điện thoại */}
          {forgotStep === 1 && (
            <form onSubmit={handleSendOtp} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại tài khoản của bạn</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0912345678"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
                {forgotPhone.trim().length > 0 && forgotPhone.trim().length < 10 && (
                  <p className="text-[11px] text-amber-600 font-medium mt-1">
                    ⚠️ Số điện thoại phải gồm 10 chữ số (Ví dụ: 0912345678)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || forgotPhone.trim().length < 10}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <span>Đang gửi mã SMS...</span> : (
                  <>
                    <span>Bước 1: Gửi Mã OTP Qua SMS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Nhập mã OTP từ SMS Firebase */}
          {forgotStep === 2 && (
            <form onSubmit={handleVerifyOtp} noValidate className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Mã OTP đã gửi đến SĐT: {forgotPhone}</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Quý khách vui lòng kiểm tra tin nhắn SMS trên điện thoại và nhập 6 chữ số vào ô bên dưới.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">Mã xác thực OTP (6 chữ số)</label>
                  {forgotCountdown > 0 && (
                    <span className="text-[11px] text-amber-600 font-bold animate-pulse">
                      Gửi lại sau ({forgotCountdown}s)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Nhập 6 số từ SMS"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none font-black text-gray-900"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setForgotStep(1); setErrorMsg(''); setSuccessMsg(''); }}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading || forgotOtp.length < 6}
                  className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <span>Đang xác minh...</span> : (
                    <>
                      <span>Bước 2: Xác Nhận Mã OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  disabled={loading || forgotCountdown > 0}
                  onClick={handleSendOtp}
                  className="text-xs font-bold text-brand-700 hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer"
                >
                  {forgotCountdown > 0 ? `Chưa nhận được SMS? Gửi lại sau (${forgotCountdown}s)` : 'Chưa nhận được mã? Bấm gửi lại SMS'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Nhập Mật khẩu mới */}
          {forgotStep === 3 && (
            <form onSubmit={handleResetPassword} noValidate className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã xác thực OTP thành công! Vui lòng thiết lập mật khẩu mới.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu mới..."
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu mới..."
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <span>Đang cập nhật...</span> : (
                  <>
                    <span>Bước 3: Lưu Mật Khẩu Mới</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className="text-xs text-gray-500 hover:text-gray-800 hover:underline cursor-pointer"
            >
              ← Quay lại Đăng Nhập
            </button>
          </div>
        </div>
      )}

      {/* Container ẩn dành cho reCAPTCHA của Firebase */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-400">Đang tải...</div>}>
      <AuthContent />
    </Suspense>
  );
}

