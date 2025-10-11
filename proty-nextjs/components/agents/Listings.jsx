"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/components/common/FavoriteButton";
import { useListingsByAgent } from "@/apis/hooks";
import LocationLoader from "../common/LocationLoader";

export default function Listings({ agentId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'rent', 'sale'
  const itemsPerPage = 6;

  // Fetch listings for the agent with pagination and filtering
  const { data: listingsData, isLoading, isError, error } = useListingsByAgent(
    agentId,
    {
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter
    }
  );

  const listings = listingsData?.data || [];
  const pagination = listingsData?.pagination || {};

  // Handle filter change
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const { currentPage: page, totalPages } = pagination;
    
    // Previous button
    items.push(
      <li key="prev" className={page <= 1 ? "arrow disabled" : "arrow"}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) handlePageChange(page - 1);
          }}
        >
          <i className="icon-arrow-left" />
        </a>
      </li>
    );

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <li key={1}>
          <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>1</a>
        </li>
      );
      if (startPage > 2) {
        items.push(<li key="ellipsis1">...</li>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={i === page ? "active" : ""}>
          <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }}>{i}</a>
        </li>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<li key="ellipsis2">...</li>);
      }
      items.push(
        <li key={totalPages}>
          <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}>{totalPages}</a>
        </li>
      );
    }

    // Next button
    items.push(
      <li key="next" className={page >= totalPages ? "arrow disabled" : "arrow"}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page < totalPages) handlePageChange(page + 1);
          }}
        >
          <i className="icon-arrow-right" />
        </a>
      </li>
    );

    return items;
  };

  // Function to get image source
  const getImageSource = (property) => {
    // Check if property exists
    if (!property) {
      return "/images/section/box-house-1.jpg";
    }

    // Check images array first
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      const firstImage = property.images[0];
      if (typeof firstImage === 'string' && firstImage.trim() !== '') {
        return firstImage;
      } else if (firstImage && typeof firstImage === 'object' && firstImage.url && firstImage.url.trim() !== '') {
        return firstImage.url;
      }
    }
    
    // Check imageNames array as fallback
    if (property.imageNames && Array.isArray(property.imageNames) && property.imageNames.length > 0) {
      const firstImageName = property.imageNames[0];
      if (typeof firstImageName === 'string' && firstImageName.trim() !== '') {
        return firstImageName;
      }
    }
    
    // Always return a valid default image
    return "/images/section/box-house-1.jpg";
  };

  if (isLoading) {
    return (
      <div className="wg-listing">
        <div className="heading">
          <div className="text-7 fw-6 text-color-heading">Listing</div>
          <div className="tf-houese-filter">
            <div className="tf-btns-filter text-1 tf-tab-link_all is--active">
              <span>All</span>
            </div>
            <div className="tf-btns-filter text-1 fw-3">
              <span>For rent</span>
            </div>
            <div className="tf-btns-filter text-1 fw-3">
              <span>For sale</span>
            </div>
          </div>
        </div>
        <div className="tf-grid-layout md-col-2" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LocationLoader 
            size="medium" 
            message="Loading agent's properties..."
          />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wg-listing">
        <div className="heading">
          <div className="text-7 fw-6 text-color-heading">Listing</div>
        </div>
        <div className="tf-grid-layout md-col-2" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="alert alert-danger">
            <h4>Error loading listings</h4>
            <p>{error?.message || "Failed to fetch agent listings. Please try again later."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wg-listing">
      <div className="heading">
        <div className="text-7 fw-6 text-color-heading">Listing</div>
        <div className="tf-houese-filter">
          <div
            className={`tf-btns-filter text-1 ${statusFilter === 'all' ? 'tf-tab-link_all is--active' : 'fw-3'}`}
            onClick={() => handleFilterChange('all')}
            style={{ cursor: 'pointer' }}
          >
            <span>All</span>
          </div>
          <div 
            className={`tf-btns-filter text-1 ${statusFilter === 'rent' ? 'tf-tab-link_all is--active' : 'fw-3'}`}
            onClick={() => handleFilterChange('rent')}
            style={{ cursor: 'pointer' }}
          >
            <span>For rent</span>
          </div>
          <div 
            className={`tf-btns-filter text-1 ${statusFilter === 'sale' ? 'tf-tab-link_all is--active' : 'fw-3'}`}
            onClick={() => handleFilterChange('sale')}
            style={{ cursor: 'pointer' }}
          >
            <span>For sale</span>
          </div>
        </div>
      </div>
      
      {listings.length === 0 ? (
        <div className="tf-grid-layout md-col-2" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <p className="text-1">No properties found for this agent.</p>
            <p className="text-1">Try adjusting your filters or check back later.</p>
          </div>
        </div>
      ) : (
        <>
          <div id="parent" className="tf-grid-layout md-col-2">
            {listings.map((property, i) => (
              <div key={property._id || i} className="tf_filter_rent tf-filter-item tf-tab-content">
                <div className="box-house hover-img">
                  <div className="image-wrap" style={{ width: '600px', height: '401px', overflow: 'hidden' }}>
                    <Link href={`/property-detail/${property._id}`}>
                      <Image
                        className="lazyload"
                        alt={property.propertyKeyword || property.propertyTitle || 'Property'}
                        width={600}
                        height={401}
                        src={getImageSource(property) || "/images/section/box-house-1.jpg"}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.src = "/images/section/box-house-1.jpg";
                        }}
                      />
                    </Link>
                    <ul className="box-tag flex gap-8">
                      <li className="flat-tag text-4 bg-main fw-6 text_white">
                        Featured
                      </li>
                      <li className={`flat-tag text-4 fw-6 text_white ${property.status === 'rent' ? 'bg-2' : 'bg-3'}`}>
                        {property.status === 'rent' ? 'For Rent' : 'For Sale'}
                      </li>
                    </ul>
                    <div className="list-btn flex gap-8">
                      <FavoriteButton 
                        propertyId={property._id}
                        showLabel={true}
                      />
                      <a href="#" className="btn-icon find hover-tooltip">
                        <i className="icon-find-plus" />
                        <span className="tooltip">Quick View</span>
                      </a>
                    </div>
                  </div>
                  <div className="content">
                    <h5 className="title">
                      <Link href={`/property-detail/${property._id}`}>
                        {property.propertyKeyword || property.propertyTitle || 'Property'}
                      </Link>
                    </h5>
                    <p className="location text-1 flex items-center gap-6">
                      <i className="icon-location" /> {property.address || property.state || 'Location not specified'}
                    </p>
                    <ul className="meta-list flex">
                      <li className="text-1 flex">
                        <span>{property.bedrooms || 0}</span>Beds
                      </li>
                      <li className="text-1 flex">
                        <span>{property.bathrooms || 0}</span>Baths
                      </li>
                      <li className="text-1 flex">
                        <span>{property.size || property.landArea || 0}</span>Sqft
                      </li>
                    </ul>
                    <div className="bot flex justify-between items-center">
                      <h5 className="price">${(property.propertyPrice || 0).toLocaleString()}</h5>
                      <div className="wrap-btn flex">
                        <a
                          href="#"
                          className="compare flex gap-8 items-center text-1"
                        >
                          <i className="icon-compare" />
                          Compare
                        </a>
                        <Link
                          href={`/property-detail/${property._id}`}
                          className="tf-btn style-border pd-4"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="wrap-pagination" style={{ marginTop: '40px' }}>
              <p className="text-1">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalListings)} of {pagination.totalListings} results.
              </p>
              <ul className="wg-pagination">
                {generatePaginationItems()}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
