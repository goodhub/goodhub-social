import React, { FC } from 'react';
import { useImageStore } from '../social-wizard';
import { FiCheck } from 'react-icons/fi';

interface PhotoGalleryProps {
  imageURL: string;
  largeImageURL: string;
  id: string;
  description: string;
  attributionName: string;
  attributionURL: string;
  downloadCallBack: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  imageURL,
  largeImageURL,
  id,
  description,
  attributionName,
  attributionURL,
  downloadCallBack
}) => {
  const store = useImageStore();
  const selectedImageId = store.selectedImageId;

  const handleClick = () => {
    const fetchImage = async () => {
      try {
        /* don't fetch if already selected */
        if (id === selectedImageId) {
          return;
        }
        const response = await fetch(largeImageURL);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          // console.log("image loads")
          const dataURL = reader.result as string;
          //dataURL && setImageData(dataURL);
          if (dataURL) {
            store.setSelectedImage(id, description, dataURL, downloadCallBack);
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative result aspect-[1/1] bg-slate-300 h-full w-full cursor-pointer ${id === selectedImageId ? 'border-4 border-blue-800' : ''}`}
      key={id}
    >
      {imageURL && (
        <>
          <img
            className={`h-full w-full object-cover ${id === selectedImageId ? 'opacity-40' : ''}`}
            src={imageURL}
            alt={description || 'Photo'}
          />
        </>
      )}
      {id === selectedImageId ? (
        <div className="absolute top-0 right-0 m-1">
          <FiCheck className="rounded-full" size={28} style={{ backgroundColor: 'blue', color: 'white' }} />
        </div>
      ) : (
        <div className="w-4/5 md:w-2/3 h-auto bg-black/50 text-ellipsis overflow-hidden max-w-full text-white absolute right-0 bottom-0 text-xs px-1">
          <a
            target="_new"
            className="whitespace-nowrap"
            href={`${attributionURL}?utm_source=your_app_name&utm_medium=referral`}
          >
            <span className="text-[8px]"></span>@{attributionName}
          </a>
        </div>
      )}
    </button>
  );
};

export default PhotoGallery;
