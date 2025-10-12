"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function BlogDetails({ blog }) {
  return (
    <section className="section-blog-details">
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading">
              <h2 className="title-heading">{blog.title}</h2>
              <div className="meta flex">
                <div className="meta-item flex align-center">
                  <svg width={18}
                    height={18}
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                   aria-hidden="true">
                    <path
                      d="M14.25 15.75V14.25C14.25 13.4544 13.9339 12.6913 13.3713 12.1287C12.8087 11.5661 12.0456 11.25 11.25 11.25H6.75C5.95435 11.25 5.19129 11.5661 4.62868 12.1287C4.06607 12.6913 3.75 13.4544 3.75 14.25V15.75"
                      stroke="#A8ABAE"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 8.25C10.6569 8.25 12 6.90685 12 5.25C12 3.59315 10.6569 2.25 9 2.25C7.34315 2.25 6 3.59315 6 5.25C6 6.90685 7.34315 8.25 9 8.25Z"
                      stroke="#A8ABAE"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-color-primary">Kathryn Murphy</p>
                </div>
                <div className="meta-item flex align-center">
                  <svg width={18}
                    height={18}
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                   aria-hidden="true">
                    <path
                      d="M4.5 2.5V4M11.5 2.5V4M2 13V5.5C2 5.10218 2.15804 4.72064 2.43934 4.43934C2.72064 4.15804 3.10218 4 3.5 4H12.5C12.8978 4 13.2794 4.15804 13.5607 4.43934C13.842 4.72064 14 5.10218 14 5.5V13M2 13C2 13.3978 2.15804 13.7794 2.43934 14.0607C2.72064 14.342 3.10218 14.5 3.5 14.5H12.5C12.8978 14.5 13.2794 14.342 13.5607 14.0607C13.842 13.7794 14 13.3978 14 13M2 13V8C2 7.60218 2.15804 7.22064 2.43934 6.93934C2.72064 6.65804 3.10218 6.5 3.5 6.5H12.5C12.8978 6.5 13.2794 6.65804 13.5607 6.93934C13.842 7.22064 14 7.60218 14 8V13"
                      stroke="#A8ABAE"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-color-primary">August 13, 2023</p>
                </div>
                <div className="meta-item flex align-center">
                  <svg width={18}
                    height={18}
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                   aria-hidden="true">
                    <path
                      d="M9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15Z"
                      stroke="#A8ABAE"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 6V9L11.25 10.5"
                      stroke="#A8ABAE"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-color-primary">5 min read</p>
                </div>
              </div>
            </div>
            <div className="image-wrap">
              <Image
                className="lazyload"
                alt="Blog detail image"
                width={900}
                height={500}
                src={blog.imageSrc}
              />
            </div>
            <div className="content">
              <div className="content-blog">
                <p>
                  {blog.content}
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <blockquote>
                  <p>
                    "Real estate cannot be lost or stolen, nor can it be carried away. Purchased with common sense, paid for in full, and managed with reasonable care, it is about the safest investment in the world."
                  </p>
                  <div className="author">
                    <span>Franklin D. Roosevelt</span>
                  </div>
                </blockquote>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <h4>Key Takeaways</h4>
                <ul>
                  <li>Understanding market trends is crucial for investment decisions</li>
                  <li>Location remains the most important factor in real estate</li>
                  <li>Long-term thinking yields better results than short-term speculation</li>
                  <li>Professional guidance can help navigate complex transactions</li>
                </ul>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
              <div className="tags" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <span style={{ 
                  display: 'block', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '16px' 
                }}>
                  Tags:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <a href="#" style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                    e.target.style.color = '#ffffff';
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.color = '#374151';
                    e.target.style.borderColor = '#e5e7eb';
                  }}>
                    Property
                  </a>
                  <a href="#" style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                    e.target.style.color = '#ffffff';
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.color = '#374151';
                    e.target.style.borderColor = '#e5e7eb';
                  }}>
                    Real Estate
                  </a>
                  <a href="#" style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                    e.target.style.color = '#ffffff';
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.color = '#374151';
                    e.target.style.borderColor = '#e5e7eb';
                  }}>
                    Investment
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}