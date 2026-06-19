/**
 * Cloudinary Image Optimization Utility
 * 
 * Transforms Cloudinary URLs to use automatic format (WebP/AVIF), 
 * quality, and width parameters for blazing-fast loading.
 * 
 * Non-Cloudinary URLs are returned as-is.
 */

const CLOUDINARY_BASE = 'res.cloudinary.com';

/**
 * Returns an optimized Cloudinary URL with auto-format, auto-quality,
 * and an optional width resize.
 * 
 * @param {string} url - The original image URL
 * @param {object} opts - { width: number, quality: 'auto'|number }
 * @returns {string} optimized URL
 */
export function getOptimizedImageUrl(url, opts = {}) {
  if (!url || typeof url !== 'string') return url;

  // Only transform Cloudinary URLs
  if (!url.includes(CLOUDINARY_BASE)) return url;

  const { width, quality = 'auto' } = opts;

  // Build transformation string
  const transforms = [`f_auto`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  transforms.push('c_limit'); // don't upscale, only downscale

  const transformStr = transforms.join(',');

  // Cloudinary URL pattern: .../image/upload/v1234/filename.jpg
  // Insert transforms after /upload/
  return url.replace(
    '/image/upload/',
    `/image/upload/${transformStr}/`
  );
}

/**
 * Thumbnail for product grid cards (400px wide, auto quality + format)
 */
export function getGridThumbnail(url) {
  return getOptimizedImageUrl(url, { width: 400 });
}

/**
 * Detail overlay full-size image (800px wide, high quality)
 */
export function getDetailImage(url) {
  return getOptimizedImageUrl(url, { width: 800 });
}

/**
 * Tiny placeholder for blur-up effect (20px wide, low quality)
 */
export function getBlurPlaceholder(url) {
  return getOptimizedImageUrl(url, { width: 20, quality: 10 });
}

/**
 * Small suggestion card thumbnail (200px wide)
 */
export function getSuggestionThumbnail(url) {
  return getOptimizedImageUrl(url, { width: 200 });
}
