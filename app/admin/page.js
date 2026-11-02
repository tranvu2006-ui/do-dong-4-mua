'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, ShoppingCart, Package, Users, AlertTriangle,
  CheckCircle2, Clock, Truck, Plus, Eye, Edit3, Trash2, RefreshCw,
  ArrowLeft, Filter, Tag, Percent, Image as ImageIcon, MapPin,
  FileText, Play, Pause, XCircle, Search, Upload, Lock, LogOut,
  ExternalLink, ShieldCheck, Leaf, ChevronRight, Sparkles, Store,
  Box, BarChart3, PackageOpen, Layers, UserPlus, Unlock, KeyRound, ShieldAlert, EyeOff, Calendar
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
  const [logPage, setLogPage] = useState(1);
  const [logPageSize, setLogPageSize] = useState(15);

  useEffect(() => {
    setProductPage(1);
  }, [productSearch, productCategoryFilter, productStatusFilter]);

  useEffect(() => {
    setOrderPage(1);
  }, [orderStatusFilter, orderSearch]);

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
        promosRes, branchesRes, bannersRes, custsRes, logsRes, usersRes
      ] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/orders?limit=100${orderStatusFilter ? `&status=${orderStatusFilter}` : ''}${orderSearch ? `&search=${encodeURIComponent(orderSearch)}` : ''}`),
        fetch('/api/products?all=1&limit=200'),
        fetch('/api/categories?all=1'),
        fetch('/api/promotions?all=1'),
        fetch('/api/branches'),
        fetch('/api/banners'),
        fetch('/api/admin/customers'),
        fetch('/api/admin/logs'),
        fetch('/api/admin/users'),
      ]);

      const [
        statsData, ordersData, prodsData, catsData,
        promosData, branchesData, bannersData, custsData, logsData, usersData
      ] = await Promise.all([
        statsRes.json(), ordersRes.json(), prodsRes.json(), catsRes.json(),
        promosRes.json(), branchesRes.json(), bannersRes.json(), custsRes.json(), logsRes.json(), usersRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (ordersData.success) setOrders(ordersData.data);
      if (prodsData.success) setProducts(prodsData.data);
      if (catsData.success) setCategories(catsData.data);
      if (promosData.success) setPromotions(promosData.data);
      if (branchesData.success) setBranches(branchesData.data);
      if (bannersData.success) setBanners(bannersData.data);
      if (custsData.success) setCustomers(custsData.data);
      if (logsData.success) setLogs(logsData.data);
      if (usersData.success) setAdminUsers(usersData.data);
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
  }, [currentUser, orderStatusFilter, orderSearch]);

  // Kiểm tra quyền hạn truy cập tab chức năng (BR-026 & FR-039)
  const hasPermissionForTab = (tabKey) => {
    if (!currentUser) return false;
    if (currentUser.role_id === 1) return true;

    // Các tab chỉ dành riêng cho Admin Tổng
    if (['admins', 'branches', 'logs'].includes(tabKey)) {
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

  const handleUpdateOrderStatus = async (orderCode, newOrderStatus, newShippingStatus = null, newPaymentStatus = null) => {
    try {
      const body = {};
      if (newOrderStatus) body.order_status = newOrderStatus;
      if (newShippingStatus) body.shipping_status = newShippingStatus;
      if (newPaymentStatus) body.payment_status = newPaymentStatus;

      const res = await fetch(`/api/orders/${orderCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Cập nhật trạng thái đơn hàng thành công!');
        loadData();
      } else {
        showToast(data.message || 'Cập nhật thất bại', 'error');
      }
    } catch (e) {
      showToast('Có lỗi xảy ra: ' + e.message, 'error');
    }
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

  const paginatedCustomers = customers.slice(
    (customerPage - 1) * customerPageSize,
    customerPage * customerPageSize
  );

  const paginatedLogs = logs.slice(
    (logPage - 1) * logPageSize,
    logPage * logPageSize
  );

  const filteredPromotions = promotions.filter(pr => {
    const matchSearch = promotionSearch ? pr.title.toLowerCase().includes(promotionSearch.toLowerCase()) : true;
    const matchStatus = promotionStatusFilter !== '' ? pr.status === parseInt(promotionStatusFilter, 10) : true;
    return matchSearch && matchStatus;
  });

  const paginatedPromotions = filteredPromotions.slice(
    (promotionPage - 1) * promotionPageSize,
    promotionPage * promotionPageSize
  );

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
                        <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                        <option value="DA_XAC_NHAN">Đã duyệt</option>
                        <option value="DANG_CHUAN_BI">Đang chuẩn bị</option>
                        <option value="TAM_DUNG">Tạm dừng</option>
                        <option value="DANG_GIAO">Đang giao</option>
                        <option value="DA_GIAO">Đã giao</option>
                        <option value="DA_HUY">Đã hủy</option>
                      </select>
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
                            <th className="py-3 px-4 whitespace-nowrap">Mã đơn</th>
                            <th className="py-3 px-4 whitespace-nowrap">Khách hàng</th>
                            <th className="py-3 px-4 whitespace-nowrap">Tổng tiền</th>
                            <th className="py-3 px-4 whitespace-nowrap">Thanh toán</th>
                            <th className="py-3 px-4 whitespace-nowrap">Vận đơn GreenSM</th>
                            <th className="py-3 px-4 whitespace-nowrap">Trạng thái đơn</th>
                            <th className="py-3 px-4 text-right whitespace-nowrap">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono font-bold text-brand-700 whitespace-nowrap">
                                <Link href={`/don-hang/${o.order_code}`} className="hover:underline">
                                  {o.order_code}
                                </Link>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="font-bold text-slate-900">{o.receiver_name}</div>
                                <div className="text-[11px] text-slate-400">{o.phone}</div>
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                {parseFloat(o.total_amount).toLocaleString('vi-VN')} đ
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                  {o.payment_method} ({o.payment_status === 'PAID' ? 'Đã thu' : 'Chưa thu'})
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                                <div>{o.tracking_code || 'Chưa tạo'}</div>
                                <span className="text-[10px] text-slate-400">GreenSM</span>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${o.order_status === 'DA_GIAO' ? 'bg-emerald-100 text-emerald-800' :
                                    o.order_status === 'DANG_GIAO' ? 'bg-teal-100 text-teal-800' :
                                      o.order_status === 'DANG_CHUAN_BI' ? 'bg-blue-100 text-blue-800' :
                                        o.order_status === 'TAM_DUNG' ? 'bg-yellow-100 text-yellow-800' :
                                          o.order_status === 'DA_XAC_NHAN' ? 'bg-purple-100 text-purple-800' :
                                            o.order_status === 'DA_HUY' ? 'bg-red-100 text-red-800' :
                                              'bg-amber-100 text-amber-800'
                                  }`}>
                                  {o.order_status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                                {o.payment_status !== 'PAID' && o.order_status !== 'DA_HUY' && (
                                  <button
                                    onClick={() => {
                                      requestConfirm({
                                        title: 'Xác Nhận Đã Thu Tiền (FR-032)',
                                        message: `Xác nhận đã nhận đủ ${parseFloat(o.total_amount).toLocaleString('vi-VN')} đ cho đơn hàng ${o.order_code}? Trạng thái thanh toán sẽ chuyển sang ĐÃ THU.`,
                                        confirmText: 'Xác nhận thu tiền',
                                        type: 'success',
                                        onConfirm: () => handleUpdateOrderStatus(
                                          o.order_code, 
                                          o.order_status === 'CHO_XAC_NHAN' ? 'DA_XAC_NHAN' : null, 
                                          o.order_status === 'CHO_XAC_NHAN' ? 'DA_TAO_VAN_DON' : null, 
                                          'PAID'
                                        ),
                                      });
                                    }}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer shadow-sm transition"
                                    title="Xác nhận thanh toán thủ công (FR-032)"
                                  >
                                    ✓ Đã thu tiền
                                  </button>
                                )}
                                {o.order_status === 'CHO_XAC_NHAN' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(o.order_code, 'DA_XAC_NHAN', 'DA_TAO_VAN_DON')}
                                    className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-[10px] font-bold hover:bg-purple-700 cursor-pointer"
                                    title="Tiếp nhận đơn hàng"
                                  >
                                    Duyệt đơn
                                  </button>
                                )}
                                {o.order_status === 'DA_XAC_NHAN' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(o.order_code, 'DANG_CHUAN_BI')}
                                    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 cursor-pointer"
                                    title="Chuẩn bị đơn hàng"
                                  >
                                    Đóng gói
                                  </button>
                                )}
                                {o.order_status === 'DANG_CHUAN_BI' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(o.order_code, 'TAM_DUNG')}
                                      className="px-2 py-1 bg-yellow-500 text-white rounded-lg text-[10px] font-bold hover:bg-yellow-600 cursor-pointer"
                                      title="Tạm dừng đơn hàng"
                                    >
                                      Tạm dừng
                                    </button>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(o.order_code, 'DANG_GIAO', 'DANG_GIAO')}
                                      className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-[10px] font-bold hover:bg-teal-700 cursor-pointer"
                                      title="Bàn giao GreenSM"
                                    >
                                      Giao GreenSM
                                    </button>
                                  </>
                                )}
                                {o.order_status === 'TAM_DUNG' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(o.order_code, 'DANG_CHUAN_BI')}
                                    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 cursor-pointer"
                                    title="Tiếp tục xử lý"
                                  >
                                    Tiếp tục
                                  </button>
                                )}
                                {o.order_status === 'DANG_GIAO' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(o.order_code, 'DA_GIAO', 'GIAO_THANH_CONG')}
                                    className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 cursor-pointer"
                                    title="Hoàn tất đơn hàng"
                                  >
                                    Hoàn tất
                                  </button>
                                )}
                                <Link
                                  href={`/don-hang/${o.order_code}`}
                                  className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-medium hover:bg-slate-200 inline-block"
                                >
                                  Chi tiết
                                </Link>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Chi Nhánh Cửa Hàng</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Mạng lưới kho và điểm nhận hàng của Đổ Đống 4 Mùa</p>
                    </div>
                    <button
                      onClick={() => setShowAddBranchModal(true)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Chi Nhánh</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                          <th className="py-3 px-4">Mã</th>
                          <th className="py-3 px-4">Tên chi nhánh</th>
                          <th className="py-3 px-4">Điện thoại</th>
                          <th className="py-3 px-4">Địa chỉ</th>
                          <th className="py-3 px-4">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {branches.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-400">#{b.id}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">{b.branch_name}</td>
                            <td className="py-3 px-4 font-bold text-brand-700">{b.phone}</td>
                            <td className="py-3 px-4 text-slate-600">{b.address}</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {b.status === 1 ? 'Hoạt động' : 'Tạm dừng'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: QUẢN LÝ BANNERS */}
              {activeTab === 'banners' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-emerald-600" />
                        <span>Quản Lý Banner Quảng Cáo</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Banner trượt tự động trên trang chủ chào đón khách hàng</p>
                    </div>
                    <button
                      onClick={() => setShowAddBannerModal(true)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Banner</span>
                    </button>
                  </div>

                  {banners.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">Chưa có banner nào</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Tải lên hình ảnh banner từ máy tính của bạn (JPG, PNG, WEBP &le; 5MB) để hiển thị nổi bật trên trang chủ!
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {banners.map((bn) => (
                        <div key={bn.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-3 p-3 bg-white">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                            <img src={bn.image_url} alt={bn.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{bn.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Thứ tự hiển thị: {bn.display_order}</p>
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

              {/* TAB 7: QUẢN LÝ KHÁCH HÀNG */}
              {activeTab === 'customers' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  <div className="border-b border-slate-100 pb-5">
                    <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span>Quản Lý Danh Sách Khách Hàng</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Thông tin người mua hàng, tài khoản và tổng chi tiêu</p>
                  </div>

                  {customers.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                        <Users className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">Chưa có khách hàng đăng ký</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Hệ thống CSDL hiện đang sạch không có khách ảo. Khi khách đăng ký hoặc đặt hàng, thông tin tài khoản sẽ lưu tự động tại đây.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                            <th className="py-3 px-4">Mã</th>
                            <th className="py-3 px-4">Họ và tên</th>
                            <th className="py-3 px-4">Số điện thoại</th>
                            <th className="py-3 px-4">Địa chỉ</th>
                            <th className="py-3 px-4">Số đơn đã đặt</th>
                            <th className="py-3 px-4">Tổng chi tiêu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedCustomers.map((cu) => (
                            <tr key={cu.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono font-bold text-slate-400">#{cu.id}</td>
                              <td className="py-3 px-4 font-bold text-slate-900">{cu.full_name}</td>
                              <td className="py-3 px-4 font-bold text-brand-700">{cu.phone}</td>
                              <td className="py-3 px-4 text-slate-600">{cu.address || '-'}</td>
                              <td className="py-3 px-4 font-bold text-slate-800">{cu.total_orders} đơn</td>
                              <td className="py-3 px-4 font-black text-brand-700">{parseFloat(cu.total_spent).toLocaleString('vi-VN')} đ</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Phân trang khách hàng chuẩn KhoHang_JAVA */}
                  {customers.length > 0 && (
                    <Pagination
                      currentPage={customerPage}
                      totalItems={customers.length}
                      pageSize={customerPageSize}
                      onPageChange={setCustomerPage}
                      onPageSizeChange={setCustomerPageSize}
                      pageSizeOptions={[5, 10, 20, 50]}
                      itemName="khách hàng"
                    />
                  )}
                </div>
              )}

              {/* TAB 8: NHẬT KÝ HỆ THỐNG AUDIT LOGS */}
              {activeTab === 'logs' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
                  <div className="border-b border-slate-100 pb-5">
                    <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span>Nhật Ký Kiểm Toán Hệ Thống</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Ghi vết mọi hành động đặt hàng, hủy đơn, cập nhật trạng thái của người dùng và quản trị viên</p>
                  </div>

                  {logs.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto border border-slate-200">
                        <FileText className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">Nhật ký trống</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Mọi thao tác quản trị hoặc đặt hàng sẽ được lưu vết kiểm toán tự động.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                            <th className="py-3 px-4">Thời gian</th>
                            <th className="py-3 px-4">Tài khoản</th>
                            <th className="py-3 px-4">Phân hệ</th>
                            <th className="py-3 px-4">Hành động</th>
                            <th className="py-3 px-4">Chi tiết thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedLogs.map((l) => (
                            <tr key={l.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                                {new Date(l.created_at).toLocaleString('vi-VN')}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-800">{l.user_name}</td>
                              <td className="py-3 px-4 font-semibold text-slate-600">{l.module}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                                  {l.action}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-700">{l.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Phân trang nhật ký chuẩn KhoHang_JAVA */}
                  {logs.length > 0 && (
                    <Pagination
                      currentPage={logPage}
                      totalItems={logs.length}
                      pageSize={logPageSize}
                      onPageChange={setLogPage}
                      onPageSizeChange={setLogPageSize}
                      pageSizeOptions={[10, 15, 30, 50]}
                      itemName="bản ghi nhật ký"
                    />
                  )}
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

      {/* MODAL 5: ADD BANNER */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Thêm Banner Trang Chủ</h3>
            <form onSubmit={handleCreateBanner} noValidate className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề banner *</label>
                <input
                  type="text" required placeholder="Mùa Cam Sành Mọng Nước"
                  value={newBanner.title} onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
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
                        <p className="font-bold text-emerald-700 text-xs truncate">✓ Đã tải ảnh lên: {newBanner.image_url}</p>
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
                <label className="block font-bold text-slate-700 mb-1">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={newBanner.display_order} onChange={(e) => setNewBanner({ ...newBanner, display_order: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddBannerModal(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 cursor-pointer">Hủy bỏ</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold cursor-pointer">Thêm Banner</button>
              </div>
            </form>
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
                <span>{actionModal.targetUser.role_name || 'Admin Chi nhánh'}</span>
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