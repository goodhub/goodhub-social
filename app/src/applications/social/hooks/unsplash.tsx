import { z } from 'zod';

const UNSPLASH_BASE_URL = 'https://api.unsplash.com';
const CLIENT_ID = import.meta.env.VITE_UNSPLASH_KEY;
const CURATED_COLLECTION_ID = 'VoNV-LRp7EU';

const UnsplashAPIResult = z.object({
  id: z.string(),
  description: z.string().nullable(),
  user: z.object({
    name: z.string(),
    links: z.object({
      html: z.string()
    })
  }),
  links: z.object({
    download_location: z.string()
  }),
  urls: z.object({
    regular: z.string(),
    small: z.string()
  })
});

export type UnsplashAPIResult = z.infer<typeof UnsplashAPIResult>;

const UnsplashAPIResponse = z.object({
  total: z.number(),
  total_pages: z.number(),
  results: z.array(UnsplashAPIResult)
});

export type UnsplashAPIResponse = z.infer<typeof UnsplashAPIResponse>;

export const getCuratedImages = async (query: string) => {
  const response = await fetch(
    `${UNSPLASH_BASE_URL}/search/photos?query=${query}&collections=${CURATED_COLLECTION_ID}&client_id=${CLIENT_ID}`
  );
  const data = await response.json();
  return UnsplashAPIResponse.parse(data);
};

export const getAllImages = async (query: string) => {
  const response = await fetch(`${UNSPLASH_BASE_URL}/search/photos?query=${query}&client_id=${CLIENT_ID}`);
  const data = await response.json();
  return UnsplashAPIResponse.parse(data);
};

export const searchForImages = async (query: string): Promise<[UnsplashAPIResponse, boolean]> => {
  const curated = await getCuratedImages(query);
  if (curated.total > 0) return [curated, false];
  // If no curated images are found, then try searching all of Unsplash
  const images = await getAllImages(query);
  if (images.total === 0) {
    throw new Error('No images found in Unsplash');
  }
  return [images, true];
};

export const loadImage = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      try {
        const url = reader.result;
        if (!url || typeof url !== 'string') throw new Error('No image URL found');
        resolve(url);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = error => {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
};
