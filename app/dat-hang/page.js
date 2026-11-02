'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, CreditCard, QrCode, CheckCircle2, AlertCircle, MessageSquare, Lock, LogIn, Loader2, Copy, Check, X, Clock } from 'lucide-react';
import { auth, formatPhoneForE164, initRecaptchaVerifier, resetRecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import { useCart } from '@/components/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, isLoaded } = useCart();

  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    receiver_name: '',
    phone: '',
    address: '',
    note: '',
    branch_id: 1,
    payment_method: 'COD',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [otpError, setOtpError] = useState('');

  // Password for new guest auto-created account (FR-024 / BR-008)
  const [customerPassword, setCustomerPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(null);

  // Phone existence & OTP verification states
  const [phoneCheckLoading, setPhoneCheckLoading] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [orderSuccess, setOrderSuccess] = useState(false);

  // Countdown for resending OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Load user from localStorage if logged in
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dodong4mua_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        setFormData((prev) => ({
          ...prev,
          receiver_name: u.full_name || '',
          phone: u.phone || '',
          address: u.address || ''
        }));
      } else {
        // Nếu là khách, khôi phục thông tin bản nháp nếu bấm reload F5
        const draft = sessionStorage.getItem('dodong4mua_checkout_draft');
        if (draft) {
          const d = JSON.parse(draft);
          setFormData((prev) => ({
            ...prev,
            receiver_name: d.receiver_name || '',
            phone: d.phone || '',
            address: d.address || '',
            note: d.note || '',
            branch_id: d.branch_id || 1,
            payment_method: d.payment_method || 'COD',
          }));
        }
      }
    } catch (e) {
      console.error('Failed to parse user or draft', e);
    }
  }, []);

  // Lưu bản nháp thông tin người nhận khi người dùng nhập (tránh mất khi F5 reload)
  useEffect(() => {
    try {
      if (formData.receiver_name || formData.phone || formData.address) {
        sessionStorage.setItem('dodong4mua_checkout_draft', JSON.stringify(formData));
      }
    } catch (e) {
      console.warn('Failed to save checkout draft', e);
    }
  }, [formData]);

  // Check if phone number already exists
  const checkPhoneStatus = async (inputPhone) => {
    const raw = inputPhone !== undefined ? inputPhone : formData.phone;
    const cleanPhone = (raw || '').trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) return;

    if (currentUser && currentUser.phone === cleanPhone) {
      setPhoneExists(false);
      return;
    }

    setPhoneCheckLoading(true);
    try {
      const res = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(cleanPhone)}`);
      const data = await res.json();
      if (data.exists) {
        setPhoneExists(true);
        setOtpVerified(false);
        setOtpError('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để tiếp tục đặt hàng!');
        setErrorMsg('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để tiếp tục đặt hàng!');
      } else {
        setPhoneExists(false);
        setOtpError('');
        setErrorMsg('');
      }
    } catch (err) {
      console.error('Check phone error', err);
    } finally {
      setPhoneCheckLoading(false);
    }
  };

  // Gửi mã OTP qua Firebase SMS
  const handleSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpError('');

    const cleanPhone = formData.phone.trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setOtpError('Số điện thoại không đúng định dạng (yêu cầu 10 chữ số, ví dụ: 0912345678 hoặc số điện thoại của bạn)');
      return;
    }

    setSendingOtp(true);
    try {
      // Kiểm tra lại trên DB
      const checkRes = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(cleanPhone)}`);
      const checkData = await checkRes.json();
      if (checkData.exists) {
        setPhoneExists(true);
        setOtpError('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để tiếp tục đặt hàng!');
        setErrorMsg('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để tiếp tục đặt hàng!');
        setSendingOtp(false);
        return;
      }

      const verifier = initRecaptchaVerifier('recaptcha-container');
      const e164Phone = formatPhoneForE164(cleanPhone);

      const confirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setCountdown(60);
      setSuccessMsg(`Đã gửi mã SMS xác thực đến ${cleanPhone}. Quý khách vui lòng kiểm tra tin nhắn.`);
    } catch (err) {
      console.error('Send OTP error:', err);
      resetRecaptchaVerifier('recaptcha-container');
      let msg = '';
      if (err.code === 'auth/billing-not-enabled') {
        msg = 'Dự án Firebase chưa kích hoạt gói Blaze (Cloud Billing) để gửi SMS thật ra viễn thông.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Vùng Việt Nam (+84) chưa được cấp phép trong Firebase SMS Region Policy hoặc chưa bật Phone Auth.';
      } else if (err.code === 'auth/invalid-phone-number') {
        msg = 'Số điện thoại không hợp lệ đối với mạng viễn thông. Vui lòng kiểm tra lại số điện thoại.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Bạn đã yêu cầu gửi mã quá nhiều lần. Vui lòng thử lại sau ít phút.';
      } else if (err.code === 'auth/quota-exceeded') {
        msg = 'Hạn mức gửi tin nhắn SMS của dự án đã tạm hết trong ngày.';
      } else {
        msg = err.message || 'Không thể gửi mã SMS. Vui lòng thử lại!';
      }
      setOtpError(msg);
      setErrorMsg(msg);
    } finally {
      setSendingOtp(false);
    }
  };

  // Xác thực mã OTP người dùng nhập (100% Firebase confirmationResult)
  const handleVerifyOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpError('');

    if (!otpCode || otpCode.trim().length < 6) {
      setOtpError('Vui lòng nhập đủ 6 chữ số mã OTP từ tin nhắn SMS.');
      return;
    }

    if (!confirmationResult) {
      setOtpError('Phiên xác thực đã hết hạn hoặc chưa được gửi. Vui lòng bấm nhận lại mã.');
      return;
    }

    setVerifyingOtp(true);
    try {
      await confirmationResult.confirm(otpCode.trim());
      setOtpVerified(true);
      setSuccessMsg('Số điện thoại đã được xác thực thành công!');
    } catch (err) {
      console.error('Verify OTP error:', err);
      setOtpError('Mã OTP không chính xác hoặc đã hết hạn.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const shippingFee = subtotal >= 500000 ? 0 : 25000;
  const totalAmount = subtotal + shippingFee;

  useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setBranches(d.data);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!items.length) {
      setErrorMsg('Giỏ hàng đang trống!');
      return;
    }

    if (!formData.receiver_name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Vui lòng điền họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    if (phoneExists) {
      setErrorMsg('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để đặt hàng!');
      return;
    }

    if (!currentUser && !otpVerified) {
      setErrorMsg('Quý khách là khách hàng mới. Vui lòng xác thực số điện thoại bằng mã OTP qua SMS trước khi đặt hàng!');
      return;
    }

    const cleanPhone = formData.phone.trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg('Số điện thoại không đúng định dạng (yêu cầu 10 chữ số, ví dụ: 0912345678).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password: customerPassword.trim() || '123456',
          user_id: currentUser ? currentUser.id : null,
          note: formData.note.trim(),
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Tự động đăng nhập cho khách hàng mới theo chuẩn FR-024 / BR-008
        if (data.data?.is_new_account && data.data?.user) {
          try {
            localStorage.setItem('dodong4mua_user', JSON.stringify(data.data.user));
            window.dispatchEvent(new Event('auth-change'));
          } catch (storageErr) {
            console.error('Failed to save user session', storageErr);
          }
        }

        setOrderSuccess(true);
        clearCart();
        try {
          sessionStorage.removeItem('dodong4mua_checkout_draft');
        } catch (e) {}
        const pwdParam = encodeURIComponent(data.data?.initial_password || customerPassword.trim() || '123456');
        const querySuffix = data.data?.is_new_account ? `?new_account=1&pwd=${pwdParam}` : '';
        const targetUrl = `/don-hang/${data.data.order_code}${querySuffix}`;

        // Chuyển hướng trực tiếp tới trang đơn hàng (có mã VietQR MB Bank to bự ở đầu)
        router.push(targetUrl);
      } else {
        setErrorMsg(data.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-brand-600" />
        <h2 className="text-base font-bold text-gray-800">Đặt hàng thành công!</h2>
        <p className="text-xs text-gray-400">Đang chuyển đến trang chi tiết và thanh toán đơn hàng...</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-brand-600" />
        <h2 className="text-base font-bold text-gray-800">Đang tải thông tin đơn hàng...</h2>
        <p className="text-xs text-gray-400">Vui lòng chờ trong giây lát</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-5xl">🧺</div>
        <h2 className="text-xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-gray-500">Hãy thêm một vài loại trái cây tươi ngon trước khi đặt hàng nhé.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Khám phá trái cây
        </Link>
      </div>
    );
  }

  // VietQR URL calculation for preview (MB Bank - TRAN VU)
  const vietQrUrl = `https://img.vietqr.io/image/MB-0929894248-compact2.png?amount=${totalAmount}&addInfo=DODONG4MUA&accountName=TRAN%20VU`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-600">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-900 font-bold">Đặt hàng & Thanh toán</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Step 1: Delivery Information */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                Thông Tin Nhận Hàng
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={formData.receiver_name}
                    onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-gray-50/50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Số điện thoại nhận hàng <span className="text-red-500">*</span>
                    </label>
                    {phoneCheckLoading && (
                      <span className="text-[10px] text-gray-400 animate-pulse font-medium">Đang kiểm tra...</span>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    disabled={Boolean(currentUser) || otpVerified}
                    placeholder="Ví dụ: 0912345678"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setPhoneExists(false);
                      setOtpVerified(false);
                      setOtpSent(false);
                      setOtpError('');
                    }}
                    onBlur={(e) => checkPhoneStatus(e.target.value)}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                      phoneExists 
                        ? 'border-amber-400 bg-amber-50 text-amber-950 font-bold' 
                        : otpVerified 
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-950 font-bold' 
                          : 'border-gray-200 bg-gray-50/50'
                    } focus:outline-none focus:ring-2 focus:ring-brand-600`}
                  />
                </div>
              </div>

              {/* TH1: Số điện thoại ĐÃ CÓ tài khoản -> Yêu cầu đăng nhập */}
              {phoneExists && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2.5 animate-fadeIn">
                  <div className="flex items-start gap-2.5 text-xs text-amber-900 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span>Số điện thoại <strong>{formData.phone}</strong> đã có tài khoản trên hệ thống.</span>
                      <p className="text-[11px] text-amber-800 font-normal mt-0.5">
                        Để bảo vệ quyền lợi thành viên và theo dõi đơn hàng, quý khách vui lòng đăng nhập trước khi mua.
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dang-nhap?redirect=/dat-hang&phone=${encodeURIComponent(formData.phone.trim())}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng nhập ngay để tiếp tục mua hàng</span>
                  </Link>
                </div>
              )}

              {/* TH2: Khách hàng mới (chưa có tài khoản) -> Bắt buộc xác thực OTP */}
              {!currentUser && !phoneExists && formData.phone.trim().length >= 10 && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-brand-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-brand-600" /> Xác thực số điện thoại khách hàng mới
                    </span>
                    {otpVerified && (
                      <span className="text-xs font-black text-emerald-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã xác thực
                      </span>
                    )}
                  </div>

                  {!otpVerified ? (
                    <div className="space-y-3">
                      <p className="text-[11px] text-gray-600 font-medium">
                        Hệ thống sẽ gửi mã xác thực SMS 6 số về điện thoại của bạn để tránh đơn hàng ảo & kích hoạt tài khoản.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={sendingOtp || countdown > 0}
                          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white rounded-xl text-xs font-black transition cursor-pointer shrink-0 shadow-sm flex items-center justify-center gap-1.5 min-w-[130px]"
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

                        <div className="flex gap-2 flex-1">
                          <input
                            type="text"
                            maxLength={6}
                            disabled={!otpSent}
                            placeholder={otpSent ? "Nhập 6 số từ SMS" : "Chờ bấm nhận mã..."}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            className={`flex-1 text-center tracking-widest font-black text-sm px-3.5 py-2 rounded-xl border ${
                              !otpSent 
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'border-emerald-400 bg-white ring-2 ring-emerald-100'
                            } focus:outline-none focus:ring-2 focus:ring-brand-600`}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={!otpSent || verifyingOtp || otpCode.length < 6}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap shadow-sm flex items-center justify-center gap-1.5"
                          >
                            {verifyingOtp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{verifyingOtp ? 'Đang kiểm tra...' : 'Xác nhận OTP'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Hiển thị lỗi OTP trực tiếp tại đây */}
                      {otpError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-2 animate-fadeIn">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-bold">{otpError}</p>
                            {otpError.includes('Blaze') && (
                              <div className="text-[11px] text-gray-600 bg-white/80 p-2.5 rounded-lg border border-rose-100 space-y-1 mt-1">
                                <p className="font-bold text-gray-800">💡 Hướng dẫn gửi SMS cho đồ án &amp; doanh nghiệp:</p>
                                <p>• <strong>Gửi tin nhắn thật về máy cá nhân:</strong> Nâng cấp gói Blaze trên Firebase Console (thêm thẻ Visa/Mastercard hoặc thẻ Visa ảo MB Bank, dưới 10.000 SMS/tháng được miễn phí $0).</p>
                                <p>• <strong>Hoặc Test nhanh không cần thẻ:</strong> Vào Firebase Console → Authentication → Sign-in method → Phone → mục <strong>&quot;Phone numbers for testing&quot;</strong> → thêm số <code>+84{formData.phone.trim().replace(/^0/, '')}</code> và mã <code>123456</code>.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {successMsg && (
                        <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{successMsg}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Số điện thoại đã được xác thực an toàn!
                      </p>
                      
                      {/* FR-024 / BR-008: Thiết lập mật khẩu tài khoản mới */}
                      <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-brand-600" />
                            Mật khẩu tài khoản mới <span className="text-[11px] font-normal text-gray-500">(Tùy chọn)</span>
                          </label>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                            Mặc định: 123456
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự) hoặc để trống"
                            value={customerPassword}
                            onChange={(e) => setCustomerPassword(e.target.value)}
                            className="w-full text-xs px-3.5 py-2 pr-16 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-gray-50/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-500 hover:text-gray-800 px-1.5 py-0.5"
                          >
                            {showPassword ? 'Ẩn' : 'Hiện'}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Hệ thống sẽ tự động tạo tài khoản và đăng nhập cho bạn sau khi đặt hàng. Bạn có thể tự đặt mật khẩu hoặc dùng mặc định <strong>123456</strong>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Chọn chi nhánh phục vụ gần nhất
                </label>
                <select
                  value={formData.branch_id}
                  onChange={(e) => setFormData({ ...formData, branch_id: parseInt(e.target.value, 10) })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-gray-50/50"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branch_name} - {b.address}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ghi chú cho tài xế GreenSM (tùy chọn)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Giao trước 11h trưa, gọi chuông cửa..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-gray-50/50"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Phương Thức Thanh Toán
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* COD */}
                <label
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    formData.payment_method === 'COD'
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-600'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">💵</span>
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={formData.payment_method === 'COD'}
                      onChange={() => setFormData({ ...formData, payment_method: 'COD' })}
                      className="text-brand-600"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Thanh toán COD</div>
                    <div className="text-[10px] text-gray-500">Trả tiền mặt khi nhận hàng</div>
                  </div>
                </label>

                {/* VietQR */}
                <label
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    formData.payment_method === 'VIETQR'
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-600'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">📲</span>
                    <input
                      type="radio"
                      name="payment_method"
                      value="VIETQR"
                      checked={formData.payment_method === 'VIETQR'}
                      onChange={() => setFormData({ ...formData, payment_method: 'VIETQR' })}
                      className="text-brand-600"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Mã VietQR 24/7</div>
                    <div className="text-[10px] text-gray-500">Quét mã chuyển khoản tức thì</div>
                  </div>
                </label>

                {/* MoMo */}
                <label
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    formData.payment_method === 'MOMO'
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-600'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">👛</span>
                    <input
                      type="radio"
                      name="payment_method"
                      value="MOMO"
                      checked={formData.payment_method === 'MOMO'}
                      onChange={() => setFormData({ ...formData, payment_method: 'MOMO' })}
                      className="text-brand-600"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Ví MoMo</div>
                    <div className="text-[10px] text-gray-500">Xác nhận tự động</div>
                  </div>
                </label>
              </div>

              {/* VietQR Preview Box - Khổ Lớn To Rõ */}
              {formData.payment_method === 'VIETQR' && (
                <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-5 text-xs">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white p-2.5 rounded-2xl shadow-sm border-2 border-emerald-300 shrink-0 flex items-center justify-center">
                    <img src={vietQrUrl} alt="VietQR Đổ Đống 4 Mùa" className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-2 text-emerald-900 flex-1">
                    <div className="font-extrabold text-sm text-emerald-800 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-600" /> Quét mã VietQR MB Bank
                    </div>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Sau khi bấm <strong>Xác nhận đặt hàng</strong>, hệ thống sẽ bật mã QR cỡ lớn kèm mã đơn riêng của bạn để quét thanh toán tức thì.
                    </p>
                    <div className="text-xs bg-white/90 p-3 rounded-xl border border-emerald-200 font-mono space-y-1 shadow-2xs">
                      <div>Ngân hàng: <strong>MB Bank (Quân Đội)</strong></div>
                      <div>Số tài khoản: <strong className="text-brand-700 text-sm">0929894248</strong></div>
                      <div>Chủ tài khoản: <strong>TRAN VU</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-600/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Xác Nhận Đặt Hàng ({totalAmount.toLocaleString('vi-VN')} đ)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Summary: Cart Items & Total */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5 sticky top-24">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" /> Tóm Tắt Đơn Hàng
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
              {items.length} món
            </span>
          </div>

          {/* List of items */}
          <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
                    <span className="text-gray-400 text-[11px]">
                      {item.price.toLocaleString('vi-VN')} đ x {item.quantity} {item.unit}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-gray-900 shrink-0">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
          </div>

          {/* Subtotal & Shipping breakdown */}
          <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-600">
              <span>Tổng tiền hàng:</span>
              <span className="font-semibold">{subtotal.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-brand-600" /> Phí vận chuyển GreenSM:
              </span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-brand-600 font-bold">MIỄN PHÍ</span>
                ) : (
                  `${shippingFee.toLocaleString('vi-VN')} đ`
                )}
              </span>
            </div>
            {shippingFee === 0 && (
              <p className="text-[10px] text-emerald-600 font-medium">
                🎉 Bạn được hưởng ưu đãi Freeship GreenSM (Đơn &gt; 500k)!
              </p>
            )}
            <div className="border-t border-gray-200 pt-3 flex items-baseline justify-between text-sm">
              <span className="font-bold text-gray-900">Tổng thanh toán:</span>
              <span className="text-xl font-black text-brand-700">
                {totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl text-[11px] text-gray-500 space-y-1.5 border border-gray-100">
            <div className="flex items-center gap-1.5 text-brand-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-brand-600" /> Cam kết chất lượng Đổ Đống 4 Mùa:
            </div>
            <p>• Trái cây tuyển chọn chuẩn VietGAP, đúng mùa vụ tươi ngon.</p>
            <p>• Bao ăn 1 đổi 1 trong vòng 24 giờ nếu có quả sượng hoặc hỏng.</p>
          </div>
        </div>
      </div>

      {/* Container ẩn dành cho reCAPTCHA của Firebase */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

