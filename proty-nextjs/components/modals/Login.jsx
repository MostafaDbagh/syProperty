"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserIcon, LockIcon } from "@/components/icons";
import ForgotPasswordFlow from "./ForgotPasswordFlow";

export default function Login() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
    alert("Password reset successfully! You can now login with your new password.");
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
            <form className="form-account" onSubmit={(e) => e.preventDefault()}>
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
                  <label htmlFor="nameAccount">Account</label>
                  <div className="ip-field">
                    <UserIcon className="icon" />
                    <input
                      type="text"
                      className="form-control"
                      id="nameAccount"
                      placeholder="Your name"
                    />
                  </div>
                </fieldset>
                <fieldset className="box-fieldset">
                  <label htmlFor="pass">Password</label>
                  <div className="ip-field">
                    <LockIcon className="icon" />
                    <input
                      type="text"
                      className="form-control"
                      id="pass"
                      placeholder="Your password"
                    />
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
              </div>
              <div className="box box-btn">
                <Link
                  href={`/dashboard`}
                  className="tf-btn bg-color-primary w-100"
                >
                  Login
                </Link>
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
