import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiList, FiRadio, FiSettings } from 'react-icons/fi';
import { ApplicationConfig, useApplication } from '../utils';
import { useAuthStore } from '@/layout/Frame';

// import ImageSearchPage from './components/image-search-page';
import WhatToPost from './components/what-to-post';
import PreviewAndEdit from './components/preview-and-edit';
import WhereAndWhen from './components/where-and-when';
import PartnerList from './components/partner-list';
import SocialMediaCompanyList from './components/social-companies-list';
import SocialList from './social-list';

import { Button } from '@/components/ui/button';

import { create } from 'zustand';
import ImageSearchPage from './components/image-search-page';

/* set up the stores for baseData*/
interface ImageStore {
  selectedImageId: string;
  selectedImageDescription: string;
  selectedImageURL: string;
  selectedImageDownloadURL: string;
  preSelectedImageId: string;
  preSelectedImageDescription: string;
  preSelectedImageURL: string;
  preSelectedImageDownloadURL: string;
  addNewImageToCollection: boolean;
  query: string;
  previousQuery: string;
  photos: any[]; // Adjust the type according to your actual photo data structure
  setQuery: (query: string) => void;
  setPreviousQuery: (query: string) => void;
  setPhotos: (photos: any[]) => void;
  allUnsplash: boolean;
  setAllUnsplash: (value: boolean) => void;
  toggleAddNewImageToCollection: () => void;
  setSelectedImage: (
    selectedImageId: string,
    selectedImageDescription: string,
    selectedImageURL: string,
    selectedImageDownloadURL: string
  ) => void;
  setPreSelectedImage: (
    preSelectedImageId: string,
    preSelectedImageDescription: string,
    preSelectedImageURL: string,
    preSelectedImageDownloadURL: string
  ) => void;
  removeSelectedImage: () => void;
}

export const useImageStore = create<ImageStore>(set => ({
  selectedImageURL: '',
  selectedImageId: '',
  selectedImageDescription: '',
  selectedImageDownloadURL: '',
  setSelectedImage: (imageId, imageDescription, imageURL, imageDownloadURL) =>
    set(state => ({
      selectedImageURL: imageURL,
      selectedImageId: imageId,
      selectedImageDescription: imageDescription,
      selectedImageDownloadURL: imageDownloadURL
    })),
  preSelectedImageURL: '',
  preSelectedImageId: '',
  preSelectedImageDescription: '',
  preSelectedImageDownloadURL: '',
  addNewImageToCollection: false,
  toggleAddNewImageToCollection: () =>
    set((state: ImageStore) => ({ addNewImageToCollection: !state.addNewImageToCollection })),
  query: '',
  previousQuery: '',
  photos: [],
  setQuery: query => set({ query }),
  setPreviousQuery: query => set({ query }),
  setPhotos: photos => set({ photos }),
  allUnsplash: false,
  setAllUnsplash: value => set({ allUnsplash: value }),
  setPreSelectedImage: (imageId, imageDescription, imageURL, imageDownloadURL) =>
    set(state => ({
      preSelectedImageURL: imageURL,
      preSelectedImageId: imageId,
      preSelectedImageDescription: imageDescription,
      preSelectedImageDownloadURL: imageDownloadURL
    })),
  removeSelectedImage: () =>
    set({
      selectedImageURL: '',
      selectedImageId: '',
      selectedImageDescription: '',
      selectedImageDownloadURL: ''
    })
}));

interface KeyAndURLStore {
  UNSPLASH_API_KEY: string;
  UNSPLASH_URL_COLLECTION: string;
  UNSPLASH_URL_ALL: string;
  UNSPLASH_URL_ADD_TO_COLLECTION: string;
  OPENAI_API_KEY: string;
  OPENAI_CHATGPT_URL: string;
}

export const useKeyAndURLStore = create<KeyAndURLStore>(set => ({
  UNSPLASH_API_KEY: import.meta.env.VITE_UNSPLASH_KEY,
  UNSPLASH_URL_COLLECTION: '', // Initialize as empty
  UNSPLASH_URL_ALL: '', // Initialize as empty
  UNSPLASH_URL_ADD_TO_COLLECTION: '', // Initialize as empty
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_KEY,
  OPENAI_CHATGPT_URL: 'https://api.openai.com/v1/completions'
}));

