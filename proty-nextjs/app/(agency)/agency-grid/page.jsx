import Agency1 from "@/components/agency/Agency1";
import Agents from "@/components/agents/Agents";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import React from "react";

export const metadata = {
  title: "Agency Grid || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="main-content tf-spacing-4">
          <Breadcumb pageName="Agency Grid" />
          <Agency1 />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
