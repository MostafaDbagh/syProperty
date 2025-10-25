"use client";

import React, { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import SplitTextAnimation from "./SplitTextAnimation";
import { listingAPI } from "@/apis/listing";

export default function Categories({
  parentClass = "tf-spacing-1 section-categories pb-0",
  searchParams,
  onSearchChange,
  setCategory
}) {
  // Get all properties for accurate counting (no pagination)
  const { data: allListingsResponse } = useQuery({
    queryKey: ['listings', 'all-count'],
    queryFn: () => listingAPI.searchListings({ limit: 100 }), // Reduced from 1000 to 100 for better performance
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Prevent refetch on component mount if data exists
  });
  
  // Memoize listings data to prevent unnecessary re-renders
  const allListings = useMemo(() => allListingsResponse?.data || [], [allListingsResponse?.data]);

  // Memoize categories calculation to prevent recalculation on every render
  const categories = useMemo(() => {
    const propertyTypes = ['Apartment', 'Villa/farms' , 'Office', 'Commercial', 'Land','holiday home'];
    const icons = ['icon-apartment1', 'icon-villa', 'icon-office1', 'icon-commercial', 'icon-land', 'icon-studio'];
    
    return propertyTypes.map((type, index) => ({
      name: type === 'Land' ? 'Land/Plot' : type,
      icon: icons[index],
      count: allListings.filter(p => p.propertyType === type).length
    }));
  }, [allListings]);

  // Memoize category click handler to prevent recreation on every render
  const handleCategoryClick = useCallback((categoryName) => {
    setCategory(categoryName);
    onSearchChange({ propertyType: categoryName });
  }, [setCategory, onSearchChange]);

  // Memoize swiper breakpoints to prevent recreation
  const swiperBreakpoints = useMemo(() => ({
    0: { slidesPerView: 2, spaceBetween: 20 },
    576: { slidesPerView: 3, spaceBetween: 30 },
    768: { slidesPerView: 4, spaceBetween: 40 },
    1200: { slidesPerView: 6, spaceBetween: 10 },
  }), []);

  return (
    <section className={parentClass}>
      <div className="tf-container">
        <div className="heading-section text-center mb-48">
          <h2 className="title split-text effect-right">
            <SplitTextAnimation text="Try Searching For" />
          </h2>
          <p className="text-1 split-text split-lines-transform">
            Thousands of luxury home enthusiasts just like you have found their
            dream home
          </p>
        </div>

        <div className="wrap-categories-sw">
          <Swiper
            dir="ltr"
            className="swiper sw-layout style-pagination"
            spaceBetween={5}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={swiperBreakpoints}
            modules={[Autoplay, Pagination]}
            pagination={{ 
              el: ".spd2", 
              clickable: true,
              dynamicBullets: false,
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide className="swiper-slide" key={index}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category.name)}
                  className={`categories-item ${
                    searchParams.propertyType === category.name ? "active" : ""
                  }`}
                >
                  <div className="icon-box">
                    <i className={`icon ${category.icon}`}></i>
                  </div>
                  <div className="content text-center">
                    <h5>{category.name}</h5>
                    <p className="mt-4 text-1">{category.count} Property</p>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Pagination dots for mobile and tablet */}
          <div 
            className="spd2" 
            style={{ 
              marginTop: '20px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
            }} 
          />
          
          <style jsx>{`
            .categories-item {
              width: 180px !important;
              min-width: 180px !important;
              max-width: 180px !important;
            }
            
            /* Orange pagination styling */
            .spd2 .swiper-pagination-bullet {
              width: 12px !important;
              height: 12px !important;
              background: #e5e7eb !important;
              opacity: 1 !important;
              margin: 0 4px !important;
              transition: all 0.3s ease !important;
              border-radius: 50% !important;
            }
            
            .spd2 .swiper-pagination-bullet-active {
              background: #f1913d !important;
              transform: scale(1.2) !important;
            }
            
            .spd2 .swiper-pagination-bullet-active-main {
              background: #f1913d !important;
              transform: scale(1.2) !important;
            }
            
            /* Additional overrides for all possible Swiper pagination classes */
            .spd2 .swiper-pagination-bullet-active-main,
            .spd2 .swiper-pagination-bullet-active,
            .spd2 .swiper-pagination-bullet-active-prev,
            .spd2 .swiper-pagination-bullet-active-next {
              background: #f1913d !important;
              background-color: #f1913d !important;
              transform: scale(1.2) !important;
            }
            
            /* Global Swiper pagination override */
            .swiper-pagination-bullet-active {
              background: #f1913d !important;
              background-color: #f1913d !important;
            }
            
            .swiper-pagination-bullet-active-main {
              background: #f1913d !important;
              background-color: #f1913d !important;
            }
            
            .spd2 .swiper-pagination-bullet:hover {
              background: #f1913d !important;
              opacity: 0.7 !important;
            }
            
            @media (min-width: 992px) {
              .spd2 {
                display: none !important;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
