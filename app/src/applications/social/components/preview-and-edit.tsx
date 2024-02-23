import React, { FC, useState } from 'react';

import { useSelectedPartnersStore, useSelectedUIElementsStore, useSocialWizardStore, useJsonStore } from '../social-wizard';
import partnerData from '../base-data/partner-organisations';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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

    const imgStore = useSocialWizardStore();
    const selectedImageURL = imgStore.selectedImageURL;

    const uiStore = useSelectedUIElementsStore();
    const useLogo = uiStore.selectedLogoCB;
    const usePartnerLogos = uiStore.selectedPartnerCB;

    const JSONStore = useJsonStore();

    const GPTObject = JSONStore.jsonData;
    //console.log(GPTObject)

    return(
        <div className='w-full '>
            <div className='flex h-[21.5rem] md:h-96 justify-center'>
            <div style={{ backgroundImage: `url(${selectedImageURL})` }} className={`mx-auto aspect-square border border-black bg-cover`}>
                    <div className='w-full h-full flex flex-col gap-2 p-2'>
                        <div className="w-full h-auto flex flex-row justify-start max-h-8" id="icon">
                            {/* Icon in here */}
                            {useLogo && (
                                <div className=''>
                                    <img className='w-10 h-10' src="https://www.nottinghamcvs.co.uk/sites/default/files/ncvs%20purple%20png.png" />
                                </div>
                            )}
                        </div>
                        <div className="w-full h-full flex flex-col p-2 items-center" id="main-content">
                            {/* Title subtitle in here */}

                            {/* h1 {

                                padding-left:0px
                                box-shadow: 7px 0 0 #FE8020;
                                -webkit-box-decoration-break: clone;
                                box-decoration-break: clone;
                            } */}
                            <div id="title" className='relative text-center h-full w-full'>
                                {/* Repeat headers one with opacity at 50% and the other with no background color.
                                This saves a problem of getting the line heights exactly right so they butt up to each line */}
                                <div className='absolute rotate-[-1deg] skew-[-2deg]'>
                                    <h1 className='font-serif pr-0 shadow-[7px_0_0_0_rgb(76,29,149)] box-decoration-clone text-[24px] leading-[30px] whitespace-pre-wrap p-[6px] inline opacity-50 text-white bg-[rgb(76,29,149)]'>
                                        {GPTObject?.title}
                                    </h1>
                                </div>
                                <div className='absolute rotate-[-1deg] skew-[-2deg]'>
                                    <h1 className="font-serif pr-0 box-decoration-clone text-[24px] leading-[30px] whitespace-pre-wrap p-[6px] inline bg-transparent text-white">
                                        {GPTObject?.title}
                                    </h1>
                                </div>
                            </div>
                            <div id="subtitle" className='relative text-center h-full w-full'>
                                {/* Repeat headers one with opacity at 50% and the other with no background color.
                                This saves a problem of getting the line heights exactly right so they butt up to each line */}
                                <div className='absolute bottom-2'>
                                    <h1 className='font-serif pr-0 shadow-[7px_0_0_0_rgb(249,115,22)] box-decoration-clone text-[14px] leading-[21px] whitespace-pre-wrap p-[6px] inline opacity-50 text-white bg-[rgb(249,115,22)]'>
                                        {GPTObject?.subtitle}
                                    </h1>
                                </div>
                                <div className='absolute bottom-2 '>
                                     {/* rotate-[1deg] skew-[2deg]  */}
                                    <h1 className="font-serif pr-0 box-decoration-clone text-[14px] leading-[21px] whitespace-pre-wrap p-[6px] inline bg-transparent text-white">
                                        {GPTObject?.subtitle}
                                    </h1>
                                </div>
                            </div>                            
                        </div>
                        <div className="w-full h-auto flex gap-3 flex-row justify-end items-center p-2 overflow-hidden max-h-8 " id="partners">
                            {usePartnerLogos && (
                                partnerItems.map((partner, index) => (
                                    selectedPartners.includes(partner.name) && (
                                        <div className=' ' key={index}>
                                            <img src={`data:image/svg+xml,${encodeURIComponent(partner.svg)}`} className='w-24' alt={partner.description} />
                                        </div>
                                    )
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>  
            <div className='flex mt-2 md:mt-4 w-full justify-center items-center'>
                <div>
                    <span className='italic'>We added a picture for you</span>
                </div>
                <div>
                    <Button type="submit" variant="outline" onClick={() => toHelper(3)} className='rounded-full ml-2 py-0 px-2 h-7'>Change</Button>
                </div>
            </div> 
            <Separator className='my-2 md:my-4' />
            <div>
                <Label htmlFor='post-content' className='md:text-lg hidden'>Main text of post</Label>
                <Textarea id="post-content" defaultValue={GPTObject?.tweet} className='h-36 mt-2 bg-white md:text-lg' placeholder='This is the main text of your post' />

            </div>
        </div>

    )
}

export default PreviewAndEdit;