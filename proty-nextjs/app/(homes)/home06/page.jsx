import ThemeController from "@/components/common/ThemeController";
import Footer2 from "@/components/footers/Footer2";
import Header6 from "@/components/headers/Header6";
import About from "@/components/homes/home-6/About";
import Blogs from "@/components/homes/home-6/Blogs";
import Contact from "@/components/homes/home-6/Contact";
import Hero from "@/components/homes/home-6/Hero";
import Projects from "@/components/homes/home-6/Projects";
import Services from "@/components/homes/home-6/Services";
import Team from "@/components/homes/home-6/Team";
import Testimonials from "@/components/homes/home-6/Testimonials";
import React from "react";

export const metadata = {
  title: "Home 06 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <>
      <ThemeController themeColor={"default-dark"} />
      <div id="wrapper" className="bg-body-1 counter-scroll">
        <Header6 />
        <Hero />
        <div className="main-content">
          <About />
          <Services />
          <Projects />
          <Team />
          <Testimonials />
          <Blogs />
          <Contact />
        </div>
        <Footer2 />
      </div>
    </>
  );
}
