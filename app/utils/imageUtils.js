/**
 * Returns a safe image path, ensuring we never pass an empty string
 * @param {string} imagePath - The original image path
 * @param {string} fallbackPath - Fallback image path to use
 * @returns {string} A valid image path that is never an empty string
 */
export const getSafeImagePath = (imagePath, fallbackPath) => {
  // Check if the image path is valid (not empty, not undefined, not null)
  if (!imagePath || imagePath.trim() === '') {
    return fallbackPath || '/images/placeholder.jpg';
  }
  
  return imagePath;
};

/**
 * Returns a NFT image path with proper fallbacks
 * @param {object} nft - NFT object
 * @returns {string} Image path to use for the NFT
 */
export const getNFTImagePath = (nft) => {
  // First check if the NFT has a valid image
  if (nft.image && nft.image.trim() !== '') {
    // No IPFS handling needed - the API now handles this
    return nft.image;
  }
  
  // Use the NFT ID to create a fallback path
  const nftId = nft.tokenId || nft.id;
  return `/images/nft${nftId}.jpg`;
};

/**
 * Returns a safe profile image path
 * @param {string} imageUrl - Profile image URL
 * @returns {string} Safe image URL
 */
export const getProfileImagePath = (imageUrl) => {
  return getSafeImagePath(imageUrl, '/images/default-avatar.jpg');
};

/**
 * Returns a safe collection image path
 * @param {string} imageUrl - Collection image URL
 * @param {string} type - Type of image ('avatar' or 'banner')
 * @returns {string} Safe image URL
 */
export const getCollectionImagePath = (imageUrl, type = 'avatar') => {
  const fallback = type === 'banner' ? '/images/default-banner.jpg' : '/images/default-avatar.jpg';
  return getSafeImagePath(imageUrl, fallback);
}; 