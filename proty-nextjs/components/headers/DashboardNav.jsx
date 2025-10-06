"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { isAuthenticated, isAgent, getUserDisplayName, logout } from "@/utlis/authHelpers";
import { 
  UserAvatarIcon, 
  DashboardIcon, 
  ProfileIcon, 
  PackageIcon, 
  HeartIcon, 
  ReviewIcon, 
  PropertyIcon, 
  AddPropertyIcon, 
  LogoutIcon 
} from "@/components/icons";

export default function DashboardNav({ color = "" }) {
  const [isDDOpen, setIsDDOpen] = useState(false);
  const [userAuth, setUserAuth] = useState({
    isLoggedIn: false,
    isAgentUser: false,
    displayName: "Guest"
  });

  useEffect(() => {
    setUserAuth({
      isLoggedIn: isAuthenticated(),
      isAgentUser: isAgent(),
      displayName: getUserDisplayName()
    });
  }, []);

  const handleUserIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If not logged in, open register modal instead of dropdown
    if (!userAuth.isLoggedIn) {
      console.log('Opening register modal for guest user');
      const registerModal = document.querySelector('#modalRegister');
      if (registerModal) {
        if (window.bootstrap?.Modal) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(registerModal);
          modal.show();
        } else {
          // Fallback if Bootstrap isn't loaded yet
          registerModal.classList.add('show');
          registerModal.style.display = 'block';
          document.body.classList.add('modal-open');
          
          // Create backdrop
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
      } else {
        console.error('Register modal not found');
      }
    } else {
      // If logged in, toggle dropdown
      setIsDDOpen((pre) => !pre);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div
      className={`box-user tf-action-btns ${isDDOpen && userAuth.isLoggedIn ? "active" : ""} `}
      onClick={handleUserIconClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="user " style={{ pointerEvents: 'none' }}>
        <UserAvatarIcon />
      </div>
      <div className={`name ${color} `} style={{ pointerEvents: 'none' }}>
        {userAuth.displayName}
        {userAuth.isLoggedIn && <i className="icon-CaretDown" />}
      </div>
      <div className="menu-user" style={{ display: userAuth.isLoggedIn ? 'block' : 'none' }}>
        {/* Dashboard - Only for logged in agents */}
        {userAuth.isLoggedIn && userAuth.isAgentUser && (
          <Link className="dropdown-item" href={`/dashboard`}>
            <DashboardIcon />
            Dashboards
          </Link>
        )}

        {/* My Profile - Only for logged in agents */}
        {userAuth.isLoggedIn && userAuth.isAgentUser && (
          <Link className="dropdown-item" href={`/my-profile`}>
            <ProfileIcon />
            My profile
          </Link>
        )}

        {/* My Package - Only for logged in agents */}
        {userAuth.isLoggedIn && userAuth.isAgentUser && (
          <Link className="dropdown-item" href={`/my-package`}>
            <PackageIcon />
            My package
          </Link>
        )}

        {/* My Favorites - Only for logged in agents */}
        {userAuth.isLoggedIn && userAuth.isAgentUser && (
          <Link className="dropdown-item" href={`/my-favorites`}>
            <HeartIcon />
            My favorites (1)
          </Link>
        )}

        {/* My Save Searches - Commented out
        {userAuth.isLoggedIn && userAuth.isAgentUser && (
        <Link className="dropdown-item" href={`/my-save-search`}>
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.91797 16.6666H3.33464C2.89261 16.6666 2.46868 16.491 2.15612 16.1785C1.84356 15.8659 1.66797 15.442 1.66797 15V4.16662C1.66797 3.7246 1.84356 3.30067 2.15612 2.98811C2.46868 2.67555 2.89261 2.49996 3.33464 2.49996H6.58464C6.86337 2.49723 7.13835 2.56445 7.38438 2.69547C7.63042 2.8265 7.83967 3.01715 7.99297 3.24996L8.66797 4.24996C8.81973 4.4804 9.02632 4.66956 9.26922 4.80046C9.51212 4.93136 9.78371 4.99991 10.0596 4.99996H16.668C17.11 4.99996 17.5339 5.17555 17.8465 5.48811C18.159 5.80067 18.3346 6.2246 18.3346 6.66662V10.0833"
              stroke="#A8ABAE"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.5013 17.5L15.918 15.9166"
              stroke="#A8ABAE"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.168 16.6666C15.5487 16.6666 16.668 15.5473 16.668 14.1666C16.668 12.7859 15.5487 11.6666 14.168 11.6666C12.7873 11.6666 11.668 12.7859 11.668 14.1666C11.668 15.5473 12.7873 16.6666 14.168 16.6666Z"
              stroke="#A8ABAE"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          My save searches
        </Link>
        )}
        */}

        {/* Reviews - Only for logged in agents */}
        {userAuth.isLoggedIn && userAuth.isAgentUser && (
          <Link className="dropdown-item" href={`/review`}>
            <ReviewIcon />
            Reviews
          </Link>
        )}

        {/* My Properties - Only for logged in agents */}
        {userAuth.isLoggedIn && userAuth.isAgentUser && (
          <Link className="dropdown-item" href={`/my-property`}>
            <PropertyIcon />
            My properties
          </Link>
        )}

        {/* Add Property - Only for logged in agents */}
        {userAuth.isLoggedIn && userAuth.isAgentUser && (
          <Link className="dropdown-item " href={`/add-property`}>
            <AddPropertyIcon />
            Add property
          </Link>
        )}

        {/* Login/Register - Only for non-logged in users */}
        {!userAuth.isLoggedIn && (
          <div className="dropdown-item ">
            <UserAvatarIcon stroke="#A8ABAE" />
            <div className="d-flex wrap-login">
              <a href="#modalLogin" data-bs-toggle="modal">
                login
              </a>
              <span>/</span>
              <a href="#modalRegister" data-bs-toggle="modal">
                register{" "}
              </a>
            </div>
          </div>
        )}

        {/* Logout - Only for logged in users */}
        {userAuth.isLoggedIn && (
          <button className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer', textAlign: 'left' }}>
            <LogoutIcon />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
