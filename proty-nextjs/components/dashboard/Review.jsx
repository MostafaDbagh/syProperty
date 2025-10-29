"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useReviewsByAgent, useHideReviewFromDashboard, useHideReviewFromListing } from "@/apis/hooks";
import { reviewAPI } from "@/apis/review";
import { useQueryClient } from "@tanstack/react-query";
import LocationLoader from "../common/LocationLoader";
import Toast from "../common/Toast";

export default function Review() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });
  
  // Track which reviews have been successfully hidden
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState(new Set());
  const [hiddenFromListing, setHiddenFromListing] = useState(new Set());

  const queryClient = useQueryClient();
  const hideFromDashboardMutation = useHideReviewFromDashboard();
  const hideFromListingMutation = useHideReviewFromListing();

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => {
      setToast({ isVisible: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  // Fetch agent's property reviews with pagination
  const { data: reviewsData, isLoading, isError } = useReviewsByAgent(
    user?._id,
    { page: currentPage, limit: itemsPerPage }
  );

  const reviews = reviewsData?.data || [];
  const stats = reviewsData?.stats || { totalReviews: 0, averageRating: 0, totalProperties: 0 };
  const pagination = reviewsData?.pagination || {};

  // Initialize hidden sets from review data (for reviews already hidden)
  useEffect(() => {
    if (reviews.length > 0) {
      const dashboardHidden = new Set();
      const listingHidden = new Set();
      
      reviews.forEach(review => {
        if (review.hiddenFromDashboard) {
          dashboardHidden.add(review._id);
        }
        if (review.hiddenFromListing) {
          listingHidden.add(review._id);
        }
      });
      
      setHiddenFromDashboard(prev => {
        const merged = new Set(prev);
        dashboardHidden.forEach(id => merged.add(id));
        return merged;
      });
      
      setHiddenFromListing(prev => {
        const merged = new Set(prev);
        listingHidden.forEach(id => merged.add(id));
        return merged;
      });
    }
  }, [reviews]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Render stars
  const renderStars = (rating = 5) => {
    return Array(rating).fill(0).map((_, index) => (
      <i key={index} className="icon-star" />
    ));
  };

  // Get avatar
  const getAvatar = (review) => {
    if (review.userId?.avatar) return review.userId.avatar;
    return '/images/avatar/avt-png13.png'; // Default avatar
  };

  // Get reviewer name
  const getReviewerName = (review) => {
    if (review.userId?.username) return review.userId.username;
    return review.name || 'Anonymous';
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

  // Handle hide review from dashboard
  const handleHideFromDashboard = async (reviewId) => {
    try {
      await hideFromDashboardMutation.mutateAsync({ reviewId, hidden: true });
      // Mark this review as hidden from dashboard
      setHiddenFromDashboard(prev => new Set(prev).add(reviewId));
      showToast('Review hidden from dashboard');
    } catch (error) {
      showToast('Failed to hide review', 'error');
    }
  };

  // Handle hide review from listing
  const handleHideFromListing = async (reviewId) => {
    try {
      await hideFromListingMutation.mutateAsync({ reviewId, hidden: true });
      // Mark this review as hidden from listing
      setHiddenFromListing(prev => new Set(prev).add(reviewId));
      showToast('Review hidden from listing');
    } catch (error) {
      showToast('Failed to hide review', 'error');
    }
  };

  return (
    <div className="main-content w-100">
      <div className="main-content-inner style-3">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Dashboard</span>
        </div>

        {/* Statistics Cards */}
        {!isLoading && stats.totalReviews > 0 && (
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-body text-center p-4">
                  <h3 className="mb-2" style={{ color: '#ff6b35', fontSize: '32px', fontWeight: '700' }}>
                    {stats.totalReviews}
                  </h3>
                  <p className="mb-0" style={{ color: '#666', fontSize: '14px' }}>Total Reviews</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-body text-center p-4">
                  <h3 className="mb-2" style={{ color: '#FFB800', fontSize: '32px', fontWeight: '700' }}>
                    {stats.averageRating.toFixed(1)} <i className="icon-star" style={{ fontSize: '24px' }} />
                  </h3>
                  <p className="mb-0" style={{ color: '#666', fontSize: '14px' }}>Average Rating</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-body text-center p-4">
                  <h3 className="mb-2" style={{ color: '#28a745', fontSize: '32px', fontWeight: '700' }}>
                    {stats.totalProperties}
                  </h3>
                  <p className="mb-0" style={{ color: '#666', fontSize: '14px' }}>Properties with Reviews</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="widget-box-2 mess-box">
          <h3 className="title">
            My Property Reviews
            {pagination.totalReviews > 0 && (
              <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', color: '#666' }}>
                ({pagination.totalReviews} total reviews)
              </span>
            )}
          </h3>

          {isLoading && (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <LocationLoader 
                size="large" 
                message="Loading property reviews..."
              />
            </div>
          )}

          {isError && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
              <p>Failed to load reviews. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && reviews.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No reviews found.</p>
            </div>
          )}

          {!isLoading && !isError && reviews.length > 0 && (
            <>
              <ul className="list-mess">
                {reviews.map((review) => (
                  <li key={review._id} className="mess-item">
                    <div className="user-box">
                      <div className="avatar">
                        <Image
                          alt={getReviewerName(review)}
                          src={getAvatar(review)}
                          width={51}
                          height={51}
                        />
                      </div>
                      <div className="content justify-content-start">
                        <div className="name fw-6">{getReviewerName(review)}</div>
                        <span className="caption-2 text-variant-3">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p>{review.review}</p>
                    {review.propertyId && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        marginTop: '8px',
                        marginBottom: '8px' 
                      }}>
                        Property: <strong>{review.propertyId.propertyKeyword || 'N/A'}</strong>
                        <br />
                        <a 
                          href={`/property-detail/${review.propertyId._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#f1913d',
                            textDecoration: 'none',
                            fontSize: '11px',
                            fontWeight: '500',
                            marginTop: '4px',
                            display: 'inline-block',
                            padding: '2px 6px',
                            backgroundColor: '#fef7f1',
                            borderRadius: '4px',
                            border: '1px solid rgba(241, 145, 61, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f1913d';
                            e.target.style.color = '#ffffff';
                            e.target.style.borderColor = '#f1913d';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#fef7f1';
                            e.target.style.color = '#f1913d';
                            e.target.style.borderColor = 'rgba(241, 145, 61, 0.2)';
                          }}
                        >
                          View Property Details (ID: {review.propertyId._id})
                        </a>
                      </div>
                    )}
                    <div className="ratings">
                      {renderStars(review.rating || 5)}
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleHideFromDashboard(review._id)}
                        disabled={hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard || hideFromDashboardMutation.isPending}
                        style={{
                          background: (hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard) 
                            ? '#9ca3af' 
                            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          border: 'none',
                          color: 'white',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: (hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard || hideFromDashboardMutation.isPending) ? 'not-allowed' : 'pointer',
                          opacity: (hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard || hideFromDashboardMutation.isPending) ? 0.6 : 1,
                          transition: 'all 0.2s ease'
                        }}
                        title={(hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard) ? 'Already hidden' : 'Hide from Dashboard'}
                      >
                        {hideFromDashboardMutation.isPending && !hiddenFromDashboard.has(review._id) && !review.hiddenFromDashboard ? 'Hiding...' : 
                         (hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard) ? 'Hidden' : 'Hide from Dashboard'}
                      </button>
                      <button
                        onClick={() => handleHideFromListing(review._id)}
                        disabled={hiddenFromListing.has(review._id) || review.hiddenFromListing || hideFromListingMutation.isPending}
                        style={{
                          background: (hiddenFromListing.has(review._id) || review.hiddenFromListing) 
                            ? '#9ca3af' 
                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          border: 'none',
                          color: 'white',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: (hiddenFromListing.has(review._id) || review.hiddenFromListing || hideFromListingMutation.isPending) ? 'not-allowed' : 'pointer',
                          opacity: (hiddenFromListing.has(review._id) || review.hiddenFromListing || hideFromListingMutation.isPending) ? 0.6 : 1,
                          transition: 'all 0.2s ease'
                        }}
                        title={(hiddenFromListing.has(review._id) || review.hiddenFromListing) ? 'Already hidden' : 'Hide from Listing'}
                      >
                        {hideFromListingMutation.isPending && !hiddenFromListing.has(review._id) && !review.hiddenFromListing ? 'Hiding...' : 
                         (hiddenFromListing.has(review._id) || review.hiddenFromListing) ? 'Hidden' : 'Hide from Listing'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

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
            </>
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
      
      {/* Toast */}
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