// Function to update the store with URLs using the API key
export const setUnsplashURLs = (key: string) => {
  const UNSPLASH_URL_COLLECTION = `https://api.unsplash.com/search/photos?client_id=${key}&collections=VoNV-LRp7EU&query=`;
  const UNSPLASH_URL_ALL = `https://api.unsplash.com/search/photos?client_id=${key}&query=`;
  const UNSPLASH_URL_ADD_TO_COLLECTION = `https://api.unsplash.com/collections/VoNV-LRp7EU/add`;

  useKeyAndURLStore.setState({
    UNSPLASH_URL_COLLECTION,
    UNSPLASH_URL_ALL,
    UNSPLASH_URL_ADD_TO_COLLECTION
  });
};

// Call setUnsplashURLs with the API key
setUnsplashURLs(useKeyAndURLStore.getState().UNSPLASH_API_KEY);

/* selected UI elements store */
interface SelectedUIElementsStore {
  selectedGPTCB: boolean;
  selectedTitleCB: boolean;
  selectedLogoCB: boolean;
  selectedPartnerCB: boolean;
  toggleGPTCB: () => void;
  toggleTitleCB: () => void;
  toggleLogoCB: () => void;
  togglePartnerCB: () => void;
}

export const useSelectedUIElementsStore = create<SelectedUIElementsStore>(set => ({
  selectedGPTCB: true,
  selectedTitleCB: true,
  selectedLogoCB: true,
  selectedPartnerCB: true,
  toggleGPTCB: () => set((state: SelectedUIElementsStore) => ({ selectedGPTCB: !state.selectedGPTCB })),
  toggleTitleCB: () => set((state: SelectedUIElementsStore) => ({ selectedTitleCB: !state.selectedTitleCB })),
  toggleLogoCB: () => set((state: SelectedUIElementsStore) => ({ selectedLogoCB: !state.selectedLogoCB })),
  togglePartnerCB: () => set((state: SelectedUIElementsStore) => ({ selectedPartnerCB: !state.selectedPartnerCB }))
}));

/* selected partner Store */

// Define the type of setSelectedPartners

interface SelectedPartnersStore {
  selectedPartners: string[];
  previousSelectedPartners: string[];
  setPreviousSelectedPartners: (previousSelectedPartners: string[]) => void;
  restoreSelectedPartners: () => void;
  setSelectedPartners: (selectedPartners: string[]) => void;
  togglePartnerSelection: (partnerKey: string) => void;
}

export const useSelectedPartnersStore = create<SelectedPartnersStore>(set => ({
  selectedPartners: ['nottinghamCityCouncil', 'nationalLotteryCommunityFund'],
  previousSelectedPartners: [],
  setPreviousSelectedPartners: previousSelectedPartners => set({ previousSelectedPartners }),
  setSelectedPartners: selectedPartners => set({ selectedPartners }),
  restoreSelectedPartners: () =>
    set(store => {
      const previousSelectedPartners = store.previousSelectedPartners;
      return {
        selectedPartners: previousSelectedPartners,
        previousSelectedPartners: []
      };
    }),
  togglePartnerSelection: partnerKey => {
    set(state => ({
      selectedPartners: state.selectedPartners.includes(partnerKey)
        ? state.selectedPartners.filter(key => key !== partnerKey)
        : [...state.selectedPartners, partnerKey]
    }));
  }
}));

interface SelectedSocialCompaniesStore {
  selectedSocialCompanies: string[];
  previousSocialCompanies: string[];
  setPreviousSocialCompanies: (previousSocialCompanies: string[]) => void;
  restoreSocialCompanies: () => void;
  setSelectedSocialCompanies: (selectedSocialCompanies: string[]) => void;
  toggleSocialCompanySelection: (socialCompanyKey: string) => void;
}

