"use client";
import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useReviewsByProperty, useCreateReview } from "@/apis/hooks";
import { useQueryClient } from "@tanstack/react-query";

export default function PropertyReviews({ propertyId }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const queryClient = useQueryClient();
  const { data: reviewsData, isLoading, isError } = useReviewsByProperty(propertyId);
  const createReviewMutation = useCreateReview();

  // Debug logging
  console.log('PropertyReviews Debug:', {
    propertyId,
    reviewsData,
    isLoading,
    isError
  });

  // Get last 5 reviews
  const recentReviews = useMemo(() => reviewsData?.data?.slice(0, 5) || [], [reviewsData?.data]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleRatingChange = useCallback((rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await createReviewMutation.mutateAsync({
        ...formData,
        propertyId
      });

      setFormData({
        name: '',
        email: '',
        review: '',
        rating: 5
      });
      setSubmitMessage('Review submitted successfully!');
      
      // Invalidate reviews query to refresh the list
      queryClient.invalidateQueries(['reviews', 'property', propertyId]);
    } catch (error) {
      setSubmitMessage('Failed to submit review. Please try again.');
      console.error('Review submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index} 
        className={`icon-star ${index < rating ? 'filled' : ''}`}
        style={{ color: index < rating ? '#f1913d' : '#e0e0e0' }}
      />
    ));
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  if (isLoading) {
    return (
      <section className="section-reviews tf-spacing-3">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading reviews...</span>
                </div>
                <p className="mt-3">Loading reviews...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
            <div className="wrap-comment" style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
              marginBottom: '20px'
            }}>
              <h4 className="title" style={{ 
                fontSize: '24px', 
                color: '#1f2937', 
                marginBottom: '24px',
                fontWeight: '700'
              }}>
                Guest Reviews
              </h4>
              
              {recentReviews.length > 0 ? (
                <ul className="comment-list">
                  {recentReviews.map((review) => (
                    <li key={review._id} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
                      <div className="comment-item" style={{ display: 'flex', gap: '16px' }}>
                        <div className="image-wrap" style={{ flexShrink: 0 }}>
                          <Image
                            alt="Reviewer avatar"
                            src="/images/avatar/avatar-1.jpg"
                            width={60}
                            height={60}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="content" style={{ flex: 1 }}>
                          <div className="user" style={{ marginBottom: '12px' }}>
                            <div className="author" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                              <h6 className="name" style={{ 
                                fontSize: '16px', 
                                fontWeight: '600', 
                                color: '#1f2937',
                                margin: 0
                              }}>
                                {review.name}
                              </h6>
                              <div className="time" style={{ 
                                fontSize: '12px', 
                                color: '#6b7280',
                                fontWeight: '500'
                              }}>
                                {formatDate(review.createdAt)}
                              </div>
                            </div>
                            <div className="ratings" style={{ display: 'flex', gap: '2px' }}>
                              {renderStars(review.rating || 5)}
                            </div>
                          </div>
                          <div className="comment">
                            <p style={{ 
                              fontSize: '14px', 
                              lineHeight: '1.6', 
                              color: '#374151',
                              margin: 0
                            }}>
                              {review.review}
                            </p>
                            <div className="action action-button-list">
                              <div className="action-item action-button btn-action">
                                <div className="icons">
                                  <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M12.375 6.75H10.6875M4.66949 14.0625C4.66124 14.025 4.64849 13.9875 4.63049 13.9515C4.18724 13.0515 3.93749 12.039 3.93749 10.9687C3.93587 9.89238 4.19282 8.83136 4.68674 7.875M4.66949 14.0625C4.72649 14.3362 4.53224 14.625 4.23824 14.625H3.55724C2.89049 14.625 2.27249 14.2365 2.07824 13.599C1.82399 12.7665 1.68749 11.8837 1.68749 10.9687C1.68749 9.804 1.90874 8.69175 2.31074 7.67025C2.54024 7.08975 3.12524 6.75 3.74999 6.75H4.53974C4.89374 6.75 5.09849 7.167 4.91474 7.47C4.83434 7.60234 4.7578 7.73742 4.68674 7.875M4.66949 14.0625H5.63999C6.0027 14.0623 6.36307 14.1205 6.70724 14.235L9.04274 15.015C9.38691 15.1295 9.74728 15.1877 10.11 15.1875H13.122C13.5855 15.1875 14.0347 15.0022 14.3257 14.6407C15.6143 13.0434 16.3156 11.0523 16.3125 9C16.3125 8.6745 16.2952 8.35275 16.2615 8.03625C16.1797 7.2705 15.4905 6.75 14.721 6.75H12.3765C11.913 6.75 11.6332 6.207 11.8327 5.7885C12.191 5.03444 12.3763 4.20985 12.375 3.375C12.375 2.92745 12.1972 2.49823 11.8807 2.18176C11.5643 1.86529 11.135 1.6875 10.6875 1.6875C10.5383 1.6875 10.3952 1.74676 10.2897 1.85225C10.1843 1.95774 10.125 2.10082 10.125 2.25V2.72475C10.125 3.1545 10.0425 3.57975 9.88349 3.97875C9.65549 4.54875 9.18599 4.97625 8.64374 5.265C7.81128 5.7092 7.0807 6.32228 6.49874 7.065C6.12524 7.5405 5.57924 7.875 4.97474 7.875H4.68674" stroke="#A8ABAE" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <div className="text-2">Useful</div>
                              </div>
                              <div className="action-item action-button btn-action">
                                <div className="icons">
                                  <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M5.62501 11.25H7.31251M13.3305 3.9375C13.3388 3.975 13.3515 4.0125 13.3695 4.0485C13.8128 4.9485 14.0625 5.961 14.0625 7.03125C14.0641 8.10762 13.8072 9.16864 13.3133 10.125M13.3305 3.9375C13.2735 3.66375 13.4678 3.375 13.7618 3.375H14.4428C15.1095 3.375 15.7275 3.7635 15.9218 4.401C16.176 5.2335 16.3125 6.11625 16.3125 7.03125C16.3125 8.196 16.0913 9.30825 15.6893 10.3298C15.4598 10.9103 14.8748 11.25 14.25 11.25H13.4603C13.1063 11.25 12.9015 10.833 13.0853 10.53C13.1657 10.3977 13.2422 10.2626 13.3133 10.125M13.3305 3.9375H12.36C11.9973 3.93772 11.6369 3.87948 11.2928 3.765L8.95726 2.985C8.61309 2.87053 8.25272 2.81228 7.89001 2.8125H4.87801C4.41451 2.8125 3.96526 2.99775 3.67426 3.35925C2.38572 4.95658 1.68441 6.94774 1.68751 9C1.68751 9.3255 1.70476 9.64725 1.73851 9.96375C1.82026 10.7295 2.50951 11.25 3.27901 11.25H5.62351C6.08701 11.25 6.36676 11.793 6.16726 12.2115C5.80897 12.9656 5.6237 13.7902 5.62501 14.625C5.62501 15.0726 5.8028 15.5018 6.11927 15.8182C6.43574 16.1347 6.86496 16.3125 7.31251 16.3125C7.46169 16.3125 7.60477 16.2532 7.71026 16.1477C7.81575 16.0423 7.87501 15.8992 7.87501 15.75V15.2753C7.87501 14.8455 7.95751 14.4203 8.11651 14.0213C8.34451 13.4513 8.81401 13.0238 9.35626 12.735C10.1887 12.2908 10.9193 11.6777 11.5013 10.935C11.8748 10.4595 12.4208 10.125 13.0253 10.125H13.3133" stroke="#A8ABAE" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <div className="text-2">Not helpful</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No reviews yet. Be the first to leave a review!</p>
                </div>
              )}

              {reviewsData?.data?.length > 5 && (
                <a href="#" className="tf-btn style-border fw-7 pd-1">
                  <span>
                    View all reviews ({reviewsData.data.length}) <i className="icon-arrow-right-2 fw-4" />
                  </span>
                </a>
              )}
            </div>

            {/* Add Review Form */}
            <div className="box-send" style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
              marginTop: '40px'
            }}>
              <div className="heading-box" style={{ marginBottom: '24px' }}>
                <h4 className="title fw-7" style={{ 
                  fontSize: '24px', 
                  color: '#1f2937', 
                  marginBottom: '8px',
                  fontWeight: '700'
                }}>
                  Leave a Review
                </h4>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  margin: 0
                }}>
                  Your email address will not be published
                </p>
              </div>
              
              {submitMessage && (
                <div className={`alert ${submitMessage.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-3`} style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '20px',
                  backgroundColor: submitMessage.includes('successfully') ? '#fef7f1' : '#fee2e2',
                  color: submitMessage.includes('successfully') ? '#f1913d' : '#991b1b',
                  border: `1px solid ${submitMessage.includes('successfully') ? 'rgba(241, 145, 61, 0.15)' : '#fecaca'}`
                }}>
                  {submitMessage}
                </div>
              )}

              <form className="form-add-review" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <div className="cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <fieldset className="name">
                    <label className="text-1 fw-6" htmlFor="name" style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Name
                    </label>
                    <input
                      type="text"
                      className="tf-input style-2"
                      placeholder="Your Name*"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#ffffff'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f1913d';
                        e.target.style.boxShadow = '0 0 0 3px rgba(241, 145, 61, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </fieldset>
                  <fieldset className="email">
                    <label className="text-1 fw-6" htmlFor="email" style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="tf-input style-2"
                      placeholder="Your Email*"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#ffffff'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f1913d';
                        e.target.style.boxShadow = '0 0 0 3px rgba(241, 145, 61, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </fieldset>
                </div>

                {/* Rating Selection */}
                <fieldset className="rating" style={{ marginTop: '20px' }}>
                  <label className="text-1 fw-6" style={{ display: 'block', marginBottom: '8px' }}>Rating</label>
                  <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                        onClick={() => handleRatingChange(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '28px',
                          color: star <= formData.rating ? '#f1913d' : '#e0e0e0',
                          cursor: 'pointer',
                          padding: '4px',
                          transition: 'all 0.2s ease',
                          borderRadius: '4px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="message" style={{ marginTop: '20px' }}>
                  <label className="text-1 fw-6" htmlFor="message" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Review
                  </label>
                  <textarea
                    id="message"
                    className="tf-input"
                    name="review"
                    rows={4}
                    placeholder="Share your experience with this property..."
                    value={formData.review}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#ffffff',
                      resize: 'vertical',
                      minHeight: '100px',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </fieldset>
                
                <button 
                  className="tf-btn bg-color-primary pd-24 fw-7" 
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '24px',
                    padding: '14px 32px',
                    backgroundColor: '#f1913d',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(241, 145, 61, 0.3)',
                    opacity: isSubmitting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.backgroundColor = '#e67e22';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(241, 145, 61, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.backgroundColor = '#f1913d';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(241, 145, 61, 0.3)';
                    }
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Post Review'} 
                  <i className="icon-arrow-right-2 fw-4" style={{ fontSize: '14px' }} />
                </button>
              </form>
            </div>
    </>
  );
}
