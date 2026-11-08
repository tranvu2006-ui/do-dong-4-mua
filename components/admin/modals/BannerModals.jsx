'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  X, 
  RefreshCw, 
  Upload, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move 
} from 'lucide-react';

/**
 * Component Khung Xem Trước & Căn Chỉnh Vị Trí Ảnh Banner (Pan & Zoom & Tỉ lệ 1920x450 / 16:9)
 */
function BannerAdjuster({
  imageUrl,
  onImageChange,
  uploadingImage,
  handleFileUpload,
  uploadType = 'banner',
  adjusterRef
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState('4/1'); // '4/1' | '1920/450' | '16/9'
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const frameRef = useRef(null);
  const imgRef = useRef(null);

  // Reset căn chỉnh khi đổi URL ảnh mới
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [imageUrl]);

  // Mouse Pan Handlers
  const handleMouseDown = (e) => {
    if (!imageUrl) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    if (isDragging) setIsDragging(false);
  };

  // Touch Pan Handlers (Mobile)
  const handleTouchStart = (e) => {
    if (!imageUrl || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  // Expose hàm xuất ảnh đã crop (nếu người dùng có zoom/pan)
  useEffect(() => {
    if (adjusterRef) {
      adjusterRef.current = {
        hasAdjustments: () => scale !== 1 || position.x !== 0 || position.y !== 0,
        getCroppedBlob: async () => {
          if (!imgRef.current || !frameRef.current) return null;
          try {
            const canvas = document.createElement('canvas');
            const targetW = 1920;
            let targetH = 480; // 4:1 chuẩn trang chủ (1920 / 4 = 480)
            if (aspectRatio === '1920/450') targetH = 450;
            else if (aspectRatio === '16/9') targetH = 1080;
            else targetH = 480;

            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            const imgRect = imgRef.current.getBoundingClientRect();
            const frameRect = frameRef.current.getBoundingClientRect();
            const scaleFactor = targetW / frameRect.width;

            const dx = (imgRect.left - frameRect.left) * scaleFactor;
            const dy = (imgRect.top - frameRect.top) * scaleFactor;
            const dw = imgRect.width * scaleFactor;
            const dh = imgRect.height * scaleFactor;

            ctx.drawImage(imgRef.current, dx, dy, dw, dh);
            return await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
          } catch (err) {
            console.warn('Canvas crop fallback (cross-origin):', err);
            return null;
          }
        }
      };
    }
  }, [adjusterRef, scale, position, aspectRatio]);

  return (
    <div className="space-y-2.5">
      {/* Thanh chuyển đổi tỷ lệ & nhãn */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          <span>Khung xem trước & căn chỉnh ảnh *</span>
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setAspectRatio('4/1')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              aspectRatio === '4/1'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Tỉ lệ chuẩn 4:1 đồng bộ tuyệt đối với trang chủ khách hàng"
          >
            4:1 (Trang Chủ)
          </button>
          <button
            type="button"
            onClick={() => setAspectRatio('1920/450')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              aspectRatio === '1920/450'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Tỉ lệ siêu rộng 1920 x 450 px"
          >
            1920 x 450
          </button>
          <button
            type="button"
            onClick={() => setAspectRatio('16/9')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              aspectRatio === '16/9'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Tỉ lệ chuẩn 16:9 (1920 x 1080)"
          >
            16:9
          </button>
        </div>
      </div>

      {/* Khung căn chỉnh hình ảnh trực quan */}
      <div
        ref={frameRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`relative w-full ${
          aspectRatio === '4/1'
            ? 'aspect-[4/1]'
            : aspectRatio === '1920/450'
            ? 'aspect-[1920/450]'
            : 'aspect-video'
        } rounded-2xl border-2 border-emerald-500/40 bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center select-none ${
          imageUrl ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
      >
        {uploadingImage ? (
          <div className="flex flex-col items-center gap-2 text-white">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            <span className="font-bold text-xs">Đang tải ảnh từ máy tính lên...</span>
          </div>
        ) : imageUrl ? (
          <>
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Bản xem trước banner"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
              crossOrigin="anonymous"
            />

            {/* Gợi ý kéo chuột căn chỉnh */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 shadow-md pointer-events-none whitespace-nowrap">
              <Move className="w-3 h-3 text-emerald-400" />
              <span>
                Kéo chuột để căn vị trí • {aspectRatio === '4/1' ? 'Tỉ lệ 4:1' : aspectRatio === '1920/450' ? '1920 x 450 px' : '16:9'}
              </span>
            </div>

            {/* Nút xóa ảnh để chọn lại */}
            <button
              type="button"
              onClick={() => onImageChange('')}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600/90 text-white backdrop-blur-md transition cursor-pointer"
              title="Xóa ảnh để chọn lại"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="text-center p-4 text-slate-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-500/80" />
            <p className="font-bold text-xs text-slate-300">
              Khung xem trước {aspectRatio === '4/1' ? 'Tỉ lệ 4:1' : aspectRatio === '1920/450' ? '1920 x 450 px' : '16:9'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Tải ảnh lên hoặc dán link URL bên dưới để căn chỉnh vị trí trực tiếp
            </p>
          </div>
        )}
      </div>

      {/* THANH CĂN CHỈNH ZOOM VÀ ĐẶT LẠI (Đúng theo mẫu giao diện người dùng yêu cầu) */}
      {imageUrl && (
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.5, Number((s - 0.1).toFixed(2))))}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0 shadow-xs"
            title="Thu nhỏ (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />

          <button
            type="button"
            onClick={() => setScale((s) => Math.min(3, Number((s + 0.1).toFixed(2))))}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0 shadow-xs"
            title="Phóng to (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
            title="Đặt lại vị trí và tỉ lệ ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      )}

      {/* Khối tải ảnh & nhập URL */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm text-xs shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span>Tải ảnh từ máy tính</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileUpload(e, uploadType)}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
          <span className="text-[11px] text-slate-500 font-medium truncate">
            JPG, PNG, WEBP &le; 5 MB (Khuyến nghị: 1920 x 450 px hoặc 16:9)
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
          <span className="text-[11px] text-slate-500 font-bold shrink-0">Hoặc dán URL:</span>
          <input
            type="text"
            placeholder="https://... hoặc /uploads/..."
            value={imageUrl || ''}
            onChange={(e) => onImageChange(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>
    </div>
  );
}

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
  const addAdjusterRef = useRef(null);
  const editAdjusterRef = useRef(null);
  const [isSubmittingCropped, setIsSubmittingCropped] = useState(false);

  // Xử lý gửi form thêm mới (tự động xuất ảnh crop nếu có zoom/pan)
  const onAddSubmit = async (e) => {
    e.preventDefault();
    if (addAdjusterRef.current && addAdjusterRef.current.hasAdjustments()) {
      setIsSubmittingCropped(true);
      try {
        const blob = await addAdjusterRef.current.getCroppedBlob();
        if (blob) {
          const formData = new FormData();
          formData.append('file', blob, `banner-${Date.now()}.jpg`);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.success && data.url) {
            newBanner.image_url = data.url;
          }
        }
      } catch (err) {
        console.warn('Lỗi khi crop banner trước khi lưu:', err);
      } finally {
        setIsSubmittingCropped(false);
      }
    }
    handleCreateBanner(e);
  };

  // Xử lý gửi form chỉnh sửa (tự động xuất ảnh crop nếu có zoom/pan)
  const onEditSubmit = async (e) => {
    e.preventDefault();
    if (editAdjusterRef.current && editAdjusterRef.current.hasAdjustments()) {
      setIsSubmittingCropped(true);
      try {
        const blob = await editAdjusterRef.current.getCroppedBlob();
        if (blob) {
          const formData = new FormData();
          formData.append('file', blob, `banner-edit-${Date.now()}.jpg`);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.success && data.url) {
            editingBanner.image_url = data.url;
          }
        }
      } catch (err) {
        console.warn('Lỗi khi crop banner trước khi lưu:', err);
      } finally {
        setIsSubmittingCropped(false);
      }
    }
    handleUpdateBanner(e);
  };

  return (
    <>
      {/* 1. MODAL THÊM BANNER MỚI (FR-042) */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-8">
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

            <form onSubmit={onAddSubmit} noValidate className="space-y-4 text-xs">
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

              {/* KHUNG CĂN CHỈNH BANNER (1920x450 / 16:9 kèm thanh Zoom / Đặt lại) */}
              <BannerAdjuster
                imageUrl={newBanner.image_url}
                onImageChange={(url) => setNewBanner({ ...newBanner, image_url: url })}
                uploadingImage={uploadingImage}
                handleFileUpload={handleFileUpload}
                uploadType="banner"
                adjusterRef={addAdjusterRef}
              />

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
                  disabled={isSubmittingCropped}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-md shadow-brand-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmittingCropped && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Thêm Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL CHỈNH SỬA BANNER (FR-042) */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-8">
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

            <form onSubmit={onEditSubmit} noValidate className="space-y-4 text-xs">
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

              {/* KHUNG CĂN CHỈNH BANNER (1920x450 / 16:9 kèm thanh Zoom / Đặt lại) */}
              <BannerAdjuster
                imageUrl={editingBanner.image_url}
                onImageChange={(url) => setEditingBanner({ ...editingBanner, image_url: url })}
                uploadingImage={uploadingImage}
                handleFileUpload={handleFileUpload}
                uploadType="edit_banner"
                adjusterRef={editAdjusterRef}
              />

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
                  disabled={isSubmittingCropped}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-md shadow-brand-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmittingCropped && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu Thay Đổi</span>
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

            <div className="aspect-[1920/450] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
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
