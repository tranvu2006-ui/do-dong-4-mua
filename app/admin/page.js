'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, ShoppingCart, Package, Users, User, AlertTriangle,
  CheckCircle2, Clock, Truck, Plus, Eye, Edit3, Trash2, RefreshCw,
  ArrowLeft, Filter, Tag, Percent, Image as ImageIcon, MapPin,
  FileText, Play, Pause, XCircle, Search, Upload, Lock, LogOut,
  ExternalLink, ShieldCheck, Leaf, ChevronRight, Sparkles, Store,
  Box, BarChart3, PackageOpen, Layers, UserPlus, Unlock, KeyRound, ShieldAlert, EyeOff, Calendar, RotateCcw, X, Settings, Bell, Send
} from 'lucide-react';
import Pagination from '@/components/Pagination';

// 10 Nhóm chức năng phân quyền cụ thể theo SRS (FR-039 & BR-026)
const SRS_FUNCTIONAL_MODULES = [
  {
    id: 'orders',
    title: 'Quản lý đơn hàng',
    description: 'Xem danh sách, cập nhật trạng thái đơn và tiếp nhận đơn đặt hàng',
    permissionIds: [6, 7, 8],
    permissionNames: ['order.view', 'order.update', 'order.cancel'],
    tabKey: 'orders'
  },
  {
    id: 'inventory',
    title: 'Quản lý tồn kho',
    description: 'Kiểm kê, cảnh báo và cập nhật số lượng tồn kho trái cây chi nhánh',
    permissionIds: [16],
    permissionNames: ['inventory.manage'],
    tabKey: 'products'
  },
  {
    id: 'reports',
    title: 'Quản lý báo cáo doanh thu',
    description: 'Xem thống kê doanh thu, số lượng đơn hàng và biểu đồ kinh doanh',
    permissionIds: [13],
    permissionNames: ['report.view'],
    tabKey: 'reports'
  },
  {
    id: 'promotions',
    title: 'Quản lý chương trình giảm giá',
    description: 'Thiết lập mã giảm giá, voucher và chương trình ưu đãi mùa vụ',
    permissionIds: [10],
    permissionNames: ['promotion.manage'],
    tabKey: 'promotions'
  },
  {
    id: 'customers',
    title: 'Quản lý khách hàng',
    description: 'Tra cứu danh sách khách hàng, điểm tích lũy và thông tin liên hệ',
    permissionIds: [17],
    permissionNames: ['customer.view'],
    tabKey: 'customers'
  },
  {
    id: 'payments',
    title: 'Quản lý thanh toán',
    description: 'Xác nhận và kiểm tra đối soát thanh toán chuyển khoản, MoMo, VNPAY',
    permissionIds: [18],
    permissionNames: ['payment.confirm'],
    tabKey: 'orders'
  },
  {
    id: 'shipments',
    title: 'Quản lý giao hàng GreenSM',
    description: 'Tạo mã vận đơn, theo dõi lộ trình và kết nối tài xế GreenSM',
    permissionIds: [9],
    permissionNames: ['shipment.manage'],
    tabKey: 'orders'
  },
  {
    id: 'categories',
    title: 'Quản lý danh mục',
    description: 'Quản lý nhóm trái cây, phân loại sản phẩm theo mùa vụ',
    permissionIds: [5],
    permissionNames: ['category.manage'],
    tabKey: 'categories'
  },
  {
    id: 'products',
    title: 'Quản lý sản phẩm',
    description: 'Thêm, sửa thông tin, giá bán và hình ảnh trái cây nông sản',
    permissionIds: [1, 2, 3, 4],
    permissionNames: ['product.view', 'product.create', 'product.update', 'product.delete'],
    tabKey: 'products'
  },
  {
    id: 'banners',
    title: 'Quản lý cấu hình banner / website',
    description: 'Cập nhật banner quảng bá, chương trình hiển thị trang chủ',
    permissionIds: [12],
    permissionNames: ['banner.manage'],
    tabKey: 'banners'
  }
];

