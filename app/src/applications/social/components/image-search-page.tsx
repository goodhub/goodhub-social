
import React, { FC, useState, KeyboardEvent } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import PhotoGallery from './photo-gallery'; 
import ImagePreview from './image-preview'; 

import { useSocialWizardStore } from '../social-wizard';

interface ImageSearchPageProps {
  mode: 'unsplash' | 'local' | 'headless';
}

const ImageSearchPage: React.FC<ImageSearchPageProps> = ({ mode }) => {

const [query, setQuery] = useState<string>('');
const [photos, setPhotos] = useState<any[]>([]);
const [loading, setLoading] = useState<boolean>(false); 

const store = useSocialWizardStore();
const selectedImageURL = store.selectedImageURL;

const API_KEY = 'LFdsh8j4BwoF4wRWCvoaD6dh_LKzVe1Yz75aAN-b-cg';
const API_URL = `https://api.unsplash.com/search/photos?client_id=${API_KEY}&collections=VoNV-LRp7EU&query=`;



const searchPhotos = async () => {
  try {
    setLoading(true);
    setPhotos([]);
    const response = await fetch(API_URL + query);
    const data = await response.json();
    setPhotos(data.results);
    setLoading(false);
  } catch (error) {
    console.error('Error searching photos:', error);
    setLoading(false);
  }
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file && file.type.startsWith('image/')){
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string'){
          const base64String = reader.result as string;
          if (base64String) store.setSelectedImage('local', '', base64String);
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

//End

return (
        <>
            <div className="flex flex-wrap gap-4 mb-2 md:mb-4 bg-slate-200 p-3 rounded-lg" >
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
                        <Button variant="secondary" type="submit">Search</Button>
                    </form>
                  )}
                  {mode === 'local' && (
                    <form className="flex flex-nowrap flex-col gap-2" onSubmit={handleSubmit}>
                      <div>                        
                        <Label tabIndex={0} onKeyDown={handleLabelKeyDown} className='bg-white shadow-sm border border-slate-300 rounded-full p-1 px-2 text-sm md:text-lg' htmlFor="local-image-input">
                            <span>Choose an image you have for this post. &#x1f4f7;</span>
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
                  <div className='text-slate-500 text-sm italic '>
                    <span>Don't worry if you don't have an image, we will 'magic' one&#127775;. Just remember its much better to have your own photos.</span>
                    <span className='text-blue-500 '> Our photo tips are here.</span>
                  </div>
                )}
            </div>
            {mode === 'unsplash' && (
            <div className="flex-grow overflow-y-auto">
                <div className="photo-list grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-1">
                {loading && <p>Loading...</p>}
                {
                photos.map((photo) => (
                    <PhotoGallery 
                    imageURL={photo.urls.small} 
                    largeImageURL={photo.urls.regular}
                    id={photo.id} 
                    description={photo.description}
                    />
                ))}
                </div>
            </div>
            )}
        </>
    );
};

export default ImageSearchPage;