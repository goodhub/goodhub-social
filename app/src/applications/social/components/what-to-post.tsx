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
    const JSONstore = useJsonStore();

    //is the component mounted or not   
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
      return () => {
        // Set the flag to false when the component unmounts
        setIsMounted(false);
      };
}, []);


function debugLog(message: string): void {
  const debugMode: boolean = false; // Set to true to enable logging, false to disable
  if (debugMode) {
    console.log(message);
  }
}

        // Define a function to call the ChatGPT API
async function callChatGPTAPI(inputText:string) {

  

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
  
  const currentDate: Date = new Date();
  const formattedDate: string = formatDate(currentDate);
  


    // Example input prompt
    //const prompt = `Today is ${formattedDate}. Write me a 280 character tweet in a fun tone for my charity twitter handle about "${inputText}". Please output in the same language as it is input. Do not miss out of the tweet any relevant information, even if it makes the text longer. Generate a post title of less than 6 words (including the word free if the event is free), a subtitle of less than 18 words (including day and month, time and location if available) and ONLY ONE word to search for an image with from that tweet. Send me back ONLY a srtictly valid JSON object, with the "tweet", "title", "subtitle" and then the "date" and "time" and "venue" and "contact" and "image_search_word" if available`;
    //const prompt = `Today's date is ${formattedDate}. Please write a fun tweet for our charity's Twitter handle about "${inputText}". Keep it to 280 characters. Provide a catchy title (less than 6 words, including 'free' if applicable), a brief subtitle (less than 18 words, including day, month, time, and location), and ONE word for image search. Output a valid JSON object with the "tweet", "title", "subtitle", and "image_search_word".`
    // const prompt = `Today's date is ${formattedDate}. At the end of this prompt, I'll provide you with some text for our charity's Twitter handle. Write a fun tweet about it, keeping it within 280 characters. Ensure all provided information is included in the tweet. Write the tweet in the same language as the original text.

    // If the text is about some good news, an ask for help, or a position we want to recruit, include a catchy title (less than 6 words, including 'free' if applicable) and a brief subtitle (less than 18 words).
    
    // If you think the text is about an upcoming event, it's vitally important that you check if the text does not include information like date, time and location about the event. 

    // If the text mentions an event but doesn't specify a date, or a time, or a location for the event, indicate that date, time or location is missing in the "missing" field of the output JSON. 

    // If the text is about an upcoming event, include a catchy title and a brief subtitle. If the event has a specified date, time, or location included in the text, include them in the subtitle. Please DO NOT put a date, time or location if it wasn't included in the text. 
    
    // Output a valid JSON object with the "tweet", "title", "subtitle", "image_search_word", and "missing" fields. If no information is missing, leave the "missing" field blank.
    
    // The input text is "${inputText}".`
    //`Today's date is ${formattedDate}. At the end of this prompt I am going to give you some text that we want you to write a fun tweet for our charity's Twitter handle about.” It could be some good news, an ask for help, a position we want to recruit or an upcoming event. Keep it to 280 characters, but make sure all information provided in the original text is contained within the tweet. Please write the tweet in the same language as it is written in. Provide also in the language it was written in, a catchy title (less than 6 words, including 'free' if applicable), a brief subtitle (less than 18 words, and if its an event include day, month, time, and location), and ONE word for image search. Output a valid JSON object with the "tweet", "title", "subtitle", and "image_search_word". The text is "${inputText}"` 
    //`Today's date is ${formattedDate}. At the end of this prompt I am going to give you some text that we want you to write a fun tweet for our charity's Twitter handle about.” It could be some good news, an ask for help, a position we want to recruit or an upcoming event. Keep it to 280 characters, but make sure all information provided in the original text is contained within the tweet. Please write the tweet in the same language as it is written in. Provide a catchy title (less than 6 words, including 'free' if applicable), a brief subtitle (less than 18 words, and if its an event include day, month, time, and location), and ONE word for image search. Output a valid JSON object with the "tweet", "title", "subtitle", and "image_search_word". The text is "${inputText}"`;
    
    
  //   const prompt = `Today's date is ${formattedDate}. I will provide you with some text for our charity's Twitter handle. Please analyze the text to determine if it's about a good news, a request for help, a position we want to recruit, or an upcoming event. Based on the text type, generate the following:
    
  //  - a suitable tweet of no less than 20 words, ensuring all information provided in the original text is included but within 280 characters. 

  //  - In addition to the tweet text, if the original text is about some good news, a request for help, or a recruitment position, provide a catchy title (less than 6 words) and a brief subtitle (less than 18 words). 

  //  - In addition to the tweet text, if the original text is about an upcoming event, provide a catchy title (less than 6 words, including 'free' if applicable) and a brief subtitle (less than 18 words). 
   
  //  - In addition, if the original text is about an upcoming event, please analyze the original text to check there is a date, a time and a location. 
    
  //   Some examples of missing data for an upcoming event are:
  //   "Join us for a fun day!" (missing date, time, and location),
  //   "Basketball competition at Meadows Community centre" (missing date and time),
  //   "Free bbq on Monday. Proceeds go to Meadows Foodbank" (missing time and location),
  //   "We are available at 2pm for employment help" (missing date and location),
  //   "Park run at Embankment Recreation Ground next Saturday" (missing time),
  //   "Join us at 10am on March 22nd for our fun drumming workshop" (missing location),
  //   "Drumming workshop for kids every Friday in June at AMC Gardens" (missing date).

  //   - In addition to the tweet text, title, subtitle and missing data, provide one word in english language to use in an image search

  //   Output a valid JSON object with the "tweet", "title", "subtitle", "image_search_word", and "missing" fields. 
    
  //   The input text is "${inputText}”.`

      const prompt = `Today's date is ${formattedDate}. I will provide you with some text for our charity's Twitter handle. Please analyze the text to determine if it's about a good news, bad news, a request for help, a position we want to recruit, or an upcoming event. Based on the text type, generate the following:
    
   - a fun social media post of no less than 20 words, ensuring ALL information provided in the original text is included, but within 280 characters. Please DO NOT include hashtags, but you can include emojis.

   - In addition to the tweet text, if the original text is about some good news, a request for help, or a recruitment position, provide a catchy title (less than 6 words) and a brief subtitle (less than 18 words). 

   - In addition to the tweet text, if the original text is about an upcoming event, provide a catchy title (less than 6 words, including 'free' if applicable) and a brief subtitle of less than 18 words (including day and month, time and location if available). Please DO NOT include any date, time, or location if not provided in the original text.

   - In addition, if the original text is about an upcoming event, please set the "missing" field in the JSON output to "event". 

   - In addition to the tweet text, title, subtitle and missing data, provide one word in english language to use in an image search.

    Output a valid JSON object with the "tweet", "title", "subtitle", "image_search_word", and "missing" fields. 
    
    The input text is "${inputText}”.`
    
    // ChatGPT functions
  
    const apiKey = keyStore.OPENAI_API_KEY;
    const endpoint = keyStore.OPENAI_CHATGPT_URL;
  
  
  
    // Example parameters
    const parameters = {
    model: 'gpt-3.5-turbo-instruct',
    max_tokens: 500
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

        JSONstore.setIsLoading(true);
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
          debugLog(data)
          let jsonData: any;
          // Parse the returned text into a JSON object
          try{
          // Call the useJsonStore hook to access the store and its setter function
          debugLog("Raw text from the response\n\n" + data.choices[0].text)

          //const text = window.prompt("",data.choices[0].text) as string;

          const text = data.choices[0].text;

          // Find the index of the first opening curly bracket
          let startIndex = text.indexOf('{');
          const needsCurlies = text.indexOf('.') === 0 && startIndex === -1;
          // Find the index of the last closing curly bracket
          const endIndex = text.lastIndexOf('}') + 1;
          debugLog("start - " + startIndex + ", end - " + endIndex);
          // Extract the JSON string if Its a bad request take the middle out
          const jsonString = (needsCurlies) ? "{" + text.slice(1,text.length) + "}" : text.slice(startIndex, endIndex);
          // const jsonString = text.slice(startIndex, endIndex);
          debugLog(jsonString)
          // Normalize keys to lowercase in the JSON string
          const normalizedJSONString = normalizeJSONStringKeys(jsonString);
  
          if (normalizedJSONString === '{}'){
            debugLog('FAIL in JSON string - try again');
            return;
          }else{
            // Parse the JSON string into an object
            try {
              jsonData = JSON.parse(normalizedJSONString);
              debugLog("parsed JSONdata - \n\n" + jsonData)
            }catch(error){
              debugLog('Error parsing JSON: - ' + error);
                //try again if fail and component still mounted
                
                // Additional logic...
                //if (isMounted){
                return;
            }
          }         




  
          const API_URL = keyStore.UNSPLASH_URL_COLLECTION;
          const API_URL2 = keyStore.UNSPLASH_URL_ALL;
  
      
          
            const query = jsonData?.image_search_word;
            if (query !== undefined){
              imgStore.setQuery(query);
            }
            if(imgStore.selectedImageURL ==='' && query !== undefined){
                //console.log(query)
                const image_response = await fetch(API_URL + query);
                const image_data= await image_response.json();
                imgStore.setPhotos(image_data.results)
                debugLog(image_data);
                let firstImage = image_data?.results[0];
                //do we need to retry?
                if (!firstImage && query !== undefined) {
                  // Rerun the routine with a different URL
                  debugLog("retry photo fetch from all of Unsplash");
                  const new_image_response = await fetch(API_URL2 + query);
                  const new_image_data = await new_image_response.json();
                  imgStore.setPhotos(new_image_data.results);
                  firstImage = new_image_data?.results[0];
                  debugLog(new_image_data);
              }
                if (firstImage){
                  const response = await fetch(firstImage.urls.regular);
                  const blob = await response.blob();
                  const reader = new FileReader();
                  reader.onload = () => {
                    debugLog("image loads")
                      const dataURL = reader.result as string;
                      //console.log("image loads - "+ dataURL)
                      //dataURL && setImageData(dataURL);
                      
                      if (dataURL) {
                        if (isMounted){
                          //are we still on this page
                          if (imgStore.selectedImageURL === '') imgStore.setPreSelectedImage(firstImage.id, firstImage.description, dataURL, firstImage.links.download_location);
                        }else{
                          //we are on the nxt page
                          if (imgStore.selectedImageURL === '') imgStore.setSelectedImage(firstImage.id, firstImage.description, dataURL, firstImage.links.download_location);
                        }
                      }
                  };
                  reader.readAsDataURL(blob);
                }
            }
          } catch (error) {
              console.error('Error fetching image:', error);
          }
              
          //Turn off skeleton on preview and edit page
          JSONstore.setIsLoading(false);

          if (jsonData?.tweet) return jsonData;
  
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

    // const [text, setText] = us eState<string>('');
     const [prevText, setPrevText] = useState<string>('');

    const { originalText, setOriginalText } = useJsonStore(); 



    /* text area functions */
      const handleBlur = async (event: ChangeEvent<HTMLTextAreaElement>) => {
        const passedText = event.target.value;
        //Do we only do one request, or have an option to re-generate?
        if (JSONstore.jsonData.tweet !=='') return;
        setPrevText(passedText);
        if (passedText !== '' && passedText !== prevText) {
            //console.log('Textarea blurred ' + event.target.value);
            // Additional logic...
            if(selectedGPTCB){
              let response = await callChatGPTAPI(event.target.value);
              if (response){
                //failed
                console.log("Succesfully returned object before set - " + response);
                if (response) setJsonData(response);
              }else{
                //try again
                response = await callChatGPTAPI(event.target.value);
                if (response) setJsonData(response);
              }
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
        const selectedTitleCB = useSelectedUIElementsStore((state) => state.selectedTitleCB);
        const toggleTitleCB = useSelectedUIElementsStore((state) => state.toggleTitleCB);

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
            <div className='flex my-2 w-full items-center justify-start md:justify-start items-center'>
                <div>
                    <Checkbox 
                        id='auto-produce-text' 
                        className='mr-2'
                        checked={selectedGPTCB}
                        onClick={toggleGPTCB}
                    />
                    <Label htmlFor='auto-produce-text' className='md:text-lg whitespace-nowrap mr-1.5'>Automatically help me with my post</Label>
                </div>
                <div>
                    <a className='cursor-pointer'><FiHelpCircle className='text-blue-500 text-lg'/></a>
                </div>
            </div>
            <div>
                <Label htmlFor='content-type' className='md:text-lg hidden'>What the post is about</Label>
                <Textarea id="content-type" onBlur={handleBlur} value={originalText} onChange={handleChange} className='h-24 mt-2 bg-white text-base md:text-lg' placeholder='Put the text of what you want to tell everyone about here &#x1f4e2;' />
            </div>
            <Separator className='my-4 mt-2' />
            <ImageSearchPage mode="local"/>
            <Separator className='my-4' />
            <div className='flex my-2 w-full justify-between md:justify-start items-center'>
                <div>
                    <Checkbox 
                            id='include-title' 
                            className='mr-2'
                            checked={selectedTitleCB}
                            onClick={toggleTitleCB}
                        />
                    <Label htmlFor='include-title' className='md:text-lg whitespace-nowrap'>Include title and subtitle</Label>
                </div>
                {/* Put this button if there is more than one logo in store */}
                {/* <div>
                    <Button type="submit" variant="outline" onClick={() => toHelper(0)} className='rounded-full ml-2 py-0 px-2 h-7'>Change</Button>
                </div> */}
            </div>
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