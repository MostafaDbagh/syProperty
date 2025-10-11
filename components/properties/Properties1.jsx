"use client";
import React, { useState, useEffect } from "react";
import DropdownSelect from "../common/DropdownSelect";
import PropertyGridItems from "./PropertyGridItems";
import PropertyListItems from "./PropertyListItems";
import LayoutHandler from "./LayoutHandler";
import FilterModal from "./FilterModal";
import { useSearchListings } from "@/apis/hooks";
import { cleanParams } from "@/utlis/cleanedParams";
import LocationLoader from "../common/LocationLoader";

export default function Properties1({ defaultGrid = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    status: "",
    keyword: "",
    priceMin: "",
    priceMax: "",
    sizeMin: "",
    sizeMax: "",
    state: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    propertyType: "",
    furnished: "",
    propertyId: "",
    sort: "newest"
  });

  // Prepare API params with pagination
  const apiParams = {
    ...cleanParams(searchParams),
    page: currentPage,
    limit: 12
  };

  const {
    data: searchResponse,
    isLoading,
    isError,
    error
  } = useSearchListings(apiParams);


  const listings = searchResponse?.data || [];
  const pagination = {
    total: searchResponse?.total || 0,
    page: searchResponse?.page || 1,
    limit: searchResponse?.limit || 12,
    totalPages: searchResponse?.totalPages || 0,
    hasNextPage: searchResponse?.hasNextPage || false,
    hasPrevPage: searchResponse?.hasPrevPage || false
  };

  // Debug: Log the API response

  const handleSearchChange = (newParams) => {
    setSearchParams((prev) => ({ ...prev, ...newParams }));
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePaginationItems = () => {
    const items = [];
    const { page, totalPages } = pagination;
    
    
    // Previous button
    items.push(
      <li key="prev" className={`arrow ${!pagination.hasPrevPage ? 'disabled' : ''}`}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (pagination.hasPrevPage) {
              handlePageChange(page - 1);
            }
          }}
        >
          <i className="icon-arrow-left" />
        </a>
      </li>
    );

    // Calculate total pages manually if API doesn't provide it correctly
    const actualTotalPages = Math.ceil(pagination.total / pagination.limit);
    const effectiveTotalPages = actualTotalPages > 0 ? actualTotalPages : 1;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(effectiveTotalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <li key={1}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </a>
        </li>
      );
      if (startPage > 2) {
        items.push(
          <li key="ellipsis1">
            <a href="#">...</a>
          </li>
        );
      }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={i === page ? 'active' : ''}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </a>
        </li>
      );
    }

    // Last page
    if (endPage < effectiveTotalPages) {
      if (endPage < effectiveTotalPages - 1) {
        items.push(
          <li key="ellipsis2">
            <a href="#">...</a>
          </li>
        );
      }
      items.push(
        <li key={effectiveTotalPages}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(effectiveTotalPages);
            }}
          >
            {effectiveTotalPages}
          </a>
        </li>
      );
    }

    // Next button
    items.push(
      <li key="next" className={`arrow ${!pagination.hasNextPage ? 'disabled' : ''}`}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (pagination.hasNextPage) {
              handlePageChange(page + 1);
            }
          }}
        >
          <i className="icon-arrow-right" />
        </a>
      </li>
    );

    return items;
  };
  return (
    <>
      <section className="section-property-layout">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="box-title">
                <h2>Property listing</h2>
                <div className="right">
                  <div
                    className="filter-popup"
                    data-bs-toggle="modal"
                    href="#modalFilter"
                    role="button"
                  >
                    Filter
                    <div className="icons">
                      <svg width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                       aria-hidden="true">
                        <path
                          d="M21 4H14"
                          stroke="#F1913D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 4H3"
                          stroke="#F1913D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12H12"
                          stroke="#F1913D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 12H3"
                          stroke="#F1913D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 20H16"
                          stroke="#F1913D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20H3"
                          stroke="#F1913D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 2V6"
                          stroke="#F1913D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 10V14"
                          stroke="#F1913D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 18V22"
                          stroke="#F1913D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <ul className="nav-tab-filter group-layout" role="tablist">
                    <LayoutHandler defaultGrid={defaultGrid} />
                  </ul>

                  <DropdownSelect
                    addtionalParentClass="select-filter list-sort"
                    options={["Newest", "Oldest"]}
                    value={searchParams.sort === "newest" ? "Newest" : "Oldest"}
                    onChange={(value) => {
                      const sortValue = value === "Newest" ? "newest" : "oldest";
                      handleSearchChange({ sort: sortValue });
                    }}
                  />
                </div>
              </div>
              <div className="flat-animate-tab">
                <div className="tab-content">
                  <div
                    className={`tab-pane ${defaultGrid ? " active show" : ""}`}
                    id="gridLayout"
                    role="tabpanel"
                  >
                    <div className="tf-grid-layout lg-col-3 md-col-2">
                      {isLoading ? (
                        <div className="loading-container" style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          minHeight: '300px',
                          gridColumn: '1 / -1'
                        }}>
                          <LocationLoader 
                            size="large" 
                            message="Finding amazing properties for you..."
                          />
                        </div>
                      ) : isError ? (
                        <div className="error-container" style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          minHeight: '200px',
                          gridColumn: '1 / -1',
                          color: '#dc3545'
                        }}>
                          <p>Error loading properties: {error?.message || 'Unknown error'}</p>
                        </div>
                      ) : (
                        <PropertyGridItems listings={listings} />
                      )}
                    </div>
                  </div>
                  <div
                    className={`tab-pane ${!defaultGrid ? " active show" : ""}`}
                    id="listLayout"
                    role="tabpanel"
                  >
                    <div className="tf-grid-layout lg-col-2">
                      {isLoading ? (
                        <div className="loading-container" style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          minHeight: '300px',
                          gridColumn: '1 / -1'
                        }}>
                          <LocationLoader 
                            size="large" 
                            message="Finding amazing properties for you..."
                          />
                        </div>
                      ) : isError ? (
                        <div className="error-container" style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          minHeight: '200px',
                          gridColumn: '1 / -1',
                          color: '#dc3545'
                        }}>
                          <p>Error loading properties: {error?.message || 'Unknown error'}</p>
                        </div>
                      ) : (
                        <PropertyListItems listings={listings} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="wrap-pagination">
                <p className="text-1">
                  Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results.
                </p>
                <ul className="wg-pagination">
                  {Math.ceil(pagination.total / pagination.limit) > 1 ? generatePaginationItems() : (
                    // Show single page if only one page
                    <>
                      <li className="arrow disabled">
                        <a href="#">
                          <i className="icon-arrow-left" />
                        </a>
                      </li>
                      <li className="active">
                        <a href="#">1</a>
                      </li>
                      <li className="arrow disabled">
                        <a href="#">
                          <i className="icon-arrow-right" />
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FilterModal onSearchChange={handleSearchChange} searchParams={searchParams} />
    </>
  );
}
