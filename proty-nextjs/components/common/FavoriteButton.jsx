"use client";
import React, { useState, useEffect } from 'react';
import { favoriteAPI } from '@/apis/favorites';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/components/contexts/FavoritesContext';

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
  const router = useRouter();
  const { incrementFavoritesCount, decrementFavoritesCount } = useFavorites();

  // Check if user is logged in and if property is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const favorited = await favoriteAPI.isFavorited(propertyId);
        setIsFavorited(favorited);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkFavoriteStatus();
  }, [propertyId]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Redirect to login
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        await favoriteAPI.removeFavorite(propertyId);
        setIsFavorited(false);
        decrementFavoritesCount(); // Update global count
        
        // Call callback if provided
        if (onToggle) {
          onToggle(false);
        }
      } else {
        // Add to favorites
        await favoriteAPI.addFavorite(propertyId);
        setIsFavorited(true);
        incrementFavoritesCount(); // Update global count
        
        // Call callback if provided
        if (onToggle) {
          onToggle(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Show error message
      alert(error?.message || error?.error || 'Failed to update favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}

