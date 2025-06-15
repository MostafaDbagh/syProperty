"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import {  useSearchListings } from "@/apis/listing";
import { cleanParams } from "@/utlis/cleanedParams";
export default function Properties({searchParams,triggerSearch,category}) {

  const [params, setParams] = useState(null);
  useEffect(() => {
 console.log(searchParams,'searchParmasssss')

    if (triggerSearch || category) {
      const cleanedParams = cleanParams(searchParams);
      setParams(cleanedParams);
    }
  }, [triggerSearch, searchParams,category]);

  const { data: listings, isLoading, isError } = useSearchListings(params, !!params);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;
  return (
    <section className="section-listing tf-spacing-1">
      <div className="tf-container">
        {console.log(listings,'data')}
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center ">
              <h2 className="title split-text effect-right">
                <SplitTextAnimation text="Today’s Luxury Listings" />
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Thousands of luxury home enthusiasts just like you visit our
                website.
              </p>
            </div>
            <div
              dir="ltr"
              className="swiper style-pagination tf-sw-mobile-1 sw-swiper-767"
              data-screen={767}
              data-preview={1}
              data-space={15}
            >
           <div className="swiper-wrapper tf-layout-mobile-md md-col-2 lg-col-3">
  {listings.map((listing, i) => (
    <div key={i} className="swiper-slide">
      <div className="box-house hover-img">
        <div className="image-wrap">
          <Link href={`/property-detail/${listing._id}`}>
            <Image
              className="lazyload"
              alt={listing.name}
              src="https://res.cloudinary.com/dgavyfooy/image/upload/v1749591601/listings/p4u5w3xaawjuxuqussbo.jpg"
              width={600}
              height={401}
            />
          </Link>

          <ul className="box-tag flex gap-8">
            {listing.offer && (
              <li className="flat-tag text-4 bg-main fw-6 text_white">
                Featured
              </li>
            )}
            <li className="flat-tag text-4 bg-3 fw-6 text_white">
              {listing.status}
            </li>
          </ul>

          <div className="list-btn flex gap-8">
            <a href="#" className="btn-icon save hover-tooltip">
              <i className="icon-save" />
              <span className="tooltip">Add Favorite</span>
            </a>
            <a href="#" className="btn-icon find hover-tooltip">
              <i className="icon-find-plus" />
              <span className="tooltip">Quick View</span>
            </a>
          </div>
        </div>

        <div className="content">
          <h5 className="title">
            <Link href={`/property-detail/${listing._id}`}>
              {listing.propertyType}
            </Link>
          </h5>

          <p className="location text-1 line-clamp-1">
            <i className="icon-location" /> {listing.address}
          </p>

          <ul className="meta-list flex">
            <li className="text-1 flex">
              <span>{listing.bedrooms}</span> Beds
            </li>
            <li className="text-1 flex">
              <span>{listing.bathrooms}</span> Baths
            </li>
            <li className="text-1 flex">
              <span>{listing.size ?? "N/A"}</span> Sqft
            </li>
          </ul>

          <div className="bot flex justify-between items-center">
            <h5 className="price">${listing?.propertyPrice?.toLocaleString()}</h5>

            <div className="wrap-btn flex">
              <a href="#" className="compare flex gap-8 items-center text-1">
                <i className="icon-compare" />
                Compare
              </a>
              <Link href={`/property-detail/${listing._id}`} className="tf-btn style-border pd-4">
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

              <div className="sw-pagination sw-pagination-mb-1 text-center d-lg-none d-block" />
            </div>
            <Swiper
              dir="ltr"
              className="swiper style-pagination tf-sw-mobile-1 sw-swiper-767"
              modules={[Pagination]}
              pagination={{
                clickable: true,
                el: ".spd446",
              }}
              spaceBetween={15}
            >
              {/* {listings.map((property, i) => (
  <SwiperSlide key={i} className="swiper-slide">
    <div className="box-house hover-img">
      <div className="image-wrap">
        <Link href={`/property-detail/${property.id}`}>
          <Image
            className="lazyload"
            alt={property.name || property.title || ''}
            src="https://res.cloudinary.com/dgavyfooy/image/upload/v1749591601/listings/p4u5w3xaawjuxuqussbo.jpg"
            width={600}
            height={401}
          />
        </Link>
        <ul className="box-tag flex gap-8">
          {property.offer && (
            <li className="flat-tag text-4 bg-main fw-6 text_white">
              Featured
            </li>
          )}
          <li className="flat-tag text-4 bg-3 fw-6 text_white">
            {property.type || "For Sale"}
          </li>
        </ul>
        <div className="list-btn flex gap-8">
          <a href="#" className="btn-icon save hover-tooltip">
            <i className="icon-save" />
            <span className="tooltip">Add Favorite</span>
          </a>
          <a href="#" className="btn-icon find hover-tooltip">
            <i className="icon-find-plus" />
            <span className="tooltip">Quick View</span>
          </a>
        </div>
      </div>

      <div className="content">
        <h5 className="title">
          <Link href={`/property-detail/${property.id}`}>
            {property.name || property.title}
          </Link>
        </h5>
        <p className="location text-1 line-clamp-1">
          <i className="icon-location" /> {property.address || property.location}
        </p>
        <ul className="meta-list flex">
          <li className="text-1 flex">
            <span>{property.bedrooms || property.beds}</span> Beds
          </li>
          <li className="text-1 flex">
            <span>{property.bathrooms || property.baths}</span> Baths
          </li>
          <li className="text-1 flex">
            <span>{property.size || property.sqft || "N/A"}</span> Sqft
          </li>
        </ul>
        <div className="bot flex justify-between items-center">
          <h5 className="price">${property.price?.toLocaleString()}</h5>
          <div className="wrap-btn flex">
            <a href="#" className="compare flex gap-8 items-center text-1">
              <i className="icon-compare" />
              Compare
            </a>
            <Link
              href={`/property-detail/${property.id}`}
              className="tf-btn style-border pd-4"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  </SwiperSlide>
))} */}

              <div className="sw-pagination sw-pagination-mb-1 text-center d-lg-none d-block spd446" />
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
