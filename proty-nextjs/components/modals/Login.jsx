"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";
import ForgotPasswordFlow from "./ForgotPasswordFlow";
import { authAPI } from "@/apis/auth";

export default function Login() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleForgotPasswordClick = () => {
    // Close the Bootstrap login modal
    const loginModal = document.getElementById('modalLogin');
    if (loginModal) {
      const bootstrapModal = window.bootstrap?.Modal?.getInstance(loginModal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
      // Also manually close modal and remove backdrop
      loginModal.classList.remove('show');
      loginModal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // Remove backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }
    // Open forgot password modal after a small delay
    setTimeout(() => {
      setShowForgotPassword(true);
    }, 100);
  };

  const handlePasswordResetSuccess = () => {
    setShowForgotPassword(false);
    // Optionally reopen login modal
    const loginModal = document.getElementById('modalLogin');
    if (loginModal && window.bootstrap?.Modal) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(loginModal);
      modal.show();
    }
  };

  const closeLoginModal = () => {
    const loginModal = document.getElementById('modalLogin');
    if (loginModal) {
      const bootstrapModal = window.bootstrap?.Modal?.getInstance(loginModal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
      // Manual cleanup
      loginModal.classList.remove('show');
      loginModal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }
  };

  const handleSwitchToRegister = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Switching from Login to Register...');
    closeLoginModal();
    
    // Open register modal after a delay
    setTimeout(() => {
      const registerModal = document.getElementById('modalRegister');
      console.log('Register modal element:', registerModal);
      console.log('Bootstrap available:', !!window.bootstrap);
      
      if (registerModal) {
        if (window.bootstrap?.Modal) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(registerModal);
          console.log('Opening register modal...');
          modal.show();
        } else {
          // Fallback if Bootstrap isn't ready
          console.log('Using fallback method...');
          registerModal.classList.add('show');
          registerModal.style.display = 'block';
          document.body.classList.add('modal-open');
          
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
      } else {
        console.error('Register modal not found!');
      }
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authAPI.signin(formData);
      console.log('Login successful:', result);
      
      // Close the modal
      closeLoginModal();
      
      // Reset form
      setFormData({ email: '', password: '' });
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div 
      className="modal modal-account fade" 
      id="modalLogin"
      tabIndex="-1"
      aria-labelledby="modalLoginLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="flat-account">
            <div className="banner-account">
              <Image
                alt="banner"
                width={380}
                height={659}
                src="/images/section/banner-login.jpg"
              />
            </div>
            <form className="form-account" onSubmit={handleSubmit}>
              <div className="title-box">
                <h4>Login</h4>
                <span
                  className="close-modal icon-close"
                  data-bs-dismiss="modal"
                  onClick={closeLoginModal}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="box">
                <fieldset className="box-fieldset">
                  <label htmlFor="nameAccount">Email</label>
                  <div className="ip-field">
                    <UserIcon className="icon" />
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="nameAccount"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </fieldset>
                <fieldset className="box-fieldset">
                  <label htmlFor="pass">Password</label>
                  <div className="ip-field" style={{ position: 'relative' }}>
                    <LockIcon className="icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      id="pass"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleInputChange}
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
                  <div className="text-forgot text-end">
                    <button
                      type="button"
                      onClick={handleForgotPasswordClick}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        padding: 0,
                      }}
                      className="text-forgot-link"
                    >
                      Forgot password
                    </button>
                  </div>
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
                  className="tf-btn bg-color-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <div className="text text-center">
                  Don't you have an account?
                  <a
                    href="#"
                    onClick={handleSwitchToRegister}
                    className="text-color-primary"
                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                  >
                    Register
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <ForgotPasswordFlow
      isOpen={showForgotPassword}
      onClose={() => {
        setShowForgotPassword(false);
        // Reopen login modal when forgot password flow is closed
        const loginModal = document.getElementById('modalLogin');
        if (loginModal && window.bootstrap?.Modal) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(loginModal);
          modal.show();
        }
      }}
      onSuccess={handlePasswordResetSuccess}
    />
    </>
  );
}
