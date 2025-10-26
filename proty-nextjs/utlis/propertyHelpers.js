/**
 * Get status badge configuration for property status
 * @param {string} status - Property status (rent, sale, etc.)
 * @returns {Object} Badge configuration with text, bgColor, and textColor
 */
export const getStatusBadge = (status) => {
  const normalizedStatus = status?.toLowerCase();
  
  if (normalizedStatus === 'rent') {
    return {
      text: 'For Rent',
      bgColor: '#3B82F6', // Blue
      textColor: '#FFFFFF'
    };
  } else if (normalizedStatus === 'sale') {
    return {
      text: 'For Sale',
      bgColor: '#10B981', // Green
      textColor: '#FFFFFF'
    };
  } else {
    return {
      text: normalizedStatus ? normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1) : 'N/A',
      bgColor: '#6B7280', // Gray
      textColor: '#FFFFFF'
    };
  }
};

/**
 * Format price with currency symbol and commas
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = '$') => {
  if (!price && price !== 0) return 'N/A';
  return `${currency}${price.toLocaleString()}`;
};

/**
 * Format property status for display
 * @param {string} status - Property status
 * @returns {string} Formatted status string
 */
export const formatStatus = (status) => {
  if (!status) return 'N/A';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Get property full address
 * @param {Object} property - Property object
 * @returns {string} Full formatted address
 */
export const getFullAddress = (property) => {
  const parts = [
    property?.address,
    property?.neighborhood,
    property?.state,
    property?.country
  ].filter(Boolean);
  
  return parts.join(', ') || 'Address not available';
};

/**
 * Get property title
 * @param {Object} property - Property object
 * @returns {string} Property title
 */
export const getPropertyTitle = (property) => {
  const keyword = property?.propertyKeyword || '';
  const type = property?.propertyType || 'Property';
  
  return keyword ? `${keyword} ${type}` : type;
};

/**
 * Check if property has images
 * @param {Object} property - Property object
 * @returns {boolean} True if property has images
 */
export const hasImages = (property) => {
  return property?.images && Array.isArray(property.images) && property.images.length > 0;
};

/**
 * Get first property image or fallback
 * @param {Object} property - Property object
 * @param {string} fallback - Fallback image URL
 * @returns {string} Image URL
 */
export const getPropertyImage = (property, fallback = '/images/section/property-details-v2-1.jpg') => {
  if (!hasImages(property)) return fallback;
  
  const firstImage = property.images[0];
  // Handle both object format (with url property) and string format
  let imageUrl = '';
  
  if (typeof firstImage === 'string') {
    imageUrl = firstImage;
  } else if (firstImage && typeof firstImage === 'object') {
    imageUrl = firstImage?.url || firstImage?.src || '';
  }
  
  // Return fallback if imageUrl is empty or invalid
  return imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '' ? imageUrl : fallback;
};