// Bảng chuyển đổi ngôn ngữ tự nhiên tiếng Việt cho Nhật Ký Kiểm Toán (FR-045)
const LOG_ACTION_LABELS = {
  UPDATE_SETTINGS: 'Cập nhật cấu hình',
  CREATE_PROMOTION: 'Tạo khuyến mãi',
  UPDATE_PROMOTION: 'Cập nhật khuyến mãi',
  DELETE_PROMOTION: 'Xóa khuyến mãi',
  TOGGLE_PROMOTION: 'Bật/Tắt khuyến mãi',
  ASSIGN_PROMOTION_PRODUCTS: 'Gán SP khuyến mãi',
  REMOVE_PROMOTION_PRODUCT: 'Gỡ SP khuyến mãi',
  UPDATE_STATUS: 'Đổi trạng thái đơn',
  CREATE: 'Đặt hàng mới',
  CREATE_ORDER: 'Đặt hàng mới',
  CANCEL: 'Hủy đơn hàng',
  CANCEL_ORDER: 'Hủy đơn hàng',
  ORDER_NOTE: 'Thêm ghi chú đơn',
  CREATE_SHIPMENT: 'Tạo vận đơn GreenSM',
  UPDATE_SHIPMENT: 'Cập nhật giao hàng',
  CREATE_PRODUCT: 'Thêm sản phẩm mới',
  UPDATE_PRODUCT: 'Cập nhật sản phẩm',
  PATCH_PRODUCT: 'Sửa nhanh sản phẩm',
  DELETE_PRODUCT: 'Xóa sản phẩm',
  CREATE_CATEGORY: 'Thêm danh mục mới',
  UPDATE_CATEGORY: 'Cập nhật danh mục',
  DELETE_CATEGORY: 'Xóa danh mục',
  TOGGLE_CATEGORY_STATUS: 'Bật/Tắt danh mục',
  CREATE_BRANCH: 'Thêm chi nhánh',
  UPDATE_BRANCH: 'Cập nhật chi nhánh',
  DELETE_BRANCH: 'Xóa chi nhánh',
  CREATE_BANNER: 'Thêm banner',
  UPDATE_BANNER: 'Cập nhật banner',
  DELETE_BANNER: 'Xóa banner',
  CREATE_ADMIN: 'Thêm quản trị viên',
  UPDATE_ADMIN: 'Sửa thông tin Admin',
  DELETE_ADMIN: 'Xóa quản trị viên',
  ASSIGN_PERMISSIONS: 'Phân quyền quản trị',
  UPDATE_PERMISSIONS: 'Cập nhật phân quyền',
  LOGIN: 'Đăng nhập hệ thống',
  LOGOUT: 'Đăng xuất',
  REGISTER: 'Đăng ký tài khoản',
  AUTO_REGISTER: 'Tự động tạo tài khoản khi mua',
  CHANGE_PASSWORD: 'Đổi mật khẩu',
  RESET_PASSWORD: 'Đặt lại mật khẩu',
  FORGOT_PASSWORD: 'Quên mật khẩu',
  UPDATE_PROFILE: 'Cập nhật hồ sơ',
  PAYMENT_WEBHOOK: 'Xác nhận thanh toán',
  CREATE_SHIPPING_FEE: 'Thêm nấc cước phí',
  UPDATE_SHIPPING_FEE: 'Cập nhật nấc cước phí',
  DELETE_SHIPPING_FEE: 'Xóa nấc cước phí',
  CREATE_NOTIFICATION: 'Gửi thông báo',
  DELETE_NOTIFICATION: 'Xóa thông báo'
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
  PAYMENT: 'Thanh toán'
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

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'categories', 'promotions', 'branches', 'banners', 'admins', 'customers', 'logs', 'reports'
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [adminPhone, setAdminPhone] = useState('0929894248');
  const [adminPassword, setAdminPassword] = useState('123456');
  const [loginError, setLoginError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(tab);
      }
      const saved = localStorage.getItem('dodong4mua_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && (u.isAdmin || u.role_id === 1 || u.role_id === 2)) {
          setCurrentUser(u);
          if (u.role_id === 2) {
            fetch(`/api/admin/permissions?user_id=${u.id}`)
              .then((res) => res.json())
              .then((data) => {
                if (data.success && data.data) {
                  const assignedIds = data.data.user_permission_ids || [];
                  const permNames = [];
                  SRS_FUNCTIONAL_MODULES.forEach((m) => {
                    if (m.permissionIds.some((id) => assignedIds.includes(id))) {
                      permNames.push(...m.permissionNames);
                    }
                  });
                  const updated = { ...u, permissions: Array.from(new Set(permNames)) };
                  setCurrentUser(updated);
                  localStorage.setItem('dodong4mua_user', JSON.stringify(updated));
                }
              })
              .catch(() => { });
          }
        }
      }
    } catch (e) { }
    setCheckingAuth(false);
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!adminPhone || !adminPhone.trim()) {
      setLoginError('Vui lòng nhập số điện thoại Quản Trị!');
      return;
    }
    if (!adminPassword) {
      setLoginError('Vui lòng nhập mật khẩu Quản Trị!');
      return;
    }
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: adminPhone, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.user.isAdmin || data.user.role_id === 1 || data.user.role_id === 2) {
          localStorage.setItem('dodong4mua_user', JSON.stringify(data.user));
          setCurrentUser(data.user);
          window.dispatchEvent(new Event('auth-change'));
          loadData();
        } else {
          setLoginError('Tài khoản này là Khách Hàng, không có quyền truy cập trang Quản Trị!');
        }
      } else {
        setLoginError(data.message || 'Số điện thoại hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setLoginError('Lỗi kết nối máy chủ: ' + err.message);
    }
  };

  const handleAdminLogout = async () => {
    try {
      if (currentUser?.id) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id, phone: currentUser.phone })
        });
      }
    } catch (e) {
      console.warn('Lỗi gọi API đăng xuất admin:', e);
    }
    localStorage.removeItem('dodong4mua_user');
    setCurrentUser(null);
    window.dispatchEvent(new Event('auth-change'));
  };

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [banners, setBanners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStartDate, setOrderStartDate] = useState('');
  const [orderEndDate, setOrderEndDate] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('');

  // Promotions filter & pagination states
  const [promotionSearch, setPromotionSearch] = useState('');
  const [promotionStatusFilter, setPromotionStatusFilter] = useState('');
  const [promotionPage, setPromotionPage] = useState(1);
  const [promotionPageSize, setPromotionPageSize] = useState(10);

  useEffect(() => {
    setPromotionPage(1);
  }, [promotionSearch, promotionStatusFilter]);

  // Pagination states (Chuẩn KhoHang_JAVA: phân trang trượt + ô nhảy trang "Nhập...")
  const [productPage, setProductPage] = useState(1);
  const [productPageSize, setProductPageSize] = useState(10);
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(10);
  const [customerPage, setCustomerPage] = useState(1);
  const [customerPageSize, setCustomerPageSize] = useState(10);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('');
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [loadingCustomerDetail, setLoadingCustomerDetail] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [logPageSize, setLogPageSize] = useState(15);
  const [logSearch, setLogSearch] = useState('');
  const [logModuleFilter, setLogModuleFilter] = useState('ALL');
  const [logStats, setLogStats] = useState({ total: 0, today: 0, uniqueIps: 0 });
  const [refreshingLogs, setRefreshingLogs] = useState(false);

  useEffect(() => {
    setProductPage(1);
  }, [productSearch, productCategoryFilter, productStatusFilter]);

  useEffect(() => {
    setOrderPage(1);
  }, [orderStatusFilter, orderSearch, orderStartDate, orderEndDate]);

  // Order Detail Modal (FR-030)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState({
    isOpen: false,
    product: null,
    name: '',
    category_id: 1,
    price: '',
    discount_price: '',
    unit: 'kg',
    stock: 0,
    thumbnail: '',
    description: '',
    is_featured: 0,
    status: 1,
  });
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddPromotionModal, setShowAddPromotionModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [branchSearch, setBranchSearch] = useState('');
  const [branchStatusFilter, setBranchStatusFilter] = useState('');
  const [editingBranch, setEditingBranch] = useState(null);
  const [deletingBranch, setDeletingBranch] = useState(null);
  const [toggleStatusBranch, setToggleStatusBranch] = useState(null);
  const [bannerSearch, setBannerSearch] = useState('');
  const [bannerStatusFilter, setBannerStatusFilter] = useState('');
  const [editingBanner, setEditingBanner] = useState(null);
  const [deletingBanner, setDeletingBanner] = useState(null);

  // Quản lý cấu hình website (FR-043)
  const [siteSettings, setSiteSettings] = useState({
    site_name: '',
    logo_url: '',
    hotline: '',
    contact_email: '',
    company_address: '',
    default_shipping_fee: '25000',
    freeship_threshold: '500000',
    shipping_partner: 'GreenSM',
    exchange_policy: '',
    shipping_policy: '',
    privacy_policy: '',
    terms_of_service: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Quản lý phí vận chuyển theo khoảng cách (FR-044 & BR-023)
  const [shippingFees, setShippingFees] = useState([]);
  const [showAddShippingFeeModal, setShowAddShippingFeeModal] = useState(false);
  const [newShippingFee, setNewShippingFee] = useState({ name: '', min_km: '', max_km: '', fee: '' });
  const [editingShippingFee, setEditingShippingFee] = useState(null);
  const [deletingShippingFee, setDeletingShippingFee] = useState(null);

  // Quản lý thông báo hệ thống (FR-046)
  const [notifications, setNotifications] = useState([]);
  const [notificationSearch, setNotificationSearch] = useState('');
  const [notificationRecipientFilter, setNotificationRecipientFilter] = useState('ALL_FILTER');
  const [notificationPage, setNotificationPage] = useState(1);
  const [notificationPageSize, setNotificationPageSize] = useState(10);
  const [showCreateNotificationModal, setShowCreateNotificationModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    content: '',
    recipient_type: 'ALL',
  });
  const [sendingNotification, setSendingNotification] = useState(false);
  const [deletingNotification, setDeletingNotification] = useState(null);
  const [selectedNotificationDetail, setSelectedNotificationDetail] = useState(null);
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  // Quản lý tài khoản Admin & Phân quyền chức năng
  const [editAdminModal, setEditAdminModal] = useState({
    isOpen: false,
    admin: null,
    full_name: '',
    phone: '',
    branch_id: 1,
  });
  const [resetPasswordModal, setResetPasswordModal] = useState({
    isOpen: false,
    admin: null,
    password: '',
    confirm_password: '',
  });
  const [permissionModal, setPermissionModal] = useState({
    isOpen: false,
    admin: null,
    selectedIds: [],
    loading: false,
    saving: false,
  });
  const [editCategoryModal, setEditCategoryModal] = useState({
    isOpen: false,
    category: null,
    name: '',
    description: '',
  });
  const [editPromotionModal, setEditPromotionModal] = useState({
    isOpen: false,
    promotion: null,
    title: '',
    description: '',
    discount_percent: 10,
    start_date: '',
    end_date: '',
    status: 1,
  });
  const [assignProductsModal, setAssignProductsModal] = useState({
    isOpen: false,
    promotion: null,
    assignedProducts: [],
    selectedProductId: '',
    loading: false,
    conflictError: '',
  });

  // Form states
  const [newAdmin, setNewAdmin] = useState({
    full_name: '', phone: '', password: '', branch_id: 1, role_id: 2
  });
  const [newProduct, setNewProduct] = useState({
    name: '', category_id: 1, price: '', discount_price: '', unit: 'kg', stock: 50,
    thumbnail: '', description: '', is_featured: 1
  });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    description: '',
    discount_percent: 10,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });
  const [newBranch, setNewBranch] = useState({ branch_name: '', phone: '', address: '' });
  const [newBanner, setNewBanner] = useState({ title: '', image_url: '', link_url: '/', display_order: 1 });
  const [uploadingImage, setUploadingImage] = useState(false);

  // In-App Notification & Modern Confirm Dialog States (thay thế alert/confirm native)
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy bỏ',
    type: 'warning',
    onConfirm: null
  });

  // Modal xác nhận thao tác Đơn hàng (Đổi trạng thái, Tạm dừng, Tiếp tục, Hủy đơn - Chuẩn giao diện Đổ Đống 4 Mùa)
  const [orderActionModal, setOrderActionModal] = useState({
    isOpen: false,
    actionType: 'STATUS', // 'STATUS' | 'PAUSE' | 'RESUME' | 'CANCEL'
    order: null,
    title: '',
    message: '',
    targetStatus: null,
    targetShippingStatus: null,
    targetPaymentStatus: null,
    statusLabel: '',
    reason: '',
    requireReason: false,
    confirmText: 'Xác nhận',
    confirmColor: 'bg-brand-600 hover:bg-brand-700',
    iconType: 'status'
  });

  // Modal xác nhận thao tác Tài khoản (Chuẩn KhoHang_JAVA: lockModal, unlockModal, deleteModal)
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    actionType: 'lock', // 'lock' | 'unlock' | 'delete'
    targetUser: null,
  });

  const requestConfirm = ({ title, message, confirmText = 'Xác nhận', cancelText = 'Hủy bỏ', type = 'warning', onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm
    });
  };

  // Xử lý Upload Ảnh từ máy tính chuẩn SRS (JPG, PNG, WEBP <= 5MB)
  const handleFileUpload = async (e, type = 'product') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast(`Dung lượng ảnh (${(file.size / (1024 * 1024)).toFixed(2)} MB) vượt quá giới hạn 5 MB!`, 'warning');
      e.target.value = '';
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'webp'];
    if (!allowed.includes(ext)) {
      showToast('Định dạng không hợp lệ! Vui lòng chọn file ảnh có đuôi .jpg, .png hoặc .webp.', 'warning');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (type === 'product') {
          // Xóa ảnh tạm cũ nếu người dùng chọn đổi ảnh khác trước khi bấm Lưu
          if (newProduct.thumbnail && newProduct.thumbnail.startsWith('/uploads/')) {
            fetch(`/api/upload?url=${encodeURIComponent(newProduct.thumbnail)}`, { method: 'DELETE' }).catch(() => {});
          }
          setNewProduct((prev) => ({ ...prev, thumbnail: data.url }));
        } else if (type === 'edit_product') {
          // Xóa ảnh vừa upload đè trước đó nếu đổi ảnh tiếp trong cùng 1 phiên sửa
          if (editProductModal.tempUploaded && editProductModal.tempUploaded.startsWith('/uploads/')) {
            fetch(`/api/upload?url=${encodeURIComponent(editProductModal.tempUploaded)}`, { method: 'DELETE' }).catch(() => {});
          }
          setEditProductModal((prev) => ({ ...prev, thumbnail: data.url, tempUploaded: data.url }));
        } else if (type === 'product_extra') {
          handleAddExtraImage(data.url);
        } else if (type === 'banner') {
          if (newBanner.image_url && newBanner.image_url.startsWith('/uploads/')) {
            fetch(`/api/upload?url=${encodeURIComponent(newBanner.image_url)}`, { method: 'DELETE' }).catch(() => {});
          }
          setNewBanner((prev) => ({ ...prev, image_url: data.url }));
        } else if (type === 'edit_banner') {
          if (editingBanner && editingBanner.tempUploaded && editingBanner.tempUploaded.startsWith('/uploads/')) {
            fetch(`/api/upload?url=${encodeURIComponent(editingBanner.tempUploaded)}`, { method: 'DELETE' }).catch(() => {});
          }
          setEditingBanner((prev) => prev ? ({ ...prev, image_url: data.url, tempUploaded: data.url }) : prev);
        } else if (type === 'settings_logo') {
          setSiteSettings((prev) => ({ ...prev, logo_url: data.url }));
        }
      } else {
        showToast(data.message || 'Lỗi khi upload ảnh', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối tải ảnh: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        statsRes, ordersRes, prodsRes, catsRes,
        promosRes, branchesRes, bannersRes, custsRes, logsRes, usersRes, settingsRes, shippingFeesRes, notificationsRes
      ] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/orders?limit=100${orderStatusFilter ? `&status=${orderStatusFilter}` : ''}${orderSearch ? `&search=${encodeURIComponent(orderSearch)}` : ''}${orderStartDate ? `&startDate=${orderStartDate}` : ''}${orderEndDate ? `&endDate=${orderEndDate}` : ''}`),
        fetch('/api/products?all=1&limit=200'),
        fetch('/api/categories?all=1'),
        fetch('/api/promotions?all=1'),
        fetch('/api/branches?all=true'),
        fetch('/api/banners?all=true'),
        fetch('/api/admin/customers'),
        fetch('/api/admin/logs'),
        fetch('/api/admin/users'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/shipping-fees'),
        fetch('/api/admin/notifications'),
      ]);

      const [
        statsData, ordersData, prodsData, catsData,
        promosData, branchesData, bannersData, custsData, logsData, usersData,
        settingsData, shippingFeesData, notificationsData
      ] = await Promise.all([
        statsRes.json(), ordersRes.json(), prodsRes.json(), catsRes.json(),
        promosRes.json(), branchesRes.json(), bannersRes.json(), custsRes.json(), logsRes.json(), usersRes.json(), settingsRes.json(), shippingFeesRes.json(), notificationsRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (ordersData.success) setOrders(ordersData.data);
      if (prodsData.success) setProducts(prodsData.data);
      if (catsData.success) setCategories(catsData.data);
      if (promosData.success) setPromotions(promosData.data);
      if (branchesData.success) setBranches(branchesData.data);
      if (bannersData.success) setBanners(bannersData.data);
      if (custsData.success) setCustomers(custsData.data);
      if (logsData.success) {
        setLogs(logsData.data);
        if (logsData.stats) setLogStats(logsData.stats);
      }
      if (usersData.success) setAdminUsers(usersData.data);
      if (settingsData && settingsData.success) setSiteSettings(settingsData.data);
      if (shippingFeesData && shippingFeesData.success) setShippingFees(shippingFeesData.data);
      if (notificationsData && notificationsData.success) setNotifications(notificationsData.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, orderStatusFilter, orderSearch, orderStartDate, orderEndDate]);

  // Kiểm tra quyền hạn truy cập tab chức năng (BR-026 & FR-039)
  const hasPermissionForTab = (tabKey) => {
    if (!currentUser) return false;
    if (currentUser.role_id === 1) return true;

    // Các tab chỉ dành riêng cho Admin Tổng
    if (['admins', 'branches', 'logs', 'settings', 'notifications'].includes(tabKey)) {
      return false;
    }

    const perms = currentUser.permissions || [];
    if (perms.includes('*')) return true;

    switch (tabKey) {
      case 'orders':
        return perms.some((p) =>
          ['order.view', 'order.update', 'order.cancel', 'shipment.manage', 'payment.confirm'].includes(p)
        );
      case 'reports':
        return perms.includes('report.view');
      case 'products':
        return perms.some((p) =>
          ['product.view', 'product.create', 'product.update', 'product.delete', 'inventory.manage'].includes(p)
        );
      case 'categories':
        return perms.includes('category.manage');
      case 'promotions':
        return perms.includes('promotion.manage');
      case 'banners':
        return perms.includes('banner.manage');
      case 'customers':
        return perms.includes('customer.view');
      default:
        return false;
    }
  };

  // Tự động chuyển về tab được cấp phép nếu URL cố tình truy cập tab bị cấm (Activity Diagram 6.7.10)
  useEffect(() => {
    if (currentUser && !hasPermissionForTab(activeTab)) {
      const allTabs = ['orders', 'products', 'categories', 'promotions', 'reports', 'banners', 'customers'];
      const firstAllowed = allTabs.find((t) => hasPermissionForTab(t));
      if (firstAllowed) {
        setActiveTab(firstAllowed);
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `?tab=${firstAllowed}`);
        }
      }
    }
  }, [currentUser, activeTab]);

  const handleViewOrderDetail = async (orderItem) => {
    setSelectedOrder(orderItem);
    setLoadingOrderDetail(true);
    try {
      const res = await fetch(`/api/orders/${orderItem.order_code}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedOrder(data.data);
      }
    } catch (err) {
      console.error('Lỗi tải chi tiết đơn hàng:', err);
    } finally {
      setLoadingOrderDetail(false);
    }
  };

  const handleUpdateOrderStatus = async (orderCode, newOrderStatus, newShippingStatus = null, newPaymentStatus = null, reason = null) => {
    try {
      const body = {};
      if (newOrderStatus) body.order_status = newOrderStatus;
      if (newShippingStatus) body.shipping_status = newShippingStatus;
      if (newPaymentStatus) body.payment_status = newPaymentStatus;
      if (reason) body.reason = reason;

      const res = await fetch(`/api/orders/${orderCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Cập nhật trạng thái đơn hàng thành công!');
        loadData();
        setSelectedOrder((prev) => {
          if (!prev || prev.order_code !== orderCode) return prev;
          return {
            ...prev,
            ...(newOrderStatus ? { order_status: newOrderStatus } : {}),
            ...(newShippingStatus ? { shipping_status: newShippingStatus } : {}),
            ...(newPaymentStatus ? { payment_status: newPaymentStatus } : {}),
          };
        });
      } else {
        showToast(data.message || 'Cập nhật thất bại', 'error');
      }
    } catch (e) {
      showToast('Có lỗi xảy ra: ' + e.message, 'error');
    }
  };

  // 1. Mở modal Đổi trạng thái với thông báo & xác nhận rõ ràng
  const promptChangeOrderStatus = (order, newStatus, newShippingStatus = null, label = 'Duyệt đơn') => {
    let color = 'bg-brand-600 hover:bg-brand-700';
    if (newStatus === 'DA_XAC_NHAN') color = 'bg-purple-600 hover:bg-purple-700';
    else if (newStatus === 'DANG_CHUAN_BI') color = 'bg-blue-600 hover:bg-blue-700';
    else if (newStatus === 'DANG_GIAO') color = 'bg-teal-600 hover:bg-teal-700';
    else if (newStatus === 'DA_GIAO') color = 'bg-emerald-600 hover:bg-emerald-700';

    const statusNames = {
      DA_XAC_NHAN: 'Đã xác nhận',
      DANG_CHUAN_BI: 'Đang chuẩn bị đóng gói',
      DANG_GIAO: 'Đang giao (Bàn giao GreenSM)',
      DA_GIAO: 'Đã giao (Hoàn tất đơn hàng)',
    };

    setOrderActionModal({
      isOpen: true,
      actionType: 'STATUS',
      order,
      title: `Xác Nhận ${label}`,
      message: `Bạn có chắc chắn muốn chuyển đơn hàng #${order.order_code} sang trạng thái "${statusNames[newStatus] || newStatus}" không?`,
      targetStatus: newStatus,
      targetShippingStatus: newShippingStatus,
      targetPaymentStatus: null,
      statusLabel: label,
      reason: '',
      requireReason: false,
      confirmText: `Xác nhận ${label}`,
      confirmColor: color,
      iconType: 'status'
    });
  };

  // 2. Mở modal Tạm dừng (FR-034: có ô nhập lý do)
  const promptPauseOrder = (order) => {
    setOrderActionModal({
      isOpen: true,
      actionType: 'PAUSE',
      order,
      title: 'Tạm Dừng Xử Lý Đơn Hàng (FR-034)',
      message: `Tạm dừng đơn hàng #${order.order_code} khi có sự cố phát sinh. Vui lòng nhập lý do cụ thể (lý do này sẽ hiển thị cho khách hàng và lưu vết hệ thống):`,
      targetStatus: 'TAM_DUNG',
      targetShippingStatus: null,
      targetPaymentStatus: null,
      statusLabel: 'Tạm dừng',
      reason: 'Hết hàng tạm thời, chờ bổ sung đợt mới',
      requireReason: true,
      confirmText: 'Xác nhận Tạm dừng',
      confirmColor: 'bg-amber-500 hover:bg-amber-600',
      iconType: 'pause'
    });
  };

  // 3. Mở modal Tiếp tục xử lý (FR-035)
  const promptResumeOrder = (order) => {
    setOrderActionModal({
      isOpen: true,
      actionType: 'RESUME',
      order,
      title: 'Tiếp Tục Xử Lý Đơn Hàng (FR-035)',
      message: `Xác nhận đã khắc phục xong sự cố và tiếp tục xử lý đơn hàng #${order.order_code}? Đơn sẽ được chuyển về khâu Đang chuẩn bị đóng gói.`,
      targetStatus: 'DANG_CHUAN_BI',
      targetShippingStatus: null,
      targetPaymentStatus: null,
      statusLabel: 'Tiếp tục',
      reason: 'Đã giải quyết sự cố, tiếp tục đóng gói',
      requireReason: false,
      confirmText: 'Tiếp tục xử lý',
      confirmColor: 'bg-blue-600 hover:bg-blue-700',
      iconType: 'resume'
    });
  };

  // 4. Mở modal Hủy đơn hàng (FR-028 & BR-020)
  const promptCancelOrder = (order) => {
    setOrderActionModal({
      isOpen: true,
      actionType: 'CANCEL',
      order,
      title: 'Xác Nhận Hủy Đơn Hàng (BR-020)',
      message: `Cảnh báo: Hành động này sẽ hủy đơn hàng #${order.order_code} và tự động hoàn trả số lượng quả vào kho. Vui lòng nhập lý do hủy:`,
      targetStatus: 'DA_HUY',
      targetShippingStatus: null,
      targetPaymentStatus: null,
      statusLabel: 'Hủy đơn',
      reason: 'Khách hàng yêu cầu hủy đơn',
      requireReason: true,
      confirmText: 'Xác nhận Hủy Đơn',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      iconType: 'cancel'
    });
  };

  // Thực thi thao tác từ modal
  const executeOrderActionModal = async () => {
    const { actionType, order, targetStatus, targetShippingStatus, targetPaymentStatus, reason, requireReason } = orderActionModal;
    if (!order) return;

    if (requireReason && (!reason || !reason.trim())) {
      showToast('Vui lòng nhập lý do để tiếp tục!', 'warning');
      return;
    }

    setOrderActionModal((prev) => ({ ...prev, isOpen: false }));

    if (actionType === 'CANCEL') {
      try {
        const res = await fetch(`/api/orders/${order.order_code}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'CANCEL', reason: reason ? reason.trim() : 'Quản trị viên hủy đơn' }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message || 'Đã hủy đơn hàng thành công!', 'success');
          loadData();
          setSelectedOrder((prev) => prev && prev.order_code === order.order_code ? { ...prev, order_status: 'DA_HUY' } : prev);
        } else {
          showToast(data.message || 'Hủy đơn thất bại', 'error');
        }
      } catch (e) {
        showToast('Lỗi kết nối: ' + e.message, 'error');
      }
      return;
    }

    // STATUS, PAUSE, RESUME
    handleUpdateOrderStatus(
      order.order_code,
      targetStatus,
      targetShippingStatus,
      targetPaymentStatus,
      reason ? reason.trim() : null
    );
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.name.trim()) {
      showToast('Vui lòng nhập tên trái cây!', 'warning');
      return;
    }
    if (!newProduct.price || isNaN(parseFloat(newProduct.price)) || parseFloat(newProduct.price) <= 0) {
      showToast('Vui lòng nhập giá bán hợp lệ lớn hơn 0đ!', 'warning');
      return;
    }
    if (newProduct.stock === '' || isNaN(parseInt(newProduct.stock, 10)) || parseInt(newProduct.stock, 10) < 0) {
      showToast('Vui lòng nhập số lượng tồn kho hợp lệ (≥ 0)!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          discount_price: newProduct.discount_price ? parseFloat(newProduct.discount_price) : null,
          stock: parseInt(newProduct.stock, 10),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddProductModal(false);
        setNewProduct({
          name: '', category_id: 1, price: '', discount_price: '', unit: 'kg', stock: 50,
          thumbnail: '', description: '', is_featured: 1
        });
        showToast('Thêm sản phẩm mới thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm sản phẩm', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const openEditProductModal = async (p) => {
    setEditProductModal({
      isOpen: true,
      product: p,
      name: p.name,
      category_id: p.category_id,
      price: p.price,
      discount_price: p.discount_price !== null && p.discount_price !== undefined ? p.discount_price : '',
      unit: p.unit || 'kg',
      stock: p.stock !== undefined ? p.stock : 0,
      thumbnail: p.thumbnail || '',
      description: p.description || '',
      is_featured: p.is_featured ? 1 : 0,
      status: p.status !== undefined ? p.status : 1,
      extraImages: [],
      loadingImages: true,
    });

    try {
      const res = await fetch(`/api/products/${p.id}/images`);
      const data = await res.json();
      if (data.success) {
        setEditProductModal((prev) => ({ ...prev, extraImages: data.data || [], loadingImages: false }));
      } else {
        setEditProductModal((prev) => ({ ...prev, loadingImages: false }));
      }
    } catch {
      setEditProductModal((prev) => ({ ...prev, loadingImages: false }));
    }
  };

  const handleAddExtraImage = async (imageUrl) => {
    if (!editProductModal.product || !imageUrl) return;
    try {
      const res = await fetch(`/api/products/${editProductModal.product.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, display_order: editProductModal.extraImages.length + 1 }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Thêm ảnh phụ thành công!', 'success');
        setEditProductModal((prev) => ({
          ...prev,
          extraImages: [...prev.extraImages, data.data],
        }));
      } else {
        showToast(data.message || 'Lỗi thêm ảnh phụ', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleDeleteExtraImage = async (imageId) => {
    if (!editProductModal.product) return;
    try {
      const res = await fetch(`/api/products/${editProductModal.product.id}/images?image_id=${imageId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Đã xóa ảnh phụ!', 'success');
        setEditProductModal((prev) => ({
          ...prev,
          extraImages: prev.extraImages.filter((img) => img.id !== imageId),
        }));
      } else {
        showToast(data.message || 'Lỗi xóa ảnh', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    if (!editProductModal.product) return;

    if (!editProductModal.name || !editProductModal.name.trim()) {
      showToast('Vui lòng nhập tên trái cây!', 'warning');
      return;
    }

    const price = parseFloat(editProductModal.price);
    if (!editProductModal.price || isNaN(price) || price <= 0) {
      showToast('Giá bán của sản phẩm phải lớn hơn 0đ!', 'warning');
      return;
    }

    const discountPrice = editProductModal.discount_price !== '' && editProductModal.discount_price !== null ? parseFloat(editProductModal.discount_price) : null;
    if (discountPrice !== null && (isNaN(discountPrice) || discountPrice < 0 || discountPrice >= price)) {
      showToast('Giá khuyến mãi phải nhỏ hơn giá bán gốc và không được âm!', 'warning');
      return;
    }

    const stock = parseInt(editProductModal.stock, 10);
    if (isNaN(stock) || stock < 0) {
      showToast('Số lượng tồn kho không được âm!', 'warning');
      return;
    }

    try {
      const res = await fetch(`/api/products/${editProductModal.product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editProductModal.name.trim(),
          category_id: parseInt(editProductModal.category_id, 10),
          price,
          discount_price: discountPrice,
          unit: editProductModal.unit,
          stock,
          thumbnail: editProductModal.thumbnail,
          description: editProductModal.description,
          is_featured: editProductModal.is_featured ? 1 : 0,
          status: editProductModal.status ? 1 : 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Cập nhật thông tin sản phẩm thành công!', 'success');
        setEditProductModal({
          isOpen: false,
          product: null,
          name: '',
          category_id: 1,
          price: '',
          discount_price: '',
          unit: 'kg',
          stock: 0,
          thumbnail: '',
          description: '',
          is_featured: 0,
          status: 1,
        });
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật sản phẩm', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    }
  };

  const handleToggleProductStatus = async (p) => {
    const newStatus = p.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(newStatus === 1 ? `Đã hiển thị sản phẩm "${p.name}"!` : `Đã ẩn sản phẩm "${p.name}"!`, 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật trạng thái', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    }
  };

  const handleDeleteProduct = async (p) => {
    if (p.order_count > 0) {
      showToast(
        `Sản phẩm "${p.name}" đã có ${p.order_count} đơn hàng liên kết trong lịch sử. Theo quy định toàn vẹn dữ liệu, không thể xóa vĩnh viễn mà chỉ được phép ẩn sản phẩm!`,
        'warning'
      );
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "${p.name}"? Thao tác này không thể hoàn tác!`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã xóa sản phẩm thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa sản phẩm', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.name.trim()) {
      showToast('Vui lòng nhập tên danh mục!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          description: newCategory.description ? newCategory.description.trim() : '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddCategoryModal(false);
        setNewCategory({ name: '', description: '' });
        showToast('Thêm danh mục mới thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm danh mục', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const openEditCategoryModal = (cat) => {
    setEditCategoryModal({
      isOpen: true,
      category: cat,
      name: cat.name,
      description: cat.description || '',
    });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryModal.category) return;
    if (!editCategoryModal.name || !editCategoryModal.name.trim()) {
      showToast('Vui lòng nhập tên danh mục!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editCategoryModal.category.id,
          name: editCategoryModal.name.trim(),
          description: editCategoryModal.description ? editCategoryModal.description.trim() : '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditCategoryModal({ isOpen: false, category: null, name: '', description: '' });
        showToast(data.message || 'Cập nhật danh mục thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật danh mục', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleToggleCategoryStatus = async (cat) => {
    const newStatus = cat.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Cập nhật trạng thái danh mục thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật trạng thái', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (cat.product_count > 0) {
      showToast(
        `Danh mục "${cat.name}" đang có ${cat.product_count} sản phẩm liên kết. Không thể xóa mà chỉ được phép ẩn!`,
        'warning'
      );
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn danh mục "${cat.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories?id=${cat.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã xóa danh mục thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa danh mục', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    if (!newPromotion.title || !newPromotion.title.trim()) {
      showToast('Vui lòng nhập tên chương trình khuyến mãi!', 'warning');
      return;
    }
    const percent = parseInt(newPromotion.discount_percent, 10);
    if (!percent || isNaN(percent) || percent <= 0 || percent > 100) {
      showToast('Phần trăm giảm phải từ 1% đến 100%!', 'warning');
      return;
    }
    if (!newPromotion.start_date || !newPromotion.end_date) {
      showToast('Vui lòng chọn ngày bắt đầu và ngày kết thúc!', 'warning');
      return;
    }
    if (new Date(newPromotion.end_date) < new Date(newPromotion.start_date)) {
      showToast('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromotion),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddPromotionModal(false);
        setNewPromotion({
          title: '',
          description: '',
          discount_percent: 10,
          start_date: new Date().toISOString().slice(0, 10),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        });
        showToast('Thêm chương trình khuyến mãi thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm khuyến mãi', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const openEditPromotionModal = (pr) => {
    setEditPromotionModal({
      isOpen: true,
      promotion: pr,
      title: pr.title || '',
      description: pr.description || '',
      discount_percent: pr.discount_percent || 10,
      start_date: pr.start_date ? new Date(pr.start_date).toISOString().slice(0, 10) : '',
      end_date: pr.end_date ? new Date(pr.end_date).toISOString().slice(0, 10) : '',
      status: pr.status !== undefined ? pr.status : 1,
    });
  };

  const handleUpdatePromotion = async (e) => {
    e.preventDefault();
    if (!editPromotionModal.promotion) return;
    if (!editPromotionModal.title || !editPromotionModal.title.trim()) {
      showToast('Vui lòng nhập tên chương trình!', 'warning');
      return;
    }
    const percent = parseInt(editPromotionModal.discount_percent, 10);
    if (!percent || isNaN(percent) || percent <= 0 || percent > 100) {
      showToast('Phần trăm giảm phải từ 1% đến 100%!', 'warning');
      return;
    }
    if (!editPromotionModal.start_date || !editPromotionModal.end_date) {
      showToast('Vui lòng chọn ngày bắt đầu và kết thúc!', 'warning');
      return;
    }
    if (new Date(editPromotionModal.end_date) < new Date(editPromotionModal.start_date)) {
      showToast('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!', 'warning');
      return;
    }
    try {
      const res = await fetch(`/api/promotions/${editPromotionModal.promotion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editPromotionModal.title.trim(),
          description: editPromotionModal.description?.trim() || '',
          discount_percent: percent,
          start_date: editPromotionModal.start_date,
          end_date: editPromotionModal.end_date,
          status: editPromotionModal.status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditPromotionModal({ isOpen: false, promotion: null, title: '', description: '', discount_percent: 10, start_date: '', end_date: '', status: 1 });
        showToast(data.message || 'Cập nhật khuyến mãi thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật khuyến mãi', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleTogglePromotionStatus = async (pr) => {
    const newStatus = pr.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/promotions/${pr.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(newStatus === 1 ? `Đã kích hoạt chương trình "${pr.title}"!` : `Đã dừng chương trình "${pr.title}"!`, 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật trạng thái', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleDeletePromotion = async (pr) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chương trình khuyến mãi "${pr.title}"? Tất cả sản phẩm đang áp dụng sẽ tự động được xóa giá khuyến mãi về giá gốc.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/promotions/${pr.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã xóa chương trình khuyến mãi!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa khuyến mãi', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const openAssignProductsModal = async (pr) => {
    setAssignProductsModal({
      isOpen: true,
      promotion: pr,
      assignedProducts: [],
      selectedProductId: '',
      loading: true,
      conflictError: '',
    });
    try {
      const res = await fetch(`/api/promotions/${pr.id}/products`);
      const data = await res.json();
      if (data.success) {
        setAssignProductsModal(prev => ({
          ...prev,
          assignedProducts: data.data || [],
          loading: false,
        }));
      } else {
        setAssignProductsModal(prev => ({ ...prev, loading: false }));
        showToast(data.message || 'Lỗi tải danh sách sản phẩm', 'error');
      }
    } catch (e) {
      setAssignProductsModal(prev => ({ ...prev, loading: false }));
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleAddProductToPromotion = async (e) => {
    e.preventDefault();
    if (!assignProductsModal.selectedProductId) {
      showToast('Vui lòng chọn một sản phẩm cần gán vào khuyến mãi!', 'warning');
      return;
    }
    setAssignProductsModal(prev => ({ ...prev, conflictError: '' }));
    try {
      const pId = parseInt(assignProductsModal.selectedProductId, 10);
      const res = await fetch(`/api/promotions/${assignProductsModal.promotion.id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_ids: [pId] }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã thêm sản phẩm vào chương trình khuyến mãi!', 'success');
        const refreshRes = await fetch(`/api/promotions/${assignProductsModal.promotion.id}/products`);
        const refreshData = await refreshRes.json();
        setAssignProductsModal(prev => ({
          ...prev,
          assignedProducts: refreshData.data || [],
          selectedProductId: '',
          conflictError: '',
        }));
        loadData();
      } else {
        setAssignProductsModal(prev => ({ ...prev, conflictError: data.message || 'Lỗi gán sản phẩm' }));
        showToast(data.message || 'Không thể gán sản phẩm!', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleRemoveProductFromPromotion = async (productId, productName) => {
    if (!window.confirm(`Gỡ sản phẩm "${productName}" khỏi chương trình khuyến mãi? Giá bán của sản phẩm sẽ trở lại giá gốc.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/promotions/${assignProductsModal.promotion.id}/products?product_id=${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã gỡ sản phẩm khỏi khuyến mãi!', 'success');
        const refreshRes = await fetch(`/api/promotions/${assignProductsModal.promotion.id}/products`);
        const refreshData = await refreshRes.json();
        setAssignProductsModal(prev => ({
          ...prev,
          assignedProducts: refreshData.data || [],
        }));
        loadData();
      } else {
        showToast(data.message || 'Lỗi gỡ sản phẩm', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!newBranch.branch_name || !newBranch.branch_name.trim()) {
      showToast('Vui lòng nhập tên chi nhánh!', 'warning');
      return;
    }
    if (!newBranch.phone || !newBranch.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại chi nhánh!', 'warning');
      return;
    }
    if (!newBranch.address || !newBranch.address.trim()) {
      showToast('Vui lòng nhập địa chỉ chi nhánh!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBranch),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddBranchModal(false);
        setNewBranch({ branch_name: '', phone: '', address: '' });
        showToast('Thêm chi nhánh mới thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm chi nhánh', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };
  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    if (!editingBranch) return;
    if (!editingBranch.branch_name || !editingBranch.branch_name.trim()) {
      showToast('Vui lòng nhập tên chi nhánh!', 'warning');
      return;
    }
    if (!editingBranch.phone || !editingBranch.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại chi nhánh!', 'warning');
      return;
    }
    if (!editingBranch.address || !editingBranch.address.trim()) {
      showToast('Vui lòng nhập địa chỉ chi nhánh!', 'warning');
      return;
    }
    try {
      const res = await fetch(`/api/branches/${editingBranch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_name: editingBranch.branch_name,
          phone: editingBranch.phone,
          address: editingBranch.address,
          status: editingBranch.status
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingBranch(null);
        showToast('Cập nhật thông tin chi nhánh thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật chi nhánh', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleConfirmToggleBranchStatus = async () => {
    if (!toggleStatusBranch) return;
    const targetStatus = toggleStatusBranch.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/branches/${toggleStatusBranch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_name: toggleStatusBranch.branch_name,
          phone: toggleStatusBranch.phone,
          address: toggleStatusBranch.address,
          status: targetStatus
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          targetStatus === 1 
            ? `Đã kích hoạt lại chi nhánh "${toggleStatusBranch.branch_name}"!` 
            : `Đã tạm ngưng hoạt động chi nhánh "${toggleStatusBranch.branch_name}"!`
        );
        setToggleStatusBranch(null);
        loadData();
      } else {
        showToast(data.message || 'Không thể đổi trạng thái chi nhánh', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleConfirmDeleteBranch = async () => {
    if (!deletingBranch) return;
    try {
      const res = await fetch(`/api/branches/${deletingBranch.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa vĩnh viễn chi nhánh "${deletingBranch.branch_name}"!`);
        setDeletingBranch(null);
        loadData();
      } else {
        showToast(data.message || 'Xóa chi nhánh thất bại!', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.title.trim()) {
      showToast('Vui lòng nhập tiêu đề banner!', 'warning');
      return;
    }
    if (!newBanner.image_url || !newBanner.image_url.trim()) {
      showToast('Vui lòng tải lên hoặc nhập liên kết ảnh banner!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddBannerModal(false);
        setNewBanner({ title: '', image_url: '', link_url: '/', display_order: 1 });
        showToast('Thêm banner quảng cáo thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm banner', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    if (!editingBanner) return;
    if (!editingBanner.title || !editingBanner.title.trim()) {
      showToast('Vui lòng nhập tiêu đề banner!', 'warning');
      return;
    }
    if (!editingBanner.image_url || !editingBanner.image_url.trim()) {
      showToast('Vui lòng tải lên hoặc nhập liên kết ảnh banner!', 'warning');
      return;
    }
    try {
      const res = await fetch(`/api/banners/${editingBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingBanner.title,
          image_url: editingBanner.image_url,
          link_url: editingBanner.link_url || '/',
          display_order: editingBanner.display_order !== undefined ? parseInt(editingBanner.display_order, 10) : 0,
          status: editingBanner.status !== undefined ? Number(editingBanner.status) : 1
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingBanner(null);
        showToast('Cập nhật banner thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật banner', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleToggleBannerStatus = async (banner) => {
    const targetStatus = banner.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: banner.title,
          image_url: banner.image_url,
          link_url: banner.link_url,
          display_order: banner.display_order,
          status: targetStatus
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          targetStatus === 1 
            ? `Đã kích hoạt hiển thị banner "${banner.title}"!` 
            : `Đã tạm ẩn banner "${banner.title}"!`
        );
        loadData();
      } else {
        showToast(data.message || 'Lỗi đổi trạng thái banner', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleConfirmDeleteBanner = async () => {
    if (!deletingBanner) return;
    try {
      const res = await fetch(`/api/banners/${deletingBanner.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa banner "${deletingBanner.title}" thành công!`);
        setDeletingBanner(null);
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa banner', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSiteSettings(data.data);
        showToast('Cập nhật cấu hình website thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật cấu hình', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateShippingFee = async (e) => {
    e.preventDefault();
    if (!newShippingFee.name || !newShippingFee.name.trim()) {
      showToast('Vui lòng nhập tên gói cước vận chuyển!', 'warning');
      return;
    }
    const minKm = parseFloat(newShippingFee.min_km);
    const maxKm = parseFloat(newShippingFee.max_km);
    const fee = parseFloat(newShippingFee.fee);

    if (isNaN(minKm) || isNaN(maxKm) || minKm < 0 || maxKm <= minKm) {
      showToast('Khoảng cách không hợp lệ! Khoảng cách đến phải lớn hơn khoảng cách từ (>= 0 km)', 'warning');
      return;
    }
    if (isNaN(fee) || fee < 0) {
      showToast('Mức phí vận chuyển phải lớn hơn hoặc bằng 0 đ!', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/admin/shipping-fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newShippingFee.name.trim(),
          min_km: minKm,
          max_km: maxKm,
          fee: fee,
          status: 1
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddShippingFeeModal(false);
        setNewShippingFee({ name: '', min_km: '', max_km: '', fee: '' });
        showToast('Thêm nấc cước vận chuyển mới thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm nấc cước', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  const handleUpdateShippingFee = async (e) => {
    e.preventDefault();
    if (!editingShippingFee) return;
    if (!editingShippingFee.name || !editingShippingFee.name.trim()) {
      showToast('Vui lòng nhập tên gói cước vận chuyển!', 'warning');
      return;
    }
    const minKm = parseFloat(editingShippingFee.min_km);
    const maxKm = parseFloat(editingShippingFee.max_km);
    const fee = parseFloat(editingShippingFee.fee);

    if (isNaN(minKm) || isNaN(maxKm) || minKm < 0 || maxKm <= minKm) {
      showToast('Khoảng cách không hợp lệ! Khoảng cách đến phải lớn hơn khoảng cách từ (>= 0 km)', 'warning');
      return;
    }
    if (isNaN(fee) || fee < 0) {
      showToast('Mức phí vận chuyển phải lớn hơn hoặc bằng 0 đ!', 'warning');
      return;
    }

    try {
      const res = await fetch(`/api/admin/shipping-fees/${editingShippingFee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingShippingFee.name.trim(),
          min_km: minKm,
          max_km: maxKm,
          fee: fee,
          status: Number(editingShippingFee.status)
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingShippingFee(null);
        showToast('Cập nhật nấc phí vận chuyển thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật nấc phí', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  const handleToggleShippingFeeStatus = async (tier) => {
    const targetStatus = tier.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/admin/shipping-fees/${tier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tier.name,
          min_km: tier.min_km,
          max_km: tier.max_km,
          fee: tier.fee,
          status: targetStatus
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(targetStatus === 1 ? `Đã kích hoạt nấc cước "${tier.name}"!` : `Đã tạm dừng nấc cước "${tier.name}"!`);
        loadData();
      } else {
        showToast(data.message || 'Lỗi đổi trạng thái nấc cước', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

    // Quản lý thông báo hệ thống (FR-046)
  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!newNotification.title || !newNotification.title.trim()) {
      showToast('Vui lòng nhập tiêu đề thông báo!', 'warning');
      return;
    }
    if (!newNotification.content || !newNotification.content.trim()) {
      showToast('Vui lòng nhập nội dung thông báo!', 'warning');
      return;
    }

    setSendingNotification(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNotification.title.trim(),
          content: newNotification.content.trim(),
          recipient_type: newNotification.recipient_type,
          sender_id: currentUser?.id || 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Gửi thông báo thành công!');
        setShowCreateNotificationModal(false);
        setNewNotification({ title: '', content: '', recipient_type: 'ALL' });
        loadData();
      } else {
        showToast(data.message || 'Lỗi gửi thông báo', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    } finally {
      setSendingNotification(false);
    }
  };

  const handleConfirmDeleteNotification = async () => {
    if (!deletingNotification) return;
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingNotification.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa thông báo "${deletingNotification.title}" thành công!`);
        setDeletingNotification(null);
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa thông báo', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  const handleConfirmDeleteShippingFee = async () => {
    if (!deletingShippingFee) return;
    try {
      const res = await fetch(`/api/admin/shipping-fees/${deletingShippingFee.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa nấc cước "${deletingShippingFee.name}" thành công!`);
        setDeletingShippingFee(null);
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa nấc cước', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  // Quản lý tài khoản Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.full_name || !newAdmin.full_name.trim()) {
      showToast('Vui lòng nhập họ và tên quản trị viên!', 'warning');
      return;
    }
    if (!newAdmin.phone || !newAdmin.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại quản trị viên!', 'warning');
      return;
    }
    if (!newAdmin.password || newAdmin.password.length < 6) {
      showToast('Mật khẩu quản trị phải có ít nhất 6 ký tự!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddAdminModal(false);
        setNewAdmin({ full_name: '', phone: '', password: '', branch_id: 1, role_id: 2 });
        showToast('Tạo tài khoản quản trị thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi tạo tài khoản quản trị', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  // Chỉnh sửa thông tin Admin
  const openEditAdminModal = (admin) => {
    setEditAdminModal({
      isOpen: true,
      admin,
      full_name: admin.full_name,
      phone: admin.phone,
      branch_id: admin.branch_id || 1,
    });
  };

  const handleUpdateAdminSubmit = async (e) => {
    e.preventDefault();
    if (!editAdminModal.admin) return;
    if (!editAdminModal.full_name || !editAdminModal.full_name.trim()) {
      showToast('Vui lòng nhập họ và tên quản trị viên!', 'warning');
      return;
    }
    if (!editAdminModal.phone || !editAdminModal.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại quản trị viên!', 'warning');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${editAdminModal.admin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: editAdminModal.full_name,
          phone: editAdminModal.phone,
          branch_id: editAdminModal.branch_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Cập nhật thông tin Admin thành công!', 'success');
        setEditAdminModal({ isOpen: false, admin: null, full_name: '', phone: '', branch_id: 1 });
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật thông tin Admin', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  // Đặt lại mật khẩu Admin
  const openResetPasswordModal = (admin) => {
    setResetPasswordModal({
      isOpen: true,
      admin,
      password: '',
      confirm_password: '',
    });
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetPasswordModal.admin) return;
    if (!resetPasswordModal.password || resetPasswordModal.password.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
      return;
    }
    if (!resetPasswordModal.confirm_password) {
      showToast('Vui lòng nhập xác nhận mật khẩu mới!', 'error');
      return;
    }
    if (resetPasswordModal.password !== resetPasswordModal.confirm_password) {
      showToast('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${resetPasswordModal.admin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: resetPasswordModal.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đặt lại mật khẩu thành công!', 'success');
        setResetPasswordModal({ isOpen: false, admin: null, password: '', confirm_password: '' });
      } else {
        showToast(data.message || 'Lỗi đặt lại mật khẩu', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  // Xem chi tiết khách hàng và lịch sử mua sắm (FR-040 & UC-18)
  const handleViewCustomerDetail = async (customer) => {
    setLoadingCustomerDetail(true);
    setSelectedCustomerDetail({ ...customer, orders: [] });
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCustomerDetail(data.data);
      } else {
        showToast(data.message || 'Lỗi tải chi tiết khách hàng', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    } finally {
      setLoadingCustomerDetail(false);
    }
  };

  // Phân quyền chức năng cho Admin Chi nhánh (FR-039)
  const openAssignPermissionsModal = async (admin) => {
    if (admin.id === 1) {
      showToast('Admin Tổng luôn nắm giữ toàn bộ quyền hạn hệ thống.', 'warning');
      return;
    }
    setPermissionModal({
      isOpen: true,
      admin,
      selectedIds: [],
      loading: true,
      saving: false,
    });
    try {
      const res = await fetch(`/api/admin/permissions?user_id=${admin.id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setPermissionModal({
          isOpen: true,
          admin,
          selectedIds: data.data.user_permission_ids || [],
          loading: false,
          saving: false,
        });
      } else {
        showToast(data.message || 'Không thể tải danh sách quyền', 'error');
        setPermissionModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      showToast('Lỗi kết nối khi tải quyền: ' + err.message, 'error');
      setPermissionModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const toggleModulePermissions = (module) => {
    setPermissionModal((prev) => {
      const allSelected = module.permissionIds.every((id) => prev.selectedIds.includes(id));
      let updated;
      if (allSelected) {
        updated = prev.selectedIds.filter((id) => !module.permissionIds.includes(id));
      } else {
        const toAdd = module.permissionIds.filter((id) => !prev.selectedIds.includes(id));
        updated = [...prev.selectedIds, ...toAdd];
      }
      return { ...prev, selectedIds: updated };
    });
  };

  const handleSelectAllPermissions = () => {
    const allIds = SRS_FUNCTIONAL_MODULES.flatMap((m) => m.permissionIds);
    setPermissionModal((prev) => ({ ...prev, selectedIds: Array.from(new Set(allIds)) }));
  };

  const handleDeselectAllPermissions = () => {
    setPermissionModal((prev) => ({ ...prev, selectedIds: [] }));
  };

  const handleSavePermissionsSubmit = async (e) => {
    e?.preventDefault();
    if (!permissionModal.admin) return;
    setPermissionModal((prev) => ({ ...prev, saving: true }));
    try {
      const res = await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: permissionModal.admin.id,
          permission_ids: permissionModal.selectedIds,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Phân quyền thành công!', 'success');
        if (currentUser && currentUser.id === permissionModal.admin.id) {
          const allPermNames = [];
          SRS_FUNCTIONAL_MODULES.forEach((m) => {
            if (m.permissionIds.some((id) => permissionModal.selectedIds.includes(id))) {
              allPermNames.push(...m.permissionNames);
            }
          });
          const updatedUser = { ...currentUser, permissions: Array.from(new Set(allPermNames)) };
          setCurrentUser(updatedUser);
          localStorage.setItem('dodong4mua_user', JSON.stringify(updatedUser));
        }
        setPermissionModal({ isOpen: false, admin: null, selectedIds: [], loading: false, saving: false });
        loadData();
      } else {
        showToast(data.message || 'Lỗi lưu phân quyền', 'error');
        setPermissionModal((prev) => ({ ...prev, saving: false }));
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
      setPermissionModal((prev) => ({ ...prev, saving: false }));
    }
  };

  // Mở các modal xác nhận chuẩn phong cách KhoHang_JAVA (lockModal, unlockModal, deleteModal)
  const openLockModal = (user) => {
    if (user.id === 1) {
      showToast('Không thể khóa tài khoản Admin Tổng mặc định!', 'warning');
      return;
    }
    setActionModal({ isOpen: true, actionType: 'lock', targetUser: user });
  };

  const openUnlockModal = (user) => {
    setActionModal({ isOpen: true, actionType: 'unlock', targetUser: user });
  };

  const openDeleteModal = (user) => {
    if (user.id === 1) {
      showToast('Không thể xóa tài khoản Admin Tổng mặc định!', 'warning');
      return;
    }
    setActionModal({ isOpen: true, actionType: 'delete', targetUser: user });
  };

  const executeActionModal = async () => {
    const user = actionModal.targetUser;
    if (!user) return;
    const { actionType } = actionModal;
    setActionModal({ isOpen: false, actionType: 'lock', targetUser: null });

    if (actionType === 'lock' || actionType === 'unlock') {
      const newStatus = actionType === 'lock' ? 0 : 1;
      try {
        const res = await fetch(`/api/admin/users/${user.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(
            actionType === 'lock'
              ? `Tài khoản ${user.full_name} đã bị vô hiệu hóa!`
              : `Đã mở khóa tài khoản ${user.full_name} thành công!`,
            'success'
          );
          loadData();
        } else {
          showToast(data.message || 'Lỗi cập nhật trạng thái', 'error');
        }
      } catch (e) {
        showToast('Lỗi kết nối máy chủ: ' + e.message, 'error');
      }
    } else if (actionType === 'delete') {
      try {
        const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          showToast(`Đã thu hồi và xóa vĩnh viễn tài khoản ${user.full_name}!`, 'success');
          loadData();
        } else {
          showToast(data.message || 'Lỗi xóa tài khoản', 'error');
        }
      } catch (e) {
        showToast('Lỗi kết nối máy chủ: ' + e.message, 'error');
      }
    }
  };

  // 1. Màn hình chờ xác thực
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3 bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800 shadow-xl">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          <span className="font-bold text-sm">Đang xác thực cổng Quản Trị...</span>
        </div>
      </div>
    );
  }

  // 2. Màn hình Đăng Nhập Quản Trị
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-8 shadow-2xl text-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
              <ShieldCheck className="w-9 h-9 text-slate-950" />
            </div>
            <h1 className="text-2xl font-black tracking-tight font-heading text-white">CỔNG QUẢN TRỊ VIÊN</h1>
            <p className="text-xs text-emerald-300/80 font-medium">Hệ Thống Bán Trái Cây Đổ Đống 4 Mùa (SRS V1.0)</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} noValidate className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Số điện thoại Quản Trị</label>
              <input
                type="tel"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="0988888888"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Mật khẩu Quản Trị</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-slate-950 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
            >
              Đăng Nhập Vào Hệ Thống Quản Trị
            </button>
          </form>

          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">Tài khoản Quản trị Tổng mặc định:</div>
            <div>• Số điện thoại: <span className="font-mono text-emerald-400">0929894248</span></div>
            <div>• Mật khẩu: <span className="font-mono text-emerald-400">123456</span></div>
          </div>

          <div className="pt-2 text-center border-t border-slate-800">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Về trang chủ mua hàng của khách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar Menu Groups
  const navigationGroups = [
    {
      group: 'BÁN HÀNG & GIAO VẬN',
      items: [
        { key: 'orders', label: 'Đơn Hàng & GreenSM', icon: ShoppingCart, count: orders.length },
        { key: 'reports', label: 'Báo Cáo Doanh Thu', icon: BarChart3 },
      ]
    },
    {
      group: 'QUẢN LÝ NÔNG SẢN',
      items: [
        { key: 'products', label: 'Sản Phẩm 4 Mùa', icon: Package, count: products.length },
        { key: 'categories', label: 'Danh Mục Mùa Vụ', icon: Tag, count: categories.length },
        { key: 'promotions', label: 'Khuyến Mãi & Voucher', icon: Percent, count: promotions.length },
      ]
    },
    {
      group: 'HỆ THỐNG & VẬN HÀNH',
      items: [
        { key: 'admins', label: 'Tài Khoản Quản Trị', icon: ShieldCheck, count: adminUsers.length },
        { key: 'branches', label: 'Chi Nhánh Cửa Hàng', icon: MapPin, count: branches.length },
        { key: 'banners', label: 'Banner Quảng Cáo', icon: ImageIcon, count: banners.length },
        { key: 'customers', label: 'Khách Hàng', icon: Users, count: customers.length },
        { key: 'logs', label: 'Nhật Ký Hoạt Động', icon: FileText, count: logs.length },
        { key: 'settings', label: 'Cấu Hình Website', icon: Settings },
        { key: 'notifications', label: 'Quản Lý Thông Báo', icon: Bell, count: notifications.length },
      ]
    }
  ];

  // Lọc thanh điều hướng theo phân quyền thực tế của tài khoản (BR-026)
  const visibleNavGroups = navigationGroups
    .map((grp) => ({
      ...grp,
      items: grp.items.filter((item) => hasPermissionForTab(item.key)),
    }))
    .filter((grp) => grp.items.length > 0);

  const currentTabLabel = navigationGroups.flatMap(g => g.items).find(i => i.key === activeTab)?.label || 'Bảng Điều Khiển';

  // Filtered products & pagination slices (Chuẩn KhoHang_JAVA)
  const filteredProducts = products.filter(p => {
    const matchSearch = productSearch ? p.name.toLowerCase().includes(productSearch.toLowerCase()) : true;
    const matchCategory = productCategoryFilter ? p.category_id === parseInt(productCategoryFilter, 10) : true;
    const matchStatus = productStatusFilter !== '' ? p.status === parseInt(productStatusFilter, 10) : true;
    return matchSearch && matchCategory && matchStatus;
  });

  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productPageSize,
    productPage * productPageSize
  );

  const paginatedOrders = orders.slice(
    (orderPage - 1) * orderPageSize,
    orderPage * orderPageSize
  );

  const filteredCustomers = customers.filter(cu => {
    const matchSearch = customerSearch
      ? ((cu.full_name && cu.full_name.toLowerCase().includes(customerSearch.toLowerCase())) ||
         (cu.phone && cu.phone.includes(customerSearch)) ||
         (cu.address && cu.address.toLowerCase().includes(customerSearch.toLowerCase())))
      : true;
    const matchStatus = customerStatusFilter !== ''
      ? cu.status === parseInt(customerStatusFilter, 10)
      : true;
    return matchSearch && matchStatus;
  });

  const filteredBanners = banners.filter((bn) => {
    const matchSearch = bannerSearch ? bn.title.toLowerCase().includes(bannerSearch.toLowerCase()) : true;
    const matchStatus = bannerStatusFilter === 'ACTIVE'
      ? bn.status === 1
      : bannerStatusFilter === 'INACTIVE'
      ? bn.status === 0
      : true;
    return matchSearch && matchStatus;
  });

  const paginatedCustomers = filteredCustomers.slice(
    (customerPage - 1) * customerPageSize,
    customerPage * customerPageSize
  );

  const reloadLogs = async () => {
    setRefreshingLogs(true);
    try {
      const res = await fetch('/api/admin/logs?limit=300');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        if (data.stats) setLogStats(data.stats);
        showToast('Đã làm mới nhật ký kiểm toán!');
      }
    } catch (err) {
      showToast('Lỗi tải nhật ký: ' + err.message, 'error');
    } finally {
      setRefreshingLogs(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    const matchesModule = logModuleFilter === 'ALL' || l.module === logModuleFilter;
    const term = logSearch.toLowerCase().trim();
    const actionLabel = (LOG_ACTION_LABELS[l.action] || '').toLowerCase();
    const moduleLabel = (LOG_MODULE_LABELS[l.module] || '').toLowerCase();
    const matchesSearch = !term ||
      (l.user_name && l.user_name.toLowerCase().includes(term)) ||
      (l.phone && l.phone.includes(term)) ||
      (l.role_name && l.role_name.toLowerCase().includes(term)) ||
      (l.action && l.action.toLowerCase().includes(term)) ||
      actionLabel.includes(term) ||
      (l.module && l.module.toLowerCase().includes(term)) ||
      moduleLabel.includes(term) ||
      (l.description && l.description.toLowerCase().includes(term)) ||
      (l.ip_address && l.ip_address.includes(term));
    return matchesModule && matchesSearch;
  });

  const paginatedLogs = filteredLogs.slice(
    (logPage - 1) * logPageSize,
    logPage * logPageSize
  );

  const filteredPromotions = promotions.filter(pr => {
    const matchSearch = promotionSearch ? pr.title.toLowerCase().includes(promotionSearch.toLowerCase()) : true;
    const matchStatus = promotionStatusFilter !== '' ? pr.status === parseInt(promotionStatusFilter, 10) : true;
    return matchSearch && matchStatus;
  });

    const filteredNotifications = notifications.filter((n) => {
    const matchType = notificationRecipientFilter === 'ALL_FILTER' || n.recipient_type === notificationRecipientFilter;
    const term = notificationSearch.toLowerCase().trim();
    const matchSearch = !term ||
      (n.title && n.title.toLowerCase().includes(term)) ||
      (n.content && n.content.toLowerCase().includes(term)) ||
      (n.sender_name && n.sender_name.toLowerCase().includes(term));
    return matchType && matchSearch;
  });

  const paginatedNotifications = filteredNotifications.slice(
    (notificationPage - 1) * notificationPageSize,
    notificationPage * notificationPageSize
  );

  const paginatedPromotions = filteredPromotions.slice(
    (promotionPage - 1) * promotionPageSize,
    promotionPage * promotionPageSize
  );

  const filteredBranches = branches.filter(b => {
    const matchSearch = branchSearch
      ? ((b.branch_name && b.branch_name.toLowerCase().includes(branchSearch.toLowerCase())) ||
         (b.phone && b.phone.includes(branchSearch)) ||
         (b.address && b.address.toLowerCase().includes(branchSearch.toLowerCase())))
      : true;
    const matchStatus = branchStatusFilter === 'ACTIVE'
      ? b.status === 1
      : branchStatusFilter === 'INACTIVE'
      ? b.status === 0
      : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/80 flex font-sans">
      {/* 1. LEFT SIDEBAR (MODERN ENTERPRISE STUDIO) */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-2xl">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Logo Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25">
              <Leaf className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="font-heading font-black text-white text-lg tracking-tight leading-none flex items-center gap-1.5">
                <span>ĐỔ ĐỐNG</span>
                <span className="text-accent-400">4 MÙA</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Admin Studio Pro</span>
              </div>
            </div>
          </div>

          {/* Navigation Items (Grouped) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
            {visibleNavGroups.map((grp) => (
              <div key={grp.group} className="space-y-1.5">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-2">
                  {grp.group}
                </div>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveTab(item.key);
                        window.history.replaceState(null, '', `?tab=${item.key}`);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-black'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive
                            ? 'bg-slate-950 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                          }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Sidebar: Admin Profile & Logout */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                  AD
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-white font-bold text-xs truncate">{currentUser?.full_name || 'Admin'}</div>
                  <div className="text-emerald-400 text-[11px] font-semibold truncate flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{currentUser?.role_name || 'Admin Tổng'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAdminLogout}
                title="Đăng xuất khỏi Quản Trị"
                className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <span>Hệ Thống</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900 font-extrabold">{currentTabLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Branch Selector Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hệ thống 2 Chi nhánh (Thủ Đức & Q.1)</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Làm mới</span>
            </button>

            {/* Open Storefront */}
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem Cửa Hàng</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Content Canvas */}
        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {!hasPermissionForTab(activeTab) ? (
            <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto my-16 border border-slate-200/80 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-black text-xl text-slate-900 mb-2">Quyền truy cập bị giới hạn</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Tài khoản quản trị của bạn chưa được phân quyền truy cập chức năng này theo quy định của hệ thống. Vui lòng liên hệ Admin Tổng để được cấp quyền.
              </p>
              <button
                type="button"
                onClick={() => {
                  const allowed = ['orders', 'products', 'categories', 'promotions', 'reports', 'banners', 'customers'].find((t) => hasPermissionForTab(t));
                  if (allowed) {
                    setActiveTab(allowed);
                    window.history.replaceState(null, '', `?tab=${allowed}`);
                  }
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition cursor-pointer shadow-md shadow-emerald-600/20"
              >
                Quay lại chức năng được cấp quyền
              </button>
            </div>
          ) : (
            <>
              {/* 4 MODERN KPI CARDS ROW */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Doanh thu */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng doanh thu</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1 font-heading">
                        {parseFloat(stats.totalRevenue).toLocaleString('vi-VN')} đ
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Dữ liệu thực tế CSDL</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                      <TrendingUp className="w-6 h-6 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Card 2: Đơn hàng */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng đơn hàng</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1 font-heading">
                        {orders.length} đơn
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-2 bg-blue-50 px-2 py-0.5 rounded-md inline-flex">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Vận đơn GreenSM</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                      <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Card 3: Sản phẩm */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm 4 mùa</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1 font-heading">
                        {stats.totalProducts} mặt hàng
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-2 bg-amber-50 px-2 py-0.5 rounded-md inline-flex">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Xuân - Hạ - Thu - Đông</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                      <Package className="w-6 h-6 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Card 4: Tồn kho ít */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cảnh báo tồn kho (&le;10)</p>
                      <h3 className={`text-2xl font-black mt-1 font-heading ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        {stats.lowStockCount} sản phẩm
                      </h3>
                      <div className={`flex items-center gap-1 text-[11px] font-bold mt-2 px-2 py-0.5 rounded-md inline-flex ${stats.lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{stats.lowStockCount > 0 ? 'Cần nhập thêm' : 'Tồn kho ổn định'}</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${stats.lowStockCount > 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                      <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: QUẢN LÝ ĐƠN HÀNG & GREENSM */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Đơn Hàng & Vận Đơn GreenSM</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Quy trình xử lý đơn hàng: Tiếp nhận ➔ Chuẩn bị hàng ➔ Đang giao ➔ Hoàn tất
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Tìm mã đơn, tên, số điện thoại..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                        />
                      </div>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="CHO_THANH_TOAN">Chờ thanh toán (QR)</option>
                        <option value="CHO_XAC_NHAN">Chờ xác nhận (COD)</option>
                        <option value="DA_XAC_NHAN">Đã duyệt</option>
                        <option value="DANG_CHUAN_BI">Đang chuẩn bị</option>
                        <option value="TAM_DUNG">Tạm dừng</option>
                        <option value="DANG_GIAO">Đang giao</option>
                        <option value="DA_GIAO">Đã giao</option>
                        <option value="DA_HUY">Đã hủy</option>
                      </select>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500">Từ:</span>
                        <input
                          type="date"
                          value={orderStartDate}
                          onChange={(e) => setOrderStartDate(e.target.value)}
                          className="bg-transparent text-xs focus:outline-none"
                        />
                        <span className="text-[11px] font-bold text-slate-500 ml-1">Đến:</span>
                        <input
                          type="date"
                          value={orderEndDate}
                          onChange={(e) => setOrderEndDate(e.target.value)}
                          className="bg-transparent text-xs focus:outline-none"
                        />
                        {(orderStartDate || orderEndDate) && (
                          <button
                            onClick={() => { setOrderStartDate(''); setOrderEndDate(''); }}
                            className="text-xs text-rose-500 hover:text-rose-700 font-bold ml-1"
                            title="Xóa lọc ngày"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                        <PackageOpen className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">Chưa có đơn hàng nào</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Hệ thống CSDL hiện đang sạch (0 dữ liệu mẫu). Khách hàng đặt mua trên trang chủ sẽ xuất hiện ngay tại đây theo thời gian thực!
                      </p>
                      <Link
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition cursor-pointer"
                      >
                        <span>Mở cửa hàng để đặt thử</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[900px]">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                            <th className="py-3 px-3 whitespace-nowrap">Mã đơn</th>
                            <th className="py-3 px-3 whitespace-nowrap">Thời gian</th>
                            <th className="py-3 px-3 whitespace-nowrap">Khách hàng</th>
                            <th className="py-3 px-3 whitespace-nowrap">Số điện thoại</th>
                            <th className="py-3 px-3 whitespace-nowrap">Thanh toán</th>
                            <th className="py-3 px-3 whitespace-nowrap">Trạng thái</th>
                            <th className="py-3 px-3 whitespace-nowrap">Tổng tiền</th>
                            <th className="py-3 px-3 whitespace-nowrap">Người xử lý</th>
                            <th className="py-3 px-3 text-right whitespace-nowrap">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50/80 transition">
                              {/* 1. Mã đơn */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <button
                                  onClick={() => handleViewOrderDetail(o)}
                                  className="font-mono font-bold text-brand-700 hover:text-brand-800 hover:underline cursor-pointer"
                                  title="Xem chi tiết đơn này"
                                >
                                  {o.order_code}
                                </button>
                              </td>

                              {/* 2. Thời gian */}
                              <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                                {new Date(o.created_at).toLocaleString("vi-VN")}
                              </td>

                              {/* 3. Tên khách hàng */}
                              <td className="py-3 px-3 whitespace-nowrap font-bold text-slate-900">
                                {o.receiver_name}
                              </td>

                              {/* 4. Số điện thoại */}
                              <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                                {o.phone}
                              </td>

                              {/* 5. Thanh toán */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  o.payment_status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                }`}>
                                  {o.payment_method} ({o.payment_status === "PAID" ? "Đã thu" : "Chưa thu"})
                                </span>
                              </td>

                              {/* 6. Trạng thái */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  o.order_status === "DA_GIAO" ? "bg-emerald-100 text-emerald-800" :
                                  o.order_status === "DANG_GIAO" ? "bg-teal-100 text-teal-800" :
                                  o.order_status === "DANG_CHUAN_BI" ? "bg-blue-100 text-blue-800" :
                                  o.order_status === "TAM_DUNG" ? "bg-yellow-100 text-yellow-800" :
                                  o.order_status === "DA_XAC_NHAN" ? "bg-purple-100 text-purple-800" :
                                  o.order_status === "CHO_THANH_TOAN" ? "bg-amber-100 text-amber-900 border border-amber-300" :
                                  o.order_status === "DA_HUY" ? "bg-red-100 text-red-800" :
                                  "bg-amber-100 text-amber-800"
                                }`}>
                                  {
                                    o.order_status === "CHO_THANH_TOAN" ? "Chờ thanh toán" :
                                    o.order_status === "CHO_XAC_NHAN" ? "Chờ xác nhận" :
                                    o.order_status === "DA_XAC_NHAN" ? "Đã xác nhận" :
                                    o.order_status === "DANG_CHUAN_BI" ? "Đang chuẩn bị" :
                                    o.order_status === "TAM_DUNG" ? "Tạm dừng" :
                                    o.order_status === "DANG_GIAO" ? "Đang giao" :
                                    o.order_status === "DA_GIAO" ? "Đã giao" :
                                    o.order_status === "DA_HUY" ? "Đã hủy" : o.order_status
                                  }
                                </span>
                              </td>

                              {/* 7. Tổng tiền */}
                              <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                                {parseFloat(o.total_amount).toLocaleString("vi-VN")} đ
                              </td>

                              {/* 8. Người xử lý */}
                              <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium text-[11px]">
                                {['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(o.order_status) && !o.processor_name ? (
                                  <span className="text-slate-400 italic">Chưa tiếp nhận</span>
                                ) : o.order_status === 'DA_HUY' && (!o.processor_name || o.processor_name === o.receiver_name) ? (
                                  <span className="text-red-500 font-medium">Khách tự hủy</span>
                                ) : (
                                  <span className="text-slate-800 font-medium">{o.processor_name || 'Admin Tổng'}</span>
                                )}
                              </td>

                              {/* 9. Thao tác: Đúng chuẩn 4 nút nghiệp vụ */}
                              <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                                {/* 1. Xem chi tiết */}
                                <button
                                  onClick={() => handleViewOrderDetail(o)}
                                  className="px-2 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer border border-brand-200/60"
                                  title="Xem chi tiết đơn hàng (FR-030)"
                                >
                                  <Eye className="w-3 h-3" /> Chi tiết
                                </button>

                                {/* 2. Đổi trạng thái (Modal xác nhận chuẩn) */}
                                {(() => {
                                  if (['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(o.order_status)) {
                                    return (
                                      <button
                                        onClick={() => promptChangeOrderStatus(o, 'DA_XAC_NHAN', 'DA_TAO_VAN_DON', 'Duyệt đơn')}
                                        className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                                        title="Duyệt đơn hàng (FR-031)"
                                      >
                                        Duyệt đơn
                                      </button>
                                    );
                                  }
                                  if (o.order_status === 'DA_XAC_NHAN') {
                                    return (
                                      <button
                                        onClick={() => promptChangeOrderStatus(o, 'DANG_CHUAN_BI', null, 'Đóng gói')}
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                                        title="Chuyển sang đóng gói (FR-033)"
                                      >
                                        Đóng gói
                                      </button>
                                    );
                                  }
                                  if (o.order_status === 'DANG_CHUAN_BI') {
                                    return (
                                      <button
                                        onClick={() => promptChangeOrderStatus(o, 'DANG_GIAO', 'DANG_GIAO', 'Bàn giao GreenSM')}
                                        className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                                        title="Bàn giao GreenSM (FR-036)"
                                      >
                                        Giao hàng
                                      </button>
                                    );
                                  }
                                  if (o.order_status === 'DANG_GIAO') {
                                    return (
                                      <button
                                        onClick={() => promptChangeOrderStatus(o, 'DA_GIAO', 'GIAO_THANH_CONG', 'Hoàn tất đơn')}
                                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                                        title="Hoàn tất đơn hàng (FR-037)"
                                      >
                                        Hoàn tất
                                      </button>
                                    );
                                  }
                                  return (
                                    <button
                                      disabled
                                      className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold cursor-not-allowed border border-slate-200"
                                      title="Không có bước kế tiếp"
                                    >
                                      Đổi trạng thái
                                    </button>
                                  );
                                })()}

                                {/* 3. Tạm dừng / Tiếp tục (Modal nhập lý do chuẩn) */}
                                {['CHO_XAC_NHAN', 'CHO_THANH_TOAN', 'DA_XAC_NHAN', 'DANG_CHUAN_BI'].includes(o.order_status) ? (
                                  <button
                                    onClick={() => promptPauseOrder(o)}
                                    className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                                    title="Tạm dừng xử lý đơn hàng (FR-034)"
                                  >
                                    Tạm dừng
                                  </button>
                                ) : o.order_status === 'TAM_DUNG' ? (
                                  <button
                                    onClick={() => promptResumeOrder(o)}
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                                    title="Tiếp tục xử lý đơn hàng (FR-035)"
                                  >
                                    Tiếp tục
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold cursor-not-allowed border border-slate-200"
                                    title="Không thể tạm dừng khi đơn đã bàn giao vận chuyển hoặc đã kết thúc"
                                  >
                                    Tạm dừng
                                  </button>
                                )}

                                {/* 4. Hủy (Modal cảnh báo hoàn kho chuẩn) */}
                                {!['DANG_GIAO', 'DA_GIAO', 'DA_HUY'].includes(o.order_status) ? (
                                  <button
                                    onClick={() => promptCancelOrder(o)}
                                    className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold cursor-pointer transition border border-red-200 hover:border-red-300"
                                    title="Hủy đơn hàng và hoàn trả tồn kho (BR-020)"
                                  >
                                    Hủy
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold cursor-not-allowed border border-slate-200"
                                    title="Không thể hủy khi đơn đã bàn giao GreenSM hoặc đã kết thúc"
                                  >
                                    Hủy
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Phân trang đơn hàng chuẩn KhoHang_JAVA */}
                  {orders.length > 0 && (
                    <Pagination
                      currentPage={orderPage}
                      totalItems={orders.length}
                      pageSize={orderPageSize}
                      onPageChange={setOrderPage}
                      onPageSizeChange={setOrderPageSize}
                      pageSizeOptions={[5, 10, 20, 50]}
                      itemName="đơn hàng"
                    />
                  )}
                </div>
              )}

              {/* TAB 2: QUẢN LÝ SẢN PHẨM */}
              {activeTab === 'products' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <Package className="w-5 h-5 text-emerald-600" />
                        <span>Danh Mục Sản Phẩm 4 Mùa</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Quản lý kho hàng, giá bán, tồn kho và hình ảnh sản phẩm</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Tìm tên sản phẩm..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                        />
                      </div>

                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>

                      <select
                        value={productStatusFilter}
                        onChange={(e) => setProductStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Đang hiển thị</option>
                        <option value="0">Đã ẩn</option>
                      </select>

                      <button
                        onClick={() => setShowAddProductModal(true)}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm Sản Phẩm Mới</span>
                      </button>
                    </div>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                        <Package className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">Không tìm thấy sản phẩm nào</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Chưa có sản phẩm phù hợp với bộ lọc hiện tại. Bấm nút dưới để thêm sản phẩm mới ngay!
                      </p>
                      <button
                        onClick={() => setShowAddProductModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm sản phẩm mới</span>
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[1020px]">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                            <th className="py-3 px-4 whitespace-nowrap w-16">#Mã SP</th>
                            <th className="py-3 px-4 min-w-[280px]">Ảnh & Tên sản phẩm</th>
                            <th className="py-3 px-4 whitespace-nowrap">Danh mục</th>
                            <th className="py-3 px-4 whitespace-nowrap">Giá bán</th>
                            <th className="py-3 px-4 whitespace-nowrap">Giá khuyến mãi</th>
                            <th className="py-3 px-4 whitespace-nowrap">Đơn vị</th>
                            <th className="py-3 px-4 whitespace-nowrap">Tồn kho</th>
                            <th className="py-3 px-4 whitespace-nowrap">Trạng thái</th>
                            <th className="py-3 px-4 text-right whitespace-nowrap">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">#{p.id}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                                    {p.thumbnail ? (
                                      <img
                                        src={p.thumbnail}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.onerror = null;
                                          e.currentTarget.src = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200';
                                        }}
                                      />
                                    ) : (
                                      <Package className="w-6 h-6 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                                      <span className="truncate max-w-[220px]">{p.name}</span>
                                      {p.is_featured === 1 && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-black shrink-0">Nổi bật</span>
                                      )}
                                    </div>
                                    <span className="text-xs text-slate-500 line-clamp-1">{p.description}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">{p.category_name}</td>
                              <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{parseFloat(p.price).toLocaleString('vi-VN')} đ</td>
                              <td className="py-3 px-4 text-brand-600 font-bold whitespace-nowrap">
                                {p.discount_price ? `${parseFloat(p.discount_price).toLocaleString('vi-VN')} đ` : '-'}
                              </td>
                              <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{p.unit}</td>
                              <td className="py-3 px-4 font-bold whitespace-nowrap">
                                <span className={p.stock <= 0 ? 'inline-block text-rose-600 font-black bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 whitespace-nowrap' : p.stock <= 10 ? 'text-amber-600 font-black' : 'text-slate-900'}>
                                  {p.stock <= 0 ? '0 (Hết hàng)' : p.stock}
                                </span>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                {p.status === 1 ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                    <span>Đang hiển thị</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                                    <span>Đã ẩn</span>
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => openEditProductModal(p)}
                                    className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition cursor-pointer"
                                    title="Chỉnh sửa thông tin sản phẩm"
                                  >
                                    Chỉnh sửa
                                  </button>
                                  <button
                                    onClick={() => handleToggleProductStatus(p)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                      p.status === 1
                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    }`}
                                    title={p.status === 1 ? 'Ẩn sản phẩm khỏi website' : 'Hiển thị sản phẩm lên website'}
                                  >
                                    {p.status === 1 ? 'Ẩn' : 'Hiển thị'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p)}
                                    className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition cursor-pointer"
                                    title="Xóa sản phẩm"
                                  >
                                    Xóa
                                  </button>
                                  <Link
                                    href={`/san-pham/${p.id}`}
                                    target="_blank"
                                    className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition inline-block"
                                    title="Xem chi tiết trên website"
                                  >
                                    Xem
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Phân trang sản phẩm chuẩn KhoHang_JAVA */}
                  {filteredProducts.length > 0 && (
                    <Pagination
                      currentPage={productPage}
                      totalItems={filteredProducts.length}
                      pageSize={productPageSize}
                      onPageChange={setProductPage}
                      onPageSizeChange={setProductPageSize}
                      pageSizeOptions={[5, 10, 20, 50]}
                      itemName="sản phẩm"
                    />
                  )}
                </div>
              )}

              {/* TAB 3: QUẢN LÝ DANH MỤC */}
              {activeTab === 'categories' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Danh Mục Sản Phẩm</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Phân loại trái cây theo mùa vụ, nhập khẩu, giỏ quà và combo gia đình</p>
                    </div>
                    <button
                      onClick={() => setShowAddCategoryModal(true)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Danh Mục</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[750px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                          <th className="py-3 px-4 whitespace-nowrap">Mã</th>
                          <th className="py-3 px-4 whitespace-nowrap">Tên danh mục</th>
                          <th className="py-3 px-4">Mô tả</th>
                          <th className="py-3 px-4 whitespace-nowrap">Số mặt hàng</th>
                          <th className="py-3 px-4 whitespace-nowrap">Trạng thái</th>
                          <th className="py-3 px-4 text-right whitespace-nowrap">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {categories.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">#{c.id}</td>
                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{c.name}</td>
                            <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{c.description || '-'}</td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
                                {c.product_count || 0} sản phẩm
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1 ${
                                c.status === 1
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {c.status === 1 ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Đang hiển thị</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3" />
                                    <span>Đã ẩn</span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Chỉnh sửa danh mục */}
                                <button
                                  onClick={() => openEditCategoryModal(c)}
                                  title="Chỉnh sửa thông tin danh mục"
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span className="text-[11px] font-bold">Chỉnh sửa</span>
                                </button>

                                {/* Ẩn / Hiển thị danh mục */}
                                <button
                                  onClick={() => handleToggleCategoryStatus(c)}
                                  title={c.status === 1 ? 'Ẩn danh mục khỏi cửa hàng' : 'Hiển thị lại danh mục'}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                    c.status === 1
                                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {c.status === 1 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  <span className="text-[11px] font-bold">{c.status === 1 ? 'Ẩn' : 'Hiển thị'}</span>
                                </button>

                                {/* Xóa danh mục */}
                                <button
                                  onClick={() => handleDeleteCategory(c)}
                                  title={c.product_count > 0 ? 'Danh mục có sản phẩm chỉ được phép ẩn' : 'Xóa danh mục trống'}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    c.product_count > 0
                                      ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                      : 'bg-red-50 hover:bg-red-100 text-red-600'
                                  }`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: QUẢN LÝ KHUYẾN MÃI */}
              {activeTab === 'promotions' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  {/* Header & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <Percent className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Chương Trình Khuyến Mãi</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Giảm giá % theo từng thời điểm mùa vụ hoặc sự kiện lễ tết</p>
                    </div>
                    <button
                      onClick={() => setShowAddPromotionModal(true)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Khuyến Mãi</span>
                    </button>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                    <div className="relative flex-1 min-w-[240px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên chương trình..."
                        value={promotionSearch}
                        onChange={(e) => setPromotionSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={promotionStatusFilter}
                        onChange={(e) => setPromotionStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Đang áp dụng</option>
                        <option value="0">Đã dừng</option>
                      </select>
                    </div>
                  </div>

                  {/* Table & Empty States */}
                  {filteredPromotions.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-accent-500 flex items-center justify-center mx-auto border border-amber-100">
                        <Percent className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">
                        {promotionSearch || promotionStatusFilter !== ''
                          ? 'Không tìm thấy chương trình khuyến mãi phù hợp'
                          : 'Chưa có chương trình khuyến mãi nào'}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {promotionSearch || promotionStatusFilter !== ''
                          ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc trạng thái để xem đầy đủ.'
                          : 'Tạo chương trình giảm giá đầu tiên để kích cầu mua sắm trái cây mùa vụ!'}
                      </p>
                      <button
                        onClick={() => setShowAddPromotionModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tạo khuyến mãi mới</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[980px]">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                              <th className="py-3 px-4 whitespace-nowrap w-16">#Mã KM</th>
                              <th className="py-3 px-4 min-w-[220px]">Tên chương trình</th>
                              <th className="py-3 px-4 whitespace-nowrap">Mức giảm</th>
                              <th className="py-3 px-4 whitespace-nowrap">Thời gian áp dụng</th>
                              <th className="py-3 px-4 whitespace-nowrap">Sản phẩm áp dụng</th>
                              <th className="py-3 px-4 whitespace-nowrap">Trạng thái</th>
                              <th className="py-3 px-4 text-right whitespace-nowrap">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {paginatedPromotions.map((pr) => {
                              const isExpired = pr.end_date && new Date(pr.end_date) < new Date();
                              return (
                                <tr key={pr.id} className="hover:bg-slate-50/80 transition">
                                  {/* Mã KM */}
                                  <td className="py-3 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">
                                    #{pr.id}
                                  </td>

                                  {/* Tên chương trình & Mô tả */}
                                  <td className="py-3 px-4">
                                    <div className="font-bold text-slate-900">{pr.title}</div>
                                    {pr.description && (
                                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{pr.description}</div>
                                    )}
                                  </td>

                                  {/* Mức giảm */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-200">
                                      -{parseFloat(pr.discount_percent)}%
                                    </span>
                                  </td>

                                  {/* Thời gian áp dụng */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                      <span>{new Date(pr.start_date).toLocaleDateString('vi-VN')}</span>
                                      <span className="text-slate-400">→</span>
                                      <span>{new Date(pr.end_date).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="mt-1">
                                      {isExpired ? (
                                        <span className="inline-block text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                                          Hết hạn
                                        </span>
                                      ) : (
                                        <span className="inline-block text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                                          Còn hiệu lực
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Sản phẩm áp dụng */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => openAssignProductsModal(pr)}
                                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition text-xs cursor-pointer border border-blue-200/60"
                                      title="Nhấn để xem hoặc gán sản phẩm vào chương trình này"
                                    >
                                      <Package className="w-3.5 h-3.5 text-blue-600" />
                                      <span>{pr.product_count || 0} sản phẩm</span>
                                    </button>
                                  </td>

                                  {/* Trạng thái */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        pr.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {pr.status === 1 ? 'Đang áp dụng' : 'Đã dừng'}
                                    </span>
                                  </td>

                                  {/* Thao tác */}
                                  <td className="py-3 px-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {/* Gán SP */}
                                      <button
                                        onClick={() => openAssignProductsModal(pr)}
                                        title="Gán sản phẩm áp dụng"
                                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                                      >
                                        <Tag className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Chỉnh sửa */}
                                      <button
                                        onClick={() => openEditPromotionModal(pr)}
                                        title="Chỉnh sửa chương trình"
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Dừng / Kích hoạt */}
                                      <button
                                        onClick={() => handleTogglePromotionStatus(pr)}
                                        title={pr.status === 1 ? 'Tạm dừng áp dụng khuyến mãi' : 'Kích hoạt lại khuyến mãi'}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                          pr.status === 1
                                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                        }`}
                                      >
                                        {pr.status === 1 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        <span className="text-[11px]">{pr.status === 1 ? 'Dừng' : 'Bật'}</span>
                                      </button>

                                      {/* Xóa */}
                                      <button
                                        onClick={() => handleDeletePromotion(pr)}
                                        title="Xóa vĩnh viễn chương trình"
                                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Phân trang KhoHang_JAVA */}
                      {filteredPromotions.length > 0 && (
                        <Pagination
                          currentPage={promotionPage}
                          totalItems={filteredPromotions.length}
                          pageSize={promotionPageSize}
                          onPageChange={setPromotionPage}
                          onPageSizeChange={(size) => {
                            setPromotionPageSize(size);
                            setPromotionPage(1);
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: QUẢN LÝ CHI NHÁNH */}
              {activeTab === 'branches' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  {/* Header & Thêm mới */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Chi Nhánh Cửa Hàng (FR-041)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Mạng lưới điểm bán, điểm lấy hàng và tiếp nhận xử lý đơn hàng</p>
                    </div>
                    <button
                      onClick={() => setShowAddBranchModal(true)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Chi Nhánh</span>
                    </button>
                  </div>

                  {/* Thống kê nhanh Quick Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số chi nhánh</div>
                      <div className="text-xl font-black text-slate-900 mt-0.5">{branches.length} điểm bán</div>
                    </div>
                    <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
                      <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Đang hoạt động</div>
                      <div className="text-xl font-black text-emerald-800 mt-0.5">{branches.filter(b => b.status === 1).length} điểm bán</div>
                    </div>
                    <div className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                      <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Ngừng hoạt động</div>
                      <div className="text-xl font-black text-amber-800 mt-0.5">{branches.filter(b => b.status === 0).length} điểm bán</div>
                    </div>
                  </div>

                  {/* Toolbar tìm kiếm & lọc */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm chi nhánh theo tên, số điện thoại, địa chỉ..."
                        value={branchSearch}
                        onChange={(e) => setBranchSearch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      />
                      {branchSearch && (
                        <button
                          onClick={() => setBranchSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="w-full sm:w-52">
                      <select
                        value={branchStatusFilter}
                        onChange={(e) => setBranchStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-brand-500"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="INACTIVE">Ngừng hoạt động</option>
                      </select>
                    </div>
                    {(branchSearch || branchStatusFilter !== '') && (
                      <button
                        onClick={() => {
                          setBranchSearch('');
                          setBranchStatusFilter('');
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Đặt lại</span>
                      </button>
                    )}
                  </div>

                  {/* Bảng danh sách chi nhánh */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                          <th className="py-3 px-4">Mã</th>
                          <th className="py-3 px-4">Tên chi nhánh</th>
                          <th className="py-3 px-4">Điện thoại</th>
                          <th className="py-3 px-4">Địa chỉ</th>
                          <th className="py-3 px-4">Nhân sự</th>
                          <th className="py-3 px-4">Trạng thái</th>
                          <th className="py-3 px-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBranches.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="py-12 text-center text-slate-400">
                              Không tìm thấy chi nhánh phù hợp với điều kiện tìm kiếm.
                            </td>
                          </tr>
                        ) : (
                          filteredBranches.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono font-bold text-slate-400">#{b.id}</td>
                              <td className="py-3 px-4 font-bold text-slate-900">
                                <div className="flex items-center gap-1.5">
                                  <span>{b.branch_name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-bold text-brand-700 font-mono">{b.phone}</td>
                              <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={b.address}>{b.address}</td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                                  <Users className="w-3 h-3 text-slate-500" />
                                  <span>{b.staff_count || 0} tài khoản</span>
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  b.status === 1 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}>
                                  {b.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Sửa chi nhánh */}
                                  <button
                                    onClick={() => setEditingBranch({ ...b })}
                                    title="Chỉnh sửa chi nhánh"
                                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Khóa / Mở chi nhánh */}
                                  <button
                                    onClick={() => setToggleStatusBranch(b)}
                                    title={b.status === 1 ? 'Tạm ngưng chi nhánh' : 'Mở lại chi nhánh'}
                                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                                      b.status === 1
                                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                    }`}
                                  >
                                    {b.status === 1 ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                  </button>

                                  {/* Xóa chi nhánh */}
                                  <button
                                    onClick={() => setDeletingBranch(b)}
                                    title="Xóa chi nhánh (BR-025)"
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: QUẢN LÝ BANNERS (FR-042) */}
              {activeTab === 'banners' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  {/* Header & Thêm mới */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Banner Quảng Cáo (FR-042)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Banner trượt tự động trên trang chủ chào đón khách hàng theo thứ tự ưu tiên</p>
                    </div>
                    <button
                      onClick={() => setShowAddBannerModal(true)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Banner</span>
                    </button>
                  </div>

                  {/* Thống kê nhanh Quick Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số banner</div>
                      <div className="text-xl font-black text-slate-900 mt-0.5">{banners.length} banner</div>
                    </div>
                    <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
                      <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Đang hiển thị</div>
                      <div className="text-xl font-black text-emerald-800 mt-0.5">{banners.filter(b => b.status === 1).length} banner</div>
                    </div>
                    <div className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                      <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Đang tạm ẩn</div>
                      <div className="text-xl font-black text-amber-800 mt-0.5">{banners.filter(b => b.status === 0).length} banner</div>
                    </div>
                  </div>

                  {/* Toolbar tìm kiếm & lọc */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm banner theo tiêu đề..."
                        value={bannerSearch}
                        onChange={(e) => setBannerSearch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      />
                      {bannerSearch && (
                        <button
                          onClick={() => setBannerSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="w-full sm:w-52">
                      <select
                        value={bannerStatusFilter}
                        onChange={(e) => setBannerStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-brand-500"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang hiển thị</option>
                        <option value="INACTIVE">Đang tạm ẩn</option>
                      </select>
                    </div>
                    {(bannerSearch || bannerStatusFilter !== '') && (
                      <button
                        onClick={() => {
                          setBannerSearch('');
                          setBannerStatusFilter('');
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Đặt lại</span>
                      </button>
                    )}
                  </div>

                  {filteredBanners.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">Chưa có banner nào phù hợp</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Thử thay đổi từ khóa tìm kiếm hoặc bấm Thêm banner mới để tạo banner nổi bật trên trang chủ!
                      </p>
                      <button
                        onClick={() => setShowAddBannerModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm banner ngay</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredBanners.map((bn) => (
                        <div key={bn.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-3 p-3 bg-white flex flex-col justify-between hover:shadow-md transition">
                          <div className="space-y-3">
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                              <img src={bn.image_url} alt={bn.title} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-xs">
                                  Thứ tự: {bn.display_order}
                                </span>
                              </div>
                              <div className="absolute top-2 right-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                                  bn.status === 1 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-rose-500 text-white'
                                }`}>
                                  {bn.status === 1 ? 'Hiển thị' : 'Đang ẩn'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{bn.title}</h4>
                              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 truncate" title={bn.link_url || '/'}>
                                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="font-mono text-slate-500 truncate">{bn.link_url || '/'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                            <button
                              onClick={() => handleToggleBannerStatus(bn)}
                              title={bn.status === 1 ? 'Tạm ẩn banner' : 'Hiển thị banner lên trang chủ'}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                                bn.status === 1
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {bn.status === 1 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{bn.status === 1 ? 'Tạm ẩn' : 'Hiển thị'}</span>
                            </button>

                            <button
                              onClick={() => setEditingBanner({ ...bn, tempUploaded: null })}
                              title="Chỉnh sửa banner"
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeletingBanner(bn)}
                              title="Xóa banner vĩnh viễn"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: QUẢN LÝ TÀI KHOẢN QUẢN TRỊ */}
              {activeTab === 'admins' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Tài Khoản Quản Trị</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Chỉ Admin Tổng có quyền tạo tài khoản Admin Chi nhánh, phân quyền chi nhánh và khóa/mở khóa tài khoản.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddAdminModal(true)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer shrink-0 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Admin Chi nhánh</span>
                    </button>
                  </div>

                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Tổng Tài Khoản</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{adminUsers.length}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <div className="text-[11px] font-bold text-purple-700 uppercase">Admin Tổng</div>
                      <div className="text-2xl font-black text-purple-900 mt-1">
                        {adminUsers.filter(u => u.role_id === 1).length}
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <div className="text-[11px] font-bold text-emerald-700 uppercase">Admin Chi nhánh</div>
                      <div className="text-2xl font-black text-emerald-900 mt-1">
                        {adminUsers.filter(u => u.role_id === 2).length}
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <div className="text-[11px] font-bold text-amber-700 uppercase">Đang Hoạt Động</div>
                      <div className="text-2xl font-black text-amber-900 mt-1">
                        {adminUsers.filter(u => u.status === 1).length} / {adminUsers.length}
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                          <th className="py-3 px-4">Mã</th>
                          <th className="py-3 px-4">Họ và tên</th>
                          <th className="py-3 px-4">Số điện thoại</th>
                          <th className="py-3 px-4">Vai trò</th>
                          <th className="py-3 px-4">Chi nhánh</th>
                          <th className="py-3 px-4">Trạng thái</th>
                          <th className="py-3 px-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminUsers.map((u) => {
                          const isSuperAdmin = u.role_id === 1 || u.id === 1;
                          const isLocked = u.status === 0;

                          return (
                            <tr key={u.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono font-bold text-slate-400">#{u.id}</td>
                              <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                                <span>{u.full_name}</span>
                                {isSuperAdmin && (
                                  <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                                    Gốc
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-brand-700">{u.phone}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1 ${isSuperAdmin
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}>
                                  {u.role_name || (isSuperAdmin ? 'Admin Tổng' : 'Admin Chi nhánh')}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600 font-medium">
                                {u.branch_name || (isSuperAdmin ? 'Toàn hệ thống' : 'Chi nhánh 1')}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1 ${isLocked
                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  }`}>
                                  {isLocked ? (
                                    <>
                                      <Lock className="w-3 h-3" />
                                      <span>Đã khóa</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Hoạt động</span>
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Chỉnh sửa thông tin Admin */}
                                  <button
                                    onClick={() => openEditAdminModal(u)}
                                    title="Chỉnh sửa thông tin quản trị viên"
                                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-bold">Chỉnh sửa</span>
                                  </button>

                                  {/* Đặt lại mật khẩu Admin */}
                                  <button
                                    onClick={() => openResetPasswordModal(u)}
                                    title="Đặt lại mật khẩu quản trị viên"
                                    className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition cursor-pointer flex items-center gap-1.5"
                                  >
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-bold">Đặt lại mật khẩu</span>
                                  </button>

                                  {u.id === 1 ? (
                                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-1 rounded-lg">
                                      Tài khoản gốc
                                    </span>
                                  ) : (
                                    <>
                                      {/* Phân quyền chức năng cho Admin Chi nhánh */}
                                      <button
                                        onClick={() => openAssignPermissionsModal(u)}
                                        title="Phân quyền chức năng cho Admin Chi nhánh"
                                        className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition cursor-pointer flex items-center gap-1.5"
                                      >
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-bold">Phân quyền</span>
                                      </button>

                                      {/* Khóa / Mở khóa tài khoản */}
                                      <button
                                        onClick={() => isLocked ? openUnlockModal(u) : openLockModal(u)}
                                        title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${isLocked
                                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                            : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                                          }`}
                                      >
                                        {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                        <span className="text-[11px] font-bold">{isLocked ? 'Mở khóa' : 'Khóa tài khoản'}</span>
                                      </button>

                                      {/* Xóa tài khoản */}
                                      <button
                                        onClick={() => openDeleteModal(u)}
                                        title="Xóa tài khoản vĩnh viễn"
                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 7: QUẢN LÝ KHÁCH HÀNG (FR-040 & UC-18) */}
              {activeTab === 'customers' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  {/* Header & Quick Stats */}
                  <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Danh Sách Khách Hàng (FR-040)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Hồ sơ người mua hàng, lịch sử mua sắm và trạng thái tài khoản</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200/60">
                        Tổng: <b className="text-slate-900">{customers.length}</b>
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Hoạt động: <b>{customers.filter(c => c.status === 1).length}</b>
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 font-bold border border-red-200/60 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Đã khóa: <b>{customers.filter(c => c.status === 0).length}</b>
                      </span>
                    </div>
                  </div>

                  {/* Thanh tìm kiếm & lọc trạng thái (FR-040 Chức năng 1) */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm khách hàng theo họ tên, số điện thoại, địa chỉ..."
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value);
                          setCustomerPage(1);
                        }}
                        className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-sans"
                      />
                      {customerSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomerSearch('');
                            setCustomerPage(1);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={customerStatusFilter}
                        onChange={(e) => {
                          setCustomerStatusFilter(e.target.value);
                          setCustomerPage(1);
                        }}
                        className="text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans cursor-pointer bg-white"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Đang hoạt động</option>
                        <option value="0">Đã bị khóa</option>
                      </select>

                      {(customerSearch || customerStatusFilter !== '') && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomerSearch('');
                            setCustomerStatusFilter('');
                            setCustomerPage(1);
                          }}
                          className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Xóa lọc
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bảng danh sách khách hàng */}
                  {filteredCustomers.length === 0 ? (
                    <div className="text-center py-14 space-y-2 border border-dashed border-slate-200 rounded-2xl">
                      <Users className="w-10 h-10 text-slate-300 mx-auto" />
                      <div className="font-bold text-slate-700 text-sm">Không tìm thấy khách hàng nào phù hợp</div>
                      <p className="text-xs text-slate-400">Hãy thử nhập từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái khác</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                            <th className="py-3 px-3">Mã</th>
                            <th className="py-3 px-3">Họ và tên</th>
                            <th className="py-3 px-3">Số điện thoại</th>
                            <th className="py-3 px-3">Địa chỉ</th>
                            <th className="py-3 px-3">Số đơn</th>
                            <th className="py-3 px-3">Tổng chi tiêu</th>
                            <th className="py-3 px-3">Trạng thái</th>
                            <th className="py-3 px-3 text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedCustomers.map((cu) => (
                            <tr key={cu.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-3 font-mono font-bold text-slate-400">#{cu.id}</td>
                              <td className="py-3 px-3 font-bold text-slate-900">{cu.full_name}</td>
                              <td className="py-3 px-3 font-mono font-bold text-brand-700">{cu.phone}</td>
                              <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={cu.address || '-'}>
                                {cu.address || '-'}
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-800">{cu.total_orders} đơn</td>
                              <td className="py-3 px-3 font-black text-brand-700">
                                {parseFloat(cu.total_spent).toLocaleString('vi-VN')} đ
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                {cu.status === 1 ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60 inline-flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Hoạt động
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200/60 inline-flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    Đã khóa
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                                {/* Xem chi tiết khách hàng */}
                                <button
                                  type="button"
                                  onClick={() => handleViewCustomerDetail(cu)}
                                  className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer border border-brand-200/60"
                                  title="Xem chi tiết hồ sơ & lịch sử đơn hàng (FR-040)"
                                >
                                  <Eye className="w-3 h-3" /> Chi tiết
                                </button>

                                {/* Khóa / Mở khóa tài khoản (BR-027) */}
                                {cu.status === 1 ? (
                                  <button
                                    type="button"
                                    onClick={() => openLockModal(cu)}
                                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer border border-amber-200"
                                    title="Khóa tài khoản khách hàng này"
                                  >
                                    <Lock className="w-3 h-3" /> Khóa
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openUnlockModal(cu)}
                                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer border border-emerald-200"
                                    title="Mở khóa tài khoản cho khách hàng"
                                  >
                                    <Unlock className="w-3 h-3" /> Mở khóa
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Phân trang khách hàng */}
                  {filteredCustomers.length > 0 && (
                    <Pagination
                      currentPage={customerPage}
                      totalItems={filteredCustomers.length}
                      pageSize={customerPageSize}
                      onPageChange={setCustomerPage}
                      onPageSizeChange={setCustomerPageSize}
                      pageSizeOptions={[5, 10, 20, 50]}
                      itemName="khách hàng"
                    />
                  )}
                </div>
              )}

              {/* TAB 8: NHẬT KÝ HỆ THỐNG AUDIT LOGS (FR-045 & BR-030) */}
              {activeTab === 'logs' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-6 p-6">
                  {/* Header & Quyền truy cập */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <span>Nhật Ký Kiểm Toán Hệ Thống (FR-045)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Theo dõi toàn bộ hoạt động của người dùng và quản trị viên kèm Địa chỉ IP thực tế (Quy tắc BR-030)
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold shadow-xs">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Chỉ Admin Tổng (BR-025)</span>
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
                          {(logStats.today || logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length).toLocaleString('vi-VN')}
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
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
                      <h4 className="font-heading font-black text-slate-900 text-base">Không tìm thấy bản ghi nhật ký phù hợp</h4>
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
                                {new Date(l.created_at).toLocaleString('vi-VN')}
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
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  l.module === 'ORDER' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                  l.module === 'PRODUCT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                  l.module === 'SYSTEM' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                  l.module === 'AUTH' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                                  l.module === 'PROMOTION' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                  l.module === 'BRANCH' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                                  l.module === 'BANNER' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                                  l.module === 'SHIPMENT' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                                  'bg-slate-100 text-slate-800 border border-slate-200'
                                }`}>
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

                  {/* Banner Quy tắc nghiệp vụ BR-030 & Toàn vẹn kiểm toán */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>
                        <strong className="text-slate-800 font-bold">Quy tắc nghiệp vụ FR-045 & BR-030:</strong> Nhật ký kiểm toán được lưu vĩnh viễn, không cho phép sửa hoặc xóa dưới mọi hình thức.
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      Hiển thị {paginatedLogs.length} / {filteredLogs.length} bản ghi
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 9: BÁO CÁO & DOANH THU */}
              {activeTab === 'reports' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <span>Top Sản Phẩm Bán Chạy Nhất</span>
                    </h3>
                    {(!stats.topProducts || stats.topProducts.length === 0) ? (
                      <p className="text-xs text-slate-400 py-6 text-center">Chưa có dữ liệu giao dịch phát sinh</p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {stats.topProducts.map((tp) => (
                          <div key={tp.id} className="py-3 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img src={tp.thumbnail} alt={tp.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                              <div>
                                <div className="font-bold text-slate-800">{tp.name}</div>
                                <div className="text-[11px] text-slate-400">{parseFloat(tp.price).toLocaleString('vi-VN')} đ</div>
                              </div>
                            </div>
                            <span className="font-black text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                              Đã bán: {tp.sold_count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                      <span>Phân Phối Đơn Hàng Theo Trạng Thái</span>
                    </h3>
                    {(!stats.orderCounts || stats.orderCounts.length === 0) ? (
                      <p className="text-xs text-slate-400 py-6 text-center">Chưa có đơn hàng nào trong hệ thống</p>
                    ) : (
                      <div className="space-y-3">
                        {stats.orderCounts.map((oc) => (
                          <div key={oc.order_status} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="font-bold text-slate-700">{oc.order_status}</span>
                            <span className="bg-brand-600 text-white font-black px-3 py-1 rounded-full">
                              {oc.count} đơn
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 11: CẤU HÌNH WEBSITE (FR-043) */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6">
                  {/* Header & Nút lưu */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-emerald-600" />
                        <span>Cấu Hình Website Hệ Thống (FR-043)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Quản lý nhận diện thương hiệu, thông số vận hành và các văn bản chính sách pháp lý (Chỉ Admin Tổng)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={savingSettings}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-600/20 cursor-pointer transition"
                    >
                      {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>{savingSettings ? 'Đang lưu...' : 'Lưu Cấu Hình Website'}</span>
                    </button>
                  </div>

                  {/* Form 3 Khối Thẻ */}
                  <form onSubmit={handleSaveSettings} noValidate className="space-y-6">
                    {/* Khối 1: Thông tin thương hiệu & Liên hệ */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-sm text-slate-900">Thông Tin Thương Hiệu & Liên Hệ</h3>
                          <p className="text-[11px] text-slate-500">Thông tin xuất hiện ở tiêu đề trang, Header, Footer và hóa đơn</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Tên website / Thương hiệu *</label>
                          <input
                            type="text"
                            required
                            placeholder="Đổ Đống 4 Mùa"
                            value={siteSettings.site_name || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Hotline chăm sóc khách hàng *</label>
                          <input
                            type="text"
                            required
                            placeholder="0901.234.567"
                            value={siteSettings.hotline || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, hotline: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium font-mono focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Email hỗ trợ & liên hệ *</label>
                          <input
                            type="email"
                            required
                            placeholder="hotro@dodong4mua.vn"
                            value={siteSettings.contact_email || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Địa chỉ trụ sở công ty *</label>
                          <input
                            type="text"
                            required
                            placeholder="53 Võ Văn Ngân, TP. Thủ Đức, TP.HCM"
                            value={siteSettings.company_address || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, company_address: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500"
                          />
                        </div>
                      </div>

                      {/* Logo Upload & Preview */}
                      <div className="pt-2">
                        <label className="block font-bold text-slate-700 mb-1.5 text-xs">Logo nhận diện thương hiệu</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                          <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {siteSettings.logo_url ? (
                              <img src={siteSettings.logo_url} alt="Logo Preview" className="w-full h-full object-contain p-1" />
                            ) : (
                              <Leaf className="w-8 h-8 text-emerald-600" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2 text-xs w-full">
                            <div className="flex items-center gap-3">
                              <label className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl border border-emerald-200 transition cursor-pointer inline-flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Tải logo từ máy tính</span>
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                  onChange={(e) => handleFileUpload(e, 'settings_logo')}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP &le; 5MB</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400 shrink-0">Hoặc dán URL:</span>
                              <input
                                type="text"
                                placeholder="/logo.png hoặc https://..."
                                value={siteSettings.logo_url || ''}
                                onChange={(e) => setSiteSettings({ ...siteSettings, logo_url: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-500 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Khối 2: Cài đặt giao vận & Đơn hàng */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-sm text-slate-900">Cấu Hình Giao Vận & Đơn Hàng</h3>
                          <p className="text-[11px] text-slate-500">Thiết lập mức phí vận chuyển mặc định và đối tác giao nhận</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm shadow-teal-600/20">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                              Đối Tác Vận Chuyển Mặc Định (BR-022)
                            </div>
                            <div className="font-heading font-black text-sm text-teal-950 flex items-center gap-2 mt-0.5">
                              <span>GreenSM (GSM Logistics)</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Đang kích hoạt
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-teal-800 sm:text-right">
                          <p className="font-medium text-[11px] text-teal-700">Giao hàng hỏa tốc và tiêu chuẩn qua tài xế GreenSM</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Cước phí tự động áp dụng theo biểu cước bên dưới</p>
                        </div>
                      </div>

                      {/* Bảng Nấc Cước Phí Vận Chuyển Theo Khoảng Cách (FR-044 & BR-023) */}
                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-heading font-black text-xs text-slate-900 flex items-center gap-1.5">
                              <Truck className="w-4 h-4 text-emerald-600" />
                              <span>Biểu Cước Phí Vận Chuyển Theo Khoảng Cách (FR-044)</span>
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Hệ thống tự động tính cước giao GreenSM dựa trên bán kính khoảng cách khi khách hàng đặt hàng (BR-023)
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAddShippingFeeModal(true)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer self-start sm:self-auto"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Thêm Nấc Phí</span>
                          </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                                <th className="py-2.5 px-3">Gói / Nấc cước</th>
                                <th className="py-2.5 px-3">Khoảng cách (km)</th>
                                <th className="py-2.5 px-3">Mức phí giao hàng</th>
                                <th className="py-2.5 px-3">Trạng thái</th>
                                <th className="py-2.5 px-3 text-right">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {shippingFees.length === 0 ? (
                                <tr>
                                  <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">
                                    Chưa có nấc phí vận chuyển nào. Bấm &quot;Thêm Nấc Phí&quot; để thiết lập.
                                  </td>
                                </tr>
                              ) : (
                                shippingFees.map((sf) => (
                                  <tr key={sf.id} className="hover:bg-slate-50/70 transition">
                                    <td className="py-2.5 px-3 font-bold text-slate-900">
                                      {sf.name}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                        {parseFloat(sf.min_km)} km - {parseFloat(sf.max_km)} km
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 font-bold text-emerald-700">
                                      {parseFloat(sf.fee).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        sf.status === 1 
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                                      }`}>
                                        {sf.status === 1 ? 'Đang áp dụng' : 'Tạm dừng'}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleShippingFeeStatus(sf)}
                                          title={sf.status === 1 ? 'Tạm dừng áp dụng nấc phí này' : 'Kích hoạt lại nấc phí'}
                                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                                            sf.status === 1
                                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                          }`}
                                        >
                                          {sf.status === 1 ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setEditingShippingFee({ ...sf })}
                                          title="Chỉnh sửa nấc cước"
                                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setDeletingShippingFee(sf)}
                                          title="Xóa nấc cước"
                                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Khối 3: Chính sách & Điều khoản pháp lý */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                          3
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-sm text-slate-900">Chính Sách & Điều Khoản Pháp Lý</h3>
                          <p className="text-[11px] text-slate-500">Các cam kết về quyền lợi khách hàng, bảo mật và bao ăn 1 đổi 1</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            1. Chính sách đổi trả &quot;Bao ăn 1 đổi 1 trong 24 giờ&quot; *
                          </label>
                          <textarea
                            rows={3}
                            value={siteSettings.exchange_policy || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, exchange_policy: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500 leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            2. Chính sách giao hàng (Siêu tốc 2 giờ nội thành) *
                          </label>
                          <textarea
                            rows={3}
                            value={siteSettings.shipping_policy || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, shipping_policy: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500 leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            3. Chính sách bảo mật thông tin khách hàng *
                          </label>
                          <textarea
                            rows={3}
                            value={siteSettings.privacy_policy || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, privacy_policy: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500 leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            4. Điều khoản sử dụng dịch vụ *
                          </label>
                          <textarea
                            rows={3}
                            value={siteSettings.terms_of_service || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, terms_of_service: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500 leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Chỉ tài khoản Admin Tổng mới có quyền lưu cấu hình. Dữ liệu có hiệu lực tức thì sau khi lưu.</span>
                      </div>
                      <button
                        type="submit"
                        disabled={savingSettings}
                        className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 cursor-pointer transition"
                      >
                        {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{savingSettings ? 'Đang lưu cấu hình...' : 'Lưu Thay Đổi Cấu Hình'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 12: QUẢN LÝ THÔNG BÁO (FR-046) */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6 animate-in fade-in duration-200">
                  {/* Header & Quick Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Thông Báo Hệ Thống (FR-046)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Gửi thông báo đến khách hàng hoặc quản trị viên chi nhánh & theo dõi lịch sử gửi tin
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCreateNotificationModal(true)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Soạn Thông Báo Mới</span>
                    </button>
                  </div>

                  {/* Thống kê nhanh thông báo */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng tin gửi</div>
                        <div className="text-lg font-black text-slate-900">{notifications.length}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Toàn hệ thống</div>
                        <div className="text-lg font-black text-emerald-700">
                          {notifications.filter(n => n.recipient_type === 'ALL').length}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Khách hàng</div>
                        <div className="text-lg font-black text-amber-700">
                          {notifications.filter(n => n.recipient_type === 'CUSTOMERS').length}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quản trị viên</div>
                        <div className="text-lg font-black text-purple-700">
                          {notifications.filter(n => n.recipient_type === 'ADMINS').length}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thanh tìm kiếm & Bộ lọc đối tượng */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm tiêu đề, nội dung, người gửi..."
                        value={notificationSearch}
                        onChange={(e) => {
                          setNotificationSearch(e.target.value);
                          setNotificationPage(1);
                        }}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Đối tượng:</span>
                      <select
                        value={notificationRecipientFilter}
                        onChange={(e) => {
                          setNotificationRecipientFilter(e.target.value);
                          setNotificationPage(1);
                        }}
                        className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 bg-white"
                      >
                        <option value="ALL_FILTER">Tất cả đối tượng nhận</option>
                        <option value="ALL">Toàn hệ thống (ALL)</option>
                        <option value="CUSTOMERS">Chỉ Khách hàng (CUSTOMERS)</option>
                        <option value="ADMINS">Chỉ Quản trị viên (ADMINS)</option>
                      </select>
                    </div>
                  </div>

                  {/* Bảng danh sách lịch sử thông báo đã gửi */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50/90 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                          <th className="py-3 px-4">Tiêu đề thông báo</th>
                          <th className="py-3 px-4">Đối tượng nhận</th>
                          <th className="py-3 px-4">Nội dung tóm tắt</th>
                          <th className="py-3 px-4">Người gửi</th>
                          <th className="py-3 px-4 whitespace-nowrap">Thời gian gửi</th>
                          <th className="py-3 px-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedNotifications.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-10 text-center text-slate-400 text-xs">
                              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <div>Không tìm thấy thông báo nào phù hợp.</div>
                            </td>
                          </tr>
                        ) : (
                          paginatedNotifications.map((n) => (
                            <tr key={n.id} className="hover:bg-slate-50/70 transition">
                              <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                                <div className="truncate cursor-pointer hover:text-emerald-700" onClick={() => setSelectedNotificationDetail(n)}>
                                  {n.title}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                {n.recipient_type === 'CUSTOMERS' ? (
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                    Khách hàng
                                  </span>
                                ) : n.recipient_type === 'ADMINS' ? (
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                    Quản trị viên
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    Toàn hệ thống
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                                <div className="line-clamp-2 leading-relaxed">
                                  {n.content}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-bold text-slate-800">
                                  {n.sender_name || 'Admin Tổng'}
                                </div>
                                {n.sender_phone && (
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    {n.sender_phone}
                                  </div>
                                )}
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                                {new Date(n.created_at).toLocaleString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedNotificationDetail(n)}
                                    title="Xem chi tiết"
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingNotification(n)}
                                    title="Xóa thông báo"
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Phân trang thông báo */}
                  {filteredNotifications.length > 0 && (
                    <Pagination
                      currentPage={notificationPage}
                      totalItems={filteredNotifications.length}
                      pageSize={notificationPageSize}
                      onPageChange={setNotificationPage}
                      onPageSizeChange={setNotificationPageSize}
                      pageSizeOptions={[10, 15, 30, 50]}
                      itemName="thông báo"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-lg text-slate-900">Thêm Sản Phẩm 4 Mùa Mới</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateProduct} noValidate className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên trái cây *</label>
                <input
                  type="text" required placeholder="Ví dụ: Bơ Sáp 034 Đắk Lắk"
                  value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục</label>
                  <select
                    value={newProduct.category_id} onChange={(e) => setNewProduct({ ...newProduct, category_id: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                  >
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn vị</label>
                  <select
                    value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="trái">trái</option>
                    <option value="giỏ">giỏ</option>
                    <option value="combo">combo</option>
                    <option value="hộp">hộp</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá bán *</label>
                  <input
                    type="number" required placeholder="80000"
                    value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá KM</label>
                  <input
                    type="number" placeholder="65000"
                    value={newProduct.discount_price} onChange={(e) => setNewProduct({ ...newProduct, discount_price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tồn kho</label>
                  <input
                    type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hình ảnh sản phẩm (Upload từ máy tính: JPG, PNG, WEBP &le; 5MB) *
                </label>
                <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50/30 hover:bg-emerald-50/60 transition relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, 'product')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2 text-brand-700 py-3">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span className="font-bold text-xs">Đang tải ảnh từ máy tính lên hệ thống...</span>
                    </div>
                  ) : newProduct.thumbnail ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={newProduct.thumbnail}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-brand-300 shadow-sm"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-emerald-700 text-xs truncate">✓ Đã tải ảnh lên: {newProduct.thumbnail}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Bấm vào đây nếu muốn chọn đổi ảnh khác từ máy tính</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-slate-500">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-brand-600" />
                      <p className="font-bold text-xs text-brand-800">Bấm để chọn ảnh từ máy tính (Browse...)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Định dạng JPG, PNG, WEBP — Dung lượng tối đa 5 MB</p>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 shrink-0">Hoặc dán link:</span>
                  <input
                    type="text"
                    placeholder="https://... hoặc /uploads/..."
                    value={newProduct.thumbnail}
                    onChange={(e) => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả & Đặc điểm mùa vụ</label>
                <textarea
                  rows={2} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2.5">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 cursor-pointer">Hủy bỏ</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 rounded-xl font-bold text-white hover:bg-brand-700 cursor-pointer">Lưu Sản Phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA SẢN PHẨM */}
      {editProductModal.isOpen && editProductModal.product && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>Chỉnh Sửa Thông Tin Sản Phẩm</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mã sản phẩm: #{editProductModal.product.id} • {editProductModal.product.slug}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditProductModal({ isOpen: false, product: null, name: '', category_id: 1, price: '', discount_price: '', unit: 'kg', stock: 0, thumbnail: '', description: '', is_featured: 0, status: 1 })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên trái cây *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bơ Sáp 034 Đắk Lắk"
                  value={editProductModal.name}
                  onChange={(e) => setEditProductModal({ ...editProductModal, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục *</label>
                  <select
                    value={editProductModal.category_id}
                    onChange={(e) => setEditProductModal({ ...editProductModal, category_id: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn vị tính *</label>
                  <select
                    value={editProductModal.unit}
                    onChange={(e) => setEditProductModal({ ...editProductModal, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="trái">trái</option>
                    <option value="giỏ">giỏ</option>
                    <option value="combo">combo</option>
                    <option value="hộp">hộp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá bán gốc (đ) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="80000"
                    value={editProductModal.price}
                    onChange={(e) => setEditProductModal({ ...editProductModal, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá khuyến mãi (đ)</label>
                  <input
                    type="number"
                    placeholder="Để trống nếu không giảm"
                    value={editProductModal.discount_price}
                    onChange={(e) => setEditProductModal({ ...editProductModal, discount_price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tồn kho *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editProductModal.stock}
                    onChange={(e) => setEditProductModal({ ...editProductModal, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái kinh doanh</label>
                  <select
                    value={editProductModal.status}
                    onChange={(e) => setEditProductModal({ ...editProductModal, status: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Đang hiển thị</option>
                    <option value={0}>Đã ẩn khỏi website</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sản phẩm nổi bật</label>
                  <select
                    value={editProductModal.is_featured}
                    onChange={(e) => setEditProductModal({ ...editProductModal, is_featured: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Bình thường</option>
                    <option value={1}>Nổi bật trang chủ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hình ảnh sản phẩm (Upload từ máy tính: JPG, PNG, WEBP &le; 5MB)
                </label>
                <div className="border-2 border-dashed border-blue-300 rounded-2xl p-4 bg-blue-50/30 hover:bg-blue-50/60 transition relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, 'edit_product')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2 text-blue-700 py-3">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span className="font-bold text-xs">Đang tải ảnh từ máy tính lên hệ thống...</span>
                    </div>
                  ) : editProductModal.thumbnail ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={editProductModal.thumbnail}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-blue-300 shadow-sm"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-blue-700 text-xs truncate">✓ Đã tải ảnh lên: {editProductModal.thumbnail}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Bấm vào đây nếu muốn chọn đổi ảnh khác từ máy tính</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-slate-500">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <p className="font-bold text-xs text-blue-800">Bấm để chọn ảnh từ máy tính (Browse...)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Định dạng JPG, PNG, WEBP — Dung lượng tối đa 5 MB</p>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 shrink-0">Hoặc dán link:</span>
                  <input
                    type="text"
                    placeholder="https://... hoặc /uploads/..."
                    value={editProductModal.thumbnail}
                    onChange={(e) => setEditProductModal({ ...editProductModal, thumbnail: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              {/* QUẢN LÝ ẢNH PHỤ SẢN PHẨM */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-slate-800 text-xs">
                      Bộ sưu tập ảnh phụ chi tiết
                    </label>
                    <p className="text-[11px] text-slate-500">Mỗi sản phẩm có thể có nhiều ảnh phụ (JPG, PNG, WebP &le; 5MB)</p>
                  </div>
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileUpload(e, 'product_extra')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploadingImage}
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/20 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4 shrink-0" />
                      <span>Thêm ảnh phụ</span>
                    </button>
                  </div>
                </div>

                {editProductModal.extraImages && editProductModal.extraImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {editProductModal.extraImages.map((img) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-square flex items-center justify-center">
                        <img src={img.image_url} alt="Ảnh phụ" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleDeleteExtraImage(img.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-110 transition shadow cursor-pointer text-xs font-bold"
                          title="Xóa ảnh này"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic py-1">
                    Chưa có ảnh phụ nào cho sản phẩm này. Bấm "+ Thêm ảnh phụ" để tải thêm ảnh chi tiết.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={editProductModal.description}
                  onChange={(e) => setEditProductModal({ ...editProductModal, description: e.target.value })}
                  placeholder="Mô tả nguồn gốc xuất xứ, hương vị, độ ngọt, mùa vụ..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditProductModal({ isOpen: false, product: null, name: '', category_id: 1, price: '', discount_price: '', unit: 'kg', stock: 0, thumbnail: '', description: '', is_featured: 0, status: 1 })}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white cursor-pointer transition shadow-md shadow-blue-600/20"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CATEGORY */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Thêm Danh Mục Mới</h3>
            <form onSubmit={handleCreateCategory} noValidate className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên danh mục *</label>
                <input
                  type="text" required placeholder="Ví dụ: Trái cây sấy dẻo"
                  value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={2} placeholder="Mô tả danh mục..."
                  value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 cursor-pointer">Hủy bỏ</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold cursor-pointer">Thêm Danh Mục</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA DANH MỤC */}
      {editCategoryModal.isOpen && editCategoryModal.category && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                <span>Chỉnh sửa danh mục</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditCategoryModal({ isOpen: false, category: null, name: '', description: '' })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateCategory} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Trái cây tươi"
                  value={editCategoryModal.name}
                  onChange={(e) => setEditCategoryModal({ ...editCategoryModal, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả danh mục..."
                  value={editCategoryModal.description}
                  onChange={(e) => setEditCategoryModal({ ...editCategoryModal, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditCategoryModal({ isOpen: false, category: null, name: '', description: '' })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-emerald-600/20"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD PROMOTION */}
      {showAddPromotionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-600" />
              <span>Thêm Chương Trình Khuyến Mãi</span>
            </h3>
            <form onSubmit={handleCreatePromotion} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chương trình khuyến mãi *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Siêu Sale Trái Cây Mùa Hè"
                  value={newPromotion.title}
                  onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mức giảm giá (%) * (từ 1% đến 100%)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    placeholder="10"
                    value={newPromotion.discount_percent}
                    onChange={(e) => setNewPromotion({ ...newPromotion, discount_percent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    required
                    value={newPromotion.start_date}
                    onChange={(e) => setNewPromotion({ ...newPromotion, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc *</label>
                  <input
                    type="date"
                    required
                    value={newPromotion.end_date}
                    onChange={(e) => setNewPromotion({ ...newPromotion, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả chương trình</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả tóm tắt nội dung ưu đãi..."
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPromotionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-brand-600/20"
                >
                  Tạo Khuyến Mãi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3B: EDIT PROMOTION */}
      {editPromotionModal.isOpen && editPromotionModal.promotion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-600" />
              <span>Chỉnh Sửa Chương Trình Khuyến Mãi</span>
            </h3>
            <form onSubmit={handleUpdatePromotion} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chương trình *</label>
                <input
                  type="text"
                  required
                  value={editPromotionModal.title}
                  onChange={(e) => setEditPromotionModal({ ...editPromotionModal, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức giảm (%) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={editPromotionModal.discount_percent}
                      onChange={(e) => setEditPromotionModal({ ...editPromotionModal, discount_percent: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={editPromotionModal.status}
                    onChange={(e) => setEditPromotionModal({ ...editPromotionModal, status: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value={1}>Đang áp dụng</option>
                    <option value={0}>Tạm dừng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    required
                    value={editPromotionModal.start_date}
                    onChange={(e) => setEditPromotionModal({ ...editPromotionModal, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc *</label>
                  <input
                    type="date"
                    required
                    value={editPromotionModal.end_date}
                    onChange={(e) => setEditPromotionModal({ ...editPromotionModal, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={2}
                  value={editPromotionModal.description}
                  onChange={(e) => setEditPromotionModal({ ...editPromotionModal, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                Lưu ý: Thay đổi mức giảm % hoặc trạng thái sẽ tự động đồng bộ lại giá khuyến mãi cho tất cả sản phẩm đang liên kết.
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditPromotionModal({ isOpen: false, promotion: null, title: '', description: '', discount_percent: 10, start_date: '', end_date: '', status: 1 })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-brand-600/20"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3C: ASSIGN PRODUCTS TO PROMOTION */}
      {assignProductsModal.isOpen && assignProductsModal.promotion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  <span>Sản Phẩm Áp Dụng: {assignProductsModal.promotion.title}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mức giảm: <strong className="text-rose-600 font-black">-{parseFloat(assignProductsModal.promotion.discount_percent)}%</strong> | Thời gian: {new Date(assignProductsModal.promotion.start_date).toLocaleDateString('vi-VN')} → {new Date(assignProductsModal.promotion.end_date).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignProductsModal({ isOpen: false, promotion: null, assignedProducts: [], selectedProductId: '', loading: false, conflictError: '' })}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Conflict Alert Banner */}
            {assignProductsModal.conflictError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-700 text-xs shrink-0 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-medium">{assignProductsModal.conflictError}</div>
              </div>
            )}

            {/* Add Product Form */}
            <form onSubmit={handleAddProductToPromotion} className="flex items-center gap-2 shrink-0">
              <select
                value={assignProductsModal.selectedProductId}
                onChange={(e) => setAssignProductsModal({ ...assignProductsModal, selectedProductId: e.target.value, conflictError: '' })}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">-- Chọn sản phẩm muốn áp dụng khuyến mãi --</option>
                {products
                  .filter((p) => !assignProductsModal.assignedProducts.some((ap) => ap.id === p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.id} - {p.name} ({new Intl.NumberFormat('vi-VN').format(p.price)}đ / {p.unit})
                    </option>
                  ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-md shadow-brand-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm vào KM</span>
              </button>
            </form>

            {/* List / Table of Assigned Products */}
            <div className="flex-1 overflow-y-auto border border-slate-100 rounded-2xl min-h-[180px]">
              {assignProductsModal.loading ? (
                <div className="text-center py-12 text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Đang tải danh sách sản phẩm...</span>
                </div>
              ) : assignProductsModal.assignedProducts.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <Package className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Chưa có sản phẩm nào được gán vào khuyến mãi này</p>
                  <p className="text-[11px] text-slate-400">Chọn sản phẩm ở ô bên trên và bấm "Thêm vào KM" để áp dụng mức giảm giá.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                    <tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3">Sản phẩm</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Giá gốc</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Giá sau giảm (-{parseFloat(assignProductsModal.promotion.discount_percent)}%)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Tồn kho</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignProductsModal.assignedProducts.map((p) => {
                      const calculatedDiscount = Math.round((p.price * (1 - parseFloat(assignProductsModal.promotion.discount_percent) / 100)) / 1000) * 1000;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              {p.thumbnail ? (
                                <img src={p.thumbnail} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                                  <Package className="w-4 h-4 text-slate-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-slate-900 leading-tight">{p.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">#{p.id} - {p.category_name || 'Nông sản'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-400 line-through whitespace-nowrap">
                            {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                          </td>
                          <td className="py-2.5 px-3 font-black text-rose-600 whitespace-nowrap">
                            {new Intl.NumberFormat('vi-VN').format(p.discount_price || calculatedDiscount)}đ
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-600">
                            {p.stock} {p.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleRemoveProductFromPromotion(p.id, p.name)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition text-xs cursor-pointer flex items-center gap-1 ml-auto"
                              title="Gỡ khỏi khuyến mãi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Gỡ bỏ</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end shrink-0 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignProductsModal({ isOpen: false, promotion: null, assignedProducts: [], selectedProductId: '', loading: false, conflictError: '' })}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD BRANCH */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Thêm Chi Nhánh Mới</h3>
            <form onSubmit={handleCreateBranch} noValidate className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chi nhánh *</label>
                <input
                  type="text" required placeholder="Chi nhánh Bình Thạnh"
                  value={newBranch.branch_name} onChange={(e) => setNewBranch({ ...newBranch, branch_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel" required placeholder="0901234567"
                  value={newBranch.phone} onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa chỉ *</label>
                <input
                  type="text" required placeholder="Số đường, phường, quận..."
                  value={newBranch.address} onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddBranchModal(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 cursor-pointer">Hủy bỏ</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold cursor-pointer">Thêm Chi Nhánh</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT BRANCH */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>Chỉnh Sửa Chi Nhánh</span>
              </h3>
              <button
                onClick={() => setEditingBranch(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateBranch} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chi nhánh *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chi nhánh Bình Thạnh"
                  value={editingBranch.branch_name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, branch_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0901234567"
                  value={editingBranch.phone}
                  onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa chỉ *</label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, đường, phường, quận..."
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trạng thái hoạt động</label>
                <select
                  value={editingBranch.status}
                  onChange={(e) => setEditingBranch({ ...editingBranch, status: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:border-brand-500"
                >
                  <option value={1}>Đang hoạt động</option>
                  <option value={0}>Ngừng hoạt động</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
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

      {/* MODAL TOGGLE STATUS BRANCH */}
      {toggleStatusBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                toggleStatusBranch.status === 1 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {toggleStatusBranch.status === 1 ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">
                  {toggleStatusBranch.status === 1 ? 'Tạm Ngưng Hoạt Động' : 'Mở Lại Hoạt Động'}
                </h3>
                <p className="text-xs text-slate-500">{toggleStatusBranch.branch_name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {toggleStatusBranch.status === 1 ? (
                <>
                  Bạn có chắc chắn muốn chuyển chi nhánh <strong className="text-slate-900 font-bold">{toggleStatusBranch.branch_name}</strong> sang trạng thái <strong className="text-amber-700">Ngừng hoạt động</strong>? Khi tạm ngưng, khách hàng sẽ không thấy chi nhánh này trên giao diện đặt hàng.
                </>
              ) : (
                <>
                  Bạn có muốn kích hoạt lại chi nhánh <strong className="text-slate-900 font-bold">{toggleStatusBranch.branch_name}</strong> hoạt động bình thường?
                </>
              )}
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setToggleStatusBranch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleBranchStatus}
                className={`px-5 py-2 text-white rounded-xl font-bold transition shadow-md cursor-pointer ${
                  toggleStatusBranch.status === 1
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {toggleStatusBranch.status === 1 ? 'Xác nhận ngưng' : 'Kích hoạt lại'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE BRANCH */}
      {deletingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">Xóa Chi Nhánh Cửa Hàng</h3>
                <p className="text-xs text-slate-500">{deletingBranch.branch_name}</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
              <strong>Lưu ý nghiệp vụ (BR-025):</strong> Hệ thống sẽ từ chối xóa nếu chi nhánh vẫn còn tài khoản nhân viên hoặc quản trị viên trực thuộc. Trong trường hợp đó, vui lòng chuyển chi nhánh sang trạng thái <strong>Ngừng hoạt động</strong>.
            </div>

            <p className="text-xs text-slate-600">
              Bạn có chắc chắn muốn xóa vĩnh viễn chi nhánh <strong className="text-slate-900 font-bold">{deletingBranch.branch_name}</strong> (Mã #{deletingBranch.id})? Hành động này không thể hoàn tác nếu không vi phạm ràng buộc dữ liệu.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingBranch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBranch}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD BANNER (FR-042) */}
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

      {/* MODAL 6: THÊM TÀI KHOẢN ADMIN CHI NHÁNH */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Thêm Admin Chi Nhánh</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Chỉ Admin Tổng có quyền tạo tài khoản quản trị</p>
              </div>
              <button onClick={() => setShowAddAdminModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateAdmin} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text" required placeholder="Nguyễn Văn A"
                  value={newAdmin.full_name} onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại đăng nhập *</label>
                <input
                  type="tel" required placeholder="09xxxxxxxx (duy nhất)"
                  value={newAdmin.phone} onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Số điện thoại đăng nhập phải là duy nhất</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu khởi tạo *</label>
                <input
                  type="password" required placeholder="Mật khẩu ít nhất 6 ký tự"
                  value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chi nhánh phân công phụ trách *</label>
                <select
                  value={newAdmin.branch_id}
                  onChange={(e) => setNewAdmin({ ...newAdmin, branch_id: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.branch_name} - {b.phone}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Cấp bậc vai trò</div>
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Admin Chi nhánh (role_id: 2)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                  * Hệ thống chỉ có 1 Admin Tổng duy nhất (Trần Vũ). Admin Tổng chỉ tạo và phân quyền cho Quản trị viên Chi nhánh.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-brand-600/20"
                >
                  Lưu Admin Chi Nhánh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA THÔNG TIN ADMIN */}
      {editAdminModal.isOpen && editAdminModal.admin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <span>Chỉnh Sửa Thông Tin Admin</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cập nhật tài khoản #{editAdminModal.admin.id} ({editAdminModal.admin.full_name})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditAdminModal({ isOpen: false, admin: null, full_name: '', phone: '', branch_id: 1 })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateAdminSubmit} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Họ và tên quản trị viên"
                  value={editAdminModal.full_name}
                  onChange={(e) => setEditAdminModal({ ...editAdminModal, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại đăng nhập *</label>
                <input
                  type="tel"
                  required
                  placeholder="09xxxxxxxx"
                  value={editAdminModal.phone}
                  onChange={(e) => setEditAdminModal({ ...editAdminModal, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Đảm bảo số điện thoại duy nhất trong hệ thống</p>
              </div>

              {editAdminModal.admin.id !== 1 && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chi nhánh phân công phụ trách *</label>
                  <select
                    value={editAdminModal.branch_id}
                    onChange={(e) => setEditAdminModal({ ...editAdminModal, branch_id: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.branch_name} - {b.phone}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Cấp bậc vai trò</div>
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${editAdminModal.admin.role_id === 1 ? 'bg-purple-600' : 'bg-blue-600'}`}></span>
                  <span>{editAdminModal.admin.role_name || (editAdminModal.admin.role_id === 1 ? 'Admin Tổng' : 'Admin Chi nhánh')}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditAdminModal({ isOpen: false, admin: null, full_name: '', phone: '', branch_id: 1 })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-blue-600/20"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ĐẶT LẠI MẬT KHẨU ADMIN */}
      {resetPasswordModal.isOpen && resetPasswordModal.admin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-600" />
                  <span>Đặt Lại Mật Khẩu Admin</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Admin Tổng cấp phát mật khẩu mới cho tài khoản #{resetPasswordModal.admin.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResetPasswordModal({ isOpen: false, admin: null, password: '', confirm_password: '' })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Target Admin Card */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <div className="font-heading font-black text-sm text-purple-950">
                  {resetPasswordModal.admin.full_name}
                </div>
                <div className="text-[11px] text-purple-800 font-medium mt-0.5">
                  Số điện thoại: {resetPasswordModal.admin.phone}
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-purple-200 text-purple-900 rounded-full">
                {resetPasswordModal.admin.role_name || 'Admin Chi nhánh'}
              </span>
            </div>

            <form onSubmit={handleResetPasswordSubmit} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu mới *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập mật khẩu mới ít nhất 6 ký tự"
                  value={resetPasswordModal.password}
                  onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  value={resetPasswordModal.confirm_password}
                  onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, confirm_password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {resetPasswordModal.password && resetPasswordModal.confirm_password && resetPasswordModal.password !== resetPasswordModal.confirm_password && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1">Mật khẩu xác nhận không khớp!</p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetPasswordModal({ isOpen: false, admin: null, password: '', confirm_password: '' })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-purple-600/20"
                >
                  Lưu mật khẩu mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PHÂN QUYỀN CHỨC NĂNG CHO ADMIN CHI NHÁNH */}
      {permissionModal.isOpen && permissionModal.admin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900 leading-tight">
                    Phân quyền chức năng
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chỉ định các quyền hạn và tính năng được phép truy cập cho tài khoản chi nhánh
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPermissionModal({ isOpen: false, admin: null, selectedIds: [], loading: false, saving: false })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Admin Info Banner */}
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3.5 flex items-center justify-between shrink-0">
              <div>
                <div className="font-heading font-black text-sm text-teal-950">
                  {permissionModal.admin.full_name}
                </div>
                <div className="text-[11px] text-teal-800 font-medium mt-0.5">
                  Số điện thoại: {permissionModal.admin.phone} • {permissionModal.admin.branch_name || 'Chi nhánh'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllPermissions}
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-teal-100 hover:bg-teal-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllPermissions}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            {/* Permissions List (10 modules from SRS) */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-200">
              {permissionModal.loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-600" />
                  Đang tải dữ liệu phân quyền...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {SRS_FUNCTIONAL_MODULES.map((mod, idx) => {
                    const isChecked = mod.permissionIds.every((id) => permissionModal.selectedIds.includes(id));
                    const isPartiallyChecked = !isChecked && mod.permissionIds.some((id) => permissionModal.selectedIds.includes(id));
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModulePermissions(mod)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${isChecked
                            ? 'bg-teal-50/60 border-teal-300 shadow-sm shadow-teal-500/5'
                            : isPartiallyChecked
                              ? 'bg-amber-50/40 border-amber-200'
                              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                      >
                        <div className="pt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => { }}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-teal-700 bg-teal-100/80 px-1.5 py-0.5 rounded-md">
                              {idx + 1}
                            </span>
                            <h4 className="font-heading font-black text-xs text-slate-900 leading-tight">
                              {mod.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug mt-1">
                            {mod.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100 shrink-0">
              <div className="text-xs font-bold text-slate-500">
                Đã chọn: <span className="text-teal-700 font-black">{SRS_FUNCTIONAL_MODULES.filter(m => m.permissionIds.every(id => permissionModal.selectedIds.includes(id))).length} / {SRS_FUNCTIONAL_MODULES.length}</span> nhóm chức năng
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPermissionModal({ isOpen: false, admin: null, selectedIds: [], loading: false, saving: false })}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={permissionModal.saving}
                  onClick={handleSavePermissionsSubmit}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-black text-xs cursor-pointer transition shadow-md shadow-teal-600/20 flex items-center gap-2"
                >
                  {permissionModal.saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu phân quyền</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN THAO TÁC TÀI KHOẢN (Đồng bộ chuẩn giao diện Đổ Đống 4 Mùa) */}
            {/* MODAL THAO TÁC ĐƠN HÀNG CHUẨN (Đổi trạng thái, Tạm dừng, Tiếp tục, Hủy đơn - Đổ Đống 4 Mùa) */}
      {orderActionModal.isOpen && orderActionModal.order && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={() => setOrderActionModal((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Top Icon with Brand Tint */}
            <div className="mb-3.5 flex justify-center">
              {orderActionModal.iconType === 'status' ? (
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              ) : orderActionModal.iconType === 'pause' ? (
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shadow-sm">
                  <Clock className="w-7 h-7" />
                </div>
              ) : orderActionModal.iconType === 'resume' ? (
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
                  <Play className="w-7 h-7" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-7 h-7" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1.5">{orderActionModal.title}</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed px-2">{orderActionModal.message}</p>

            {/* Thông tin vắn tắt đơn hàng */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-4 text-left flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Mã đơn hàng</div>
                <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">#{orderActionModal.order.order_code}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Khách nhận</div>
                <div className="font-bold text-slate-800 text-xs mt-0.5">{orderActionModal.order.receiver_name}</div>
              </div>
            </div>

            {/* Ô nhập lý do nếu là Tạm dừng hoặc Hủy đơn */}
            {orderActionModal.requireReason && (
              <div className="mb-4 text-left">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  Lý do {orderActionModal.actionType === 'PAUSE' ? 'tạm dừng' : 'hủy đơn'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={orderActionModal.reason}
                  onChange={(e) => setOrderActionModal((prev) => ({ ...prev, reason: e.target.value }))}
                  rows={2}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none font-sans"
                  placeholder={orderActionModal.actionType === 'PAUSE' ? 'Nhập lý do tạm dừng đơn hàng...' : 'Nhập lý do hủy đơn hàng...'}
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOrderActionModal((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={executeOrderActionModal}
                className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs text-white transition cursor-pointer shadow-sm ${orderActionModal.confirmColor}`}
              >
                {orderActionModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

            {/* MODAL CHI TIẾT KHÁCH HÀNG & LỊCH SỬ MUA HÀNG (FR-040 & UC-18) */}
      {selectedCustomerDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setSelectedCustomerDetail(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>{selectedCustomerDetail.full_name}</span>
                  <span className="font-mono text-xs font-bold text-slate-400">#{selectedCustomerDetail.id}</span>
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-mono">{selectedCustomerDetail.phone}</span>
                  <span>•</span>
                  <span>{selectedCustomerDetail.address || 'Chưa cập nhật địa chỉ'}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedCustomerDetail.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedCustomerDetail.status === 1 ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 py-4 shrink-0">
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70">
                <div className="text-[10px] uppercase font-bold text-slate-400">Tổng số đơn hàng</div>
                <div className="text-xl font-black text-slate-900 mt-0.5">{selectedCustomerDetail.total_orders || 0} đơn</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70">
                <div className="text-[10px] uppercase font-bold text-slate-400">Tổng chi tiêu tích lũy</div>
                <div className="text-xl font-black text-brand-700 mt-0.5">
                  {parseFloat(selectedCustomerDetail.total_spent || 0).toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Lịch sử đơn hàng ({selectedCustomerDetail.orders ? selectedCustomerDetail.orders.length : 0})
              </div>

              {loadingCustomerDetail ? (
                <div className="text-center py-10 text-xs text-slate-400">Đang tải lịch sử mua hàng...</div>
              ) : !selectedCustomerDetail.orders || selectedCustomerDetail.orders.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Khách hàng chưa có đơn hàng nào
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                        <th className="py-2.5 px-3">Mã đơn</th>
                        <th className="py-2.5 px-3">Thời gian</th>
                        <th className="py-2.5 px-3">Thanh toán</th>
                        <th className="py-2.5 px-3">Trạng thái</th>
                        <th className="py-2.5 px-3 text-right">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCustomerDetail.orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-2.5 px-3 font-mono font-bold text-brand-700">#{o.order_code}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                            {new Date(o.created_at).toLocaleString('vi-VN')}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[11px] font-bold text-slate-700">{o.payment_method || 'COD'}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.order_status === 'DA_GIAO' ? 'bg-emerald-100 text-emerald-800' :
                              o.order_status === 'DANG_GIAO' ? 'bg-teal-100 text-teal-800' :
                              o.order_status === 'DANG_CHUAN_BI' ? 'bg-blue-100 text-blue-800' :
                              o.order_status === 'TAM_DUNG' ? 'bg-yellow-100 text-yellow-800' :
                              o.order_status === 'DA_XAC_NHAN' ? 'bg-purple-100 text-purple-800' :
                              o.order_status === 'CHO_THANH_TOAN' ? 'bg-amber-100 text-amber-900' :
                              o.order_status === 'DA_HUY' ? 'bg-red-100 text-red-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {
                                o.order_status === 'CHO_THANH_TOAN' ? 'Chờ thanh toán' :
                                o.order_status === 'CHO_XAC_NHAN' ? 'Chờ xác nhận' :
                                o.order_status === 'DA_XAC_NHAN' ? 'Đã xác nhận' :
                                o.order_status === 'DANG_CHUAN_BI' ? 'Đang chuẩn bị' :
                                o.order_status === 'TAM_DUNG' ? 'Tạm dừng' :
                                o.order_status === 'DANG_GIAO' ? 'Đang giao' :
                                o.order_status === 'DA_GIAO' ? 'Đã giao' :
                                o.order_status === 'DA_HUY' ? 'Đã hủy' : o.order_status
                              }
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 text-right">
                            {parseFloat(o.total_amount).toLocaleString('vi-VN')} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 shrink-0 mt-3">
              <div>
                {selectedCustomerDetail.status === 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const cu = selectedCustomerDetail;
                      setSelectedCustomerDetail(null);
                      openLockModal(cu);
                    }}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Khóa tài khoản này
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const cu = selectedCustomerDetail;
                      setSelectedCustomerDetail(null);
                      openUnlockModal(cu);
                    }}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Mở khóa tài khoản
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomerDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {actionModal.isOpen && actionModal.targetUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={() => setActionModal({ isOpen: false, actionType: 'lock', targetUser: null })}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Top Icon with Brand Tint */}
            <div className="mb-3.5 flex justify-center">
              {actionModal.actionType === 'lock' ? (
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shadow-sm">
                  <Lock className="w-8 h-8" />
                </div>
              ) : actionModal.actionType === 'unlock' ? (
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-sm">
                  <Unlock className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shadow-sm">
                  <Trash2 className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Title & Subtitle */}
            <h4 className="font-heading font-black text-xl text-slate-900 mb-1">
              {actionModal.actionType === 'lock'
                ? 'Khóa tài khoản?'
                : actionModal.actionType === 'unlock'
                  ? 'Mở khóa tài khoản?'
                  : 'Xóa vĩnh viễn?'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mb-4">
              {actionModal.actionType === 'lock'
                ? 'Tài khoản quản trị này sẽ bị tạm dừng đăng nhập vào hệ thống.'
                : actionModal.actionType === 'unlock'
                  ? 'Khôi phục toàn bộ quyền truy cập và quản lý cho quản trị viên này.'
                  : 'Dữ liệu quản trị này sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu.'}
            </p>

            {/* User Info Card */}
            <div
              className={`rounded-2xl p-4 mb-5 border text-center ${actionModal.actionType === 'lock'
                  ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
                  : actionModal.actionType === 'unlock'
                    ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200/80 text-rose-950'
                }`}
            >
              <div className="font-heading font-black text-base tracking-tight">
                {actionModal.targetUser.full_name}
              </div>
              <div className="text-xs font-semibold mt-1 opacity-85 flex items-center justify-center gap-1.5">
                <span>Số điện thoại: {actionModal.targetUser.phone}</span>
                <span>•</span>
                <span>{actionModal.targetUser.role_name || (actionModal.targetUser.role_id === 3 ? 'Khách hàng' : 'Admin Chi nhánh')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setActionModal({ isOpen: false, actionType: 'lock', targetUser: null })}
                className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={executeActionModal}
                className={`py-2.5 px-4 rounded-xl font-black text-xs text-white transition cursor-pointer shadow-md ${actionModal.actionType === 'lock'
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                    : actionModal.actionType === 'unlock'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                  }`}
              >
                {actionModal.actionType === 'lock'
                  ? 'Khóa tài khoản'
                  : actionModal.actionType === 'unlock'
                    ? 'Mở khóa tài khoản'
                    : 'Xóa tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Modal Cửa Sổ Phụ: Chi Tiết Đơn Hàng (FR-030) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-lg font-bold">
                  📦
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                    <span>Chi Tiết Đơn Hàng</span>
                    <span className="font-mono text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200/60">{selectedOrder.order_code}</span>
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Thời gian đặt: {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('vi-VN') : '—'} • Xử lý: <strong className="text-slate-700">
                      {['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(selectedOrder.order_status) && !selectedOrder.processor_name ? (
                        <span className="text-slate-400 italic font-normal">Chưa tiếp nhận</span>
                      ) : selectedOrder.order_status === 'DA_HUY' && (!selectedOrder.processor_name || selectedOrder.processor_name === selectedOrder.receiver_name) ? (
                        <span className="text-red-600 font-medium">Khách hàng hủy</span>
                      ) : (
                        selectedOrder.processor_name || 'Admin Tổng'
                      )}
                    </strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* 2 Cột thông tin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thông tin khách hàng & nhận hàng */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs pb-1.5 border-b border-slate-200/60">
                    <User className="w-4 h-4 text-brand-600" /> Thông Tin Khách Hàng (FR-030)
                  </div>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Người nhận:</span>
                      <strong className="text-slate-900 font-bold">{selectedOrder.receiver_name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số điện thoại:</span>
                      <strong className="text-slate-900 font-mono">{selectedOrder.phone}</strong>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-slate-500 shrink-0">Địa chỉ nhận:</span>
                      <span className="text-slate-900 text-right font-medium">{selectedOrder.address}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2 pt-1 border-t border-slate-200/50">
                      <span className="text-slate-500 shrink-0">Ghi chú:</span>
                      <span className="text-slate-900 text-right font-medium italic">
                        {selectedOrder.note && selectedOrder.note.trim() ? selectedOrder.note : 'Không có ghi chú'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin vận chuyển & thanh toán */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs pb-1.5 border-b border-slate-200/60">
                    <Truck className="w-4 h-4 text-emerald-600" /> Thanh Toán & Vận Chuyển
                  </div>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Hình thức:</span>
                      <strong className="text-slate-900">{selectedOrder.payment_method || 'COD'}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Thanh toán:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedOrder.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedOrder.payment_status === 'PAID' ? 'ĐÃ THU TIỀN' : 'CHƯA THU'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/40">
                      <span className="text-slate-500">Đơn vị vận chuyển:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        {selectedOrder.shipping_company || 'GreenSM'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Mã vận đơn:</span>
                      <strong className="font-mono text-slate-800">{selectedOrder.tracking_code && ['DANG_GIAO', 'DA_GIAO'].includes(selectedOrder.order_status) ? selectedOrder.tracking_code : 'Chưa tạo (chờ giao hàng)'}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Trạng thái đơn:</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        selectedOrder.order_status === 'DA_GIAO' ? 'bg-emerald-100 text-emerald-800' :
                        selectedOrder.order_status === 'DANG_GIAO' ? 'bg-teal-100 text-teal-800' :
                        selectedOrder.order_status === 'DANG_CHUAN_BI' ? 'bg-blue-100 text-blue-800' :
                        selectedOrder.order_status === 'TAM_DUNG' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.order_status === 'DA_XAC_NHAN' ? 'bg-purple-100 text-purple-800' :
                        selectedOrder.order_status === 'CHO_THANH_TOAN' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        selectedOrder.order_status === 'DA_HUY' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedOrder.order_status === 'CHO_THANH_TOAN' ? 'Chờ thanh toán (VietQR)' :
                         selectedOrder.order_status === 'CHO_XAC_NHAN' ? 'Chờ xác nhận (COD)' :
                         selectedOrder.order_status === 'DA_XAC_NHAN' ? 'Đã duyệt (Tiếp nhận)' :
                         selectedOrder.order_status === 'DANG_CHUAN_BI' ? 'Đang chuẩn bị hàng' :
                         selectedOrder.order_status === 'TAM_DUNG' ? 'Tạm dừng xử lý' :
                         selectedOrder.order_status === 'DANG_GIAO' ? 'Đang giao GreenSM' :
                         selectedOrder.order_status === 'DA_GIAO' ? 'Giao thành công' :
                         selectedOrder.order_status === 'DA_HUY' ? 'Đã hủy đơn' : selectedOrder.order_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bảng danh sách sản phẩm trong đơn */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 font-bold text-slate-800 text-xs border-b border-slate-200 flex items-center justify-between">
                  <span>Danh Sách Sản Phẩm Mua</span>
                  <span className="text-slate-500 font-normal">{selectedOrder.items?.length || 0} sản phẩm</span>
                </div>
                {loadingOrderDetail ? (
                  <div className="p-6 text-center text-slate-400">Đang tải chi tiết các món...</div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/60 text-slate-500 text-[11px] border-b border-slate-100">
                      <tr>
                        <th className="py-2 px-3">Tên trái cây</th>
                        <th className="py-2 px-3 text-center">ĐVT</th>
                        <th className="py-2 px-3 text-right">Đơn giá</th>
                        <th className="py-2 px-3 text-center">Số lượng</th>
                        <th className="py-2 px-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.product_name} className="w-8 h-8 rounded-lg object-cover border" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs">🍇</div>
                              )}
                              <span className="font-bold text-slate-800">{item.product_name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-center text-slate-500">{item.unit || 'kg'}</td>
                          <td className="py-2 px-3 text-right text-slate-700">
                            {parseFloat(item.unit_price || 0).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-slate-900">
                            x{item.quantity}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">
                            {parseFloat(item.total_price || (item.unit_price * item.quantity) || 0).toLocaleString('vi-VN')} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Tóm tắt tổng tiền */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tiền hàng (Tạm tính):</span>
                  <span className="font-medium">{parseFloat(selectedOrder.subtotal || (parseFloat(selectedOrder.total_amount || 0) - parseFloat(selectedOrder.shipping_fee || 0)) || 0).toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển (GreenSM):</span>
                  <span className="font-medium">{parseFloat(selectedOrder.shipping_fee || 0).toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-sm font-black text-brand-700 pt-2 border-t border-slate-200">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-base">{parseFloat(selectedOrder.total_amount || 0).toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Lịch Sử Xử Lý Đơn Hàng (SRS FR-030) */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                <div className="font-bold text-slate-900 flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span>Lịch Sử Xử Lý Đơn Hàng (FR-030)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {selectedOrder.logs?.length || 1} mốc xử lý
                  </span>
                </div>

                <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedOrder.logs && selectedOrder.logs.length > 0 ? (
                    selectedOrder.logs.map((log, idx) => (
                      <div key={log.id || idx} className="relative text-xs">
                        <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 border-2 border-white ring-2 ring-brand-100" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <strong className="text-slate-900 font-bold">{log.title || log.action}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.created_at).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{log.description}</p>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Người xử lý: <span className="font-medium text-slate-700">{log.user_name || 'Admin'}</span>
                          {log.role_name && <span className="text-slate-400"> ({log.role_name})</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative text-xs">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 border-2 border-white ring-2 ring-brand-100" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <strong className="text-slate-900 font-bold">Khách hàng đặt hàng</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('vi-VN') : '—'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Khách hàng {selectedOrder.receiver_name} đặt đơn qua {selectedOrder.payment_method || 'COD'}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Người xử lý: <span className="font-medium text-slate-700">{selectedOrder.receiver_name}</span> (Khách hàng)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer: Nút xử lý & Nút Đóng */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                {selectedOrder.payment_status !== 'PAID' && selectedOrder.order_status !== 'DA_HUY' && (
                  <button
                    onClick={() => {
                      requestConfirm({
                        title: 'Xác Nhận Đã Thu Tiền (FR-032)',
                        message: `Xác nhận đã thu đủ ${parseFloat(selectedOrder.total_amount || 0).toLocaleString('vi-VN')} đ cho đơn ${selectedOrder.order_code}?`,
                        confirmText: 'Xác nhận thu tiền',
                        type: 'success',
                        onConfirm: () => handleUpdateOrderStatus(
                          selectedOrder.order_code,
                          ['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(selectedOrder.order_status) ? 'DA_XAC_NHAN' : null,
                          ['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(selectedOrder.order_status) ? 'DA_TAO_VAN_DON' : null,
                          'PAID'
                        ),
                      });
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    ✓ Đã thu tiền
                  </button>
                )}

                {['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(selectedOrder.order_status) && (
                  <button
                    onClick={() => promptChangeOrderStatus(selectedOrder, 'DA_XAC_NHAN', 'DA_TAO_VAN_DON', 'Duyệt đơn')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Duyệt đơn
                  </button>
                )}

                {selectedOrder.order_status === 'DA_XAC_NHAN' && (
                  <button
                    onClick={() => promptChangeOrderStatus(selectedOrder, 'DANG_CHUAN_BI', null, 'Đóng gói')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Đóng gói
                  </button>
                )}

                {selectedOrder.order_status === 'DANG_CHUAN_BI' && (
                  <button
                    onClick={() => promptChangeOrderStatus(selectedOrder, 'DANG_GIAO', 'DANG_GIAO', 'Bàn giao GreenSM')}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Bàn giao GreenSM
                  </button>
                )}

                {selectedOrder.order_status === 'DANG_GIAO' && (
                  <button
                    onClick={() => promptChangeOrderStatus(selectedOrder, 'DA_GIAO', 'GIAO_THANH_CONG', 'Hoàn tất giao hàng')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Hoàn tất giao hàng
                  </button>
                )}

                {/* Tạm dừng / Tiếp tục trong modal */}
                {['CHO_XAC_NHAN', 'CHO_THANH_TOAN', 'DA_XAC_NHAN', 'DANG_CHUAN_BI'].includes(selectedOrder.order_status) && (
                  <button
                    onClick={() => promptPauseOrder(selectedOrder)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Tạm dừng
                  </button>
                )}
                {selectedOrder.order_status === 'TAM_DUNG' && (
                  <button
                    onClick={() => promptResumeOrder(selectedOrder)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Tiếp tục xử lý
                  </button>
                )}

                {/* Hủy đơn trong modal */}
                {!['DANG_GIAO', 'DA_GIAO', 'DA_HUY'].includes(selectedOrder.order_status) && (
                  <button
                    onClick={() => promptCancelOrder(selectedOrder)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold cursor-pointer transition"
                  >
                    Hủy đơn
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

            {/* MODAL THÊM NẤC PHÍ VẬN CHUYỂN (FR-044 & BR-023) */}
      {showAddShippingFeeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span>Thêm Nấc Phí Vận Chuyển</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Thiết lập cước giao hàng GreenSM theo khoảng cách (FR-044)</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddShippingFeeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShippingFee} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên gói / nấc cước *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nội thành gần, Ngoại thành xa..."
                  value={newShippingFee.name}
                  onChange={(e) => setNewShippingFee({ ...newShippingFee, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khoảng cách từ (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    placeholder="0"
                    value={newShippingFee.min_km}
                    onChange={(e) => setNewShippingFee({ ...newShippingFee, min_km: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khoảng cách đến (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="5"
                    value={newShippingFee.max_km}
                    onChange={(e) => setNewShippingFee({ ...newShippingFee, max_km: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mức phí giao hàng (VNĐ) *</label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  required
                  placeholder="Ví dụ: 15000"
                  value={newShippingFee.fee}
                  onChange={(e) => setNewShippingFee({ ...newShippingFee, fee: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
                <p className="text-[10px] text-slate-400 mt-1">Cước phí giao hàng GreenSM áp dụng khi bán kính giao nằm trong khoảng này</p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddShippingFeeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Thêm Nấc Phí
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA NẤC PHÍ VẬN CHUYỂN (FR-044) */}
      {editingShippingFee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <span>Chỉnh Sửa Nấc Phí Vận Chuyển</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Cập nhật cước giao hàng #{editingShippingFee.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingShippingFee(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateShippingFee} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên gói / nấc cước *</label>
                <input
                  type="text"
                  required
                  value={editingShippingFee.name || ''}
                  onChange={(e) => setEditingShippingFee({ ...editingShippingFee, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khoảng cách từ (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={editingShippingFee.min_km}
                    onChange={(e) => setEditingShippingFee({ ...editingShippingFee, min_km: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khoảng cách đến (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={editingShippingFee.max_km}
                    onChange={(e) => setEditingShippingFee({ ...editingShippingFee, max_km: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức phí giao hàng (VNĐ) *</label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    required
                    value={editingShippingFee.fee}
                    onChange={(e) => setEditingShippingFee({ ...editingShippingFee, fee: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái áp dụng *</label>
                  <select
                    value={editingShippingFee.status}
                    onChange={(e) => setEditingShippingFee({ ...editingShippingFee, status: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Đang áp dụng</option>
                    <option value={0}>Tạm dừng áp dụng</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingShippingFee(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÓA NẤC PHÍ VẬN CHUYỂN (FR-044) */}
      {deletingShippingFee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">Xóa Nấc Phí Vận Chuyển</h3>
                <p className="text-xs text-slate-500">Mã #{deletingShippingFee.id}</p>
              </div>
            </div>

            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 text-xs text-rose-950 space-y-1">
              <div className="font-bold">{deletingShippingFee.name}</div>
              <div className="text-slate-600">
                Khoảng cách: <span className="font-mono font-bold text-slate-800">{parseFloat(deletingShippingFee.min_km)} km - {parseFloat(deletingShippingFee.max_km)} km</span>
              </div>
              <div className="text-slate-600">
                Cước phí: <span className="font-bold text-emerald-700">{parseFloat(deletingShippingFee.fee).toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa nấc cước vận chuyển này? Hành động này sẽ gỡ bỏ nấc cước khỏi hệ thống tính phí tự động.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingShippingFee(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteShippingFee}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

{/* MODAL 1: SOẠN THÔNG BÁO MỚI (FR-046) */}
      {showCreateNotificationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">Soạn Thông Báo Mới</h3>
                  <p className="text-[11px] text-slate-500">Phát thông báo đến khách hàng hoặc quản trị viên (FR-046)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateNotificationModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề thông báo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thông báo khuyến mãi Black Friday 2026..."
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đối tượng nhận thông báo <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNewNotification({ ...newNotification, recipient_type: 'ALL' })}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      newNotification.recipient_type === 'ALL'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                    }`}
                  >
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">Toàn hệ thống</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewNotification({ ...newNotification, recipient_type: 'CUSTOMERS' })}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      newNotification.recipient_type === 'CUSTOMERS'
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-600" />
                    <span className="text-[11px]">Khách hàng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewNotification({ ...newNotification, recipient_type: 'ADMINS' })}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      newNotification.recipient_type === 'ADMINS'
                        ? 'border-purple-500 bg-purple-50/80 text-purple-950 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span className="text-[11px]">Quản trị viên</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung chi tiết thông báo <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập nội dung đầy đủ của thông báo..."
                  value={newNotification.content}
                  onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateNotificationModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={sendingNotification}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  {sendingNotification ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{sendingNotification ? 'Đang gửi...' : 'Gửi Thông Báo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM CHI TIẾT THÔNG BÁO (FR-046) */}
      {selectedNotificationDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">Chi Tiết Thông Báo</h3>
                  <p className="text-[11px] text-slate-500">Mã thông báo #{selectedNotificationDetail.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotificationDetail(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tiêu đề:</span>
                <div className="text-sm font-black text-slate-900 leading-snug">
                  {selectedNotificationDetail.title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Đối tượng nhận:</span>
                  {selectedNotificationDetail.recipient_type === 'CUSTOMERS' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Khách hàng
                    </span>
                  ) : selectedNotificationDetail.recipient_type === 'ADMINS' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      Quản trị viên
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Toàn hệ thống
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Thời gian gửi:</span>
                  <div className="font-mono font-bold text-slate-700 text-[11px]">
                    {new Date(selectedNotificationDetail.created_at).toLocaleString('vi-VN')}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Người gửi:</span>
                  <div className="font-bold text-slate-800">
                    {selectedNotificationDetail.sender_name || 'Admin Tổng'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Số điện thoại:</span>
                  <div className="font-mono text-slate-600">
                    {selectedNotificationDetail.sender_phone || '0929894248'}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nội dung thông báo:</span>
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedNotificationDetail.content}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNotificationDetail(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition cursor-pointer text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: XÓA THÔNG BÁO (FR-046) */}
      {deletingNotification && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">Xóa Thông Báo</h3>
                <p className="text-xs text-slate-500">Mã #{deletingNotification.id}</p>
              </div>
            </div>

            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 text-xs text-rose-950 space-y-1">
              <div className="font-bold">{deletingNotification.title}</div>
              <div className="text-slate-600">
                Đối tượng: <span className="font-bold text-slate-800">{deletingNotification.recipient_type}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa thông báo này khỏi lịch sử hệ thống? Thao tác này không thể hoàn tác.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingNotification(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteNotification}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION (Đồng bộ phong cách hiện đại, tinh gọn của Đổ Đống 4 Mùa) */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-2xl border border-slate-100/90 shadow-slate-900/10">
            <div className="shrink-0">
              {toast.type === 'error' ? (
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
              ) : toast.type === 'warning' ? (
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
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