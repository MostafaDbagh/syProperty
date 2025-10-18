import React, { useMemo } from "react";
import Image from "next/image";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import { useSearchListings } from "@/apis/hooks";

export default function Cities() {
  const { data: searchResponse, isLoading, isError } = useSearchListings({ 
    limit: 50, // Limit to 50 for city statistics
    sort: 'newest' 
  });
  
  // Memoize listings data to prevent unnecessary re-renders
  const listings = useMemo(() => searchResponse?.data || [], [searchResponse?.data]);

  // Memoize state counts calculation to prevent recalculation on every render
  const stateCounts = useMemo(() => {
    return listings.reduce((acc, listing) => {
      const state = listing.state;
      if (state) {
        acc[state] = (acc[state] || 0) + 1;
      }
      return acc;
    }, {});
  }, [listings]);

  // Memoize locations array to prevent recreation on every render
  const locations = useMemo(() => {
    return Object.entries(stateCounts).map(([state, count], index) => ({
      id: index + 1,
      city: state,
      properties: `${count} Properties`,
      imageSrc: `/images/section/location-${(index % 6) + 9}.jpg`, // Cycle through images 9-14
      alt: state,
      width: index === 5 ? 1395 : 689, // Last item gets wider image
      height: 467
    }));
  }, [stateCounts]);

  // Show loading state
  if (isLoading) {
    return (
      <section className="section-neighborhoods">
        <div className="tf-container full">
          <div className="col-12">
            <div className="heading-section text-center mb-48">
              <h2 className="title split-text effect-right">
                <SplitTextAnimation text="Explore The Neighborhoods" />
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Find your dream apartment with our listing
              </p>
            </div>
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading locations...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no locations
  if (locations.length === 0) {
    return (
      <section className="section-neighborhoods">
        <div className="tf-container full">
          <div className="col-12">
            <div className="heading-section text-center mb-48">
              <h2 className="title split-text effect-right">
                <SplitTextAnimation text="Explore The Neighborhoods" />
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Find your dream apartment with our listing
              </p>
            </div>
            <div className="text-center">
              <div className="alert alert-info">
                <h4>No Locations Available</h4>
                <p>There are currently no properties available to show locations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-neighborhoods ">
      <div className="tf-container full">
        <div className="col-12">
          <div className="heading-section text-center mb-48">
            <h2 className="title split-text effect-right">
                <SplitTextAnimation text="Explore The Neighborhoods" />
            </h2>
            <p className="text-1 split-text split-lines-transform">
              Find your dream apartment with our listing
            </p>
          </div>
          <div className="wrap-neighborhoods">
            {locations.slice(0, 7).map((location) => (
              <div
                key={location.id}
                className={`box-location hover-img item-${location.id}`}
              >
                <div className="image-wrap">
                  <a href="#">
                    <Image
                      className="lazyload"
                      data-src={location.imageSrc}
                      alt={location.alt}
                      src={location.imageSrc}
                      width={location.width}
                      height={location.height}
                    />
                  </a>
                </div>
                <div className="content">
                  <h6 className="text_white">{location.city}</h6>
                  <a
                    href="#"
                    className="text-1 tf-btn style-border pd-23 text_white"
                  >
                    {location.properties} <i className="icon-arrow-right" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
