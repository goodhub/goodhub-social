
import React, { FC, useState, useEffect, KeyboardEvent } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FiArrowRightCircle, FiSlash } from 'react-icons/fi';

import PhotoGallery from './photo-gallery'; 
import ImagePreview from './image-preview'; 

import { useImageStore, useJsonStore, useKeyAndURLStore, useSelectedUIElementsStore } from '../social-wizard';

interface ImageSearchPageProps {
  mode: 'unsplash' | 'local';
}

const ImageSearchPage: React.FC<ImageSearchPageProps> = ({ mode }) => {

const imgStore = useImageStore();
const { query, previousQuery, photos, setQuery, setPreviousQuery, setPhotos, allUnsplash, setAllUnsplash } = imgStore;

const [loading, setLoading] = useState<boolean>(false); 
const [loadingMessage, setLoadingMessage] = useState<string>('Searching our curated collection');


const selectedImageURL = imgStore.selectedImageURL;

const uiStore = useSelectedUIElementsStore();
const selectedGPTCB = uiStore.selectedGPTCB

const {
  UNSPLASH_URL_COLLECTION,
  UNSPLASH_URL_ALL,
} = useKeyAndURLStore((state) => ({
  UNSPLASH_URL_COLLECTION: state.UNSPLASH_URL_COLLECTION,
  UNSPLASH_URL_ALL: state.UNSPLASH_URL_ALL,
}));

const searchPhotos = async () => {
  try {
    setLoading(true);
    setPhotos([]);
    const response = await fetch(UNSPLASH_URL_COLLECTION + query);
    const data = await response.json();
    if(data.results.length === 0){
      searchAllPhotos();
    }else{
      setPhotos(data.results);
      setLoading(false);
    }

  } catch (error) {
    console.error('Error searching photos:', error);
    setLoading(false);
  }
};

const searchAllPhotos = async () => {
  setLoading(true);
  setPhotos([]);
  setAllUnsplash(true);
  //we will add the new selectedImage to the collection on done
  imgStore.toggleAddNewImageToCollection();
  setLoadingMessage('Searching all of Unsplash');
  const response2 = await fetch(UNSPLASH_URL_ALL + query);
  const data2 = await response2.json();
  setPhotos(data2.results);
  setLoading(false);
}

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file && file.type.startsWith('image/')){
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string'){
          const base64String = reader.result as string;
          if (base64String) imgStore.setSelectedImage('local', '', base64String);
      }
    };
    reader.readAsDataURL(file);
  } else {
    // Display an error message or handle invalid file types
    console.error('Invalid file type. Please upload an image file.');
  }
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (query.trim() !== '') {
    if (query !== previousQuery){
      setAllUnsplash(false)
      setPreviousQuery(query);
    }
    searchPhotos();
  }
};

// Make the label for the image act like a button

const handleLabelClick = () => {
  // Trigger the click event on the hidden input field
  const hiddenInput = document.getElementById('local-image-input') as HTMLInputElement;
  hiddenInput.click();
};

const handleLabelKeyDown = (event: KeyboardEvent<HTMLLabelElement>) => {
  if (event.key === 'Enter') {
    // Trigger the click event on Enter key press
    handleLabelClick();
  }
};

const handleMoreResults = () => {
  if (query.trim() !== '') {
    searchAllPhotos();
  }
}

//End
  return (
          <>
              <div className={`flex flex-wrap gap-2 md:gap-4 mb-2 md:mb-4 rounded-lg ${mode === 'local' ? 'p-0' : 'bg-slate-200 p-3'}`} >
                  <div className="search-bar mb-0 md:mb-2 max-w-80 w-full md:w-2/5 lg:w-2/5">
                    {mode === 'unsplash' && (
                      <form className="flex flex-nowrap gap-2" onSubmit={handleSubmit}>
                        <Label className='hidden' htmlFor="image-search-input">Image search text
                        </Label>
                          <Input
                            id="image-search-input"
                            className='bg-white'
                            type="text"
                            placeholder="Search for photos..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                          <Button className='text-base md:text-lg  border border-slate-400 shadow' variant="secondary" type="submit">Search</Button>
                      </form>
                    )}
                    {mode === 'local' && (
                      <form className="flex flex-nowrap flex-col gap-2" onSubmit={handleSubmit}>
                        <div>                        
                          <Label tabIndex={0} onKeyDown={handleLabelKeyDown} className='inline-block cursor-pointer bg-white shadow-sm border border-slate-300 rounded-full p-1 px-2 text-base md:text-lg text-center' htmlFor="local-image-input">
                              <span className='font-normal md:font-medium'>Choose an image you have for this post. &#x1f4f7;</span>
                              {/* <span className='text-sm italic text-slate-500'>Don't worry if not</span> */}
                          </Label>
                        </div>
                        <div className='hidden'>
                            <Input
                            id='local-image-input'
                            className='bg-white'
                            type="file"
                            placeholder="Choose a photo..."
                            accept="image/*" 
                            onChange={handleFileChange}
                          />
                        </div>
                      </form>
                    )}
                  </div>
                  {selectedImageURL || mode==='unsplash' ? (
                    <ImagePreview selectedImageURL={selectedImageURL}/>
                  ) : (
                    <div className='text-slate-500 text-sm md:text-lg italic '>
                      {selectedGPTCB && (
                        <span>Don't worry if you don't have an image, we will 'magic' one&#127775;. Just remember its much better to have your own photos.</span>
                      )}
                      <span className='text-blue-500 cursor-pointer'> Our photo tips are here <FiArrowRightCircle className='inline text-lg' /></span>
                    </div>
                  )}
              </div>
              {mode === 'unsplash' && (
              <div className="flex-grow " style={{minHeight:'4rem'}}>
                 {loading && <p>{loadingMessage}</p>}
                 {!loading && allUnsplash && 
                  <div className='mb-2 italic'><FiSlash className='inline text-xl mr-1 text-orange-600' />
                    We have not checked these photos. Please make sure they display correctly in all of the four preview ratios above! 
                    You can click on the previews for a larger version.
                    </div>
                  }
                  <div className="photo-list grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-1">
                  {
                  photos.map((photo) => (
                      <PhotoGallery 
                      key={photo.id}
                      imageURL={photo.urls.small} 
                      largeImageURL={photo.urls.regular}
                      id={photo.id} 
                      description={photo.description}
                      attributionName={photo.user.name}
                      attributionURL={photo.user.links.html}
                      />
                  ))}
                  {photos.length !==0 && !allUnsplash && (
                  <button 
                    onClick={handleMoreResults} 
                    className={`relative result aspect-[1/1] bg-white text-sm md:text-base text-slate-500 h-full w-full cursor-pointer border border-slate-400`} 
                    key='more'
                    >
                    Search for more photos 
                    <FiArrowRightCircle className='inline text-2xl ml-1'/>
                  </button>
                  )}
                  </div>
              </div>
              )}
          </>
      );
  };

export default ImageSearchPage;