"use client";
import React, { useState, useEffect, useCallback } from "react";
import { UserIcon, EmailIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";
import { authAPI } from "@/apis/auth";
import OTPVerification from "./OTPVerification";
import styles from "./Register.module.css";

export default function Register({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);


  const closeModal = useCallback(() => {
    // Reset form when closing
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user"
    });
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
    onClose();
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error when user types
    setFieldErrors(prev => ({
      ...prev,
      [name]: ""
    }));
    
    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateField = (fieldName) => {
    let error = "";
    
    switch(fieldName) {
      case "username":
        if (formData.username && formData.username.length < 3) {
          error = "Username must be at least 3 characters";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (formData.password && formData.password.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
          error = "Passwords do not match";
        }
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use the original form data without any modifications
      const userDataForRegistration = {
        ...formData
      };
      
      // Send OTP API call for signup
      await authAPI.sendOTP(userDataForRegistration.email, 'signup');
      
      // Store user data for later registration
      setPendingUserData(userDataForRegistration);
      
      // Close registration modal first
      closeModal();
      
      // Show OTP modal after a short delay
      setTimeout(() => {
        setShowOTPModal(true);
      }, 300);
      
    } catch (error) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.username &&
           formData.email &&
           formData.password &&
           formData.confirmPassword &&
           formData.password === formData.confirmPassword &&
           formData.password.length >= 6 &&
           Object.values(fieldErrors).every(error => !error);
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    closeModal();
    
    // Open login modal after a delay
    setTimeout(() => {
      const loginModal = document.getElementById('modalLogin');
      
      if (loginModal) {
        if (window.bootstrap?.Modal) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(loginModal);
          modal.show();
        } else {
          // Fallback if Bootstrap isn't ready
          loginModal.classList.add('show');
          loginModal.style.display = 'block';
          document.body.classList.add('modal-open');
          
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
      }
    }, 300);
  };

  const handleOTPSuccess = (result) => {
    
    // Close register modal
    closeModal();
    
    // Reset form
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user"
    });
    
    // Reset OTP modal state
    setShowOTPModal(false);
    setPendingUserData(null);
  };

  const handleOTPClose = () => {
    setShowOTPModal(false);
    // Don't reset pendingUserData here - keep it for success modal
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Clean Modern Register Modal */}
      <div className={styles.modalOverlay} onClick={handleOverlayClick}>
        <div className={styles.modalContent}>
          <button 
            className={styles.closeButton} 
            onClick={closeModal} 
            aria-label="Close modal"
          >
            <i className="icon-close" />
          </button>

          <div className={styles.modalHeader}>
            <div className={styles.iconWrapper}>
              <i className="icon-user-plus" />
            </div>
            <h2 className={styles.modalTitle}>Create Account</h2>
            <p className={styles.modalSubtitle}>
              Join our community and start your property journey today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <div className={styles.inputWithIcon}>
                <UserIcon className={styles.inputIcon} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => validateField("username")}
                  placeholder="Enter your username"
                  className={styles.formInput}
                  required
                />
              </div>
              {fieldErrors.username && (
                <span className={styles.errorSpan}>
                  {fieldErrors.username}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <div className={styles.inputWithIcon}>
                <EmailIcon className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => validateField("email")}
                  placeholder="Enter your email"
                  className={styles.formInput}
                  required
                />
              </div>
              {fieldErrors.email && (
                <span className={styles.errorSpan}>
                  {fieldErrors.email}
                </span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>Register as</label>
              <select
                className={styles.roleSelect}
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">👤 Regular User - Browse and favorite properties</option>
                <option value="agent">🏢 Property Agent - List and manage properties</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pass2" className={styles.label}>Password</label>
              <div className={styles.inputWithIcon}>
                <LockIcon className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="pass2"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => validateField("password")}
                  placeholder="Enter your password"
                  className={styles.formInput}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOffIcon width={20} height={20} />
                  ) : (
                    <EyeIcon width={20} height={20} />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <span className={styles.errorSpan}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirm" className={styles.label}>Confirm Password</label>
              <div className={styles.inputWithIcon}>
                <LockIcon className={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => validateField("confirmPassword")}
                  placeholder="Confirm your password"
                  className={styles.formInput}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon width={20} height={20} />
                  ) : (
                    <EyeIcon width={20} height={20} />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span className={styles.errorSpan}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <i className="icon-alert-circle" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner} />
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="icon-user-plus" />
                  Create Account
                </>
              )}
            </button>

            <div className={styles.signInLink}>
              Already have an account?{" "}
              <a
                href="#"
                onClick={handleSwitchToLogin}
              >
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    
      {/* OTP Verification Modal */}
      <OTPVerification
        isOpen={showOTPModal}
        onClose={handleOTPClose}
        onSuccess={handleOTPSuccess}
        userData={pendingUserData}
        email={pendingUserData?.email}
        type="signup"
      />
    </>
  );
}
