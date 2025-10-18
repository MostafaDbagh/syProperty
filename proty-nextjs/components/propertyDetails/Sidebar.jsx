"use client";
import React from "react";
import Image from "next/image";

export default function Sidebar({ property }) {
  // Extract agent contact information from property
  const agentEmail = property?.agentEmail || property?.agent || "contact@property.com";
  const agentNumber = property?.agentNumber || "Not provided";
  const agentWhatsapp = property?.agentWhatsapp || property?.agentNumber;
  const agentName = property?.agentId?.username || "Property Agent";

  return (
    <div className="tf-sidebar sticky-sidebar">
      <form
        className="form-contact-seller mb-30"
        onSubmit={(e) => e.preventDefault()}
      >
        <h4 className="heading-title mb-30">Contact Agent</h4>
        <div className="seller-info">
          <div className="avartar">
            <Image
              alt={agentName}
              src="/images/avatar/seller.jpg"
              width={200}
              height={200}
            />
          </div>
          <div className="content">
            <h6 className="name">{agentName}</h6>
            <ul className="contact">
              {agentNumber && agentNumber !== "Not provided" && (
                <li>
                  <i className="icon-phone-1" />
                  <span>{agentNumber}</span>
                </li>
              )}
              {agentEmail && (
                <li>
                  <i className="icon-mail" />
                  <a href={`mailto:${agentEmail}`}>{agentEmail}</a>
                </li>
              )}
              {agentWhatsapp && agentWhatsapp !== "Not provided" && (
                <li>
                  <i className="icon-whatsapp" />
                  <a 
                    href={`https://wa.me/${agentWhatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <fieldset className="mb-12">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            name="name"
            id="name1"
            required
          />
        </fieldset>
        <fieldset className="mb-30">
          <textarea
            name="message"
            cols={30}
            rows={10}
            placeholder="How can an agent help"
            id="message1"
            required
            defaultValue={""}
          />
        </fieldset>
        <a href="#" className="tf-btn bg-color-primary w-full">
          Send message
        </a>
      </form>
      <div className="sidebar-ads mb-30">
        <div className="image-wrap">
          <Image
            className="lazyload"
            data-src="/images/blog/ads.jpg"
            alt="Property detail icon"
            src="/images/blog/ads.jpg"
            width={400}
            height={470}
          />
        </div>
        <div className="logo relative z-5">
          <Image
            alt="Property detail icon"
            src="/images/logo/logo-2@2x.png"
            width={272}
            height={85}
          />
        </div>
        <div className="box-ads relative z-5">
          <div className="content">
            <h4 className="title">
              <a href="#">We can help you find a local real estate agent</a>
            </h4>
            <div className="text-addres">
              <p>
                Connect with a trusted agent who knows the market inside out -
                whether you’re buying or selling.
              </p>
            </div>
          </div>
          <a href="#" className="tf-btn fw-6 bg-color-primary fw-6 w-full">
            Connect with an agent
          </a>
        </div>
      </div>
    
    </div>
  );
}
