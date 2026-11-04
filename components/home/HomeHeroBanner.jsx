'use client';

import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function HomeHeroBanner({
  banners = [],
  bannersLoaded = false,
  activeIdx = 0,
  onSelectIdx,
  onScrollToProducts
}) {
  const currentBanner = banners[activeIdx] || null;

  if (!bannersLoaded && banners.length === 0) {
    return (
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 min-h-[480px] lg:min-h-[520px] flex items-center animate-pulse">
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
    );
  }

  if (!currentBanner) return null;

  return (
    <section className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white overflow-hidden shadow-xl min-h-[480px] lg:min-h-[520px] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10 w-full">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 border border-accent-500/40 text-accent-300 font-extrabold uppercase tracking-wider backdrop-blur-md text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>Nông Sản Tận Vườn • Tươi Ngon 4 Mùa</span>
          </div>

          {currentBanner.title && (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white font-heading">
              {currentBanner.title}
            </h1>
          )}

          {currentBanner.description ? (
            <p className="text-emerald-100 max-w-2xl leading-relaxed font-medium text-sm sm:text-base">
              {currentBanner.description}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={onScrollToProducts}
              className="btn-primary cursor-pointer text-sm font-bold"
            >
              <span>Xem Bảng Giá Hôm Nay</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onScrollToProducts}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold border border-white/20 transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer hover:border-white/40 text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Khám Phá Sản Phẩm</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          {currentBanner.image_url ? (
            <div className="relative aspect-video sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/15 group bg-slate-800">
              <img
                src={currentBanner.image_url}
                alt={currentBanner.title || 'Banner'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                <div className="text-white font-bold flex items-center gap-2 text-xs sm:text-sm">
                  <span className="bg-brand-600 px-2.5 py-0.5 rounded-lg text-white font-black uppercase text-xs">Hot</span>
                  <span>Bao ăn từng quả • Giao tươi tận nhà</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Dots navigation */}
          {banners.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectIdx && onSelectIdx(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeIdx ? 'w-8 bg-accent-500' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Chuyển tới banner ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

