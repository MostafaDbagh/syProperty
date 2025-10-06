"use client";
import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
import DashboardNav from "./DashboardNav";
import { PhoneIcon } from "@/components/icons";
import { isAgent, isAuthenticated } from "@/utlis/authHelpers";

export default function Header1({ parentClass = "header" }) {
  const [canAddProperty, setCanAddProperty] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is an agent
    setCanAddProperty(isAuthenticated() && isAgent());
  }, []);

  return (
    <header id="header-main" className={parentClass}>
      <div className="header-inner">
        <div className="tf-container xl">
          <div className="row">
            <div className="col-12">
              <div className="header-inner-wrap">
                <div className="header-logo">
                  <Link href={`/`} className="site-logo">
                    <img
                      className="logo_header"
                      alt=""
                      data-light="/images/logo/logo@2x.png"
                      data-dark="/images/logo/logo-2@2x.png"
                      src="/images/logo/logo@2x.png"
                    />
                  </Link>
                </div>
                <nav className="main-menu">
                  <ul className="navigation ">
                    <Nav />
                  </ul>
                </nav>
                <div className="header-right">
                  <div className="phone-number">
                    <div className="icons">
                      <PhoneIcon stroke="black" />
                    </div>
                    <p>(603) 555-0123</p>
                  </div>
                  <DashboardNav />
                  {canAddProperty && (
                    <div className="btn-add">
                      <Link
                        className="tf-btn style-border pd-23"
                        href={`/add-property`}
                      >
                        Add property
                      </Link>
                    </div>
                  )}
                  <div
                    className="mobile-button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#menu-mobile"
                    aria-controls="menu-mobile"
                  >
                    <i className="icon-menu" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
