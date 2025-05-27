import AgencyDetails from "@/components/agency/AgencyDetails";

import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import { agenciesData } from "@/data/agency";
import React from "react";

export const metadata = {
  title: "Agency Details || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default async function page({ params }) {
  const { id } = await params;

  const agency =
    agenciesData.filter((elm) => elm.id == id)[0] || agenciesData[0];

  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="main-content tf-spacing-4">
          <Breadcumb pageName="Agency Details" />
          <AgencyDetails agency={agency} />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
