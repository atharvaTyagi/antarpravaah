/**
 * Cloudinary Helper Utilities
 * 
 * Provides functions to:
 * - Generate optimized Cloudinary URLs with transformations
 * - Get image dimensions for Next.js Image component
 * - Support quality and format parameters
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// Temporary cache-bust versions for recently updated images (Jan 31, 2026)
// Remove this after CDN cache clears (24-48 hours)
const CACHE_BUST_VERSIONS: Record<string, string> = {
  'antarpravaah/immersions/immersion_2': '1769872658',
  'antarpravaah/immersions/workshops/immersion_workshop_3': '1769872661',
  'antarpravaah/general/Private Sessions': '1769872663',
};

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto' | 'auto:good' | 'auto:best';
  format?: 'auto' | 'webp' | 'avif';
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  version?: string | number; // Optional version for cache busting
}

/**
 * Generate an optimized Cloudinary URL
 * @param publicId - The Cloudinary public ID (e.g., "antarpravaah/about/namita_one")
 * @param options - Transformation options
 * @returns Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    return '';
  }

  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fit',
    version,
  } = options;

  // Build transformation string
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  // Add version if provided for cache busting, or use auto cache-bust for recently updated images
  const cacheBustVersion = version || CACHE_BUST_VERSIONS[publicId];
  const versionStr = cacheBustVersion ? `v${cacheBustVersion}/` : '';

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${versionStr}${publicId}`;
}

/**
 * Get Cloudinary URL without width/height constraints (for responsive images)
 * @param publicId - The Cloudinary public ID
 * @param quality - Quality setting (default: 'auto:good')
 * @returns Cloudinary URL
 */
export function getResponsiveCloudinaryUrl(
  publicId: string,
  quality: CloudinaryOptions['quality'] = 'auto:good'
): string {
  return getCloudinaryUrl(publicId, { quality });
}

/**
 * Get image dimensions from the dimensions reference
 * @param filename - The image filename (without extension)
 * @returns Object with width and height
 */
export function getImageDimensions(filename: string): {
  width: number;
  height: number;
} {
  const dimensions = imageDimensions[filename];
  
  if (!dimensions) {
    console.warn(`Dimensions not found for: ${filename}`);
    // Return default dimensions
    return { width: 800, height: 600 };
  }
  
  return dimensions;
}

/**
 * Image dimensions reference
 * Actual dimensions of large images for Next.js Image component
 */
export const imageDimensions: Record<string, { width: number; height: number }> = {
  // About page - Namita images
  'namita_one': { width: 276, height: 289 },
  'namita_two': { width: 400, height: 419 },
  'namita_three': { width: 222, height: 233 },
  'namita_four': { width: 254, height: 266 },
  'namita_five': { width: 400, height: 419 },
  'namita_six': { width: 312, height: 327 },
  
  // Immersions page - Decorative images
  'immersion_1': { width: 200, height: 200 },
  'immersion_2': { width: 560, height: 560 }, // Updated: 2x for crisp display
  'immersion_3': { width: 180, height: 180 },

  // Immersions page - Workshop images
  'immersion_workshop_1': { width: 400, height: 206 },
  'immersion_workshop_2': { width: 400, height: 206 },
  'immersion_workshop_3': { width: 800, height: 412 }, // Updated: 2x for crisp display
  
  // Trainings section images
  'training_1': { width: 200, height: 200 },
  'training_2': { width: 180, height: 180 },
  'training_3': { width: 280, height: 280 },
  
  // We Work Together section
  'we_work_together_vector_one': { width: 400, height: 400 },
  'we_work_together_vector_two': { width: 400, height: 400 },
  'we_work_together_vector_three': { width: 400, height: 400 },
  'we_work_together_vector_four': { width: 400, height: 400 },
  
  // General images
  'AP Immersions': { width: 400, height: 300 },
  'Private Sessions': { width: 800, height: 600 }, // Updated: 2x for crisp display
  'Trainings': { width: 400, height: 300 },
};

/**
 * Get Cloudinary public ID from local path
 * Maps local image paths to their Cloudinary public IDs
 */
export function getCloudinaryPublicId(localPath: string): string {
  // Remove leading slash and extension
  const filename = localPath.replace(/^\//, '').replace(/\.(webp|svg|jpg|png)$/, '');
  
  // Map to Cloudinary folder structure (clean paths without duplication)
  if (filename.startsWith('namita_')) {
    return `antarpravaah/about/${filename}`;
  } else if (filename.match(/^immersion_[123]$/)) {
    return `antarpravaah/immersions/${filename}`;
  } else if (filename.startsWith('immersion_workshop_')) {
    return `antarpravaah/immersions/workshops/${filename}`;
  } else if (filename.startsWith('training_')) {
    return `antarpravaah/trainings/${filename}`;
  } else if (filename.startsWith('we_work_together_')) {
    return `antarpravaah/we-work/${filename}`;
  } else if (['AP Immersions', 'Private Sessions', 'Trainings'].includes(filename)) {
    return `antarpravaah/general/${filename}`;
  }
  
  // Fallback: return as-is
  return filename;
}

