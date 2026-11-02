'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, Search, Clock, Truck, CheckCircle2, XCircle, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

function OrderHistoryContent() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Đổi ý không mua nữa');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  // Auto-fill phone from logged-in user
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dodong4mua_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.phone) {
          setPhone(u.phone);
          fetchOrders(u.phone);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchOrders = async (lookupPhone) => {
    if (!lookupPhone) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(lookupPhone.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(phone);
  };

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    try {
      const res = await fetch(`/api/orders/${cancelModalOrder.order_code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', reason: cancelReason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Hủy đơn hàng thành công!');
        setCancelModalOrder(null);
        fetchOrders(phone);
      } else {
        showToast(data.message || 'Lỗi hủy đơn', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối máy chủ', 'error');
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'CHO_XAC_NHAN':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Chờ xác nhận</span>;
      case 'DA_XAC_NHAN':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Đã tiếp nhận</span>;
      case 'DANG_CHUAN_BI':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Đang đóng gói</span>;
      case 'TAM_DUNG':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800">Tạm dừng xử lý</span>;
      case 'DANG_GIAO':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Đang giao GreenSM</span>;
      case 'DA_GIAO':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Giao thành công</span>;
      case 'DA_HUY':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Đã hủy đơn</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">{st}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <span>📦</span> Lịch Sử Đơn Hàng Của Bạn
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Tra cứu toàn bộ đơn hàng đã đặt theo Số điện thoại và theo dõi vận chuyển GreenSM
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="tel"
            required
            placeholder="Nhập số điện thoại đã dùng để đặt hàng..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
        >
          {loading ? <span>Đang tìm...</span> : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>Tra Cứu Đơn</span>
            </>
          )}
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-gray-100 rounded-3xl" />
          <div className="h-32 bg-gray-100 rounded-3xl" />
        </div>
      ) : searched && orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
          <div className="text-5xl">🍉</div>
          <h3 className="font-bold text-gray-800 text-base">Không tìm thấy đơn hàng nào</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Số điện thoại <strong>{phone}</strong> chưa có đơn hàng nào trong hệ thống. Hãy dạo quanh cửa hàng và chọn trái cây bạn thích nhé!
          </p>
          <Link
            href="/"
            className="inline-block mt-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-brand-700 text-sm">{ord.order_code}</span>
                  {getStatusBadge(ord.order_status)}
                </div>
                <div className="text-[11px] text-gray-400">
                  Ngày đặt: {new Date(ord.created_at).toLocaleString('vi-VN')}
                </div>
              </div>

              {/* Items in order */}
              <div className="divide-y divide-gray-50">
                {ord.items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail} alt={item.product_name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-gray-800">{item.product_name}</div>
                        <div className="text-[11px] text-gray-400">
                          {parseFloat(item.unit_price).toLocaleString('vi-VN')} đ x {item.quantity}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      {parseFloat(item.subtotal).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                <div>
                  <span className="text-gray-500">Tổng thanh toán: </span>
                  <strong className="text-base font-black text-brand-700">
                    {parseFloat(ord.total_amount).toLocaleString('vi-VN')} đ
                  </strong>
                  <span className="text-[11px] text-gray-400 ml-2">
                    ({ord.payment_method} - {ord.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Cancel button if order is CHO_XAC_NHAN */}
                  {ord.order_status === 'CHO_XAC_NHAN' && (
                    <button
                      onClick={() => setCancelModalOrder(ord)}
                      className="px-3.5 py-1.5 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition"
                    >
                      Hủy đơn
                    </button>
                  )}
                  <Link
                    href={`/don-hang/${ord.order_code}`}
                    className="px-4 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl font-bold text-xs transition flex items-center gap-1"
                  >
                    <span>Lộ trình GreenSM</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-gray-900 text-base">Xác Nhận Hủy Đơn Hàng?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Bạn có chắc chắn muốn hủy đơn hàng <strong>{cancelModalOrder.order_code}</strong>? Số lượng trái cây sẽ được hoàn lại kho.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Lý do hủy đơn:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
              >
                <option value="Đổi ý không mua nữa">Đổi ý không mua nữa</option>
                <option value="Muốn đổi sang loại trái cây khác">Muốn đổi sang loại trái cây khác</option>
                <option value="Cần đổi địa chỉ giao hàng">Cần đổi địa chỉ giao hàng</option>
                <option value="Đặt nhầm số lượng">Đặt nhầm số lượng</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 shadow-md shadow-red-600/30"
              >
                Xác Nhận Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {/* TOAST NOTIFICATION (Đồng bộ phong cách hiện đại Đổ Đống 4 Mùa) */}
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

export default function OrderHistoryPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-400">Đang tải...</div>}>
      <OrderHistoryContent />
    </Suspense>
  );
}

