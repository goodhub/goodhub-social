import React, { FC, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  // The overall group (used for positioning)
  Tooltip,
  // The thing you show
  TooltipContent,
  // The thing that triggers the hover
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FiXSquare } from 'react-icons/fi';
import SocialMediaCompanies from '../base-data/social-media-companies';

interface ImagePreviewProps {
  selectedImageURL: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ selectedImageURL }) => {
  const [open, setOpen] = useState(false);
  const [previewAspectRatio, setAspectRatio] = useState('1/1');

  const handleThumbnailClick = (aspectRatio: string) => {
    setOpen(true);
    setAspectRatio(aspectRatio);
  };

  const aspectRatios = [
    { ratio: '9/16', label: ['tiktok','instagram']},
    { ratio: '1/1', label: ['instagram']},
    { ratio: '4/3', label: ['twitter','website','linkedIn']},
    { ratio: '16/9', label: ['facebook','threads'] }
  ];

  // Initialize an empty array to store applicable social media company descriptions
  const applicableCompanies: string[] = [];

  // Iterate through aspectRatios to find applicable social media companies
  aspectRatios.forEach(aspect => {
    if (aspect.ratio === previewAspectRatio) {
      aspect.label.forEach(label => {
        applicableCompanies.push(capitalize(label));
      });
    }
  });

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Generate the text with applicable social media company descriptions
  const selectedImageText = `Your selected image${applicableCompanies.length > 0 ? ` in ${applicableCompanies.join(', ')}` : ''}`

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="photo-preview flex flex-auto gap-1 md:gap-3 justify-center ">
        {/* {['9/16', '1/1', '4/3', '16/9'].map((aspectRatio, index) => ( */}
        {aspectRatios.map((aspect, index) => (
          <>
          <Dialog.Trigger
            onClick={() => handleThumbnailClick(aspect.ratio)}
            style={{ aspectRatio: aspect.ratio }}
            className={`relative result w-auto max-h-24 h-16 md:h-24 lg:h-24 bg-slate-400`}
            key={index}
          >
            {selectedImageURL && (
              <>
              
                <img
                  className="h-full w-full object-cover border-black border-4"
                  src={selectedImageURL}
                  alt={'Selected Photo'}
                />
                <div className="w-auto flex flex-col gap-y-px md:gap-y-1 h-auto bg-black text-white inline absolute right-0 bottom-0 text-xs sm:text-xs md:text-sm p-0.5">
                  {/* Loop through labels and render icons */}
                  {aspect.label.map((label, idx) => {
                    const IconComponent = SocialMediaCompanies[label] ? SocialMediaCompanies[label]?.icon : null;
                    return (
                      <span key={idx}>
                        {IconComponent && <IconComponent title={SocialMediaCompanies[label] && SocialMediaCompanies[label]?.description}/>}
                      </span>
                    );
                  })}

                </div>

              </>
            )}
          </Dialog.Trigger>
          </>
        ))}
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          style={{ aspectRatio: previewAspectRatio }}
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black w-[calc(90vw)] h-auto max-h-[calc(80vh)] md:h4/6 md:w-auto lg:h-4/6  lg:w-auto  text-center aspect-[${previewAspectRatio}]`}
        >
          <Dialog.Title className="text-white text-nowrap truncate m-1 mr-8">{selectedImageText}</Dialog.Title>
          {selectedImageURL && (
            <img
              className={`h-full w-auto object-cover border-black m-auto max-h-[90vh] border-2`}
              style={{ aspectRatio: previewAspectRatio }}
              src={selectedImageURL}
              alt={'Selected Photo'}
            />
          )}
          <Dialog.Close>
            <FiXSquare size={24} className="m-1 absolute top-0 right-0" style={{ color: 'white' }} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImagePreview;
