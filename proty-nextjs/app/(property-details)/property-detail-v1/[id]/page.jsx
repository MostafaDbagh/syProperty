import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Details1 from "@/components/propertyDetails/Details1";
import RelatedProperties from "@/components/propertyDetails/RelatedProperties";
import Slider1 from "@/components/propertyDetails/sliders/Slider1";
import React from "react";
import { allProperties } from "@/data/properties";

export const metadata = {
  title: "Property Details 01 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default async function page({ params }) {
  const { id } = await params;

  const property =
    allProperties.filter((elm) => elm.id == id)[0] || allProperties[0];

  return (
    <>
      <div id="wrapper">
        <Header1 />
        <Breadcumb pageName="Property Details 01" />
        <div className="main-content">
          <Slider1 />
          <Details1 property={property} />
          <RelatedProperties />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
