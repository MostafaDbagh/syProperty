"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserIcon, EmailIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";
import { authAPI } from "@/apis/auth";
import OTPVerification from "./OTPVerification";
import styles from "./Register.module.css";

export default function Register() {
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
    const registerModal = document.getElementById('modalRegister');
    if (registerModal) {
      const bootstrapModal = window.bootstrap?.Modal?.getInstance(registerModal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
      // Manual cleanup
      registerModal.classList.remove('show');
      registerModal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }
  }, []);

  // Initialize Bootstrap modal event listeners
  useEffect(() => {
    const registerModal = document.getElementById('modalRegister');
    if (registerModal) {
      // Reset form when modal is hidden
      const handleHidden = () => {
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
      };
      
      // Handle click outside to close
      const handleBackdropClick = (e) => {
        if (e.target === registerModal) {
          closeModal();
        }
      };
      
      registerModal.addEventListener('hidden.bs.modal', handleHidden);
      registerModal.addEventListener('click', handleBackdropClick);
      
      return () => {
        registerModal.removeEventListener('hidden.bs.modal', handleHidden);
        registerModal.removeEventListener('click', handleBackdropClick);
      };
    }
  }, [closeModal]);

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
      } else {
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

  return (
    <>
      <div 
        className="modal modal-account fade" 
        id="modalRegister"
        tabIndex="-1"
        aria-labelledby="modalRegisterLabel"
        aria-hidden="true"
      >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="flat-account">
            <div className="banner-account">
              <Image
                alt="banner"
                width={380}
                height={858}
                src="/images/section/banner-register.jpg"
              />
            </div>
            <form className="form-account" onSubmit={handleSubmit}>
              <div className="title-box">
                <h4>Register</h4>
                <span
                  className="close-modal icon-close"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="box">
                <fieldset className="box-fieldset">
                  <label htmlFor="username">User name</label>
                  <div className="ip-field">
                    <UserIcon className="icon" />
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={() => validateField("username")}
                      placeholder="User name"
                      required
                    />
                  </div>
                  {fieldErrors.username && (
                    <span className={styles.errorSpan}>
                      {fieldErrors.username}
                    </span>
                  )}
                </fieldset>
                <fieldset className="box-fieldset">
                  <label htmlFor="email">Email address</label>
                  <div className="ip-field">
                    <EmailIcon className="icon" />
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => validateField("email")}
                      placeholder="Email address"
                      required
                    />
                  </div>
                  {fieldErrors.email && (
                    <span className={styles.errorSpan}>
                      {fieldErrors.email}
                    </span>
                  )}
                </fieldset>
                
                <fieldset className="box-fieldset">
                  <label htmlFor="role">Register as</label>
                  <div className="ip-field">
                    <svg
                      className="icon"
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z"
                        stroke="#A3ABB0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 15C3 13.4087 3.63214 11.8826 4.75736 10.7574C5.88258 9.63214 7.40870 9 9 9C10.5913 9 12.1174 9.63214 13.2426 10.7574C14.3679 11.8826 15 13.4087 15 15"
                        stroke="#A3ABB0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <select
                      className={`form-control ${styles.roleSelect}`}
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
                </fieldset>
                <fieldset className="box-fieldset">
                  <label htmlFor="pass2">Password</label>
                  <div className="ip-field" style={{ position: 'relative' }}>
                    <LockIcon className="icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="pass2"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => validateField("password")}
                      placeholder="Your password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10
                      }}
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
                </fieldset>
                <fieldset className="box-fieldset">
                  <label htmlFor="confirm">Confirm password</label>
                  <div className="ip-field" style={{ position: 'relative' }}>
                    <LockIcon className="icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="confirm"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => validateField("confirmPassword")}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10
                      }}
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
                </fieldset>
                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}
              </div>
              <div className="box box-btn">
                <button
                  type="submit"
                  className="tf-btn bg-color-primary w-full"
                  disabled={!isFormValid() || isLoading}
                  style={{
                    opacity: (isFormValid() && !isLoading) ? 1 : 0.6,
                    cursor: (isFormValid() && !isLoading) ? 'pointer' : 'not-allowed',
                    border: 'none'
                  }}
                >
                  {isLoading ? 'Sending OTP...' : 'Sign Up'}
                </button>
                <div className="text text-center">
                  Already have an account?
                  <a
                    href="#"
                    onClick={handleSwitchToLogin}
                    className="text-color-primary"
                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                  >
                    Sign In
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
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
