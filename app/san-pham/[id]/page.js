'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw, 
  Plus, Minus, Check, Star, Sparkles, PackageOpen, Award, Package 
} from 'lucide-react';
import { useCart } from '@/components/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setSelectedImage(data.data.thumbnail);
        }
      } catch (e) {
        console.error('Failed to load product detail', e);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded-2xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-5">
            <div className="h-10 bg-gray-200 rounded-2xl w-3/4" />
            <div className="h-8 bg-gray-200 rounded-2xl w-1/3" />
            <div className="h-32 bg-gray-200 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center mx-auto">
          <PackageOpen className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 font-heading">Không tìm thấy sản phẩm này</h2>
        <p className="text-gray-500 font-medium">Sản phẩm có thể đã hết mùa vụ hoặc tạm ngưng kinh doanh.</p>
        <Link
          href="/"
          className="btn-primary cursor-pointer inline-flex"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const effectivePrice = discountPrice !== null ? discountPrice : price;
  const discountPercent = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleBuyNow = () => {
    addToCart(product, Number(quantity) || 1);
    router.push('/dat-hang');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2.5 text-gray-500 font-bold">
        <Link href="/" className="hover:text-brand-600 transition cursor-pointer">Trang chủ</Link>
        <span>/</span>
        <Link href={`/?category=${product.category_slug}`} className="hover:text-brand-600 transition cursor-pointer">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-black truncate max-w-sm">{product.name}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-5">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-lg">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <div className="absolute top-5 left-5 bg-accent-500 text-white font-black px-4 py-1.5 rounded-2xl shadow-xl">
                TIẾT KIỆM {discountPercent}%
              </div>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3.5 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img ? 'border-brand-600 scale-105 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-6 space-y-7">
          <div>
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-brand-700 font-black uppercase tracking-wider border border-emerald-200">
              {product.category_name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 leading-tight font-heading">
              {product.name}
            </h1>
            <div className="flex items-center gap-3.5 mt-3 text-gray-500 font-medium">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="font-extrabold text-gray-800">5.0</span>
              <span>•</span>
              <span className="text-brand-700 font-bold">Bao ăn 1 đổi 1 trong 24h</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-100 flex items-baseline gap-4">
            <span className="text-4xl font-black text-brand-700">
              {effectivePrice.toLocaleString('vi-VN')} đ
            </span>
            <span className="text-gray-500 font-bold">/ 1 {product.unit || 'kg'}</span>
            {discountPrice && (
              <span className="text-xl text-gray-400 line-through font-medium">
                {price.toLocaleString('vi-VN')} đ
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-gray-800 uppercase tracking-wider">Đặc điểm & Vị ngon:</h4>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm leading-relaxed text-gray-700 font-medium">
              {product.description || 'Trái cây sạch, độ ngọt chuẩn tự nhiên, được lựa chọn kỹ càng từng trái.'}
            </div>
          </div>

          {/* Quy chuẩn thành phần cố định cho Combo & Giỏ quà */}
          {(product.category_id === 2 || product.category_id === 3 || product.name?.toLowerCase().includes('combo') || product.name?.toLowerCase().includes('giỏ')) && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs shadow-sm">
              <Package className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Quy chuẩn đóng gói cố định:</span> Thành phần trái cây trong {product.category_id === 3 || product.name?.toLowerCase().includes('giỏ') ? 'giỏ quà' : 'combo'} đã được tuyển chọn và định lượng sẵn theo tiêu chuẩn chất lượng của cửa hàng, không hỗ trợ thay đổi thành phần riêng lẻ.
              </div>
            </div>
          )}

          {/* Stock & Quantity */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-gray-800">Số lượng ({product.unit || 'kg'}):</span>
              <span className="text-gray-500">
                Tồn kho: <strong className={product.stock <= 0 ? "text-rose-600 font-black" : "text-brand-700 font-black"}>{product.stock}</strong> {product.unit || 'kg'}
              </span>
            </div>

            {product.stock <= 0 ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                <span>Sản phẩm này hiện đang tạm hết hàng. Quý khách vui lòng tham khảo các loại trái cây khác!</span>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <div className="flex items-center border border-gray-300 rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                  <button
                    onClick={() => setQuantity(Math.max(1, (Number(quantity) || 1) - 1))}
                    className="p-3.5 hover:bg-gray-100 rounded-l-2xl transition cursor-pointer active:scale-95"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setQuantity('');
                        return;
                      }
                      const val = parseInt(raw, 10);
                      if (!isNaN(val)) {
                        if (val < 1) {
                          setQuantity(1);
                        } else if (product.stock && val > product.stock) {
                          setQuantity(product.stock);
                          alert(`Số lượng không được vượt quá số lượng tồn kho (${product.stock} ${product.unit || 'kg'})`);
                        } else {
                          setQuantity(val);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (quantity === '' || isNaN(quantity) || Number(quantity) < 1) {
                        setQuantity(1);
                      }
                    }}
                    className="w-16 text-center font-black text-gray-900 focus:outline-none rounded py-1 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Số lượng đặt"
                  />
                  <button
                    onClick={() => {
                      const current = Number(quantity) || 1;
                      if (product.stock && current >= product.stock) {
                        alert(`Số lượng tồn kho chỉ còn ${product.stock} ${product.unit || 'kg'}`);
                        return;
                      }
                      setQuantity(current + 1);
                    }}
                    className="p-3.5 hover:bg-gray-100 rounded-r-2xl transition cursor-pointer active:scale-95"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="text-gray-600 font-medium">
                  Tổng tiền: <strong className="text-2xl text-brand-700 font-black">{(effectivePrice * (Number(quantity) || 1)).toLocaleString('vi-VN')} đ</strong>
                </div>
              </div>
            )}
          </div>

          {/* Action CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            <button
              onClick={() => {
                addToCart(product, quantity);
                setIsCartOpen(true);
              }}
              disabled={product.stock <= 0}
              className={`py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2.5 transition-all shadow-sm ${
                product.stock <= 0
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border-2 border-brand-300 cursor-pointer active:scale-95'
              }`}
            >
              <ShoppingBag className="w-6 h-6" />
              <span>{product.stock <= 0 ? 'Sản Phẩm Tạm Hết Hàng' : 'Thêm Vào Giỏ Hàng'}</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className={`py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2.5 transition-all ${
                product.stock <= 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/30 cursor-pointer active:scale-95'
              }`}
            >
              <span>{product.stock <= 0 ? 'Tạm Hết Hàng' : 'Mua Ngay (Giao 2H)'}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-t border-gray-100 text-center">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <Truck className="w-6 h-6 text-brand-600 mx-auto" />
              <div className="font-black text-gray-900">GreenSM 2H</div>
              <div className="text-gray-500 font-medium">Giao tươi tận cửa</div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <RotateCcw className="w-6 h-6 text-brand-600 mx-auto" />
              <div className="font-black text-gray-900">Bao ăn 1 đổi 1</div>
              <div className="text-gray-500 font-medium">Trong vòng 24 giờ</div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <ShieldCheck className="w-6 h-6 text-brand-600 mx-auto" />
              <div className="font-black text-gray-900">Chuẩn VietGAP</div>
              <div className="text-gray-500 font-medium">An toàn tuyệt đối</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.related && product.related.length > 0 && (
        <div className="pt-12 border-t border-gray-100 space-y-8">
          <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2.5 font-heading">
            <Sparkles className="w-6 h-6 text-brand-600" />
            <span>Sản Phẩm Cùng Danh Mục</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
