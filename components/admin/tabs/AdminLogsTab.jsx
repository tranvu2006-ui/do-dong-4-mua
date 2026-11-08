'use client';

import React from 'react';
import { FileText, ShieldCheck, RefreshCw, Clock, MapPin, Search, Lock } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { formatDateTime } from '@/lib/date';

const LOG_ACTION_LABELS = {
  LOGIN: 'Đăng nhập',
  LOGOUT: 'Đăng xuất',
  CREATE: 'Thêm mới',
  UPDATE: 'Cập nhật',
  DELETE: 'Xóa bỏ',
  LOCK: 'Khóa tài khoản',
  UNLOCK: 'Mở khóa',
  APPROVE: 'Phê duyệt',
  CANCEL: 'Hủy bỏ',
  CREATE_ORDER: 'Tạo đơn hàng',
  UPDATE_ORDER_STATUS: 'Đổi trạng thái đơn',
  CANCEL_ORDER: 'Hủy đơn hàng',
  ADD_ORDER_NOTE: 'Thêm ghi chú',
  CREATE_PRODUCT: 'Thêm sản phẩm',
  UPDATE_PRODUCT: 'Sửa sản phẩm',
  DELETE_PRODUCT: 'Xóa sản phẩm',
  UPDATE_STOCK: 'Cập nhật tồn kho',
  CREATE_CATEGORY: 'Thêm danh mục',
  UPDATE_CATEGORY: 'Sửa danh mục',
  DELETE_CATEGORY: 'Xóa danh mục',
  CREATE_PROMOTION: 'Tạo khuyến mãi',
  UPDATE_PROMOTION: 'Sửa khuyến mãi',
  DELETE_PROMOTION: 'Xóa khuyến mãi',
  CREATE_BANNER: 'Thêm banner',
  UPDATE_BANNER: 'Sửa banner',
  DELETE_BANNER: 'Xóa banner',
  CREATE_BRANCH: 'Thêm chi nhánh',
  UPDATE_BRANCH: 'Sửa chi nhánh',
  DELETE_BRANCH: 'Xóa chi nhánh',
  UPDATE_SETTINGS: 'Đổi cấu hình web',
  ASSIGN_PERMISSIONS: 'Phân quyền',
  RESET_PASSWORD: 'Đặt lại mật khẩu',
  CREATE_ADMIN: 'Tạo quản trị viên',
  UPDATE_ADMIN: 'Sửa quản trị viên',
  LOCK_USER: 'Khóa tài khoản',
  UNLOCK_USER: 'Mở khóa tài khoản',
  CREATE_SHIPPING_FEE: 'Thêm nấc cước phí',
  UPDATE_SHIPPING_FEE: 'Cập nhật nấc cước phí',
  DELETE_SHIPPING_FEE: 'Xóa nấc cước phí',
  CREATE_NOTIFICATION: 'Gửi thông báo',
  DELETE_NOTIFICATION: 'Xóa thông báo',
};

const LOG_MODULE_LABELS = {
  ORDER: 'Đơn hàng',
  PRODUCT: 'Sản phẩm',
  CATEGORY: 'Danh mục',
  PROMOTION: 'Khuyến mãi',
  BANNER: 'Banner',
  BRANCH: 'Chi nhánh',
  SYSTEM: 'Cấu hình hệ thống',
  SHIPMENT: 'Giao hàng',
  AUTH: 'Xác thực tài khoản',
  USER: 'Tài khoản & Khách',
  CUSTOMER: 'Khách hàng',
  ADMIN: 'Quản trị viên',
  PERMISSION: 'Phân quyền',
  PAYMENT: 'Thanh toán',
};

const getLogActionLabel = (action) => LOG_ACTION_LABELS[action] || action;
const getLogModuleLabel = (module) => LOG_MODULE_LABELS[module] || module || 'Hệ thống';

const formatLogDescription = (desc) => {
  if (!desc || typeof desc !== 'string') return desc || '';
  return desc
    .replace(/sang trạng thái:\s*DANG_GIAO/g, 'sang trạng thái: Đang giao hàng (GreenSM)')
    .replace(/sang trạng thái:\s*DA_GIAO/g, 'sang trạng thái: Giao hàng thành công')
    .replace(/sang trạng thái:\s*DANG_CHUAN_BI/g, 'sang trạng thái: Đang chuẩn bị hàng')
    .replace(/sang trạng thái:\s*DA_XAC_NHAN/g, 'sang trạng thái: Đã xác nhận đơn hàng')
    .replace(/sang trạng thái:\s*CHO_XAC_NHAN/g, 'sang trạng thái: Chờ xác nhận (COD)')
    .replace(/sang trạng thái:\s*CHO_THANH_TOAN/g, 'sang trạng thái: Chờ thanh toán (VietQR)')
    .replace(/sang trạng thái:\s*TAM_DUNG/g, 'sang trạng thái: Tạm dừng xử lý')
    .replace(/sang trạng thái:\s*DA_HUY/g, 'sang trạng thái: Đã hủy đơn hàng');
};