export const useSelectedSocialCompaniesStore = create<SelectedSocialCompaniesStore>(set => ({
  selectedSocialCompanies: ['website', 'twitter', 'facebook', 'instagram'],
  previousSocialCompanies: [],
  setPreviousSocialCompanies: previousSocialCompanies => set({ previousSocialCompanies }),
  setSelectedSocialCompanies: selectedSocialCompanies => set({ selectedSocialCompanies }),
  restoreSocialCompanies: () =>
    set(store => {
      const previousSocialCompanies = store.previousSocialCompanies;
      return {
        selectedSocialCompanies: previousSocialCompanies,
        previousSocialCompanies: []
      };
    }),
  toggleSocialCompanySelection: socialCompanyKey => {
    set(state => ({
      selectedSocialCompanies: state.selectedSocialCompanies.includes(socialCompanyKey)
        ? state.selectedSocialCompanies.filter(key => key !== socialCompanyKey)
        : [...state.selectedSocialCompanies, socialCompanyKey]
    }));
  }
}));

// Define an interface representing the structure of your JSON data
interface GPTData {
  image_search_word?: string | null;
  subtitle?: string | null;
  title?: string | null;
  tweet?: string | undefined;
  missing?: string | null;
}

// Define a Zustand store to manage the JSON object
interface JsonStoreState {
  jsonData: GPTData; // Use the interface to type the state
  originalText: string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setOriginalText: (text: string) => void;
  setJsonData: (data: Partial<GPTData>) => void;
}

export const useJsonStore = create<JsonStoreState>(set => ({
  jsonData: {
    image_search_word: '',
    subtitle: 'Subtitle in here, click to edit',
    title: 'Title in here!!',
    tweet: '',
    missing: ''
  },
  originalText: '',
  isLoading: false,
  setIsLoading: value => set({ isLoading: value }),
  setOriginalText: originalText => set({ originalText }),
  setJsonData: (data: Partial<GPTData>) => {
    // Merge the provided data with the current state data
    set(state => ({
      jsonData: {
        ...state.jsonData,
        ...data
      }
    }));
  }
}));

