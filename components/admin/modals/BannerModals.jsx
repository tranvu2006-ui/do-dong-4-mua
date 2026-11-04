'use client';

import React from 'react';
import { Image as ImageIcon, X, RefreshCw, Upload, Edit3, Trash2 } from 'lucide-react';

export default function BannerModals({
  showAddBannerModal,
  setShowAddBannerModal,
  handleCreateBanner,
  newBanner,
  setNewBanner,
  handleFileUpload,
  uploadingBanner,
  editingBanner,
  setEditingBanner,
  handleUpdateBanner,
  deletingBanner,
  setDeletingBanner,
  handleConfirmDeleteBanner
}) {
  return (
    <>
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                <span>Thêm Banner Trang Chủ</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBannerModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề banner *</label>
                <input
                  type="text" required placeholder="Ví dụ: Mùa Cam Sành Mọng Nước"
                  value={newBanner.title} onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hình ảnh banner (Upload từ máy tính: JPG, PNG, WEBP &le; 5MB) *
                </label>
                <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50/30 hover:bg-emerald-50/60 transition relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, 'banner')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2 text-brand-700 py-3">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span className="font-bold text-xs">Đang tải ảnh banner từ máy tính lên...</span>
                    </div>
                  ) : newBanner.image_url ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={newBanner.image_url}
                        alt="Preview Banner"
                        className="w-20 h-12 rounded-xl object-cover border border-brand-300 shadow-sm"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-emerald-700 text-xs truncate">✓ Đã tải ảnh: {newBanner.image_url}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Bấm vào đây để chọn đổi ảnh khác</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-slate-500">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-brand-600" />
                      <p className="font-bold text-xs text-brand-800">Bấm để chọn ảnh từ máy tính (Browse...)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Định dạng JPG, PNG, WEBP — Tối đa 5 MB</p>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 shrink-0">Hoặc dán URL:</span>
                  <input
                    type="text"
                    placeholder="https://... hoặc /uploads/..."
                    value={newBanner.image_url}
                    onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn liên kết khi bấm vào banner</label>
                <input
                  type="text"
                  placeholder="Ví dụ: / hoặc /san-pham/1 hoặc /khuyen-mai"
                  value={newBanner.link_url}
                  onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thứ tự hiển thị (Số nhỏ xếp trước)</label>
                <input
                  type="number"
                  value={newBanner.display_order}
                  onChange={(e) => setNewBanner({ ...newBanner, display_order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBannerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-md shadow-brand-600/20 cursor-pointer"
                >
                  Thêm Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT BANNER (FR-042) */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>Chỉnh Sửa Banner</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateBanner} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề banner *</label>
                <input
                  type="text"
                  required
                  placeholder="Tiêu đề banner"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hình ảnh banner (Upload từ máy tính: JPG, PNG, WEBP &le; 5MB) *
                </label>
                <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50/30 hover:bg-emerald-50/60 transition relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, 'edit_banner')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2 text-brand-700 py-3">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span className="font-bold text-xs">Đang tải ảnh banner lên...</span>
                    </div>
                  ) : editingBanner.image_url ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={editingBanner.image_url}
                        alt="Preview Banner"
                        className="w-20 h-12 rounded-xl object-cover border border-brand-300 shadow-sm"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-emerald-700 text-xs truncate">✓ Ảnh hiện tại: {editingBanner.image_url}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Bấm vào đây để chọn đổi ảnh khác từ máy tính</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-slate-500">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-brand-600" />
                      <p className="font-bold text-xs text-brand-800">Bấm để chọn ảnh từ máy tính (Browse...)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Định dạng JPG, PNG, WEBP — Tối đa 5 MB</p>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 shrink-0">Hoặc dán URL:</span>
                  <input
                    type="text"
                    placeholder="https://... hoặc /uploads/..."
                    value={editingBanner.image_url}
                    onChange={(e) => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn liên kết khi bấm vào banner</label>
                <input
                  type="text"
                  placeholder="Ví dụ: / hoặc /san-pham/1"
                  value={editingBanner.link_url || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, link_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={editingBanner.display_order}
                    onChange={(e) => setEditingBanner({ ...editingBanner, display_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái hiển thị</label>
                  <select
                    value={editingBanner.status}
                    onChange={(e) => setEditingBanner({ ...editingBanner, status: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:border-brand-500"
                  >
                    <option value={1}>Đang hiển thị</option>
                    <option value={0}>Đang tạm ẩn</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-md shadow-brand-600/20 cursor-pointer"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DELETE BANNER (FR-042) */}
      {deletingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">Xóa Banner Quảng Cáo</h3>
                <p className="text-xs text-slate-500">Mã #{deletingBanner.id}</p>
              </div>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={deletingBanner.image_url} alt={deletingBanner.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa vĩnh viễn banner <strong className="text-slate-900 font-bold">{deletingBanner.title}</strong>? Banner này sẽ bị gỡ bỏ khỏi toàn bộ trang chủ và không thể khôi phục lại.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingBanner(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBanner}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
