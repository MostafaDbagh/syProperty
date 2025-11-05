"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { favoriteAPI } from '@/apis/favorites';
import { useFavorites } from '@/components/contexts/FavoritesContext';
import { useGlobalModal } from '@/components/contexts/GlobalModalContext';
import logger from '@/utils/logger';
import Toast from './Toast';

export default function FavoriteButton({ 
  propertyId, 
  initialIsFavorited = false,
  showLabel = true,
  className = '',
  iconClassName = 'icon-save',
  onToggle = null // Callback for when favorite status changes
}) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [toast, setToast] = useState(null);
  const { showLoginModal } = useGlobalModal();
  const { incrementFavoritesCount, decrementFavoritesCount } = useFavorites();

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const pathname = usePathname();
  
  // Check if we're on a dashboard or favorites page
  const isDashboardOrFavoritesPage = pathname?.startsWith('/dashboard') || 
                                      pathname?.startsWith('/my-favorites') || 
                                      pathname?.startsWith('/my-property') ||
                                      pathname?.startsWith('/review') ||
                                      pathname?.startsWith('/messages') ||
                                      pathname?.startsWith('/property-detail');

  // Check if user is logged in and if property is favorited
  // Only check on dashboard/favorites pages or property detail pages
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      // Only check favorite status on dashboard/favorites pages or property detail pages
      // Skip on home page to avoid unnecessary API calls
      if (!isDashboardOrFavoritesPage) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const favorited = await favoriteAPI.isFavorited(propertyId);
        setIsFavorited(favorited);
      } catch (error) {
        logger.error('Error checking favorite status:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkFavoriteStatus();
  }, [propertyId, isDashboardOrFavoritesPage]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Show login modal instead of redirecting
      showLoginModal();
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await favoriteAPI.removeFavorite(propertyId);
        setIsFavorited(false);
        decrementFavoritesCount(); // Update global count
        
        // Show success message
        const message = response?.message || 'Property removed from favorites successfully!';
        showToast(message, 'success');
        
        // Call callback if provided
        if (onToggle) {
          onToggle(false);
        }
      } else {
        // Add to favorites
        const response = await favoriteAPI.addFavorite(propertyId);
        setIsFavorited(true);
        incrementFavoritesCount(); // Update global count
        
        // Show success message
        const message = response?.message || 'Property added to favorites successfully!';
        showToast(message, 'success');
        
        // Call callback if provided
        if (onToggle) {
          onToggle(true);
        }
      }
    } catch (error) {
      logger.error('Error toggling favorite:', error);
      
      // Show error message
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to update favorites. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading || isCheckingAuth}
        className={`${className || "btn-icon save hover-tooltip"} favorite-button`}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <i 
          className={`${iconClassName} favorite-icon ${isFavorited ? 'favorite-icon-favorited' : ''}`}
        />
        {showLabel && (
          <span className="tooltip">
            {isLoading ? 'Loading...' : isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
          </span>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <span className="favorite-loading-overlay">
            <span className="favorite-loading-spinner" />
          </span>
        )}
      </button>
      {/* Toast Notification - Rendered at root level using Portal */}
      {toast && typeof window !== 'undefined' && createPortal(
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />,
        document.body
      )}
    </>
  );
}

