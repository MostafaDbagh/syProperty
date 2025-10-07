"use client";
import React from "react";
import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
import DashboardNav from "./DashboardNav";
import { PhoneIcon } from "@/components/icons";
import { useAuthState } from "@/store/hooks/useAuth";

export default function Header1({ parentClass = "header" }) {
  // Use Redux for auth state
  const { isAuthenticated: isLoggedIn, isAgent, changeRole } = useAuthState();

  const makeAgent = () => {
    changeRole('agent');
  };

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
                      alt="Property Listing Logo - Home"
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
                  
                  {/* Add Property Button - Only for Agents */}
                  {isLoggedIn && isAgent && (
                    <div className="btn-add">
                      <Link
                        className="tf-btn style-border pd-23"
                        href={`/add-property`}
                      >
                        Add property
                      </Link>
                    </div>
                  )}
                  
                  {/* Make Me Agent Button - Only for Logged in Users (not agents) */}
                  {isLoggedIn && !isAgent && (
                    <div className="btn-add">
                      <button
                        className="tf-btn pd-23"
                        onClick={makeAgent}
                        style={{
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        🎯 Make Me Agent
                      </button>
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
