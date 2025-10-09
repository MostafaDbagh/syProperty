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
      className={className || "btn-icon save hover-tooltip"}
      style={{
        position: 'relative',
        cursor: isLoading ? 'wait' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
        transition: 'all 0.3s ease'
      }}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i 
        className={iconClassName} 
        style={{
          color: isFavorited ? '#ff6b35' : 'inherit',
          fontSize: '18px',
          transition: 'color 0.3s ease'
        }}
      />
      {showLabel && (
        <span className="tooltip">
          {isLoading ? 'Loading...' : isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
        </span>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <span 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px'
          }}
        >
          <span style={{
            width: '12px',
            height: '12px',
            border: '2px solid #ff6b35',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
        </span>
      )}
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}

