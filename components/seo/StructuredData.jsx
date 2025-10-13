export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Proty Real Estate",
    "description": "Premium real estate services for buying, selling, and renting properties",
    "url": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com",
    "logo": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/images/logo/logo-2@2x.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SY",
      "addressLocality": "Lattakia",
      "addressRegion": "Lattakia Governorate"
    },
    "sameAs": [
      "https://www.facebook.com/protyrealestate",
      "https://www.twitter.com/protyrealestate",
      "https://www.instagram.com/protyrealestate",
      "https://www.linkedin.com/company/protyrealestate"
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 35.5167,
        "longitude": 35.7833
      },
      "geoRadius": "200000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Sales",
            "description": "Expert assistance with buying and selling properties"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Rentals",
            "description": "Professional property rental services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Management",
            "description": "Comprehensive property management services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Holiday Homes & Vacation Rentals",
            "description": "Premium holiday homes and vacation rental properties in Syria and Lattakia"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Beach & Coastal Properties",
            "description": "Exclusive beach and coastal properties for sale and rent"
          }
        }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Proty Real Estate",
    "url": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com",
    "description": "Find your dream property with Proty Real Estate",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-list?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
