import React from "react";
import Slider3 from "./sliders/Slider3";
import PropertyOverview from "./PropertyOverview";
import VideoReview from "./VideoReview";
import ExtraInfo from "./ExtraInfo";
import Features from "./Features";
import Location from "./Location";
import Sidebar from "./Sidebar";

export default function Details3({ property }) {
  return (
    <section className="section-property-detail style-2">
      <div className="tf-container">
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <Slider3 property={property} />
            <div className="wg-property box-overview">
              <PropertyOverview property={property} />
            </div>
            {property?.videoUrl && (
              <div className="wg-property video spacing-2">
                <VideoReview property={property} />
              </div>
            )}
            <div className="wg-property box-property-detail spacing-1">
              <ExtraInfo property={property} />
            </div>
            <div className="wg-property box-amenities spacing-3">
              <Features property={property} />
            </div>
          </div>
          <div className="col-xl-4 col-lg-5">
            <Sidebar property={property} />
          </div>
        </div>
      </div>
    </section>
  );
}