const SocialWizard: FC = () => {
  const navigate = useNavigate();

  //const PStore = useSelectedPartnersStore;

  const imgStore = useImageStore();
  const partnerStore = useSelectedPartnersStore();
  const socialStore = useSelectedSocialCompaniesStore();
  const keyStore = useKeyAndURLStore();
  const authStore = useAuthStore();

  if (!authStore.isAuthorised) {
    //console.log(authStore.isAuthorised);
    return;
  }

  //   // State to track the current page index
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  //   // State to track the current helper page index
  const [currentHelperIndex, setHelperPageIndex] = useState(0);

  // State to track whether it's in wizard or helper mode
  const [isWizardMode, setIsWizardMode] = useState(true);

  // Define your wizard pages as an array of objects
  const wizardPages = [
    {
      title: 'What do you want to post?',
      content: (
        <WhatToPost
          isWizardMode={isWizardMode}
          setIsWizardMode={setIsWizardMode}
          setHelperPageIndex={setHelperPageIndex}
        />
      ), // Include your component directly here
      onNext: () => goToNextPage(),
      onPrevious: () => goToPreviousPage(),
      nextButtonText: 'Next', // Customize button text
      previousButtonText: 'Cancel' // Customize button text
    },
    {
      title: 'Preview (and Edit)',
      content: (
        <PreviewAndEdit
          isWizardMode={isWizardMode}
          setIsWizardMode={setIsWizardMode}
          setHelperPageIndex={setHelperPageIndex}
        />
      ),
      onNext: () => goToNextPage(),
      onPrevious: () => goToPreviousPage(),
      nextButtonText: 'Next', // Customize button text
      previousButtonText: 'Back' // Customize button text
    },
    {
      title: 'Where and when to post?',
      content: (
        <WhereAndWhen
          isWizardMode={isWizardMode}
          setIsWizardMode={setIsWizardMode}
          setHelperPageIndex={setHelperPageIndex}
        />
      ),
      onNext: () => goToNextPage(),
      onPrevious: () => goToPreviousPage(),
      nextButtonText: 'Send', // Customize button text
      previousButtonText: 'Back' // Customize button text
    }
    // Add more pages as needed
  ];

  // Function to handle moving to the next page
  const goToNextPage = () => {
    setCurrentPageIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      if (newIndex < wizardPages.length) {
        window.scrollTo(0, 0);
        return newIndex;
      } else {
        //send the post
        return prevIndex; // Stay on the current page if newIndex is out of bounds
      }
    });
  };

  // Function to handle moving to the previous page
  const goToPreviousPage = () => {
    setCurrentPageIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      if (newIndex >= 0) {
        window.scrollTo(0, 0);
        return newIndex;
      } else {
        //go to home
        return -1; // Stay on the current page if newIndex is out of bounds
      }
    });
  };

  // Use useEffect to perform route navigation after state update
  useEffect(() => {
    if (currentPageIndex < 0) {
      // Go to home
      navigate('/');
    }
  }, [currentPageIndex]); // Run this effect when currentPageIndex changes

  // Define your helper pages as an array of objects
  const helperPages = [
    {
      title: 'Choose your logo',
      content: 'Logo content',
      onCancelAction: () => {
        // clear down anything selected

        //PStore.restoreSelectedPartners();
        window.scrollTo(0, 0);
        setIsWizardMode(true);
      },
      onAction: () => {
        window.scrollTo(0, 0);
        setIsWizardMode(true);
      },
      actionButtonText: 'Done', // Customize button text
      cancelButtonText: 'Cancel' // Customize button text
    },
    {
      title: 'Choose partner logos',
      content: <PartnerList />,
      onCancelAction: () => {
        // clear down anything selected
        window.scrollTo(0, 0);
        partnerStore.restoreSelectedPartners();
        setIsWizardMode(true);
      },
      onAction: () => {
        //   // State to track the current page index
        window.scrollTo(0, 0);
        setIsWizardMode(true);
      },
      actionButtonText: 'Done', // Customize button text
      cancelButtonText: 'Cancel' // Customize button text
    },
    {
      title: 'Choose where to post to',
      content: <SocialMediaCompanyList />,
      onCancelAction: () => {
        // clear down anything selected
        window.scrollTo(0, 0);
        socialStore.restoreSocialCompanies();
        setIsWizardMode(true);
      },
      onAction: () => {
        //   // State to track the current page index
        window.scrollTo(0, 0);
        setIsWizardMode(true);
      },
      actionButtonText: 'Done', // Customize button text
      cancelButtonText: 'Cancel' // Customize button text
    },
    {
      title: 'Search Unsplash for an image',
      content: <ImageSearchPage mode="unsplash" />,
      onCancelAction: () => {
        // clear down anything selected
        window.scrollTo(0, 0);
        setIsWizardMode(true);
      },
      onAction: () => {
        //   // State to track the current page index
        window.scrollTo(0, 0);
        setIsWizardMode(true);
        //
        console.log(
          'Add new image to unsplash - ' + imgStore.addNewImageToCollection + ' - photo_id: ' + imgStore.selectedImageId
        );

        async function callUnSplashDownload(unsplashURL: string) {
          try {
            const url = unsplashURL + '&client_id=' + keyStore.UNSPLASH_API_KEY;
            const response = await fetch(url);
            if (!response.ok) {
              // Handle HTTP error status
              throw new Error('UnSplash response was not ok');
            }
            const data = await response.json();
            // Process the data as needed
            console.log(data);
          } catch (error) {
            // Handle fetch or JSON parsing errors
            console.error('Error fetching data:', error);
          }
        }

        callUnSplashDownload(imgStore.selectedImageDownloadURL);

        //
        console.log(
          'Add new image to unsplash - ' + imgStore.addNewImageToCollection + ' - photo_id: ' + imgStore.selectedImageId
        );

        // Do this when we have write_collections scope from Unsplash

        // if (imgStore.addNewImageToCollection) {
        //   const handlePostData = async () => {
        //     try {
        //       // Define postData function inline
        //       const postData = async () => {
        //         try {
        //           const UNSPLASH_URL_ADD_TO_COLLECTION = keyStore.UNSPLASH_URL_ADD_TO_COLLECTION;
        //           const apiKey = keyStore.UNSPLASH_API_KEY;
        //           const response = await fetch(UNSPLASH_URL_ADD_TO_COLLECTION, {
        //             method: 'POST',
        //             headers: {
        //               'Authorization': `Client-ID ${apiKey}`,
        //               'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({
        //               photo_id: imgStore.selectedImageId,
        //               collection_id: 'VoNV-LRp7EU',
        //             })
        //           });

        //           if (!response.ok) {
        //             throw new Error('Failed to post data');
        //           }

        //           const responseData = await response.json(); // Parse response JSON
        //           return responseData; // Return the response data
        //         } catch (error) {
        //           throw error; // Throw any errors that occur during the API call
        //         }
        //       };

        //       // Call postData function
        //       const responseData = await postData();
        //       console.log('Response:', responseData);
        //       // Handle response data as needed
        //     } catch (error) {
        //       console.error('Error:', error);
        //       // Handle errors
        //     }
        //   };

        //   handlePostData(); // Call handlePostData to initiate the process
        // }
      },
      actionButtonText: 'Done', // Customize button text
      cancelButtonText: 'Cancel' // Customize button text
    }
    // Add more helper pages as needed
  ];

  if (isWizardMode) {
    const currentPage = wizardPages[currentPageIndex];
    return (
      <div id="fullPage">
        <div id="title" className="mb-1 md:mb-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl md:my-2 font-semibold">{currentPage?.title}</h1>
        </div>
        {/* calc a height for scrolling, may need to change based on viewport */}
        {/* <div id="component" className="overflow-y-auto" style={{maxHeight:'calc(100vh - 225px)'}}> */}
        <div id="component">
          {/* change 'pages' here */}
          {currentPage?.content}
        </div>
        <div id="buttonFooter" className="flex w-full justify-between md:justify-end p-4 gap-4">
          <Button type="submit" variant="outline" className="text-base md:text-lg" onClick={currentPage?.onPrevious}>
            {currentPage?.previousButtonText}
          </Button>
          <Button type="submit" variant="default" className="text-base md:text-lg" onClick={currentPage?.onNext}>
            {currentPage?.nextButtonText}
          </Button>
        </div>
      </div>
    );
  } else {
    const helperPage = helperPages[currentHelperIndex];
    return (
      <div>
        {/* Render helper pages */}
        <div id="fullPage">
          <div id="title">
            <h1 className="text-lg md:text-xl lg:text-2xl md:my-2 font-semibold">{helperPage?.title}</h1>
          </div>
          {/* calc a height for scrolling, may need to change based on viewport */}
          <div id="component" className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {/* change 'pages' here */}
            {helperPage?.content}
          </div>
          <div id="buttonFooter" className="flex w-full justify-between md:justify-end p-4 gap-4">
            <Button
              type="submit"
              variant="outline"
              className="text-base md:text-lg"
              onClick={helperPage?.onCancelAction}
            >
              {helperPage?.cancelButtonText}
            </Button>
            <Button type="submit" variant="default" className="text-base md:text-lg" onClick={helperPage?.onAction}>
              {helperPage?.actionButtonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

// const SocialList: FC = () => {
//   return (
//     <div>Your posts</div>
//   );
// }

export default {
  name: 'Social Media',
  stage: 'Development',
  // Navigation is a list of links that will be rendered in the sidebar
  navigation: [
    {
      name: 'Social Media',
      path: 'socialmedia',
      icon: FiRadio,
      children: [
        {
          name: 'Your Posts',
          path: '/social/list',
          icon: FiList
        }
      ]
    }
  ],

  // Routes are the actual routes that will be rendered in the application
  routes: {
    // These routes will be rendered inside the main application frame
    dashboard: [
      { path: 'socialmedia', element: <SocialWizard /> },
      { path: 'social/list', element: <SocialList /> }
    ],
    // These routes will be rendered as a standalone page with no frame
    standalone: []
  }
} satisfies ApplicationConfig;
