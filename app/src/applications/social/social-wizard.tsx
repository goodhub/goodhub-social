import { FC, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { FiList, FiRadio, FiSettings} from 'react-icons/fi';
import { ApplicationConfig, useApplication } from '../utils';

// import ImageSearchPage from './components/image-search-page';
import WhatToPost from './components/what-to-post';
import PreviewAndEdit from './components/preview-and-edit';
import WhereAndWhen from './components/where-and-when';
import PartnerList from './components/partner-list';
import SocialMediaCompanyList from './components/social-companies-list'

import { Button } from '@/components/ui/button';

import { create } from 'zustand';
import ImageSearchPage from './components/image-search-page';

/* set up the stores for baseData*/
type SocialWizardStore = {
  selectedImageId: string;
  selectedImageDescription: string;
  selectedImageURL: string;
  setSelectedImage: (selectedImageId:string, selectedImageDescription:string, selectedImageURL:string) => void;
  removeSelectedImage: () => void;
}

export const useSocialWizardStore = create<SocialWizardStore>((set) => ({
  selectedImageURL: '',
  selectedImageId:'',
  selectedImageDescription:'',
  setSelectedImage : (imageId, imageDescription, imageURL) => 
    set((state) => ({ 
      selectedImageURL: imageURL,
      selectedImageId: imageId,
      selectedImageDescription: imageDescription,
    })),
  removeSelectedImage: () => set({
    selectedImageURL: '',
    selectedImageId:'',
    selectedImageDescription:'',
  })
}));

/* selected UI elements store */
interface SelectedUIElementsStore {
  selectedGPTCB: boolean;
  selectedLogoCB: boolean;
  selectedPartnerCB: boolean;
  toggleGPTCB: () => void;
  toggleLogoCB: () => void;
  togglePartnerCB: () => void;
}

export const useSelectedUIElementsStore = create<SelectedUIElementsStore>((set) => ({
  selectedGPTCB: true,
  selectedLogoCB: true,
  selectedPartnerCB: true,
  toggleGPTCB: () => set((state: SelectedUIElementsStore) => ({ selectedGPTCB: !state.selectedGPTCB })),
  toggleLogoCB: () => set((state: SelectedUIElementsStore) => ({ selectedLogoCB: !state.selectedLogoCB })),
  togglePartnerCB: () => set((state: SelectedUIElementsStore) => ({ selectedPartnerCB: !state.selectedPartnerCB })),
}));

/* selected partner Store */

// Define the type of setSelectedPartners

interface SelectedPartnersStore {
  selectedPartners: string[];
  previousSelectedPartners: string[];
  setPreviousSelectedPartners: (previousSelectedPartners: string[]) => void;
  restoreSelectedPartners: ()=> void;
  setSelectedPartners: (selectedPartners: string[]) => void;
  togglePartnerSelection: (partnerKey: string) => void;
}

export const useSelectedPartnersStore = create<SelectedPartnersStore>((set) => ({
  selectedPartners: ['nottinghamCityCouncil','nationalLotteryCommunityFund'],
  previousSelectedPartners: [],
  setPreviousSelectedPartners: (previousSelectedPartners) => set({ previousSelectedPartners }),
  setSelectedPartners: (selectedPartners) => set({ selectedPartners }),
  restoreSelectedPartners: () => set((store) => {
    const previousSelectedPartners = store.previousSelectedPartners;
    return { 
      selectedPartners: previousSelectedPartners,
      previousSelectedPartners: []
    }
  }),
  togglePartnerSelection: (partnerKey) => {
      set((state) => ({
          selectedPartners: state.selectedPartners.includes(partnerKey)
              ? state.selectedPartners.filter((key) => key !== partnerKey)
              : [...state.selectedPartners, partnerKey],
      }));
  },
}));

interface SelectedSocialCompaniesStore {
  selectedSocialCompanies: string[];
  toggleSocialCompanySelection: (socialCompanyKey: string) => void;
}

export const useSelectedSocialCompaniesStore = create<SelectedSocialCompaniesStore>((set) => ({
  selectedSocialCompanies: ['website','twitter','facebook', 'instagram'],
  toggleSocialCompanySelection: (socialCompanyKey) => {
      set((state) => ({
          selectedSocialCompanies: state.selectedSocialCompanies.includes(socialCompanyKey)
              ? state.selectedSocialCompanies.filter((key) => key !== socialCompanyKey)
              : [...state.selectedSocialCompanies, socialCompanyKey],
      }));
  },
}));

// Define an interface representing the structure of your JSON data
interface GPTData {
  contact: string;
  date: string;
  image_search_word: string;
  subtitle: string;
  time: string;
  title: string;
  tweet: string;
  venue: string;
}


// Define a Zustand store to manage the JSON object
interface JsonStoreState {
  jsonData: GPTData | null; // Use the interface to type the state
  setJsonData: (data: GPTData) => void;
}

export const useJsonStore = create<JsonStoreState>((set) => ({
  jsonData: null, // Initial state is null
  setJsonData: (data:GPTData) => set({ jsonData: data }), // Setter function to update the JSON data
}));


const SocialWizard: FC = () => {

  const navigate = useNavigate()

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
        content: <WhatToPost isWizardMode={isWizardMode} setIsWizardMode={setIsWizardMode} setHelperPageIndex={setHelperPageIndex}/>, // Include your component directly here
        onNext: () => goToNextPage(),
        onPrevious: () => goToPreviousPage(),
        nextButtonText: 'Next', // Customize button text
        previousButtonText: 'Cancel', // Customize button text
      },
      {
        title: 'Preview (and Edit)',
        content: <PreviewAndEdit isWizardMode={isWizardMode} setIsWizardMode={setIsWizardMode} setHelperPageIndex={setHelperPageIndex}/>,
        onNext: () => goToNextPage(),
        onPrevious: () => goToPreviousPage(),
        nextButtonText: 'Next', // Customize button text
        previousButtonText: 'Back', // Customize button text
      },
      {
        title: 'Where and when to post?',
        content: <WhereAndWhen isWizardMode={isWizardMode} setIsWizardMode={setIsWizardMode} setHelperPageIndex={setHelperPageIndex}/>,
        onNext: () => goToNextPage(),
        onPrevious: () => goToPreviousPage(),
        nextButtonText: 'Send', // Customize button text
        previousButtonText: 'Back', // Customize button text
      }
      // Add more pages as needed
    ];
    
