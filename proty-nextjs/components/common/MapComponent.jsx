"use client";
import {
  GoogleMap,
  useLoadScript,
  InfoWindowF,
  OverlayView,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";

import { properties } from "@/data/properties";
import Link from "next/link";
import Image from "next/image";

const option = {
  zoomControl: true,
  disableDefaultUI: true,
  styles: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [
        {
          weight: "2.00",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#9c9c9c",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [
        {
          color: "#f2f2f2",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 45,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#eeeeee",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#7b7b7b",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [
        {
          color: "#46bcec",
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#c8d7d4",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#070707",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
  ],
  scrollwheel: true,
};
const containerStyle = {
  width: "100%",
  height: "100%",
};
export default function MapComponent({ zoom = 16 }) {
  const [getLocation, setLocation] = useState(null);
  const [mapError, setMapError] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAAz77U5XQuEME6TpftaMdX0bBelQxXRlM",
  });
  
  const center = useMemo(() => ({ lat: 40.709295, lng: -74.003099 }), []);

  // Handle Google Maps loading errors (like billing not enabled)
  if (loadError) {
    console.warn('Google Maps failed to load:', loadError);
    setMapError(true);
  }

  // add long & lat
  const locationHandler = (location) => {
    setLocation(null);
    setTimeout(() => {
      setLocation(location);
    }, 10);
  };

  // close handler
  const closeCardHandler = () => {
    setLocation(null);
  };

  const CustomMarker = ({ elm }) => {
    return (
      <div
        className="map-marker-container"
        onClick={() => locationHandler(elm)}
      >
        <div className="marker-container">
          <div className="marker-card">
            <div className=" face" />
          </div>
        </div>
      </div>
    );
  };
  // Show fallback if Google Maps fails to load
  if (mapError || loadError) {
    return (
      <div style={{ 
        width: "100%", 
        height: "400px", 
        backgroundColor: "#f8f9fa", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        border: "1px solid #dee2e6",
        borderRadius: "8px"
      }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗺️</div>
          <h4 style={{ color: "#6c757d", marginBottom: "8px" }}>Map Unavailable</h4>
          <p style={{ color: "#6c757d", margin: 0 }}>
            Google Maps is currently unavailable. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isLoaded ? (
        <div style={{ 
          width: "100%", 
          height: "400px", 
          backgroundColor: "#f8f9fa", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          border: "1px solid #dee2e6",
          borderRadius: "8px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading map...</span>
            </div>
            <p style={{ marginTop: "16px", color: "#6c757d" }}>Loading map...</p>
          </div>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          options={option}
        >
          {properties.slice(0, 4).map((marker, i) => (
            <OverlayView
              key={i}
              position={{
                lat: marker.lat,
                lng: marker.long,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <CustomMarker elm={marker} />
            </OverlayView>
          ))}
          {getLocation !== null && (
            <InfoWindowF
              position={{
                lat: getLocation.lat,
                lng: getLocation.long,
              }}
              key={"fdg"}
              onCloseClick={closeCardHandler}
            >
              <div className="map-listing-item">
                <div className="box-house">
                  <div className="image-wrap">
                    <a href="#">
                      <Image
                        alt="/images/section/box-house.jpg"
                        src="/images/section/box-house.jpg"
                        width="600"
                        height="401"
                      />
                    </a>
                    <ul className="box-tag flex gap-8">
                      <li className="flat-tag text-4 bg-main fw-6 text-white">
                        For Sale
                      </li>
                    </ul>
                    <div className="list-btn flex gap-8">
                      <a href="#" className="btn-icon save">
                        <i className="icon-save" />
                      </a>
                      <a href="#" className="btn-icon find">
                        <i className="icon-find-plus" />
                      </a>
                    </div>
                  </div>
                  <div className="content">
                    <h5 className="title">
                      <Link href={`/property-details-v1`}>
                        Elegant studio flat
                      </Link>
                    </h5>
                    <p className="location text-1 flex items-center gap-8">
                      <i className="icon-location" /> 102 Ingraham St,
                      Brooklyn...
                    </p>
                    <ul className="meta-list flex">
                      <li className="text-1 flex">
                        <span>3</span>Beds
                      </li>
                      <li className="text-1 flex">
                        <span>2</span>Baths
                      </li>
                      <li className="text-1 flex">
                        <span>2,100</span>Sqft
                      </li>
                    </ul>
                    <div className="bot flex justify-between items-center">
                      <h5 className="price">$8.600</h5>{" "}
                      <div className="wrap-btn flex" style={{ width: "auto" }}>
                        <a href="#" className="tf-btn style-border pd-4">
                          Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      )}
    </>
  );
}
