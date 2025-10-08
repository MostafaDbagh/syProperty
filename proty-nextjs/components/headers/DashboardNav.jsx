"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "@/store/hooks/useAuth";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
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
  const dropdownRef = useRef(null);
  
  // Use Redux for auth state
  const { 
    isAuthenticated: isLoggedIn, 
    isAgent: isAgentUser, 
    displayName, 
    logout: logoutUser,
    changeRole 
  } = useAuthState();

  // Use GlobalModal context for modals
  const { showRegisterModal, showLoginModal, showSuccessModal } = useGlobalModal();


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDDOpen(false);
      }
    };

    if (isDDOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDDOpen]);

  const handleUserIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If not logged in, open register modal instead of dropdown
    if (!isLoggedIn) {
      showRegisterModal();
    } else {
      // If logged in, toggle dropdown
      setIsDDOpen((pre) => !pre);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await authAPI.signout();
      setIsDDOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Still close dropdown even if API call fails
      setIsDDOpen(false);
    }
  };

  const handleMakeAgent = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user._id) {
        const result = await authAPI.makeAgent(user._id);
        setIsDDOpen(false); // Close dropdown after successful role change
        
        // Show success modal
        showSuccessModal(
          'Congratulations! 🎉', 
          'You are now a Property Agent! You can now list and manage properties.',
          user.email
        );
      }
    } catch (error) {
      console.error('Failed to make user agent:', error);
      // You could show an error modal here if needed
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`box-user tf-action-btns ${isDDOpen && isLoggedIn ? "active" : ""} `}
      onClick={handleUserIconClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="user " style={{ pointerEvents: 'none' }}>
        <UserAvatarIcon />
      </div>
      <div className={`name ${color} `} style={{ pointerEvents: 'none' }}>
        {displayName}
        {isLoggedIn && <i className="icon-CaretDown" />}
      </div>
      <div 
        className="menu-user" 
        style={{ 
          display: isLoggedIn ? 'block' : 'none'
        }}
      >
        {/* Dashboard - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link className="dropdown-item" href={`/dashboard`}>
            <DashboardIcon />
            Dashboards
          </Link>
        )}

        {/* My Profile - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link className="dropdown-item" href={`/my-profile`}>
            <ProfileIcon />
            My profile
          </Link>
        )}

        {/* My Package - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link className="dropdown-item" href={`/my-package`}>
            <PackageIcon />
            My package
          </Link>
        )}

        {/* My Favorites - For ALL logged in users */}
        {isLoggedIn && (
          <Link className="dropdown-item" href={`/my-favorites`}>
            <HeartIcon />
            My favorites (1)
          </Link>
        )}

        {/* Reviews - For ALL logged in users */}
        {isLoggedIn && (
          <Link className="dropdown-item" href={`/review`}>
            <ReviewIcon />
            Reviews
          </Link>
        )}

        {/* Make me Agent - Only for regular users (not agents) */}
        {isLoggedIn && !isAgentUser && (
          <button 
            className="dropdown-item" 
            onClick={handleMakeAgent}
            style={{ cursor: 'pointer', textAlign: 'left' }}
          >
            <AddPropertyIcon />
            Make me Agent
          </button>
        )}

        {/* My Properties - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link className="dropdown-item" href={`/my-property`}>
            <PropertyIcon />
            My properties
          </Link>
        )}

        {/* Add Property - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link className="dropdown-item " href={`/add-property`}>
            <AddPropertyIcon />
            Add property
          </Link>
        )}

        {/* Login/Register - Only for non-logged in users */}
        {!isLoggedIn && (
          <div className="dropdown-item ">
            <UserAvatarIcon stroke="#A8ABAE" />
            <div className="d-flex wrap-login">
              <a href="#" onClick={(e) => { e.preventDefault(); showLoginModal(); }}>
                login
              </a>
              <span>/</span>
              <a href="#" onClick={(e) => { e.preventDefault(); showRegisterModal(); }}>
                register{" "}
              </a>
            </div>
          </div>
        )}

        {/* Logout - Only for logged in users */}
        {isLoggedIn && (
          <button className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer', textAlign: 'left' }}>
            <LogoutIcon />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