// Function to handle moving to the next page
const goToNextPage = () => {
  setCurrentPageIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      if (newIndex < wizardPages.length) {
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
          setIsWizardMode(true)
        },
        onAction: () => {
          setIsWizardMode(true)
        },
        actionButtonText: 'Done', // Customize button text
        cancelButtonText: 'Cancel', // Customize button text
      },
      {
        title: 'Choose partner logos',
        content: <PartnerList />,
        onCancelAction: () => {
          // clear down anything selected
          setIsWizardMode(true)
        },
        onAction: () => {
            //   // State to track the current page index
          setIsWizardMode(true);

        },
        actionButtonText: 'Done', // Customize button text
        cancelButtonText: 'Cancel', // Customize button text
      },
      {
        title: 'Choose where to post to',
        content: <SocialMediaCompanyList />,
        onCancelAction: () => {
          // clear down anything selected
          setIsWizardMode(true)
        },
        onAction: () => {
            //   // State to track the current page index
          setIsWizardMode(true);

        },
        actionButtonText: 'Done', // Customize button text
        cancelButtonText: 'Cancel', // Customize button text
      },
      {
        title: 'Search online for an image',
        content: <ImageSearchPage mode="unsplash" />,
        onCancelAction: () => {
          // clear down anything selected
          setIsWizardMode(true)
        },
        onAction: () => {
            //   // State to track the current page index
          setIsWizardMode(true);

        },
        actionButtonText: 'Done', // Customize button text
        cancelButtonText: 'Cancel', // Customize button text
      },
      // Add more helper pages as needed
    ];

  if (isWizardMode) {
      const currentPage = wizardPages[currentPageIndex];
      return (
        <div id="fullPage">
          <div id="title" className='mb-1 md:mb-4'>
            <h1 className="text-xl md:text-2xl lg:text-3xl md:my-2 font-semibold">{currentPage?.title}</h1>
          </div>
          {/* calc a height for scrolling, may need to change based on viewport */}
          <div id="component" className="overflow-y-auto" style={{maxHeight:'calc(100vh - 225px)'}}>

              {/* change 'pages' here */}
              {currentPage?.content}
          </div> 
          <div id="buttonFooter" className='flex w-full justify-between md:justify-end p-4 gap-4'>
            <Button type="submit" variant="outline" className='md:text-lg' onClick={currentPage?.onPrevious}>{currentPage?.previousButtonText}</Button>
            <Button type="submit" variant="default" className='md:text-lg' onClick={currentPage?.onNext}>{currentPage?.nextButtonText}</Button>
          </div>
        </div>
      )
    }else{
      const helperPage = helperPages[currentHelperIndex];
      return (
        <div>
          {/* Render helper pages */}
          <div id="fullPage">
            <div id="title">
              <h1 className="text-lg md:text-xl lg:text-2xl md:my-2 font-semibold">{helperPage?.title}</h1>
            </div>
            {/* calc a height for scrolling, may need to change based on viewport */}
            <div id="component" className="overflow-y-auto" style={{maxHeight:'calc(100vh - 200px)'}}>

                {/* change 'pages' here */}
                {helperPage?.content}
            </div> 
            <div id="buttonFooter" className='flex w-full justify-between md:justify-end p-4 gap-4'>
              <Button type="submit" variant="outline" className='md:text-lg' onClick={helperPage?.onCancelAction}>{helperPage?.cancelButtonText}</Button>
              <Button type="submit" variant="default" className='md:text-lg' onClick={helperPage?.onAction}>{helperPage?.actionButtonText}</Button>
            </div>
          </div>
        </div>
      );
    }
};

const SocialList: FC = () => {
  return (
    <div>Your posts</div>
  );
}

  // Function to render the current page
  // const renderPage = () => {
  //   if (isWizardMode) {
  //     const currentPage = wizardPages[currentPageIndex];
  //     return (
  //       <div>
  //         <h2>{currentPage.title}</h2>
  //         {currentPage.content}
  //         <button onClick={currentPage.onNext}>{currentPage.nextButtonText}</button>
  //         {currentPageIndex > 0 && (
  //           <button onClick={currentPage.onPrevious}>{currentPage.previousButtonText}</button>
  //         )}
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div>
  //         {/* Render helper pages */}
  //         {helperPages.map((helperPage, index) => (
  //           <div key={index}>
  //             <h2>{helperPage.title}</h2>
  //             <p>{helperPage.content}</p>
  //             <button onClick={helperPage.onAction}>{helperPage.actionButtonText}</button>
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   }
  // };

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
          name: 'Your posts',
          path: '/social/list',
          icon: FiList
        }
      ]
    }
  ],

  // Routes are the actual routes that will be rendered in the application
  routes: {
    // These routes will be rendered inside the main application frame
    dashboard: [{ path: 'socialmedia', element: <SocialWizard />},{ path: 'social/list', element: <SocialList /> }],
    // These routes will be rendered as a standalone page with no frame
    standalone: []
  }
} satisfies ApplicationConfig;
