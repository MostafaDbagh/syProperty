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
