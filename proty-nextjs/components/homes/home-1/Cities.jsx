import React from "react";
import Image from "next/image";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import { useSearchListings } from "@/apis/hooks";

export default function Cities() {
  const { data: searchResponse } = useSearchListings({});
  const listings = searchResponse?.data || [];
  const locations = [
    { 
      id: 1, 
      city: "New York", 
      properties: `${listings.filter(p => p.state === 'New York').length} Properties`,
      imageSrc: "/images/section/location-9.jpg",
      alt: "New York",
      width: 689,
      height: 467
    },
    { 
      id: 2, 
      city: "California", 
      properties: `${listings.filter(p => p.state === 'California').length} Properties`,
      imageSrc: "/images/section/location-10.jpg",
      alt: "California",
      width: 689,
      height: 467
    },
    { 
      id: 3, 
      city: "Texas", 
      properties: `${listings.filter(p => p.state === 'Texas').length} Properties`,
      imageSrc: "/images/section/location-11.jpg",
      alt: "Texas",
      width: 689,
      height: 467
    },
    { 
      id: 4, 
      city: "Florida", 
      properties: `${listings.filter(p => p.state === 'Florida').length} Properties`,
      imageSrc: "/images/section/location-12.jpg",
      alt: "Florida",
      width: 689,
      height: 467
    },
    { 
      id: 5, 
      city: "Illinois", 
      properties: `${listings.filter(p => p.state === 'Illinois').length} Properties`,
      imageSrc: "/images/section/location-13.jpg",
      alt: "Illinois",
      width: 689,
      height: 467
    },
    { 
      id: 6, 
      city: "Washington", 
      properties: `${listings.filter(p => p.state === 'Washington').length} Properties`,
      imageSrc: "/images/section/location-14.jpg",
      alt: "Washington",
      width: 1395,
      height: 467
    }
  ];

  return (
    <section className="section-neighborhoods ">
      <div className="tf-container full">
        <div className="col-12">
          <div className="heading-section text-center mb-48">
            <h2 className="title split-text effect-right">
              <SplitTextAnimation text="Explore The Neighborhood fs" />
            </h2>
            <p className="text-1 split-text split-lines-transform">
              Find your dream apartment with our listing
            </p>
          </div>
          <div className="wrap-neighborhoods">
            {locations.map((location) => (
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
