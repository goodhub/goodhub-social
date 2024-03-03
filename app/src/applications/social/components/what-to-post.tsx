import React, { FC, useState, ChangeEvent, useEffect } from 'react';

import ImageSearchPage from './image-search-page';
import { useSelectedPartnersStore, useSelectedUIElementsStore, useJsonStore, useImageStore, useKeyAndURLStore } from '../social-wizard';
import partnerData from '../base-data/partner-organisations';

import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FiHelpCircle } from 'react-icons/fi';
import { start } from 'repl';



  

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

    const imgStore = useImageStore();
    const keyStore = useKeyAndURLStore();

    //is the component mounted or not   
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
      return () => {
        // Set the flag to false when the component unmounts
        setIsMounted(false);
      };
}, []);

        // Define a function to call the ChatGPT API
async function callChatGPTAPI(inputText:string) {

    // Example input prompt
    const prompt = `Today is 26th February 2024. write me a tweet of at least 40 words in a fun tone for my charity twitter handle about "${inputText}". Generate a post title of less than 6 words (including the word free if the event is free), a subtitle of less than 18 words (including day and month, time and location if available) and ONLY ONE word to search for an image with from that tweet. Send me back ONLY a srtictly valid JSON object, with the "tweet", "title", "subtitle" and then the "date" and "time" and "venue" and "contact" and "image_search_word" if available`;
  
    // ChatGPT functions
  
    const apiKey = keyStore.OPENAI_API_KEY;
    const endpoint = keyStore.OPENAI_CHATGPT_URL;
  
  
  
    // Example parameters
    const parameters = {
    model: 'gpt-3.5-turbo-instruct',
    max_tokens: 300
    };

    function normalizeJSONStringKeys(jsonString: string): string {
      const regex = /"([^"]+)"\s*:\s*("[^"]*"|[^,]+),?/g;
      let result = '{';
      let match = regex.exec(jsonString);
      while (match !== null) {
        const key = match[1] as string;
        let value = match[2] as string;
        // Add quotes around the value if it's not already quoted
        if (!/^["']/.test(value)) {
          // Escape line breaks within the value
          value = value.replace(/\n/g, '\\n');
          value = `"${value.trim()}"`;
        }
        result += `"${key.toLowerCase()}": ${value}, `;
        match = regex.exec(jsonString);
      }
      // Remove the trailing comma and add the closing curly brace
      result = result.replace(/,\s*$/, '') + '}';
      return result;
    }
  
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

          const text = data.choices[0].text
          // Find the index of the first opening curly bracket
          

          let startIndex = text.indexOf('{');
          const needsCurlies = text.indexOf('.') === 0 && startIndex === -1;
  
          // Find the index of the last closing curly bracket
          const endIndex = text.lastIndexOf('}') + 1;

          console.log("start - " + startIndex + ", end - " + endIndex);

          // Extract the JSON string if Its a bad request take the middle out
          const jsonString = (needsCurlies) ? "{" + text.slice(1,text.length) + "}" : text.slice(startIndex, endIndex);
          // const jsonString = text.slice(startIndex, endIndex);

          console.log(jsonString)
  
          // Normalize keys to lowercase in the JSON string
          const normalizedJSONString = normalizeJSONStringKeys(jsonString);
  
          console.log(normalizedJSONString)

          if (normalizedJSONString === '{}'){
            //try again if fail and component still mounted
            console.log('FAIL in JSON string - try again');
            // Additional logic...
            if (isMounted){
              const response = await callChatGPTAPI(jsonString);
              console.log(response);
              setJsonData(response);
            }
          }

          // Parse the JSON string into an object
          const jsonData = JSON.parse(normalizedJSONString);
          console.log(jsonData)
  
          const API_URL = keyStore.UNSPLASH_URL_COLLECTION;
  
      
          try {
            const query = jsonData?.image_search_word;
            imgStore.setQuery(query);
            if(imgStore.selectedImageURL ===''){
                //console.log(query)
                const image_response = await fetch(API_URL + query);
                const image_data= await image_response.json();
                imgStore.setPhotos(image_data.results)
                console.log(image_data);
                const firstImage = image_data?.results[0];
                console.log(firstImage)
                if (firstImage){
                const response = await fetch(firstImage.urls.regular);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onload = () => {
                    console.log("image loads")
                    const dataURL = reader.result as string;
                    //console.log("image loads - "+ dataURL)
                    //dataURL && setImageData(dataURL);
                    
                    if (dataURL) {
                      if (isMounted){
                        //are we still on this page
                        if (imgStore.selectedImageURL === '') imgStore.setPreSelectedImage(firstImage.id, firstImage.description, dataURL);
                      }else{
                        //we are on the nxt page
                        if (imgStore.selectedImageURL === '') imgStore.setSelectedImage(firstImage.id, firstImage.description, dataURL);
                      }
                    }
                };
                reader.readAsDataURL(blob);
                }
            }
          } catch (error) {
              console.error('Error fetching image:', error);
          }
              
  
  
          return jsonData;
  
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

    const setJsonData = useJsonStore((state) => state.setJsonData);

    const toggleWizardMode = () => {
      setIsWizardMode(!isWizardMode);
    };

    const toHelper = (index: number) => {
        setHelperPageIndex(index);
        setIsWizardMode(!isWizardMode);
      };

    // const [text, setText] = useState<string>('');
     const [prevText, setPrevText] = useState<string>('');

    const { originalText, setOriginalText } = useJsonStore(); 



    /* text area functions */
      const handleBlur = async (event: ChangeEvent<HTMLTextAreaElement>) => {
        const passedText = event.target.value;
        setPrevText(passedText);
        if (passedText !== '' && passedText !== prevText) {
            //console.log('Textarea blurred ' + event.target.value);
            // Additional logic...
            if(selectedGPTCB){
              const response = await callChatGPTAPI(event.target.value);
              //console.log(response);
              setJsonData(response);
            }else{
              setJsonData({tweet: event.target.value});
            }
        }
      }



      const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const passedText = event.target.value;
        if (passedText !== '' && passedText !== prevText) {
          setOriginalText(passedText);
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
                <Textarea id="content-type" onBlur={handleBlur} value={originalText} onChange={handleChange} className='h-24 mt-2 bg-white text-base md:text-lg' placeholder='Put the text of what you want to tell everyone about here &#x1f4e2;' />
            </div>
            <div className='flex my-2 w-full items-center justify-start md:justify-start items-center'>
                <div>
                    <Checkbox 
                        id='auto-produce-text' 
                        className='mr-2'
                        checked={selectedGPTCB}
                        onClick={toggleGPTCB}
                    />
                    <Label htmlFor='auto-produce-text' className='md:text-lg whitespace-nowrap mr-1.5'>Auto-help with post</Label>
                </div>
                <div>
                    <a className='cursor-pointer'><FiHelpCircle className='text-blue-500 text-lg'/></a>
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
                    <Label htmlFor='include-logo' className='md:text-lg whitespace-nowrap'>Include your logo</Label>
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
                    <Label htmlFor='include-partner-logo' className=' md:text-lg whitespace-nowrap'>Include partner logos</Label>
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