"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "@/store/hooks/useAuth";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import FavoritesCount from "@/components/common/FavoritesCount";
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
      logoutUser(); // This will handle the redirect to home page
      setIsDDOpen(false);
    } catch (error) {
      // Still logout and redirect even if API call fails
      logoutUser(); // This will handle the redirect to home page
      setIsDDOpen(false);
    }
  };

  const handleMakeAgent = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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
      // You could show an error modal here if needed
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`box-user tf-action-btns dashboard-nav-user ${isDDOpen && isLoggedIn ? "active" : ""} `}
      onClick={handleUserIconClick}
    >
      <div className="user dashboard-nav-user-inner" style={{ cursor: 'pointer',borderRadius: '24px' }}>
        <UserAvatarIcon />
      </div>
      <div className={`name ${color} dashboard-nav-name`}>
        {displayName}
        {isLoggedIn && <i className="icon-CaretDown" />}
      </div>
      <div 
        className={`menu-user ${isLoggedIn ? 'dashboard-nav-menu' : 'dashboard-nav-menu-hidden'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dashboard - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link 
            className="dropdown-item" 
            href={`/dashboard`}
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db'
            }}
          >
            <DashboardIcon />
            Dashboard
          </Link>
        )}

        {/* My Profile - For ALL logged in users */}
        {isLoggedIn && (
          <Link 
            className="dropdown-item" 
            href={`/my-profile`}
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db'
            }}
          >
            <ProfileIcon />
            My profile
          </Link>
        )}

        {/* My Package - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link 
            className="dropdown-item" 
            href={`/my-package`}
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db'
            }}
          >
            <PackageIcon />
            My package
          </Link>
        )}

        {/* My Favorites - For ALL logged in users */}
        {isLoggedIn && (
          <Link 
            className="dropdown-item" 
            href={`/my-favorites`}
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db'
            }}
          >
            <FavoritesCount />
          </Link>
        )}

        {/* Reviews - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link 
            className="dropdown-item" 
            href={`/review`}
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db'
            }}
          >
            <ReviewIcon />
            Reviews
          </Link>
        )}

        {/* Make me Agent - Only for regular users (not agents) */}
        {isLoggedIn && !isAgentUser && (
          <button 
            type="button"
            className="dropdown-item dashboard-nav-button" 
            onClick={handleMakeAgent}
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db',
              cursor: 'pointer'
            }}
          >
            <AddPropertyIcon />
            Make me Agent
          </button>
        )}

        {/* My Properties - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link 
            className="dropdown-item" 
            href={`/my-property`}
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db'
            }}
          >
            <PropertyIcon />
            My properties
          </Link>
        )}

        {/* Add Property - Only for logged in agents */}
        {isLoggedIn && isAgentUser && (
          <Link 
            className="dropdown-item" 
            href={`/add-property`}
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db'
            }}
          >
            <AddPropertyIcon />
            Add property
          </Link>
        )}

        {/* Login/Register - Only for non-logged in users */}
        {!isLoggedIn && (
          <div 
            className="dropdown-item"
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db'
            }}
          >
            <UserAvatarIcon stroke="#A8ABAE" />
            <div className="d-flex wrap-login" style={{ gap: '4px' }}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); showLoginModal(); }}
                style={{ color: 'var(--Primary)', textDecoration: 'none', fontWeight: '500' }}
              >
                login
              </a>
              <span style={{ color: 'var(--Note)' }}>/</span>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); showRegisterModal(); }}
                style={{ color: 'var(--Primary)', textDecoration: 'none', fontWeight: '500' }}
              >
                register
              </a>
            </div>
          </div>
        )}

        {/* Logout - Only for logged in users */}
        {isLoggedIn && (
          <button 
            type="button" 
            className="dropdown-item dashboard-nav-button" 
            onClick={handleLogout} 
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db',
              cursor: 'pointer'
            }}
          >
            <LogoutIcon />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
