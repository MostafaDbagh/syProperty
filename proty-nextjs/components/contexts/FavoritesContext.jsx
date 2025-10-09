"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { favoriteAPI } from '@/apis/favorites';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites count on mount and when user changes
  useEffect(() => {
    loadFavoritesCount();
  }, []);

  const loadFavoritesCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFavoritesCount(0);
      return;
    }

    setIsLoading(true);
    try {
      // Get a small number of items to get the total count from pagination
      const response = await favoriteAPI.getFavorites({ page: 1, limit: 10 });
      console.log('FavoritesContext - API response:', response);
      const totalCount = response?.pagination?.totalFavorites || response?.data?.length || 0;
      console.log('FavoritesContext - Setting count to:', totalCount);
      setFavoritesCount(totalCount);
    } catch (error) {
      console.error('Error loading favorites count:', error);
      setFavoritesCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementFavoritesCount = () => {
    setFavoritesCount(prev => prev + 1);
  };

  const decrementFavoritesCount = () => {
    setFavoritesCount(prev => Math.max(0, prev - 1));
  };

  const resetFavoritesCount = () => {
    setFavoritesCount(0);
  };

  const refreshFavoritesCount = () => {
    loadFavoritesCount();
  };

  const value = {
    favoritesCount,
    isLoading,
    incrementFavoritesCount,
    decrementFavoritesCount,
    resetFavoritesCount,
    refreshFavoritesCount
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
