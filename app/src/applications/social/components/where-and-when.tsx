import React, { FC, useState } from 'react';

import { useSelectedSocialCompaniesStore } from '../social-wizard';
import socialCompaniesData from '../base-data/social-media-companies';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// Iterate over the keys of the partnerData object
const socialCompanyItems = Object.entries(socialCompaniesData).map(([key, value]) => {
  return {
    name: key, // Assuming the key is the name of the partner
    description: value.description
  };
});

interface HelperProps {
  isWizardMode: boolean;
  setIsWizardMode: React.Dispatch<React.SetStateAction<boolean>>;
  setHelperPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const WhereAndWhen: React.FC<HelperProps> = ({ isWizardMode, setIsWizardMode, setHelperPageIndex }) => {
  const toggleWizardMode = () => {
    setIsWizardMode(!isWizardMode);
  };

  const toHelper = (index: number) => {
    setHelperPageIndex(index);
    setIsWizardMode(!isWizardMode);
  };

  const store = useSelectedSocialCompaniesStore();
  const selectedSocialCompanies: string[] = store.selectedSocialCompanies;

  // Function to calculate the next posting time based on the rules
  function getNextPostingTime(currentDate: Date): Date {
    const nextWednesday = getNextWednesday(currentDate);
    const nextPostingTime = new Date(
      nextWednesday.getFullYear(),
      nextWednesday.getMonth(),
      nextWednesday.getDate(),
      14,
      0,
      0
    ); // 2 PM
    return nextPostingTime;
  }

  // Function to get the next Wednesday after the current date
  function getNextWednesday(currentDate: Date): Date {
    const daysUntilNextWednesday = (3 - currentDate.getDay() + 7) % 7; // 3 is Wednesday's index (0-indexed)
    const nextWednesday = new Date(currentDate);
    nextWednesday.setDate(currentDate.getDate() + daysUntilNextWednesday);
    return nextWednesday;
  }

  // Function to format the date as 'Wednesday 21st February at 2pm'
  function formatPostingTime(postingTime: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // Full weekday name (e.g., "Wednesday")
      day: 'numeric', // Numeric day of the month (e.g., "21")
      month: 'long', // Full month name (e.g., "February")
      hour: 'numeric', // Hour (e.g., "2")
      minute: '2-digit', // Minute (e.g., "30")
      hour12: true // Use 12-hour clock (e.g., "am" or "pm")
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(postingTime);
    return formattedDate;
  }

  // Example usage
  const currentDate = new Date();
  const nextPostingTime = getNextPostingTime(currentDate);
  const formattedPostingTime = formatPostingTime(nextPostingTime);
  const nextBestTime = 'The best time to post for engagement is ' + formattedPostingTime;

  const descriptions = selectedSocialCompanies
    .map(key => {
      const company = socialCompanyItems.find(item => item.name === key);
      return company ? company.description : ''; // Return empty string if key not found
    })
    .sort((a, b) => a.localeCompare(b)) // Sort in alphabetical order
    .reverse(); // Reverse the sorted array to get reverse alphabetical order

  // Join descriptions with commas
  const getDescriptionsJoined = () => {
    return descriptions.join(', ');
  };

  return (
    <div className="md:text-lg">
      <div className="flex mt-2 w-full justify-between md:justify-start items-center">
        <div>
          <span className="font-bold">Posting to: </span>
          <span>{`${getDescriptionsJoined()}`}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="outline" onClick={() => toHelper(2)} className="rounded-full ml-2 py-0 px-2 h-7">
          Change
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="flex mt-2 w-full justify-between md:justify-start items-center">
        <div>
          <span className="font-bold">When: </span>
          <span>{nextBestTime}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="outline" onClick={() => toHelper(2)} className="rounded-full ml-2 py-0 px-2 h-7">
          Change
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="italic text-slate-600">
        <p className="my-4">When you press "Send" we will create this post and send it as scheduled.</p>
        <p className="my-4">
          You will be notified when it is posted, and you can access the post in your 'Social List' area.
        </p>
      </div>
    </div>
  );
};

export default WhereAndWhen;
