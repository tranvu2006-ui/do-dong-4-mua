'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Sparkles, Filter, Banknote, X, RefreshCw, Truck, Award, Zap, 
  ChevronRight, Flower2, Sun, Wind, Snowflake, CheckCircle2,
  ShieldCheck, ArrowRight, PackageOpen, Tag, Check, SlidersHorizontal
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const DEFAULT_BANNER = {
  id: 0,
  title: 'Đổ Đống 4 Mùa - Tươi Sạch Tận Tay',
  description: 'Thưởng thức hương vị trái cây thơm ngọt tự nhiên theo từng thời điểm trong năm. 100% chín cây, cam kết bao ăn 1 đổi 1 và giao nhanh 2 giờ bằng GreenSM.',
  image_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&auto=format&fit=crop&q=80',
  link_url: '#product-section'
};

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSeason = searchParams.get('season') || '';
  const inStockFilter = searchParams.get('in_stock') === '1';
  const discountedFilter = searchParams.get('discounted') === '1';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';

  const [customMin, setCustomMin] = useState(minPriceParam);
  const [customMax, setCustomMax] = useState(maxPriceParam);
  const [showPricePopover, setShowPricePopover] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([DEFAULT_BANNER]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setCustomMin(minPriceParam);
    setCustomMax(maxPriceParam);
  }, [minPriceParam, maxPriceParam]);

  // Load Categories & Banners Metadata on mount
  useEffect(() => {
    let isMounted = true;
    async function loadMeta() {
      try {
        const [catRes, banRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/banners')
        ]);
        const catData = await catRes.json();
        const banData = await banRes.json();
        if (isMounted) {
          if (catData.success && Array.isArray(catData.data)) setCategories(catData.data);
          if (banData.success && Array.isArray(banData.data) && banData.data.length > 0) {
            setBanners(banData.data);
          }
        }
      } catch (err) {
        console.error('Failed to load metadata', err);
      }
    }
    loadMeta();
    return () => { isMounted = false; };
  }, []);

  // Load Products based on Filters & Sorting
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const params = new URLSearchParams();
        if (currentSearch) params.set('search', currentSearch);
        if (currentCategory) params.set('category', currentCategory);
        if (currentSeason) params.set('season', currentSeason);
        if (inStockFilter) params.set('in_stock', '1');
        if (discountedFilter) params.set('discounted', '1');
        if (minPriceParam) params.set('min_price', minPriceParam);
        if (maxPriceParam) params.set('max_price', maxPriceParam);
        if (sort) params.set('sort', sort);

        const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();
        if (isMounted && data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, [currentSearch, currentCategory, currentSeason, inStockFilter, discountedFilter, minPriceParam, maxPriceParam, sort]);

  // Auto rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : '/', { scroll: false });
  };

  const getPricePreset = () => {
    if (!minPriceParam && !maxPriceParam) return '';
    if (!minPriceParam && maxPriceParam === '50000') return 'under_50';
    if (minPriceParam === '50000' && maxPriceParam === '100000') return '50_100';
    if (minPriceParam === '100000' && maxPriceParam === '200000') return '100_200';
    if (minPriceParam === '200000' && !maxPriceParam) return 'above_200';
    return 'custom';
  };

  const handlePricePresetSelect = (preset) => {
    if (preset === '') {
      updateFilters({ min_price: '', max_price: '' });
      setShowPricePopover(false);
    } else if (preset === 'under_50') {
      updateFilters({ min_price: '', max_price: '50000' });
      setShowPricePopover(false);
    } else if (preset === '50_100') {
      updateFilters({ min_price: '50000', max_price: '100000' });
      setShowPricePopover(false);
    } else if (preset === '100_200') {
      updateFilters({ min_price: '100000', max_price: '200000' });
      setShowPricePopover(false);
    } else if (preset === 'above_200') {
      updateFilters({ min_price: '200000', max_price: '' });
      setShowPricePopover(false);
    } else if (preset === 'custom') {
      setShowPricePopover(true);
    }
  };

  const applyCustomPrice = () => {
    updateFilters({
      min_price: customMin ? customMin.trim() : '',
      max_price: customMax ? customMax.trim() : ''
    });
    setShowPricePopover(false);
  };

  const clearAllFilters = () => {
    setSort('newest');
    setCustomMin('');
    setCustomMax('');
    setShowPricePopover(false);
    router.replace('/', { scroll: false });
  };

  const currentBanner = banners[activeBannerIdx] || DEFAULT_BANNER;

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Hero Section (Fixed height container to eliminate layout shift) */}
      <section className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white overflow-hidden shadow-xl min-h-[480px] lg:min-h-[520px] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10 w-full">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 border border-accent-500/40 text-accent-300 font-extrabold uppercase tracking-wider backdrop-blur-md text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span>Nông Sản Tận Vườn • Chuẩn VietGAP</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white font-heading">
              {currentBanner.title}
            </h1>

            <p className="text-emerald-100 max-w-2xl leading-relaxed font-medium text-sm sm:text-base">
              {currentBanner.description || DEFAULT_BANNER.description}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('product-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary cursor-pointer text-sm font-bold"
              >
                <span>Xem Bảng Giá Hôm Nay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold border border-white/20 transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer hover:border-white/40 text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Khám Phá Sản Phẩm</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-video sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/15 group bg-slate-800">
              <img
                src={currentBanner.image_url}
                alt={currentBanner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                <div className="text-white font-bold flex items-center gap-2 text-xs sm:text-sm">
                  <span className="bg-brand-600 px-2.5 py-0.5 rounded-lg text-white font-black uppercase text-xs">Hot</span>
                  <span>Bao ăn từng quả • Giao tươi tận nhà</span>
                </div>
              </div>
            </div>

            {/* Dots navigation */}
            {banners.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveBannerIdx(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === activeBannerIdx ? 'w-8 bg-accent-500' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Chuyển tới banner ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Feature Value Proposition Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 mb-0.5 text-sm sm:text-base">100% Chín Tự Nhiên</h3>
              <p className="text-gray-500 font-medium text-xs sm:text-sm">Không hóa chất ủ ép, thu hái tươi tại các nhà vườn VietGAP.</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-accent-500 flex items-center justify-center shrink-0 border border-amber-100">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 mb-0.5 text-sm sm:text-base">Giao Hỏa Tốc 2H</h3>
              <p className="text-gray-500 font-medium text-xs sm:text-sm">Đội xe điện GreenSM vận chuyển bọc xốp cẩn thận không dập nát.</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 mb-0.5 text-sm sm:text-base">Bao Ăn 1 Đổi 1</h3>
              <p className="text-gray-500 font-medium text-xs sm:text-sm">Bảo hành vị ngọt trong 24 giờ. Đổi ngay hoặc hoàn tiền nếu sượng/hỏng.</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
              <Zap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 mb-0.5 text-sm sm:text-base">Giá Rẻ Tận Vườn</h3>
              <p className="text-gray-500 font-medium text-xs sm:text-sm">Mô hình thu mua trực tiếp, giá sỉ lẻ cạnh tranh tốt nhất thị trường.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content Container */}
      <div id="product-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Danh Mục Nổi Bật */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5 font-heading">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span>Danh Mục Nổi Bật</span>
              </h2>
              <p className="text-gray-500 font-medium text-xs sm:text-sm mt-0.5">Khám phá các dòng sản phẩm tuyển chọn tươi ngon mỗi ngày</p>
            </div>
            {currentCategory && (
              <button
                onClick={() => updateFilters({ category: '' })}
                className="font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Xem tất cả danh mục</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {categories.map((c) => {
              const isActive = currentCategory === String(c.id) || currentCategory === c.slug;
              const catImages = {
                1: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
                2: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
                3: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&auto=format&fit=crop&q=80'
              };
              const imgUrl = catImages[c.id] || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80';

              return (
                <div
                  key={c.id}
                  onClick={() => updateFilters({ category: isActive ? '' : (c.slug || c.id) })}
                  className={`group relative rounded-2xl overflow-hidden border p-5 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    isActive
                      ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-600 shadow-md'
                      : 'border-gray-200/80 bg-white hover:border-brand-400 hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-1 z-10">
                    <span className="text-[11px] font-black uppercase tracking-wider text-brand-700 bg-brand-100/80 px-2 py-0.5 rounded-full inline-block">
                      {c.product_count || 0} sản phẩm
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-brand-700 transition">
                      {c.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1">{c.description || 'Trái cây ngon loại 1'}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                    <img src={imgUrl} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Filter Toolbar: Categories Tabs + Quick Filters (Còn hàng, Giảm giá) + Sort (FR-017 & FR-018) */}
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => updateFilters({ category: '' })}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentCategory === ''
                    ? 'bg-brand-700 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Tất Cả Danh Mục
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFilters({ category: c.slug })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    currentCategory === c.slug
                      ? 'bg-brand-700 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {c.name} ({c.product_count || 0})
                </button>
              ))}
            </div>

            {/* Quick Filters & Sort Selector */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Lọc theo Khoảng giá (FR-017) */}
              <div className="relative">
                <select
                  value={getPricePreset()}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setShowPricePopover(true);
                    } else {
                      handlePricePresetSelect(e.target.value);
                    }
                  }}
                  className={`font-bold border rounded-xl px-3 py-2 text-xs transition cursor-pointer shadow-sm ${
                    getPricePreset() !== ''
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                      : 'bg-white border-gray-200 text-slate-700 hover:border-gray-300'
                  }`}
                >
                  <option value="">Khoảng giá: Tất cả</option>
                  <option value="under_50">Dưới 50.000 đ</option>
                  <option value="50_100">50.000 đ - 100.000 đ</option>
                  <option value="100_200">100.000 đ - 200.000 đ</option>
                  <option value="above_200">Trên 200.000 đ</option>
                  <option value="custom">Tùy chọn khoảng giá...</option>
                </select>

                {/* Popover tùy chọn khoảng giá */}
                {showPricePopover && (
                  <div className="absolute top-full right-0 sm:left-0 mt-2 z-40 bg-white border border-gray-200 shadow-xl rounded-2xl p-4 w-72 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">Nhập khoảng giá (VNĐ)</h4>
                      <button
                        onClick={() => setShowPricePopover(false)}
                        className="text-gray-400 hover:text-gray-600 p-0.5 rounded-lg cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 mb-1 block">Tối thiểu (đ)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={customMin}
                          onChange={(e) => setCustomMin(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 mb-1 block">Tối đa (đ)</label>
                        <input
                          type="number"
                          placeholder="500000"
                          value={customMax}
                          onChange={(e) => setCustomMax(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setCustomMin('');
                          setCustomMax('');
                          updateFilters({ min_price: '', max_price: '' });
                          setShowPricePopover(false);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
                      >
                        Đặt lại
                      </button>
                      <button
                        onClick={applyCustomPrice}
                        className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Quick Filter: Đang giảm giá (FR-017) */}
              <button
                onClick={() => updateFilters({ discounted: discountedFilter ? '' : '1' })}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  discountedFilter
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Đang giảm giá</span>
              </button>

              {/* Quick Filter: Còn hàng (FR-017) */}
              <button
                onClick={() => updateFilters({ in_stock: inStockFilter ? '' : '1' })}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  inStockFilter
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Còn hàng</span>
              </button>

              {/* Sắp xếp chuẩn FR-018: 5 tiêu chí */}
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 font-bold text-xs flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="font-bold bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-600 cursor-pointer shadow-sm"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="name_asc">Tên A → Z</option>
                  <option value="name_desc">Tên Z → A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Notification Bar */}
          {(currentSearch || currentCategory || currentSeason || inStockFilter || discountedFilter || minPriceParam || maxPriceParam) && (
            <div className="bg-emerald-50/80 border border-emerald-200 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
              <div className="text-brand-900 font-medium flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-500">Đang lọc theo:</span>
                {currentSearch && (
                  <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-accent-700">
                    Từ khóa: &quot;{currentSearch}&quot;
                  </span>
                )}
                {currentCategory && (
                  <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-brand-700">
                    Danh mục: {categories.find(c => c.slug === currentCategory || String(c.id) === currentCategory)?.name || currentCategory}
                  </span>
                )}
                {currentSeason && (
                  <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-amber-700 uppercase">
                    Mùa: {currentSeason}
                  </span>
                )}
                {discountedFilter && (
                  <span className="font-extrabold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-lg">
                    Chỉ hàng giảm giá
                  </span>
                )}
                {inStockFilter && (
                  <span className="font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg">
                    Chỉ hàng còn trong kho
                  </span>
                )}
                {minPriceParam && !maxPriceParam && (
                  <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-800">
                    Giá từ: {Number(minPriceParam).toLocaleString('vi-VN')} đ
                  </span>
                )}
                {!minPriceParam && maxPriceParam && (
                  <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-800">
                    Giá dưới: {Number(maxPriceParam).toLocaleString('vi-VN')} đ
                  </span>
                )}
                {minPriceParam && maxPriceParam && (
                  <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-800">
                    Khoảng giá: {Number(minPriceParam).toLocaleString('vi-VN')} đ - {Number(maxPriceParam).toLocaleString('vi-VN')} đ
                  </span>
                )}
              </div>
              <button
                onClick={clearAllFilters}
                className="font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer text-xs ml-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Xóa bộ lọc</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. Product Grid & Empty States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse space-y-4">
                <div className="aspect-square bg-gray-100 rounded-2xl" />
                <div className="h-5 bg-gray-100 rounded-xl w-3/4" />
                <div className="h-5 bg-gray-100 rounded-xl w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-xl font-heading">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-gray-500 font-medium text-xs leading-relaxed">
              Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục mùa vụ khác nhé!
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-2 btn-primary cursor-pointer text-xs"
            >
              Xem lại tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 6. GreenSM Logistics Highlight Banner */}
        <section className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 rounded-3xl p-7 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2.5 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white font-black uppercase tracking-wider backdrop-blur-md text-xs">
              <Truck className="w-4 h-4 text-accent-300" />
              <span>Đối Tác Vận Chuyển Chiến Lược</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading leading-snug">
              Giao Hàng Siêu Tốc 2H Bằng Đội Xe Điện GreenSM
            </h3>
            <p className="text-emerald-100 max-w-2xl font-medium leading-relaxed text-xs sm:text-sm">
              Trái cây giữ trọn độ tươi mát như vừa hái tại vườn. Giảm phát thải CO2, bảo vệ môi trường xanh và bảo vệ an toàn sức khỏe gia đình bạn!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
              <div className="text-emerald-200 text-xs font-medium">Đơn từ 500k</div>
              <div className="text-xl font-black text-yellow-300">FREESHIP 100%</div>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('product-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-white text-emerald-900 rounded-2xl font-black hover:bg-emerald-50 transition shadow-lg cursor-pointer text-xs"
            >
              Đặt hàng ngay
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

// Seamless Skeleton Fallback (Mirrors exact page structure so there is ZERO layout shift or flicker)
function HomeSkeleton() {
  return (
    <div className="space-y-12 pb-20 animate-pulse">
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 min-h-[480px] lg:min-h-[520px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          <div className="lg:col-span-7 space-y-5">
            <div className="w-48 h-8 rounded-full bg-white/15" />
            <div className="w-3/4 h-12 rounded-2xl bg-white/20" />
            <div className="w-full h-16 rounded-xl bg-white/10" />
            <div className="w-56 h-12 rounded-2xl bg-white/20" />
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-3xl bg-white/10" />
          </div>
        </div>
      </section>

      {/* Product Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100 space-y-4">
              <div className="aspect-square bg-slate-100 rounded-2xl" />
              <div className="h-5 bg-slate-100 rounded-xl w-3/4" />
              <div className="h-5 bg-slate-100 rounded-xl w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
