"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query"; 
import ReduxProvider from "@/store/ReduxProvider";
import { GlobalModalProvider } from "@/components/contexts/GlobalModalContext";

import "../public/main.scss";
import "odometer/themes/odometer-theme-default.css";
import "photoswipe/style.css";
import "rc-slider/assets/index.css";

import { usePathname } from "next/navigation";
import BackToTop from "@/components/common/BackToTop";
import MobileMenu from "@/components/headers/MobileMenu";
import SettingsHandler from "@/components/common/SettingsHandler";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  if (typeof window !== "undefined") {
    import("bootstrap/dist/js/bootstrap.esm").then(() => {});
  }

  useEffect(() => {
    const bootstrap = require("bootstrap");
    const modals = document.querySelectorAll(".modal.show");
    modals.forEach((modal) => {
      const instance = bootstrap.Modal.getInstance(modal);
      if (instance) instance.hide();
    });

    const offcanvas = document.querySelectorAll(".offcanvas.show");
    offcanvas.forEach((item) => {
      const instance = bootstrap.Offcanvas.getInstance(item);
      if (instance) instance.hide();
    });
  }, [pathname]);

  useEffect(() => {
    const WOW = require("@/utlis/wow");
    const wow = new WOW.default({
      animateClass: "animated",
      offset: 100,
      mobile: true,
      live: false,
    });
    wow.init();
  }, [pathname]);

  useEffect(() => {
    const handleSticky = () => {
      const navbar = document.querySelector(".header");
      if (navbar) {
        if (window.scrollY > 120) {
          navbar.classList.add("fixed", "header-sticky");
        } else {
          navbar.classList.remove("fixed", "header-sticky");
        }
        if (window.scrollY > 300) {
          navbar.classList.add("is-sticky");
        } else {
          navbar.classList.remove("is-sticky");
        }
      }
    };

    window.addEventListener("scroll", handleSticky);
    return () => window.removeEventListener("scroll", handleSticky);
  }, []);

  return (
    <html lang="en">
      <body className="popup-loader">
        <ReduxProvider>
          <GlobalModalProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <MobileMenu />
              <BackToTop />
              <SettingsHandler />
            </QueryClientProvider>
          </GlobalModalProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
