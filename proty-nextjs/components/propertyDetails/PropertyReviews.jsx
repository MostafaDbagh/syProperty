"use client";
import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useReviewsByProperty, useCreateReview } from "@/apis/hooks";
import { useQueryClient } from "@tanstack/react-query";
import logger from "@/utils/logger";
import styles from "./PropertyReviews.module.css";

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
  logger.debug('PropertyReviews Debug:', {
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
      logger.error('Review submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index} 
        className={`icon-star ${index < rating ? 'filled' : ''}`}
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
            <div className={styles.wrapComment}>
              <h4 className={styles.reviewTitle}>Guest Reviews</h4>
              
              {recentReviews.length > 0 ? (
                <ul className="comment-list">
                  {recentReviews.map((review) => (
                    <li key={review._id} className={styles.commentListItem}>
                      <div className={styles.commentItem}>
                        <div className={styles.imageWrap}>
                          <Image
                            alt="Reviewer avatar"
                            src="/images/avatar/avatar-1.jpg"
                            width={60}
                            height={60}
                            className={styles.reviewerImage}
                          />
                        </div>
                        <div className={styles.reviewContent}>
                          <div className={styles.userDetails}>
                            <div className={styles.reviewAuthorRow}>
                              <h6 className={styles.reviewAuthor}>{review.name}</h6>
                              <div className={styles.reviewTime}>{formatDate(review.createdAt)}</div>
                            </div>
                            <div className={styles.reviewStars}>{renderStars(review.rating || 5)}</div>
                          </div>
                          <div className="comment">
                            <p className={styles.reviewText}>{review.review}</p>
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
                  <span>View all reviews ({reviewsData.data.length}) <i className="icon-arrow-right-2 fw-4" /></span>
                </a>
              )}
            </div>

            {/* Add Review Form */}
            <div className={styles.boxSend}>
              <div className={styles.addHeadingBox}>
                <h4 className={styles.addTitle}>Leave a Review</h4>
                <p className={styles.addDescription}>Your email address will not be published</p>
              </div>
              
              {submitMessage && (
                <div className={
                  submitMessage.includes('successfully')
                    ? styles.submitAlert
                    : styles.submitAlert + ' ' + styles.submitAlertDanger
                }>
                  {submitMessage}
                </div>
              )}

              <form className={styles.addReviewForm} onSubmit={handleSubmit}>
                <div className={styles.addCols}>
                  <fieldset className="name">
                    <label className={styles.addFormField} htmlFor="name">Name</label>
                    <input
                      type="text"
                      className={styles.addInput + " tf-input style-2"}
                      placeholder="Your Name*"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                  <fieldset className="email">
                    <label className={styles.addFormField} htmlFor="email">Email</label>
                    <input
                      type="email"
                      className={styles.addInput + " tf-input style-2"}
                      placeholder="Your Email*"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                </div>

                {/* Rating Selection */}
                <fieldset className={styles.addRating + " rating"}>
                  <label className={styles.addFormField + " text-1 fw-6"}>Rating</label>
                  <div className={styles.ratingStars + " rating-stars"}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${styles.starBtn} star-btn ${star <= formData.rating ? styles.starBtnActive + ' active' : ''}`}
                        onClick={() => handleRatingChange(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="message">
                  <label className={styles.addFormField} htmlFor="message">Review</label>
                  <textarea
                    id="message"
                    className={styles.addTextarea + " tf-input"}
                    name="review"
                    rows={4}
                    placeholder="Share your experience with this property..."
                    value={formData.review}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
                
                <button 
                  className={styles.reviewBtn + " tf-btn bg-color-primary pd-24 fw-7"}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Post Review'}
                  <i className="icon-arrow-right-2 fw-4" />
                </button>
              </form>
            </div>
    </>
  );
}
