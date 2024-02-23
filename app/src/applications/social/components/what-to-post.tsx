import React, { FC, useState, ChangeEvent } from 'react';

import ImageSearchPage from './image-search-page';
import { useSelectedPartnersStore, useSelectedUIElementsStore, useJsonStore } from '../social-wizard';
import partnerData from '../base-data/partner-organisations';

import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

  

    // Define a function to call the ChatGPT API
export async function callChatGPTAPI(inputText:string) {

  // Example input prompt
  const prompt = `Today is 21st February 2024. write me a tweet in a fun tone for my charity twitter handle about "${inputText}". Generate a post title of less than 6 words (including the word free if the event is free), a subtitle of less than 18 words (including day and month, time and location if available) and one word to search for an image with from that tweet. Return me only a JSON object with the 'tweet', 'title', 'subtitle' and then the 'date' and 'time' and 'venue' and 'contact' and 'image search word' if available`;

  // ChatGPT functions

  const apiKey = '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';
  const endpoint = 'https://api.openai.com/v1/completions';


  // Example parameters
  const parameters = {
  model: 'gpt-3.5-turbo-instruct',
  max_tokens: 200
  };
;



    try {
      // Make the API call to ChatGPT
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt: prompt,
            ...parameters
        })
      });
  
      // Check if the response is successful
      if (response.ok) {
        // Parse the response JSON
        const data = await response.json();
        // Return the response data
        console.log(data)
        // Parse the returned text into a JSON object
        try{
    // Call the useJsonStore hook to access the store and its setter function
    
        console.log(data.choices[0].text)
        // Find the index of the first opening curly bracket
        const startIndex = data.choices[0].text.indexOf('{');

        // Find the index of the last closing curly bracket
        const endIndex = data.choices[0].text.lastIndexOf('}') + 1;

        // Extract the JSON string
        const jsonString = data.choices[0].text.slice(startIndex, endIndex);

        // Parse the JSON string into an object
        const jsonData = JSON.parse(jsonString);
        //console.log(jsonData)
        return jsonData;

        // console.log(jsonData);
        // const setJsonData = useJsonStore((state) => state.setJsonData);

  
        // // // Update the Zustand store with the parsed JSON object
        // console.log(jsonData);
        // setJsonData(jsonData);

        }catch(error){
            console.error('Error parsing JSON:', error);
        }

        //return data;
      } else {
        // Handle the error response
        throw new Error('Failed to call ChatGPT API');
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error calling ChatGPT API:', error);
      // You can choose to throw the error or return null, depending on your needs
      throw error;
    }
  }
  

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

const WhatToPost: React.FC<HelperProps> = ({ isWizardMode, setIsWizardMode, setHelperPageIndex }) => {

    const setJsonData = useJsonStore((state) => state.setJsonData);

    const toggleWizardMode = () => {
      setIsWizardMode(!isWizardMode);
    };

    const toHelper = (index: number) => {
        setHelperPageIndex(index);
        setIsWizardMode(!isWizardMode);
      };

      const [text, setText] = useState<string>('');
      const [prevText, setPrevText] = useState<string>('');

    /* text area functions */
      const handleBlur = async (event: ChangeEvent<HTMLTextAreaElement>) => {
        const passedText = event.target.value;
        setPrevText(passedText);
        if (passedText !== '' && passedText !== prevText) {
            //console.log('Textarea blurred ' + event.target.value);
            // Additional logic...
            const response = await callChatGPTAPI(event.target.value);
            //console.log(response);
            setJsonData(response);
        }
      }



      const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const passedText = event.target.value;
        if (passedText !== '' && passedText !== prevText) {
            setText(passedText);
        }
      };
      /* end */


        // Use chatGPT checkbox
        const selectedGPTCB = useSelectedUIElementsStore((state) => state.selectedGPTCB);
        const toggleGPTCB = useSelectedUIElementsStore((state) => state.toggleGPTCB);

        //use logo checkbox
        const selectedLogoCB = useSelectedUIElementsStore((state) => state.selectedLogoCB);
        const toggleLogoCB = useSelectedUIElementsStore((state) => state.toggleLogoCB);

        //use partners checkbox
        const selectedPartnerCB = useSelectedUIElementsStore((state) => state.selectedPartnerCB);
        const togglePartnerCB = useSelectedUIElementsStore((state) => state.togglePartnerCB);
    

      const store = useSelectedPartnersStore();
      const selectedPartners: string[] = store.selectedPartners;
      
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
        <div className='md:text-lg'>
            <div>
                <Label htmlFor='content-type' className='md:text-lg hidden'>What the post is about</Label>
                <Textarea id="content-type" onBlur={handleBlur} value={text} onChange={handleChange} className='h-24 mt-2 bg-white md:text-lg' placeholder='Put the text of what you want to tell everyone about here &#x1f4e2;' />
            </div>
            <div className='flex my-2 w-full justify-between md:justify-start items-center'>
                <div>
                    <Checkbox 
                        id='auto-produce-text' 
                        className='mr-2'
                        checked={selectedGPTCB}
                        onClick={toggleGPTCB}
                    />
                    <Label htmlFor='auto-produce-text' className='md:text-lg'>Auto-produce post</Label>
                </div>
                <div>
                    <a className='ml-3 italic text-blue-500 md:text-lg'>How does it work?</a>
                </div>
            </div>
            <Separator className='my-4 mt-2' />
            <ImageSearchPage mode="local"/>
            <Separator className='my-4' />
            <div className='flex my-2 w-full justify-between md:justify-start items-center'>
                <div>
                    <Checkbox 
                            id='include-logo' 
                            className='mr-2'
                            checked={selectedLogoCB}
                            onClick={toggleLogoCB}
                        />
                    <Label htmlFor='include-logo' className='md:text-lg'>Include your logo</Label>
                </div>
                {/* Put this button if there is more than one logo in store */}
                {/* <div>
                    <Button type="submit" variant="outline" onClick={() => toHelper(0)} className='rounded-full ml-2 py-0 px-2 h-7'>Change</Button>
                </div> */}
            </div>
            <div className='flex mt-2 w-full justify-between md:justify-start items-center'>
                <div>
                <Checkbox 
                        id='include-partner-logo' 
                        className='mr-2'
                        checked={selectedPartnerCB}
                        onClick={togglePartnerCB}
                    />
                    <Label htmlFor='include-partner-logo' className=' md:text-lg'>Include partner logos</Label>
                </div>
                <div>
                    <Button type="submit" variant="outline" onClick={() => toHelper(1)} className='rounded-full ml-2 py-0 px-2 h-7'>Change</Button>
                </div>
            </div> 
            <div className='text-slate-500 text-sm md:text-lg'>{`Partners: (${getDescriptionsJoined()})`}</div>  
        </div>
    );
};

export default WhatToPost;