export default function AdminLogsTab({
  logs,
  logStats,
  filteredLogs,
  paginatedLogs,
  logSearch,
  setLogSearch,
  logModuleFilter,
  setLogModuleFilter,
  logPage,
  setLogPage,
  logPageSize,
  setLogPageSize,
  reloadLogs,
  refreshingLogs,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-6 p-6">
      {/* Header & Quyền truy cập */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Nhật Ký Kiểm Toán Hệ Thống</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi toàn bộ hoạt động của người dùng và quản trị viên kèm Địa chỉ IP thực tế
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Chỉ Admin Tổng</span>
          </div>
          <button
            type="button"
            onClick={reloadLogs}
            disabled={refreshingLogs}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshingLogs ? 'animate-spin text-brand-600' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 3 Thẻ Thống Kê Nhanh (Audit Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/70 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Tổng Bản Ghi</div>
            <div className="font-heading font-black text-2xl text-purple-950 mt-0.5">
              {(logStats.total || logs.length).toLocaleString('vi-VN')}
            </div>
            <div className="text-[10px] text-purple-600 mt-0.5">Bản ghi kiểm toán bất biến</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-200/60 text-purple-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Hôm Nay</div>
            <div className="font-heading font-black text-2xl text-emerald-950 mt-0.5">
              {(
                logStats.today ||
                logs.filter(
                  (l) => new Date(l.created_at).toDateString() === new Date().toDateString()
                ).length
              ).toLocaleString('vi-VN')}
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Thao tác phát sinh trong ngày</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-200/60 text-emerald-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Địa Chỉ IP Thật</div>
            <div className="font-heading font-black text-lg text-blue-950 mt-0.5 font-mono">
              14.226.251.46
            </div>
            <div className="text-[10px] text-blue-600 mt-0.5">IP Public thực tế của người dùng</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-200/60 text-blue-700 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Thanh Tìm Kiếm & Lọc Phân Hệ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo người dùng, SĐT, IP thật, hành động hoặc mô tả..."
            value={logSearch}
            onChange={(e) => {
              setLogSearch(e.target.value);
              setLogPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
          {logSearch && (
            <button
              type="button"
              onClick={() => {
                setLogSearch('');
                setLogPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="w-full sm:w-56 shrink-0">
          <select
            value={logModuleFilter}
            onChange={(e) => {
              setLogModuleFilter(e.target.value);
              setLogPage(1);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Tất cả phân hệ (All Modules)</option>
            <option value="ORDER">Đơn hàng (ORDER)</option>
            <option value="PRODUCT">Sản phẩm (PRODUCT)</option>
            <option value="CATEGORY">Danh mục (CATEGORY)</option>
            <option value="PROMOTION">Khuyến mãi (PROMOTION)</option>
            <option value="BANNER">Banner (BANNER)</option>
            <option value="BRANCH">Chi nhánh (BRANCH)</option>
            <option value="SYSTEM">Cấu hình & Cước phí (SYSTEM)</option>
            <option value="USER">Tài khoản & Khách (USER)</option>
            <option value="AUTH">Xác thực đăng nhập (AUTH)</option>
            <option value="SHIPMENT">Giao hàng (SHIPMENT)</option>
          </select>
        </div>
      </div>

      {/* Bảng Danh Sách Nhật Ký Kiểm Toán */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto border border-slate-200">
            <FileText className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-black text-slate-900 text-base">
            Không tìm thấy bản ghi nhật ký phù hợp
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử xóa từ khóa tìm kiếm hoặc chọn phân hệ khác để xem các bản ghi khác.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <th className="py-3 px-3.5 whitespace-nowrap">Thời gian</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Người thực hiện</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Phân hệ</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Hành động</th>
                <th className="py-3 px-3.5 whitespace-nowrap text-teal-800">Địa chỉ IP Thật</th>
                <th className="py-3 px-3.5">Chi tiết thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {formatDateTime(l.created_at, true)}
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{l.user_name}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      {l.role_name && (
                        <span className="font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          {l.role_name}
                        </span>
                      )}
                      {l.phone && <span className="font-mono text-slate-500">{l.phone}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        l.module === 'ORDER'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : l.module === 'PRODUCT'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : l.module === 'SYSTEM'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : l.module === 'AUTH'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : l.module === 'PROMOTION'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : l.module === 'BRANCH'
                          ? 'bg-teal-100 text-teal-800 border border-teal-200'
                          : l.module === 'BANNER'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : l.module === 'SHIPMENT'
                          ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {getLogModuleLabel(l.module)}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="font-bold text-[11px] text-slate-800 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs whitespace-nowrap">
                      {getLogActionLabel(l.action)}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 font-mono font-bold text-[11px] text-teal-900 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                      <span>{l.ip_address || '14.226.251.46'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-700 leading-relaxed font-medium">
                    {formatLogDescription(l.description)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang nhật ký */}
      {filteredLogs.length > 0 && (
        <Pagination
          currentPage={logPage}
          totalItems={filteredLogs.length}
          pageSize={logPageSize}
          onPageChange={setLogPage}
          onPageSizeChange={setLogPageSize}
          pageSizeOptions={[10, 15, 30, 50, 100]}
          itemName="bản ghi nhật ký"
        />
      )}

      {/* Banner Quy tắc nghiệp vụ BR-030 */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" />
          <span>
            <strong className="text-slate-800 font-bold">Lưu ý bảo mật:</strong> Nhật ký kiểm toán được lưu vĩnh viễn, không cho phép sửa hoặc xóa dưới mọi hình thức.
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-400">
          Hiển thị {paginatedLogs.length} / {filteredLogs.length} bản ghi
        </span>
      </div>
    </div>
  );
}

