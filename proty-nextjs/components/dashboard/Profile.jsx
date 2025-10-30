"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { userAPI } from "@/apis";
import Toast from "../common/Toast";
import LocationLoader from "../common/LocationLoader";
import logger from "@/utils/logger";
import styles from "./Profile.module.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Profile form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    description: "",
    company: "",
    position: "",
    officeNumber: "",
    officeAddress: "",
    job: "",
    phone: "",
    location: "",
    facebook: "",
    twitter: "",
    linkedin: "",
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          window.location.href = "/login";
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Fetch latest profile data
        const profile = await userAPI.getProfile(userData._id);
        setFormData({
          username: profile.username || "",
          email: profile.email || "",
          description: profile.description || "",
          company: profile.company || "",
          position: profile.position || "",
          officeNumber: profile.officeNumber || "",
          officeAddress: profile.officeAddress || "",
          job: profile.job || "",
          phone: profile.phone || "",
          location: profile.location || "",
          facebook: profile.facebook || "",
          twitter: profile.twitter || "",
          linkedin: profile.linkedin || "",
        });
        setUser(profile);
      } catch (error) {
        logger.error("Error loading profile:", error);
        setToast({ type: "error", message: "Failed to load profile" });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedUser = await userAPI.updateProfile(user._id, formData);
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setToast({ type: "success", message: "Profile updated successfully!" });
    } catch (error) {
      logger.error("Error updating profile:", error);
      setToast({ type: "error", message: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ type: "error", message: "Passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({ type: "error", message: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);

    try {
      await userAPI.changePassword(
        user._id,
        passwordData.oldPassword,
        passwordData.newPassword
      );
      
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      setToast({ type: "success", message: "Password changed successfully!" });
    } catch (error) {
      logger.error("Error changing password:", error);
      setToast({ type: "error", message: "Failed to change password" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <LocationLoader 
          size="large" 
          message="Loading your profile..."
        />
      </div>
    );
  }

  return (
    <div className="main-content style-2">
      <div className="main-content-inner wrap-dashboard-content-2">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Dashboard</span>
        </div>
        <div className="widget-box-2">
          {user?.role === "agent" && (
            <div className="box">
              <h3 className="title">Account Settings</h3>
              <div className="box-agent-account">
                <h6>Agent Account</h6>
                <p className="note">
                  Your current account type is set to agent. You have access to all agent features
                  including property management and analytics.
                </p>
                <div className={styles.pointsBalance}>
                  <strong>Points Balance:</strong> {user.pointsBalance || 0} points
                </div>
              </div>
            </div>
          )}
          
          <div className="box">
            <h5 className="title">Avatar</h5>
            <div className="box-agent-avt">
              <div className="avatar">
                <Image
                  alt={user?.fullName || "User avatar"}
                  loading="lazy"
                  width={128}
                  height={128}
                  src={user?.avatar || "/images/avatar/account.jpg"}
                />
              </div>
              <div className="content uploadfile">
                <p>Upload a new avatar</p>
                <div className="box-ip">
                  <input type="file" className="ip-file" />
                </div>
                <p>JPEG 100x100</p>
              </div>
            </div>
          </div>

          <h5 className="title">Information</h5>
          <form onSubmit={handleSubmitProfile}>
            <fieldset className="box box-fieldset">
              <label htmlFor="username">
                Full name:<span>*</span>
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-control"
              />
            </fieldset>
            
            <fieldset className="box box-fieldset">
              <label htmlFor="email">
                Email address:<span>*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
              />
            </fieldset>

            <fieldset className="box box-fieldset">
              <label htmlFor="description">
                Description:
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </fieldset>

            {user?.role === "agent" && (
              <fieldset className="box grid-layout-4 gap-30">
                <div className="box-fieldset">
                  <label htmlFor="company">
                    Your Company:
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="box-fieldset">
                  <label htmlFor="position">
                    Position:
                  </label>
                  <input
                    type="text"
                    id="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="box-fieldset">
                  <label htmlFor="officeNumber">
                    Office Number:
                  </label>
                  <input
                    type="text"
                    id="officeNumber"
                    value={formData.officeNumber}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="box-fieldset">
                  <label htmlFor="officeAddress">
                    Office Address:
                  </label>
                  <input
                    type="text"
                    id="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </fieldset>
            )}

            <div className="box grid-layout-4 gap-30 box-info-2">
              <div className="box-fieldset">
                <label htmlFor="job">
                  Job:
                </label>
                <input
                  type="text"
                  id="job"
                  value={formData.job}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="box-fieldset">
                <label htmlFor="phone">
                  Your Phone:
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="box-fieldset">
                <label htmlFor="location">
                  Location:
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="box box-fieldset">
              <label htmlFor="facebook">
                Facebook:
              </label>
              <input
                type="text"
                id="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="box box-fieldset">
              <label htmlFor="twitter">
                Twitter:
              </label>
              <input
                type="text"
                id="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="box box-fieldset">
              <label htmlFor="linkedin">
                Linkedin:
              </label>
              <input
                type="text"
                id="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="box">
              <button 
                type="submit" 
                className="tf-btn bg-color-primary pd-10"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save & Update"}
              </button>
            </div>
          </form>

          <h5 className="title" style={{ marginTop: '32px' }}>Change password</h5>
          <form onSubmit={handleSubmitPassword}>
            <div className="box grid-layout-3 gap-30">
              <div className="box-fieldset">
                <label htmlFor="oldPassword">
                  Old Password:<span>*</span>
                </label>
                <div className="box-password">
                  <input
                    type="password"
                    id="oldPassword"
                    className="form-contact password-field"
                    placeholder="Old Password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className="box-fieldset">
                <label htmlFor="newPassword">
                  New Password:<span>*</span>
                </label>
                <div className="box-password">
                  <input
                    type="password"
                    id="newPassword"
                    className="form-contact password-field2"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className="box-fieldset mb-30">
                <label htmlFor="confirmPassword">
                  Confirm Password:<span>*</span>
                </label>
                <div className="box-password">
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-contact password-field3"
                    placeholder="Confirm Password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
            </div>
            <div className="box">
              <button 
                type="submit" 
                className="tf-btn bg-color-primary pd-20"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
        
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
      </div>
      <div className="overlay-dashboard" />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
