import React from "react";
import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
export default function Header6() {
  return (
    <header id="header-main" className="header style-6 v1">
      <div className="header-inner">
        <div className="tf-container xl">
          <div className="row">
            <div className="col-12">
              <div className="header-inner-wrap">
                <div className="header-logo">
                  <Link href={`/`} className="site-logo">
                    <Image
                      className="logo_header"
                      alt=""
                      width={272}
                      height={85}
                      src="/images/logo/logo-2@2x.png"
                    />
                  </Link>
                </div>
                <nav className="main-menu">
                  <ul className="navigation">
                    <Nav />
                  </ul>
                </nav>
                <div className="header-right">
                  <div className="btn-add">
                    <Link
                      className="tf-btn style-border border2 pd-23"
                      href={`/add-property`}
                    >
                      Book a visit
                    </Link>
                  </div>
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
