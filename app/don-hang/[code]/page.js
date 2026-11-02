'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, Clock, Truck, Package, ShieldCheck, MapPin, 
  Phone, ArrowLeft, RefreshCw, XCircle, AlertTriangle, 
  Sparkles, Lock, KeyRound, Copy, Check, Eye, EyeOff, QrCode, CreditCard, Maximize2, X
} from 'lucide-react';

function OrderDetailContent({ code }) {
  const searchParams = useSearchParams();
  const isNewAccount = searchParams.get('new_account') === '1';
  const initialPwd = searchParams.get('pwd') || '123456';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Đổi ý không mua nữa');
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-created account password state & modal
  const [currentPassword, setCurrentPassword] = useState(initialPwd);
  const [copiedPwd, setCopiedPwd] = useState(false);
  const [showChangePwdModal, setShowChangePwdModal] = useState(false);
  const [oldPwdInput, setOldPwdInput] = useState(initialPwd);
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [changePwdError, setChangePwdError] = useState('');

  const [copiedField, setCopiedField] = useState(null);
  const [qrMode, setQrMode] = useState('qr_only'); // 'qr_only' for super large clear QR, 'compact2' for standard frame
  const [showFullQrModal, setShowFullQrModal] = useState(false);

  const handleCopyText = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Đã sao chép ${fieldName}!`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${code}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (e) {
      console.error('Failed to load order', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [code]);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(currentPassword);
    setCopiedPwd(true);
    showToast('Đã sao chép mật khẩu vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopiedPwd(false), 2500);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwdError('');

    if (!newPwdInput || newPwdInput.length < 6) {
      setChangePwdError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPwdInput !== confirmPwdInput) {
      setChangePwdError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    setChangingPwd(true);
    try {
      const res = await fetch('/api/customer/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: order?.user_id,
          old_password: oldPwdInput,
          new_password: newPwdInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentPassword(newPwdInput);
        setShowChangePwdModal(false);
        setNewPwdInput('');
        setConfirmPwdInput('');
        showToast('Đổi mật khẩu thành công! Quý khách vui lòng ghi nhớ mật khẩu mới nhé.', 'success');
      } else {
        setChangePwdError(data.message || 'Đổi mật khẩu thất bại.');
      }
    } catch (err) {
      setChangePwdError('Không thể kết nối máy chủ.');
    } finally {
      setChangingPwd(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', reason: cancelReason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Hủy đơn hàng thành công! Tồn kho đã được hoàn lại.', 'success');
        setShowCancelModal(false);
        fetchOrder();
      } else {
        showToast(data.message || 'Hủy đơn thất bại', 'error');
      }
    } catch (e) {
      showToast('Không thể kết nối máy chủ', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-800">Không tìm thấy đơn hàng</h2>
        <p className="text-xs text-gray-500">Mã đơn &quot;{code}&quot; không có trong cơ sở dữ liệu.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
      </div>
    );
  }

  // Progress Steps
  const steps = [
    { key: 'CHO_XAC_NHAN', label: 'Đặt hàng', desc: 'Chờ tiếp nhận' },
    { key: 'DA_XAC_NHAN', label: 'Đã duyệt', desc: 'Cửa hàng xác nhận' },
    { key: 'DANG_CHUAN_BI', label: 'Đang đóng gói', desc: 'Chọn trái cây tươi' },
    { key: 'DANG_GIAO', label: 'Đang giao GreenSM', desc: 'Tài xế di chuyển' },
    { key: 'DA_GIAO', label: 'Hoàn tất', desc: 'Đã nhận trái cây' },
  ];

  const statusHierarchy = {
    CHO_THANH_TOAN: 0,
    CHO_XAC_NHAN: 1,
    DA_XAC_NHAN: 2,
    DANG_CHUAN_BI: 3,
    TAM_DUNG: 3,
    DANG_GIAO: 4,
    DA_GIAO: 5,
    DA_HUY: -1,
  };

  const currentLevel = statusHierarchy[order.order_status] ?? 1;
  const isCancelled = order.order_status === 'DA_HUY';
  const isPaused = order.order_status === 'TAM_DUNG';
  const isUnpaidVietQr = !isCancelled && order.payment_method === 'VIETQR' && order.payment_status !== 'PAID';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* FR-024 / BR-008: Thông báo tài khoản tự động tạo cho khách mới */}
      {isNewAccount && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-700 text-white p-6 rounded-3xl shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-base font-black flex items-center gap-2">
                  <span>Tài Khoản Thành Viên Đã Được Tự Động Khởi Tạo!</span>
                  <span className="text-[10px] bg-yellow-400 text-gray-900 font-extrabold px-2 py-0.5 rounded-full">
                    Đã đăng nhập
                  </span>
                </h2>
                <p className="text-xs text-white/90 mt-1">
                  Hệ thống đã tự động kích hoạt tài khoản và đăng nhập cho bạn để dễ dàng theo dõi hành trình đơn hàng.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setOldPwdInput(currentPassword);
                setShowChangePwdModal(true);
              }}
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-black transition shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              Đổi mật khẩu ngay
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl flex items-center justify-between border border-white/20">
              <span className="text-white/80">Tên đăng nhập (SĐT):</span>
              <strong className="font-mono text-sm tracking-wide text-white">{order.phone}</strong>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl flex items-center justify-between border border-white/20">
              <span className="text-white/80">Mật khẩu tra cứu:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black bg-white/20 px-2.5 py-1 rounded-lg border border-white/20 text-yellow-200">
                  {currentPassword}
                </span>
                <button
                  onClick={handleCopyPassword}
                  title="Sao chép mật khẩu"
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition cursor-pointer"
                >
                  {copiedPwd ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className={`text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isCancelled 
          ? 'bg-red-600' 
          : isPaused 
            ? 'bg-amber-600' 
            : isUnpaidVietQr 
              ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700' 
              : 'bg-emerald-600'
      }`}>
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0">
            {isCancelled ? (
              <XCircle className="w-7 h-7" />
            ) : isUnpaidVietQr ? (
              <Clock className="w-7 h-7 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-7 h-7" />
            )}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black">
              {isCancelled 
                ? 'Đơn Hàng Đã Bị Hủy' 
                : isPaused 
                  ? 'Đơn Hàng Đang Tạm Dừng Xử Lý' 
                  : isUnpaidVietQr 
                    ? 'Đơn Hàng Chờ Quét Mã VietQR' 
                    : 'Đơn Hàng Đang Được Xử Lý!'}
            </h1>
            <p className="text-xs text-white/90 mt-0.5">
              {isUnpaidVietQr ? (
                <>Mã đơn hàng: <strong className="text-white font-mono">{order.order_code}</strong> • Vui lòng quét mã QR bên dưới để thanh toán</>
              ) : (
                <>Mã đơn hàng: <strong className="text-white font-mono">{order.order_code}</strong></>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Cancel button if order is still CHO_XAC_NHAN */}
          {order.order_status === 'CHO_XAC_NHAN' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-3.5 py-2 bg-red-700/80 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition border border-red-500 shadow-md cursor-pointer"
            >
              Hủy đơn này
            </button>
          )}
          <button
            onClick={fetchOrder}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </button>
        </div>
      </div>

      {/* Khung thanh toán VietQR (BR-014, BR-015 & FR-026) - ĐẶT LÊN ĐẦU KHI CHỜ THANH TOÁN */}
      {!isCancelled && order.payment_method === 'VIETQR' && (
        <div className={`bg-white p-6 rounded-3xl border shadow-sm space-y-4 ${
          order.payment_status === 'PAID' ? 'border-gray-100' : 'border-amber-300 ring-4 ring-amber-50'
        }`}>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-brand-600" />
              Thanh Toán Quét Mã VietQR (MB Bank)
            </h3>
            {order.payment_status === 'PAID' ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ĐÃ XÁC NHẬN THANH TOÁN
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Chờ chuyển khoản
              </span>
            )}
          </div>

          {order.payment_status === 'PAID' ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Cửa hàng đã nhận được thanh toán chuyển khoản cho đơn hàng này!</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">Trái cây đang được ưu tiên đóng gói tươi ngon chuẩn bị bàn giao GreenSM.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 pt-1">
              {/* Khối Ảnh Khung Chuẩn VietQR MB Bank To Rõ */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-5 rounded-3xl border border-emerald-200 text-center shrink-0 w-full sm:w-[420px] md:w-[440px] flex flex-col items-center">
                {/* Hộp Ảnh QR Cỡ To */}
                <div className="relative group w-full aspect-square max-w-[400px] bg-white p-3 rounded-2xl shadow-md border-2 border-emerald-300 flex items-center justify-center">
                  <img
                    src={`https://img.vietqr.io/image/MB-0929894248-compact2.png?amount=${parseFloat(order.total_amount)}&addInfo=DODONG4MUA%20${order.order_code}&accountName=TRAN%20VU`}
                    alt="VietQR MB Bank"
                    className="w-full h-full object-contain select-none"
                  />
                  {/* Nút Phóng To Toàn Màn Hình */}
                  <button
                    type="button"
                    onClick={() => setShowFullQrModal(true)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/75 hover:bg-black/90 text-white rounded-xl backdrop-blur-xs transition shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    title="Phóng to mã QR toàn màn hình"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Phóng to</span>
                  </button>
                </div>

                <p className="text-sm text-emerald-950 font-black mt-3.5 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  Mở App ngân hàng bất kỳ để quét mã
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Đã tự động điền số tiền: <strong className="text-emerald-900 font-extrabold">{parseFloat(order.total_amount).toLocaleString('vi-VN')} đ</strong>
                </p>
              </div>

              {/* Thông tin chuyển khoản chi tiết kèm nút Copy */}
              <div className="space-y-3 flex-1 text-xs w-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Ngân hàng thụ hưởng:</span>
                      <strong className="text-gray-900 font-bold">MB Bank (Ngân hàng Quân Đội)</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Số tài khoản:</span>
                      <strong className="text-brand-700 font-mono text-sm font-black">0929894248</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText('0929894248', 'Số tài khoản')}
                      className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    >
                      {copiedField === 'Số tài khoản' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'Số tài khoản' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Chủ tài khoản:</span>
                      <strong className="text-gray-900 font-bold">TRAN VU</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div>
                      <span className="text-emerald-700 text-[10px] block font-medium">Số tiền cần thanh toán:</span>
                      <strong className="text-emerald-800 text-base font-black">
                        {parseFloat(order.total_amount).toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(parseFloat(order.total_amount).toString(), 'Số tiền')}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    >
                      {copiedField === 'Số tiền' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'Số tiền' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div>
                      <span className="text-amber-800 text-[10px] block font-bold">Nội dung chuyển khoản (bắt buộc):</span>
                      <strong className="text-amber-950 font-mono text-xs font-black">
                        DODONG4MUA {order.order_code}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(`DODONG4MUA ${order.order_code}`, 'Nội dung chuyển khoản')}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-300 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    >
                      {copiedField === 'Nội dung chuyển khoản' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'Nội dung chuyển khoản' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-gray-100">
                  <p className="text-[11px] text-gray-500">
                    💡 Sau khi chuyển khoản, Admin sẽ đối soát biến động số dư và duyệt đơn.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      fetchOrder();
                      showToast('Đang làm mới trạng thái đơn hàng...', 'info');
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Làm mới trạng thái</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visual Tracking Bar */}
      {!isCancelled ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" /> Tiến Độ Vận Đơn GreenSM
            </h2>
            {order.tracking_code && (
              <span className="text-xs bg-emerald-50 text-emerald-800 font-mono font-bold px-3 py-1 rounded-full border border-emerald-200">
                Mã vận đơn: {order.tracking_code}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
            {steps.map((st, idx) => {
              const stepLevel = idx + 1;
              const isCompleted = currentLevel >= stepLevel;
              const isCurrent = currentLevel === stepLevel;

              return (
                <div key={st.key} className="text-center space-y-2">
                  <div
                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold text-xs transition ${
                      isCompleted
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'bg-gray-100 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-brand-200 animate-pulse' : ''}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepLevel}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {st.label}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{st.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 p-6 rounded-3xl border border-red-200 flex items-center gap-4 text-xs text-red-800">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <strong className="block text-sm font-bold">Đơn hàng này đã bị hủy</strong>
            Toàn bộ số lượng trái cây trong đơn đã được hệ thống tự động hoàn lại kho hàng.
          </div>
        </div>
      )}

      {/* Order Info & Items Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipient & Payment Info */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
            Thông Tin Nhận Hàng & Thanh Toán
          </h3>
          <div className="space-y-2.5 text-gray-600">
            <p className="flex items-center gap-2">
              <strong className="text-gray-900 w-24 shrink-0">Người nhận:</strong>
              <span>{order.receiver_name}</span>
            </p>
            <p className="flex items-center gap-2">
              <strong className="text-gray-900 w-24 shrink-0">Số điện thoại:</strong>
              <span>{order.phone}</span>
            </p>
            <p className="flex items-start gap-2">
              <strong className="text-gray-900 w-24 shrink-0">Địa chỉ:</strong>
              <span>{order.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <strong className="text-gray-900 w-24 shrink-0">Thanh toán:</strong>
              <span className="font-bold text-gray-800 uppercase">
                {order.payment_method || 'COD'} ({order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'})
              </span>
            </p>
            {order.note && (
              <p className="flex items-start gap-2 bg-yellow-50 p-2.5 rounded-xl border border-yellow-200/60 text-yellow-900">
                <strong className="w-20 shrink-0">Ghi chú:</strong>
                <span>{order.note}</span>
              </p>
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
            Tổng Kết Chi Phí
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Tiền hàng:</span>
              <span className="font-semibold">{parseFloat(order.subtotal).toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển GreenSM:</span>
              <span>
                {parseFloat(order.shipping_fee) === 0 ? (
                  <strong className="text-brand-600">MIỄN PHÍ</strong>
                ) : (
                  `${parseFloat(order.shipping_fee).toLocaleString('vi-VN')} đ`
                )}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-sm">
              <span className="font-bold text-gray-900">Tổng thanh toán:</span>
              <span className="text-lg font-black text-brand-700">
                {parseFloat(order.total_amount).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
          <div className="pt-2 flex gap-2">
            <Link
              href="/lich-su-don-hang"
              className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-center block transition cursor-pointer"
            >
              Xem tất cả đơn
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-xl text-center block transition border border-brand-200 cursor-pointer"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      {/* Item List */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-gray-900">Chi Tiết Sản Phẩm Trong Đơn</h3>
        <div className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.product_name}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{item.product_name}</h4>
                  <p className="text-gray-400 text-[11px]">
                    {parseFloat(item.unit_price).toLocaleString('vi-VN')} đ x {item.quantity} {item.unit}
                  </p>
                </div>
              </div>
              <span className="font-extrabold text-gray-900">
                {parseFloat(item.total_price || (item.unit_price * item.quantity) || item.subtotal || 0).toLocaleString('vi-VN')} đ
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL ĐỔI MẬT KHẨU TÀI KHOẢN MỚI TẠO */}
      {showChangePwdModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Thiết Lập Mật Khẩu Mới</h3>
              </div>
              <button
                onClick={() => setShowChangePwdModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            {changePwdError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-bold">
                {changePwdError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="text"
                  required
                  value={oldPwdInput}
                  onChange={(e) => setOldPwdInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Nhập mật khẩu mới..."
                    value={newPwdInput}
                    onChange={(e) => setNewPwdInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 pr-10 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showNewPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Nhập lại mật khẩu mới..."
                  value={confirmPwdInput}
                  onChange={(e) => setConfirmPwdInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePwdModal(false)}
                  className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={changingPwd}
                  className="py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl text-xs transition shadow-md shadow-brand-600/30 cursor-pointer disabled:bg-gray-400"
                >
                  {changingPwd ? 'Đang lưu...' : 'Lưu mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-gray-900 text-base">Hủy Đơn Hàng Này?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Đơn hàng đang ở trạng thái Chờ xác nhận nên bạn có thể hủy. Số lượng trái cây sẽ được tự động trả lại kho.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Lý do hủy:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
              >
                <option value="Đổi ý không mua nữa">Đổi ý không mua nữa</option>
                <option value="Muốn chọn loại trái cây khác">Muốn chọn loại trái cây khác</option>
                <option value="Đổi địa chỉ giao">Đổi địa chỉ giao</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 shadow-md shadow-red-600/30 cursor-pointer"
              >
                {cancelling ? 'Đang hủy...' : 'Đồng Ý Hủy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PHÓNG TO MÃ QR TOÀN MÀN HÌNH */}
      {showFullQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 text-center">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="text-left">
                <h3 className="font-black text-base text-gray-900">Mã QR Thanh Toán Khổ Cực Đại</h3>
                <p className="text-xs text-gray-500 font-mono">Đơn hàng: {order.order_code} • MB: 0929894248</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullQrModal(false)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-80 h-80 sm:w-[440px] sm:h-[440px] mx-auto bg-white p-3 rounded-2xl shadow-inner border-2 border-emerald-300 flex items-center justify-center">
              <img
                src={`https://img.vietqr.io/image/MB-0929894248-compact2.png?amount=${parseFloat(order.total_amount)}&addInfo=DODONG4MUA%20${order.order_code}&accountName=TRAN%20VU`}
                alt="VietQR MB Bank Full"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-gray-600 font-medium">
              Bạn có thể đưa camera điện thoại lại gần màn hình để quét mã siêu nhanh!
            </p>

            <button
              type="button"
              onClick={() => setShowFullQrModal(false)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-2xl border border-slate-100/90 shadow-slate-900/10">
            <div className="shrink-0">
              {toast.type === 'error' ? (
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
            <span className="text-xs font-bold font-sans text-slate-800">
              {toast.message}
            </span>
            <button
              onClick={() => setToast(null)}
              className="ml-auto p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage({ params }) {
  const resolvedParams = use(params);

  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
      </div>
    }>
      <OrderDetailContent code={resolvedParams.code} />
    </Suspense>
  );
}
