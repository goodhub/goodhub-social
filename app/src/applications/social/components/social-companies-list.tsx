import React, { useState, useEffect } from 'react';
import socialCompaniesData from '../base-data/social-media-companies';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

import { useSelectedSocialCompaniesStore } from '../social-wizard'; // Path to your store
import { Label } from '@/components/ui/label';

const SocialMediaCompanyList: React.FC = () => {
  const store = useSelectedSocialCompaniesStore();
  const selectedSocialMediaCompanies = store.selectedSocialCompanies;
  const togglePartnerSelection = store.toggleSocialCompanySelection;

  useEffect(() => {
    // // Function to capture the current state into a previous state variable
    store.setPreviousSocialCompanies(selectedSocialMediaCompanies);
    // Return a cleanup function if needed
    return () => {
      // Perform cleanup here if necessary
    };
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  return (
    <div>
      {Object.entries(socialCompaniesData).map(([key, { description, icon: Icon }]) => (
        <React.Fragment key={key}>
          <div className="flex my-2 w-full justify-start items-center max-h-12 h-12 overflow-hidden">
            <Checkbox
              checked={selectedSocialMediaCompanies.includes(key)}
              onClick={() => togglePartnerSelection(key)}
              id={`social-${key}`}
            />
            <Label htmlFor={`social-${key}`} className="flex items-center">
              <Icon size="24" className="mx-2 ml-4" /> {/* Render the icon component */}
              <div className="text md:text-lg">{description}</div>
            </Label>
          </div>
          <Separator key={`separator-${key}`} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default SocialMediaCompanyList;
