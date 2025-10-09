"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from '@tanstack/react-query';
import { favoriteAPI } from "@/apis/favorites";
import ConfirmationModal from "../modals/ConfirmationModal";
import Toast from "../common/Toast";
import { useFavorites } from "@/components/contexts/FavoritesContext";

export default function Favorites() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { favoritesCount, refreshFavoritesCount } = useFavorites();
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmColor: '#dc3545',
    onConfirm: null,
    loading: false
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Get user from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('👤 User loaded from localStorage:', parsedUser);
      console.log('   - Email:', parsedUser.email);
      console.log('   - Role:', parsedUser.role);
      console.log('   - ID:', parsedUser._id);
      setUser(parsedUser);
    } else {
      console.log('⚠️ No user found in localStorage');
    }
  }, []);

  // Fetch favorites with pagination
  const { data: favoritesData, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-favorites', user?._id, currentPage],
    queryFn: async () => {
      console.log('🔍 Fetching favorites for user:', user?._id, 'page:', currentPage);
      const result = await favoriteAPI.getFavorites({ page: currentPage, limit: itemsPerPage });
      console.log('✅ Favorites received:', result?.data?.length || 0, 'items');
      console.log('📊 Pagination:', result?.pagination);
      return result;
    },
    enabled: !!user,
    retry: 1,
    keepPreviousData: true
  });

  const favorites = favoritesData?.data || [];
  const pagination = favoritesData?.pagination || {};

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get property image
  const getPropertyImage = (property) => {
    if (property?.images && property.images.length > 0) {
      return property.images[0].url;
    }
    return '/images/default.jpg';
  };

  // Get property status display
  const getStatusDisplay = (property) => {
    if (!property) return 'N/A';
    if (property.isSold) return 'Sold';
    if (property.approvalStatus === 'closed') return 'Closed';
    if (property.approvalStatus === 'pending') return 'Pending';
    if (property.approvalStatus === 'approved') {
      return property.status === 'rent' ? 'For Rent' : 'For Sale';
    }
    return property.status === 'rent' ? 'For Rent' : 'For Sale';
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages || 1;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  // Handle delete favorite
  const handleDeleteFavorite = (favorite) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Remove from Favorites',
      message: `Are you sure you want to remove "${favorite.propertyId?.propertyKeyword || 'this property'}" from your favorites?`,
      confirmText: 'Remove',
      confirmColor: '#dc3545',
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, loading: true }));
        try {
          await favoriteAPI.removeFavorite(favorite.propertyId._id);
          refetch(); // Refresh the favorites list
          refreshFavoritesCount(); // Update the global count
          setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: 'Confirm', confirmColor: '#dc3545', onConfirm: null, loading: false });
          showToast('Property removed from favorites successfully!', 'success');
        } catch (error) {
          console.error('Error removing favorite:', error);
          setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: 'Confirm', confirmColor: '#dc3545', onConfirm: null, loading: false });
          const errorMessage = error?.message || error?.error || 'Failed to remove favorite. Please try again.';
          showToast(errorMessage, 'error');
        }
      },
      loading: false
    });
  };

  return (
    <div className="main-content w-100">
      <div className="main-content-inner">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Dashboard</span>
        </div>
        <div className="widget-box-2 wd-listing">
          <h3 className="title">
            My Favorites
            {favoritesCount > 0 && (
              <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', color: '#666' }}>
                ({favoritesCount} total {favoritesCount === 1 ? 'property' : 'properties'})
              </span>
            )}
          </h3>

          {isLoading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p>Loading favorites...</p>
            </div>
          )}

          {isError && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#dc3545' }}>
              <p>Failed to load favorites. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && favorites.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p>You haven't added any properties to your favorites yet.</p>
              <Link href="/property-list" style={{ color: '#ff6b35', marginTop: '10px', display: 'inline-block' }}>
                Browse Properties
              </Link>
            </div>
          )}

          {!isLoading && !isError && favorites.length > 0 && (
            <div className="wrap-table">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Listing</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favorites.map((favorite) => {
                      const property = favorite.propertyId;
                      if (!property) return null;

                      return (
                        <tr key={favorite._id} className="file-delete">
                          <td>
                            <div className="listing-box">
                              <div className="images">
                                <Image
                                  alt={property.propertyKeyword || 'Property'}
                                  src={getPropertyImage(property)}
                                  width={615}
                                  height={405}
                                />
                              </div>
                              <div className="content">
                                <div className="title">
                                  <Link
                                    href={`/property-detail/${property._id}`}
                                    className="link"
                                  >
                                    {property.propertyKeyword || 'Property'}
                                  </Link>
                                </div>
                                <div className="text-date">
                                  Added: {formatDate(favorite.createdAt || favorite.addedAt)}
                                </div>
                                <div className="text-btn text-color-primary">
                                  ${property.propertyPrice?.toLocaleString() || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span 
                              className="btn-status"
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '500',
                                display: 'inline-block',
                                minWidth: '80px',
                                textAlign: 'center',
                                height: '40px',
                                lineHeight: '24px',
                                backgroundColor: 
                                  property.isSold || property.approvalStatus === 'closed' ? '#dc3545' :
                                  property.approvalStatus === 'pending' ? '#ffc107' :
                                  property.status === 'rent' ? '#17a2b8' : '#28a745',
                                color: '#fff'
                              }}
                            >
                              {getStatusDisplay(property)}
                            </span>
                          </td>
                          <td>
                            <ul className="list-action">
                              <li>
                                <button
                                  onClick={() => handleDeleteFavorite(favorite)}
                                  className="remove-file item"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    cursor: 'pointer',
                                    color: '#A3ABB0',
                                    fontSize: '14px',
                                    padding: '8px 12px',
                                    transition: 'color 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => e.target.style.color = '#dc3545'}
                                  onMouseLeave={(e) => e.target.style.color = '#A3ABB0'}
                                >
                                  <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.82667 6.00035L9.596 12.0003M6.404 12.0003L6.17333 6.00035M12.8187 3.86035C13.0467 3.89501 13.2733 3.93168 13.5 3.97101M12.8187 3.86035L12.1067 13.1157C12.0776 13.4925 11.9074 13.8445 11.63 14.1012C11.3527 14.3579 10.9886 14.5005 10.6107 14.5003H5.38933C5.0114 14.5005 4.64735 14.3579 4.36999 14.1012C4.09262 13.8445 3.92239 13.4925 3.89333 13.1157L3.18133 3.86035M12.8187 3.86035C12.0492 3.74403 11.2758 3.65574 10.5 3.59568M3.18133 3.86035C2.95333 3.89435 2.72667 3.93101 2.5 3.97035M3.18133 3.86035C3.95076 3.74403 4.72416 3.65575 5.5 3.59568M10.5 3.59568V2.98501C10.5 2.19835 9.89333 1.54235 9.10667 1.51768C8.36908 1.49411 7.63092 1.49411 6.89333 1.51768C6.10667 1.54235 5.5 2.19901 5.5 2.98501V3.59568M10.5 3.59568C8.83581 3.46707 7.16419 3.46707 5.5 3.59568"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '30px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e5e5'
                }}>
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPreviousPage}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      background: pagination.hasPreviousPage ? '#fff' : '#f5f5f5',
                      color: pagination.hasPreviousPage ? '#333' : '#999',
                      cursor: pagination.hasPreviousPage ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    « Previous
                  </button>

                  {/* Page Numbers */}
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} style={{ padding: '8px 12px', color: '#999' }}>
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e5e5e5',
                            borderRadius: '6px',
                            background: currentPage === page ? '#ff6b35' : '#fff',
                            color: currentPage === page ? '#fff' : '#333',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: currentPage === page ? '600' : '400',
                            minWidth: '40px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== page) {
                              e.target.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== page) {
                              e.target.style.backgroundColor = '#fff';
                            }
                          }}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      background: pagination.hasNextPage ? '#fff' : '#f5f5f5',
                      color: pagination.hasNextPage ? '#333' : '#999',
                      cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Next »
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* .footer-dashboard */}
        <div className="footer-dashboard">
          <p>Copyright © {new Date().getFullYear()} Popty</p>
          <ul className="list">
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Support</a>
            </li>
          </ul>
        </div>
        {/* .footer-dashboard */}
      </div>
      <div className="overlay-dashboard" />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: 'Confirm', confirmColor: '#dc3545', onConfirm: null, loading: false })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        confirmColor={confirmationModal.confirmColor}
        loading={confirmationModal.loading}
      />

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
}
