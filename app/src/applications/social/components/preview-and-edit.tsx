import React, { useState } from 'react';

import orgData from '../base-data/organisation';
import partnerData from '../base-data/partner-organisations';
import { useImageStore, useJsonStore, useSelectedPartnersStore, useSelectedUIElementsStore } from '../social-wizard';
import EditableText from './content-editable-ext';

import { toPng } from 'html-to-image';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { FiAlertTriangle } from 'react-icons/fi';

// Iterate over the keys of the partnerData object
const partnerItems = Object.entries(partnerData).map(([key, value]) => {
  return {
    name: key, // Assuming the key is the name of the partner
    description: value.description,
    svg: value.svg
  };
});

interface HelperProps {
  isWizardMode: boolean;
  setIsWizardMode: React.Dispatch<React.SetStateAction<boolean>>;
  setHelperPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const PreviewAndEdit: React.FC<HelperProps> = ({ isWizardMode, setIsWizardMode, setHelperPageIndex }) => {
  const toggleWizardMode = () => {
    setIsWizardMode(!isWizardMode);
  };

  const toHelper = (index: number) => {
    setHelperPageIndex(index);
    setIsWizardMode(!isWizardMode);
  };

  const store = useSelectedPartnersStore();
  const selectedPartners: string[] = store.selectedPartners;

  const imgStore = useImageStore();
  const selectedImageURL = imgStore.selectedImageURL;
  const selectedImageId = imgStore.selectedImageId;
  const setSelectedImageURL = imgStore.setSelectedImage;

  const uiStore = useSelectedUIElementsStore();
  const useTitle = uiStore.showTitleAndDescription;
  const useLogo = uiStore.showLogo;
  const usePartnerLogos = uiStore.showPartners;
  const useGPT = uiStore.useGPT;

  const JSONStore = useJsonStore();
  const setJsonData = JSONStore.setJsonData;

  const GPTObject = JSONStore.jsonData;
  const [progress, setProgress] = useState(0);

  const buildPng = async (element: HTMLElement, aspectRatio: number) => {
    let dataUrl = '';
    const minDataLength = 340000;
    let i = 0;
    const maxAttempts = 10;
    element.style.aspectRatio = `${aspectRatio}`;
    while (dataUrl.length < minDataLength && i < maxAttempts) {
      dataUrl = await toPng(element);
      i += 1;
    }

    return dataUrl;
  };

  const captureImagesWithAspectRatio = async () => {
    const element = document.getElementById('full-content') as HTMLElement;
    element.style.border = `none`;

    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('absolute', 'inset-0', 'flex', 'justify-center', 'items-center', 'bg-gray-50', 'z-50');

    // Append the overlay to the full-content element's parent
    element.parentElement?.appendChild(overlay);

    try {
      //Ratios we want to capture
      const ratios = [1.91 / 1, 16 / 9, 4 / 3, 1 / 1];

      //create blank array
      const dataUrls: string[] = [];

      // const totalSteps = ratios.length;
      // let completedSteps = 0;

      // Capture images with different aspect ratios
      for (const ratio of ratios) {
        //get the dataUrl
        const dataUrl = await buildPng(element, ratio);
        dataUrls.push(dataUrl);

        // Update progress
        // completedSteps++;
        // const newProgress = Math.round((completedSteps / totalSteps) * 100);
        // setProgress(newProgress);
      }

      //return array of urls
      return dataUrls;
    } finally {
      // Remove the overlay when image capture is complete
      element.style.border = ``;
      element.style.aspectRatio = ``;
      overlay.remove();
    }
  };

  const handleImageSave = (): void => {
    captureImagesWithAspectRatio()
      .then(function (dataUrls) {
        dataUrls.forEach(function (dataUrl) {
          var img = new Image();
          img.src = dataUrl;
          document.body.appendChild(img);
        });
      })
      .catch(function (error) {
        console.error('Oops, something went wrong!', error);
      });
  };

  return (
    <div className="w-full">
      <div className="flex h-[21.5rem] md:h-96 justify-center relative">
        <div
          id="full-content"
          style={{ backgroundImage: `url(${selectedImageURL})` }}
          className={` aspect-square border border-black bg-cover bg-center relative`}
        >
          {JSONStore.isLoading && <Skeleton className="absolute bg-gray-50 z-10 top-0 left-0 h-full w-full flex " />}
          <div className="w-full h-full flex flex-col gap-2 p-2 items-center">
            <div className="w-full h-auto flex flex-row justify-start max-h-8" id="icon">
              {/* Icon in here */}
              {useLogo && (
                <div className="">
                  {/* Put logo image as base64 so it saves in Chrome */}
                  <img alt="" className="w-10 h-10" src={orgData.logo.logoSrc} />
                </div>
              )}
            </div>
            <div className="w-full h-full flex flex-col p-2 max-w-[300px] items-center" id="main-content">
              {useTitle && (
                <>
                  <div id="title" className="relative text-center h-full w-full">
                    {/* Repeat headers one with opacity at 50% and the other with no background color.
                                This saves a problem of getting the line heights exactly right so they butt up to each line */}
                    <div className="absolute rotate-[-1deg] skew-[-2deg]">
                      {GPTObject && (
                        <div
                          style={{
                            boxShadow: `7px 0 0 0 ${orgData.colors.colorPrimary}`,
                            backgroundColor: orgData.colors.colorPrimary
                          }}
                          className={`font-serif pr-0 box-decoration-clone text-[24px] leading-[30px] whitespace-pre-wrap p-[6px] inline opacity-50 text-white`}
                        >
                          {GPTObject?.title}
                        </div>
                      )}
                    </div>
                    <div className="absolute rotate-[-1deg] skew-[-2deg]">
                      {GPTObject && (
                        <EditableText
                          initialValue={GPTObject?.title as string}
                          className="font-serif pr-0 box-decoration-clone text-[24px] leading-[30px] whitespace-pre-wrap p-[6px] inline bg-transparent text-white"
                          storeSetter={newValue => setJsonData({ ...GPTObject, title: newValue })}
                        />
                      )}
                    </div>
                  </div>
                  <div id="subtitle" className="relative text-center h-full w-full">
                    {/* Repeat headers one with opacity at 50% and the other with no background color.
                                This saves a problem of getting the line heights exactly right so they butt up to each line */}
                    <div className="absolute bottom-2">
                      {GPTObject && (
                        <div
                          style={{
                            boxShadow: `7px 0 0 0 ${orgData.colors.colorSecondary}`,
                            backgroundColor: orgData.colors.colorSecondary
                          }}
                          className={`font-serif pr-0 box-decoration-clone text-[14px] leading-[21px] whitespace-pre-wrap p-[6px] inline opacity-60 text-white`}
                        >
                          {GPTObject?.subtitle}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-2 ">
                      {/* rotate-[1deg] skew-[2deg]  */}
                      {GPTObject && (
                        <EditableText
                          initialValue={GPTObject?.subtitle as string}
                          className="font-serif pr-0 box-decoration-clone text-[14px] leading-[21px] whitespace-pre-wrap p-[6px] inline bg-transparent text-white"
                          storeSetter={newValue => setJsonData({ ...GPTObject, subtitle: newValue })}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div
              className="w-full h-auto flex gap-3 flex-row justify-end items-center p-2 overflow-hidden max-h-8 "
              id="partners"
            >
              {usePartnerLogos &&
                partnerItems.map(
                  (partner, index) =>
                    selectedPartners.includes(partner.name) && (
                      <div className=" " key={index}>
                        <img
                          src={`data:image/svg+xml,${encodeURIComponent(partner.svg)}`}
                          className="w-24"
                          alt={partner.description}
                        />
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
      </div>
      {useGPT && selectedImageId !== 'local' && (
        <>
          <div className="flex my-2 md:my-4 w-full justify-center items-center">
            {selectedImageURL ? (
              <>
                <div>
                  <span className="italic">We added a picture for you</span>
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="outline"
                    onClick={() => toHelper(3)}
                    className="rounded-full ml-2 py-0 px-2 h-7"
                  >
                    Change
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="italic">Search for an image</span>
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="outline"
                    onClick={() => toHelper(3)}
                    className="rounded-full ml-2 py-0 px-2 h-7"
                  >
                    Search
                  </Button>
                </div>
              </>
            )}
          </div>
          {/* <Separator className='my-2 md:my-4' /> */}
        </>
      )}
      {GPTObject?.missing && GPTObject.missing.trim() === 'event' && (
        <div className="p-2 m-1 bg-orange-100 text-xl">
          <FiAlertTriangle size="20" className="inline text-red-500 mr-1" />
          {/* Possible missing items: {GPTObject.missing.toLowerCase()} */}
          <span className="italic text-base">Event? Have you included a date, time and location!</span> &#x1f914;
        </div>
      )}
      <div>
        <Label htmlFor="post-content" className="md:text-lg hidden">
          Main text of post
        </Label>
        <Textarea
          id="post-content"
          value={GPTObject?.tweet}
          onChange={event => setJsonData({ ...GPTObject, tweet: event.target.value })}
          className="h-36 mt-2 bg-white text-base md:text-lg"
          placeholder="This is the main text of your post"
        />
      </div>
      <div className="flex my-2 md:my-4 w-full justify-center items-center">
        <div>
          <span className="italic">Save picture below as a development test</span>
        </div>
        <div>
          <Button type="submit" variant="outline" onClick={handleImageSave} className="rounded-full ml-2 py-0 px-2 h-7">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewAndEdit;
