'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Phone, Lock, MapPin, ArrowRight, CheckCircle2, AlertCircle, Sparkles, KeyRound, MessageSquare, Loader2 } from 'lucide-react';
import { auth, formatPhoneForE164, initRecaptchaVerifier, resetRecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');

  // OTP Verification States (Chạy thực tế 100% qua Google Firebase Phone Auth)
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Gửi mã OTP thật qua Firebase SMS
  const handleSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg('Vui lòng nhập số điện thoại Việt Nam hợp lệ (yêu cầu 10 chữ số, ví dụ: 0912345678)');
      return;
    }

    setSendingOtp(true);
    try {
      // 1. Kiểm tra xem SĐT đã tồn tại chưa
      const checkRes = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(cleanPhone)}`);
      const checkData = await checkRes.json();
      if (checkData.exists) {
        setErrorMsg('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập!');
        setSendingOtp(false);
        return;
      }

      // 2. Khởi tạo reCAPTCHA verifier và gửi SMS qua Firebase
      const verifier = initRecaptchaVerifier('recaptcha-container');
      const e164Phone = formatPhoneForE164(cleanPhone);

      const confirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setCountdown(60);
      setSuccessMsg(`Đã gửi mã xác thực SMS đến số ${cleanPhone}. Quý khách vui lòng kiểm tra hộp thư tin nhắn.`);
    } catch (err) {
      console.error('Firebase send OTP error:', err);
      resetRecaptchaVerifier('recaptcha-container');
      if (err.code === 'auth/billing-not-enabled') {
        setErrorMsg('Dự án Firebase chưa kích hoạt gói Blaze (Cloud Billing) để gửi SMS thật ra viễn thông. Để test không cần thẻ: Thêm SĐT này vào "Phone numbers for testing" trên Firebase Console với mã 123456.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Vùng Việt Nam (+84) chưa được cấp phép trong Firebase SMS Region Policy hoặc chưa bật Phone Auth.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setErrorMsg('Số điện thoại không hợp lệ với dịch vụ viễn thông. Vui lòng kiểm tra lại số điện thoại.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Bạn đã yêu cầu gửi mã quá nhiều lần trong thời gian ngắn. Vui lòng thử lại sau ít phút.');
      } else if (err.code === 'auth/quota-exceeded') {
        setErrorMsg('Hạn mức gửi tin nhắn SMS của dự án đã tạm hết trong ngày.');
      } else {
        setErrorMsg(err.message || 'Không thể gửi mã SMS xác thực. Vui lòng thử lại!');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  // Xác thực mã OTP người dùng nhập (100% Firebase confirmationResult)
  const handleVerifyOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    if (!confirmationResult) {
      setErrorMsg('Phiên xác thực đã hết hạn hoặc chưa được gửi. Vui lòng bấm nhận lại mã.');
      return;
    }

    setVerifyingOtp(true);
    try {
      await confirmationResult.confirm(otpCode.trim());
      setOtpVerified(true);
      setSuccessMsg('Xác thực số điện thoại thành công! Quý khách vui lòng hoàn tất thông tin đăng ký.');
    } catch (err) {
      console.error('Verify OTP error:', err);
      setErrorMsg('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại tin nhắn SMS!');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Hoàn tất Đăng ký tài khoản
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    if (!otpVerified) {
      setErrorMsg('Vui lòng xác thực số điện thoại bằng mã OTP trước khi đăng ký.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim().replace(/\s+/g, ''),
          password: password,
          address: address.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          router.push(`/dang-nhap?phone=${encodeURIComponent(phone.trim())}`);
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('Register submit error:', err);
      setErrorMsg('Không thể kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container ẩn dành cho reCAPTCHA của Firebase */}
      <div id="recaptcha-container"></div>

      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-brand-600 shadow-sm border border-emerald-100">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-heading">
            Đăng Ký Tài Khoản
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Tạo tài khoản thành viên để theo dõi đơn hàng & tích điểm ưu đãi 4 mùa
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMsg}</span>
              {errorMsg.includes('đã có tài khoản') && (
                <div className="mt-1">
                  <Link href={`/dang-nhap?phone=${encodeURIComponent(phone.trim())}`} className="underline text-brand-700 hover:text-brand-900">
                    Bấm vào đây để Đăng nhập ngay &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitRegister} noValidate className="space-y-4">
          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Họ và tên của bạn <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Ví dụ: Nguyễn Văn An"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Số điện thoại + Nhận mã OTP */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Số điện thoại nhận mã OTP <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  disabled={otpVerified}
                  placeholder="Ví dụ: 0912345678"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (otpVerified) setOtpVerified(false);
                    if (otpSent) setOtpSent(false);
                  }}
                  className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border ${
                    otpVerified ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'border-gray-200 bg-gray-50/50'
                  } focus:outline-none focus:ring-2 focus:ring-brand-600`}
                />
              </div>

              {!otpVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || countdown > 0 || phone.trim().length < 10}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  {sendingOtp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang gửi SMS...</span>
                    </>
                  ) : countdown > 0 ? (
                    `Gửi lại (${countdown}s)`
                  ) : (otpSent ? 'Gửi lại mã' : 'Nhận mã OTP')}
                </button>
              )}
            </div>
            {phone.trim().length > 0 && phone.trim().length < 10 && (
              <p className="text-[11px] text-amber-600 font-medium mt-1">
                ⚠️ Số điện thoại phải gồm 10 chữ số (Ví dụ: 0912345678)
              </p>
            )}
          </div>

          {/* Ô nhập mã OTP (LUÔN HIỆN ĐỂ NGƯỜI DÙNG THẤY CHỖ NHẬP) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">
                Mã xác thực OTP (6 chữ số) <span className="text-red-500">*</span>
              </label>
              {otpSent && countdown > 0 && !otpVerified && (
                <span className="text-[11px] text-amber-600 font-bold animate-pulse">
                  Hiệu lực trong {countdown}s
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  disabled={!otpSent || otpVerified}
                  placeholder={
                    otpVerified 
                      ? "Đã xác thực thành công" 
                      : otpSent 
                        ? "Nhập 6 số từ SMS (ví dụ: 123456)..." 
                        : "Bấm nút 'Nhận mã OTP' ở trên để lấy mã..."
                  }
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border ${
                    otpVerified 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-black' 
                      : !otpSent 
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border-brand-500 ring-2 ring-brand-100 font-black tracking-widest text-sm text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-brand-600`}
                />
              </div>

              {!otpVerified && (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otpSent || verifyingOtp || otpCode.length < 6}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  {verifyingOtp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{verifyingOtp ? 'Đang kiểm tra...' : 'Xác nhận OTP'}</span>
                </button>
              )}
            </div>

            {/* Thông báo trạng thái OTP */}
            {otpVerified ? (
              <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Số điện thoại đã được xác thực an toàn!
              </p>
            ) : otpSent ? (
              <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                📲 Đã gửi tin nhắn SMS! Bạn vui lòng nhập mã 6 số vào ô trên rồi bấm <strong>Xác nhận OTP</strong>.
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1">
                💡 Nhập đủ 10 số điện thoại & bấm <strong>"Nhận mã OTP"</strong> ở trên để nhận tin nhắn SMS.
              </p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Nhập lại mật khẩu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nhập lại mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Nhập lại chính xác mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Địa chỉ giao hàng mặc định (tùy chọn) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Địa chỉ nhận hàng mặc định (tùy chọn)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Số nhà, tên đường, phường, quận..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-gray-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !otpVerified}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm mt-3"
          >
            {loading ? (
              <span>Đang tạo tài khoản...</span>
            ) : (
              <>
                <span>Hoàn Tất Đăng Ký</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Đã có tài khoản?{' '}
            <Link href="/dang-nhap" className="font-extrabold text-brand-700 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

