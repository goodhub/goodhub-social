import React, { ChangeEvent, useState } from 'react';

import partnerData from '../base-data/partner-organisations';
import { useImageStore, useJsonStore, useSelectedPartnersStore, useSelectedUIElementsStore } from '../social-wizard';
import ImageSearchPage from './image-search-page';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { FiHelpCircle } from 'react-icons/fi';
import { AIProcessedPost, useSummarizePost } from '../hooks/ai';
import { UnsplashAPIResult, loadImage, searchForImages } from '../hooks/unsplash';

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

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate;
}

const WhatToPost: React.FC<HelperProps> = ({ isWizardMode, setIsWizardMode, setHelperPageIndex }) => {
  const { setSelectedImage, setPhotos, setQuery, setAllUnsplash } = useImageStore();
  const { jsonData, setJsonData, setIsLoading } = useJsonStore(state => ({
    jsonData: state.jsonData,
    setJsonData: state.setJsonData,
    setIsLoading: state.setIsLoading
  }));
  const summarizePost = useSummarizePost();

  // Define a function to call the ChatGPT API
  async function summarizePostAndGetImage(input: string): Promise<{
    post: AIProcessedPost;
    image?: {
      unsplash: UnsplashAPIResult;
      url: string;
      results: UnsplashAPIResult[];
      expandedSearch: boolean;
      query: string;
    };
  }> {
    // I'm trying to keep any setting of state outside of this function
    // so we're returning the data and handling it in the component
    try {
      const post = await summarizePost.mutateAsync({ input });
      const query = post.image_search_word;
      if (!query) return { post };

      const [unsplash, expandedSearch] = await searchForImages(query);
      const image = unsplash.results[0];
      if (!image) throw new Error('No image found but total is greater than 0');
      const url = await loadImage(image.urls.regular);
      return { post, image: { unsplash: image, url, results: unsplash.results, expandedSearch, query } };
    } catch (error) {
      console.error('Error summarizing post and getting image:', error);
      throw error;
    }
  }

  const toggleWizardMode = () => {
    setIsWizardMode(!isWizardMode);
  };

  const toHelper = (index: number) => {
    setHelperPageIndex(index);
    setIsWizardMode(!isWizardMode);
  };

  // const [text, setText] = us eState<string>('');
  const [prevText, setPrevText] = useState<string>('');

  const { originalText, setOriginalText } = useJsonStore();

  /* text area functions */
  const handleBlur = async () => {
    //Do we only do one request, or have an option to re-generate?
    if (jsonData.tweet !== '') return;
    setPrevText(originalText);
    if (originalText !== '' && originalText !== prevText) {
      // If the user doesn't want to use the AI, don't call the API
      // and just set the text to the original text
      if (!useGPT) {
        setJsonData({ tweet: originalText });
      }

      // If the user wants to use the AI, call the API
      setIsLoading(true);
      const response = await summarizePostAndGetImage(originalText);
      setJsonData(response.post);

      // If the response has an image, set the image data
      if (response.image) {
        setPhotos(response.image.results);
        setQuery(response.image.query);
        if (response.image.expandedSearch) {
          setAllUnsplash(true);
        }

        setSelectedImage(
          response.image.unsplash.id,
          response.image.unsplash.description ?? '',
          response.image.url,
          response.image.unsplash.links.download_location
        );
      }
      setIsLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setOriginalText(event.target.value);
  };
  /* end */

  const [useGPT, toggleUseGPT] = useSelectedUIElementsStore(state => [state.useGPT, state.toggleUseGPT]);
  const [showTitleAndDescription, toggleShowTitleAndDescription] = useSelectedUIElementsStore(state => [
    state.showTitleAndDescription,
    state.toggleShowTitleAndDescription
  ]);
  const [showLogo, toggleShowLogo] = useSelectedUIElementsStore(state => [state.showLogo, state.toggleShowLogo]);

  const [showPartners, toggleShowPartners] = useSelectedUIElementsStore(state => [
    state.showPartners,
    state.toggleShowPartners
  ]);

  const selectedPartners = useSelectedPartnersStore(state => state.selectedPartners);

  // Assuming `partnerItems` is accessible here
  // Match keys in `selectedPartners` with `partnerItems` to get descriptions
  const descriptions = selectedPartners.map(key => {
    const partner = partnerItems.find(item => item.name === key);
    return partner ? partner.description : ''; // Return empty string if key not found
  });

  // Join descriptions with commas
  const getDescriptionsJoined = () => {
    return descriptions.join(', ');
  };

  return (
    <div className="md:text-lg">
      <div className="flex my-2 w-full items-center justify-start md:justify-start">
        <div>
          <Checkbox id="auto-produce-text" className="mr-2" checked={useGPT} onClick={toggleUseGPT} />
          <Label htmlFor="auto-produce-text" className="md:text-lg whitespace-nowrap mr-1.5">
            Automatically help me with my post
          </Label>
        </div>
        <div>
          <a className="cursor-pointer">
            <FiHelpCircle className="text-blue-500 text-lg" />
          </a>
        </div>
      </div>
      <div>
        <Label htmlFor="content-type" className="md:text-lg hidden">
          What the post is about
        </Label>
        <Textarea
          id="content-type"
          onBlur={handleBlur}
          value={originalText}
          onChange={handleChange}
          className="h-24 mt-2 bg-white text-base md:text-lg"
          placeholder="Put the text of what you want to tell everyone about here &#x1f4e2;"
        />
      </div>
      <Separator className="my-4 mt-2" />
      <ImageSearchPage mode="local" />
      <Separator className="my-4" />
      <div className="flex my-2 w-full justify-between md:justify-start items-center">
        <div>
          <Checkbox
            id="include-title"
            className="mr-2"
            checked={showTitleAndDescription}
            onClick={toggleShowTitleAndDescription}
          />
          <Label htmlFor="include-title" className="md:text-lg whitespace-nowrap">
            Include title and subtitle
          </Label>
        </div>
        {/* Put this button if there is more than one logo in store */}
        {/* <div>
                    <Button type="submit" variant="outline" onClick={() => toHelper(0)} className='rounded-full ml-2 py-0 px-2 h-7'>Change</Button>
                </div> */}
      </div>
      <div className="flex my-2 w-full justify-between md:justify-start items-center">
        <div>
          <Checkbox id="include-logo" className="mr-2" checked={showLogo} onClick={toggleShowLogo} />
          <Label htmlFor="include-logo" className="md:text-lg whitespace-nowrap">
            Include your logo
          </Label>
        </div>
        {/* Put this button if there is more than one logo in store */}
        {/* <div>
                    <Button type="submit" variant="outline" onClick={() => toHelper(0)} className='rounded-full ml-2 py-0 px-2 h-7'>Change</Button>
                </div> */}
      </div>
      <div className="flex mt-2 w-full justify-between md:justify-start items-center">
        <div>
          <Checkbox id="include-partner-logo" className="mr-2" checked={showPartners} onClick={toggleShowPartners} />
          <Label htmlFor="include-partner-logo" className=" md:text-lg whitespace-nowrap">
            Include partner logos
          </Label>
        </div>
        <div>
          <Button
            type="submit"
            variant="outline"
            onClick={() => toHelper(1)}
            className="rounded-full ml-2 py-0 px-2 h-7"
          >
            Change
          </Button>
        </div>
      </div>
      <div className="text-slate-500 text-sm md:text-lg">{`Partners: (${getDescriptionsJoined()})`}</div>
    </div>
  );
};

export default WhatToPost;
