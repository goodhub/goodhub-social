import { z } from 'zod';

const UNSPLASH_BASE_URL = 'https://api.unsplash.com';
const CLIENT_ID = import.meta.env.VITE_UNSPLASH_KEY;
const CURATED_COLLECTION_ID = 'VoNV-LRp7EU';

const UnsplashAPIResponse = z.object({
  total: z.number(),
  total_pages: z.number(),
  results: z.array(
    z.object({
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
    })
  )
});

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
