'use client';

import React, { useState, useEffect } from 'react';
import { Package, X, Store, ArrowRight, AlertCircle, CheckCircle2, History, Plus, Minus, RefreshCw } from 'lucide-react';

export default function BranchStockModal({
  isOpen,
  onClose,
  product,
  branches = [],
  currentUser,
  onStockUpdated,
  showToast,
}) {
  const isSuperAdmin = currentUser?.role_id === 1;
  const initialBranchId = isSuperAdmin ? (branches[0]?.id || 1) : (currentUser?.branch_id || 1);

  const [selectedBranchId, setSelectedBranchId] = useState(initialBranchId);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [reason, setReason] = useState('Nhập hàng mới từ nhà vườn');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Khi modal mở hoặc đổi sản phẩm/chi nhánh: lấy số lượng tồn hiện tại của chi nhánh đó
  useEffect(() => {
    if (product) {
      const bId = isSuperAdmin ? selectedBranchId : (currentUser?.branch_id || 1);
      setSelectedBranchId(bId);

      const branchStockObj = product.branch_stocks?.find((bs) => Number(bs.branch_id) === Number(bId));
      const cur = branchStockObj ? branchStockObj.stock_quantity : (product.current_stock || 0);
      setStockQuantity(cur);
      setReason('Nhập hàng mới từ nhà vườn');
      setCustomReason('');
    }
  }, [product, selectedBranchId, isSuperAdmin, currentUser]);

  if (!isOpen || !product) return null;

  const currentBranch = branches.find((b) => Number(b.id) === Number(selectedBranchId));
  const branchStockObj = product.branch_stocks?.find((bs) => Number(bs.branch_id) === Number(selectedBranchId));
  const currentStockAtBranch = branchStockObj !== undefined ? branchStockObj.stock_quantity : (product.current_stock || 0);

  const delta = Number(stockQuantity) - Number(currentStockAtBranch);
  const estimatedTotalStock = Number(product.total_stock || 0) + delta;

  const handleAdjustQuick = (amount) => {
    setStockQuantity((prev) => Math.max(0, Number(prev) + amount));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stockQuantity < 0) {
      showToast?.('Số lượng tồn kho không được âm!', 'error');
      return;
    }

    const finalReason = reason === 'Khác' ? (customReason.trim() || 'Điều chỉnh thủ công') : reason;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_id: selectedBranchId,
          product_id: product.id,
          stock_quantity: parseInt(stockQuantity, 10),
          reason: finalReason,
          admin_user: currentUser,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Lỗi khi cập nhật tồn kho');
      }

      showToast?.(`Cập nhật kho "${product.name}" tại ${currentBranch?.branch_name || 'Chi nhánh'} thành công!`, 'success');
      onStockUpdated?.(data.data);
      onClose();
    } catch (err) {
      console.error(err);
      showToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-white">Điều Chỉnh Tồn Kho Chi Nhánh</h3>
              <p className="text-[11px] text-slate-400">FR-011 & BR-027: Quản lý số lượng tồn kho từng điểm bán</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Thông tin sản phẩm */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center shadow-2xs">
              {product.thumbnail ? (
                <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-7 h-7 text-slate-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                {product.category_name || 'Nông sản 4 mùa'}
              </div>
              <h4 className="font-heading font-black text-sm text-slate-900 truncate" title={product.name}>
                {product.name}
              </h4>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Đơn vị: <strong className="text-slate-800">{product.unit || 'kg'}</strong></span>
                <span>•</span>
                <span>Giá bán: <strong className="text-brand-600">{(product.discount_price || product.price)?.toLocaleString('vi-VN')} đ</strong></span>
              </div>
            </div>
          </div>

          {/* Chọn chi nhánh */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Chi nhánh áp dụng kho:</span>
              {!isSuperAdmin && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Cố định theo chi nhánh trực thuộc
                </span>
              )}
            </label>

            {isSuperAdmin ? (
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.branch_name} ({b.address})
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{currentBranch?.branch_name || `Chi nhánh #${selectedBranchId}`}</span>
              </div>
            )}
          </div>

          {/* Hiện trạng & Số lượng mới */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200 text-center">
              <div className="text-[11px] font-bold text-slate-500">Tồn kho hiện tại tại CN</div>
              <div className="text-xl font-heading font-black text-slate-800 mt-1">
                {currentStockAtBranch} <span className="text-xs font-normal text-slate-500">{product.unit || 'kg'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-[11px] font-bold text-emerald-700">Tổng tồn toàn hệ thống</div>
              <div className="text-xl font-heading font-black text-emerald-800 mt-1">
                {product.total_stock} <span className="text-xs font-normal text-emerald-600">{product.unit || 'kg'}</span>
              </div>
            </div>
          </div>

          {/* Nhập số lượng mới & nút tăng giảm */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Số lượng tồn kho mới ({product.unit || 'kg'}):
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAdjustQuick(-10)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition cursor-pointer flex items-center justify-center shrink-0"
                title="Giảm 10"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => handleAdjustQuick(-1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center justify-center shrink-0"
                title="Giảm 1"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="0"
                step="1"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Math.max(0, parseInt(e.target.value || '0', 10)))}
                className="flex-1 text-center font-heading font-black text-xl py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white shadow-2xs"
              />

              <button
                type="button"
                onClick={() => handleAdjustQuick(1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center justify-center shrink-0"
                title="Tăng 1"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleAdjustQuick(10)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition cursor-pointer flex items-center justify-center shrink-0"
                title="Tăng 10"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() => handleAdjustQuick(50)}
                className="w-10 h-10 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-black text-xs transition cursor-pointer flex items-center justify-center shrink-0"
                title="Tăng 50"
              >
                +50
              </button>
            </div>

            {/* Chênh lệch & Ước tính */}
            <div className="mt-2 text-xs flex items-center justify-between text-slate-500 px-1">
              <span>
                Chênh lệch: <strong className={delta > 0 ? 'text-emerald-600 font-bold' : delta < 0 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                  {delta > 0 ? `+${delta}` : delta} {product.unit || 'kg'}
                </strong>
              </span>
              <span>
                Ước tính tổng hệ thống: <strong className="text-slate-900 font-bold">{estimatedTotalStock} {product.unit || 'kg'}</strong>
              </span>
            </div>
          </div>

          {/* Lý do điều chỉnh kho (FR-045 Audit Trail) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Lý do điều chỉnh (Ghi nhận Nhật ký kiểm toán):
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
            >
              <option value="Nhập hàng mới từ nhà vườn">Nhập hàng tươi mới từ nhà vườn</option>
              <option value="Kiểm kê điều chỉnh kho định kỳ">Kiểm kê điều chỉnh kho định kỳ</option>
              <option value="Xuất hủy hàng dập / hư hỏng">Xuất hủy hàng dập / hư hỏng do vận chuyển</option>
              <option value="Điều chuyển nội bộ giữa các chi nhánh">Điều chuyển nội bộ giữa các chi nhánh</option>
              <option value="Khác">Lý do khác (tự nhập)...</option>
            </select>

            {reason === 'Khác' && (
              <input
                type="text"
                placeholder="Nhập lý do chi tiết..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="mt-2 w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Lưu Cập Nhật Tồn Kho</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

