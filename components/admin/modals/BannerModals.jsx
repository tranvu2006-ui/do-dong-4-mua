'use client';

import React from 'react';
import { Image as ImageIcon, X, RefreshCw, Upload, Edit3, Trash2, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BannerModals({
  showAddBannerModal,
  setShowAddBannerModal,
  handleCreateBanner,
  newBanner,
  setNewBanner,
  handleFileUpload,
  uploadingImage,
  editingBanner,
  setEditingBanner,
  handleUpdateBanner,
  deletingBanner,
  setDeletingBanner,
  handleConfirmDeleteBanner
}) {
  return (
    <>
      {/* 1. MODAL THÊM BANNER MỚI (FR-042) */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
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

            <form onSubmit={handleCreateBanner} noValidate className="space-y-4 text-xs">
              {/* Tiêu đề banner */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề banner *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Mùa Cam Sành Mọng Nước - Giảm Giá 20%"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>

              {/* KHUNG XEM TRƯỚC BANNER HIỂN THỊ (Chuẩn tỉ lệ 3:1 sàn TMĐT) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Khung xem trước hiển thị (Tỉ lệ chuẩn 3:1) *</span>
                  </label>
                  {newBanner.image_url && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Đã có ảnh</span>
                    </span>
                  )}
                </div>

                {/* Khung xem trước trực quan */}
                <div className="relative w-full aspect-[3/1] rounded-2xl border-2 border-emerald-500/40 bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center group">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2 text-white">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                      <span className="font-bold text-xs">Đang tải ảnh banner từ máy tính lên...</span>
                    </div>
                  ) : newBanner.image_url ? (
                    <>
                      <img
                        src={newBanner.image_url}
                        alt="Bản xem trước banner"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {/* Huy hiệu xem trước */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 pointer-events-none">
                        <Eye className="w-3 h-3 text-emerald-400" />
                        <span>Bản xem trước thực tế</span>
                      </div>
                      {/* Nút xóa ảnh để chọn lại */}
                      <button
                        type="button"
                        onClick={() => setNewBanner({ ...newBanner, image_url: '' })}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600/90 text-white backdrop-blur-md transition cursor-pointer"
                        title="Xóa ảnh để chọn lại"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4 text-slate-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-500/80" />
                      <p className="font-bold text-xs text-slate-300">Khung xem trước tỉ lệ 3:1</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Tải ảnh từ máy tính hoặc dán link URL bên dưới để xem trước ảnh tại đây
                      </p>
                    </div>
                  )}
                </div>

                {/* Khối tải ảnh & nhập URL */}
                <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm text-xs shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh từ máy tính</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileUpload(e, 'banner')}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      JPG, PNG, WEBP (Tối đa 5 MB)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500 font-bold shrink-0">Hoặc dán URL:</span>
                    <input
                      type="text"
                      placeholder="https://... hoặc /uploads/..."
                      value={newBanner.image_url}
                      onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Đường dẫn liên kết */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn liên kết khi bấm vào banner</label>
                <input
                  type="text"
                  placeholder="Ví dụ: / hoặc /san-pham/1 hoặc /khuyen-mai"
                  value={newBanner.link_url}
                  onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 font-mono text-xs"
                />
              </div>

              {/* Thứ tự hiển thị */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Thứ tự hiển thị (Số nhỏ xếp trước)</label>
                <input
                  type="number"
                  value={newBanner.display_order}
                  onChange={(e) => setNewBanner({ ...newBanner, display_order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>

              {/* Nút hành động */}
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

      {/* 2. MODAL CHỈNH SỬA BANNER (FR-042) */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
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

            <form onSubmit={handleUpdateBanner} noValidate className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề banner *</label>
                <input
                  type="text"
                  required
                  placeholder="Tiêu đề banner"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>

              {/* KHUNG XEM TRƯỚC BANNER HIỂN THỊ KHI CHỈNH SỬA */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Khung xem trước hiển thị (Tỉ lệ chuẩn 3:1) *</span>
                  </label>
                  {editingBanner.image_url && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ảnh hợp lệ</span>
                    </span>
                  )}
                </div>

                <div className="relative w-full aspect-[3/1] rounded-2xl border-2 border-blue-500/40 bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center group">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2 text-white">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                      <span className="font-bold text-xs">Đang tải ảnh banner lên...</span>
                    </div>
                  ) : editingBanner.image_url ? (
                    <>
                      <img
                        src={editingBanner.image_url}
                        alt="Bản xem trước banner"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 pointer-events-none">
                        <Eye className="w-3 h-3 text-blue-400" />
                        <span>Bản xem trước thực tế</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingBanner({ ...editingBanner, image_url: '' })}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600/90 text-white backdrop-blur-md transition cursor-pointer"
                        title="Xóa ảnh để chọn lại"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4 text-slate-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-500/80" />
                      <p className="font-bold text-xs text-slate-300">Khung xem trước tỉ lệ 3:1</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Tải ảnh từ máy tính hoặc dán link URL bên dưới để xem trước ảnh tại đây
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm text-xs shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Đổi ảnh từ máy tính</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileUpload(e, 'edit_banner')}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      JPG, PNG, WEBP (Tối đa 5 MB)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500 font-bold shrink-0">Hoặc dán URL:</span>
                    <input
                      type="text"
                      placeholder="https://... hoặc /uploads/..."
                      value={editingBanner.image_url}
                      onChange={(e) => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn liên kết khi bấm vào banner</label>
                <input
                  type="text"
                  placeholder="Ví dụ: / hoặc /san-pham/1"
                  value={editingBanner.link_url || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, link_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={editingBanner.display_order}
                    onChange={(e) => setEditingBanner({ ...editingBanner, display_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái hiển thị</label>
                  <select
                    value={editingBanner.status}
                    onChange={(e) => setEditingBanner({ ...editingBanner, status: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:border-brand-500 text-xs"
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

      {/* 3. MODAL XÁC NHẬN XÓA BANNER (FR-042) */}
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

            <div className="aspect-[3/1] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
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
