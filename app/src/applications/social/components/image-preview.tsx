import React, { FC, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { FiXSquare } from "react-icons/fi";

interface ImagePreviewProps{
    selectedImageURL: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ selectedImageURL}) => {

    const [open, setOpen] = useState(false);
    const [previewAspectRatio, setAspectRatio] = useState("1/1");

    const handleThumbnailClick = (aspectRatio:string) => {
            setOpen(true);
            setAspectRatio(aspectRatio);
    }
        
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <div className="photo-preview flex flex-auto gap-1 md:gap-3 justify-center ">
                {/* Render the image four times with different aspect ratios */}
                {["9/16", "1/1", "4/3", "16/9"].map((aspectRatio, index) => (
                    
                    <Dialog.Trigger onClick={() => handleThumbnailClick(aspectRatio)} style={{aspectRatio:aspectRatio}} className={`relative result w-auto max-h-24 h-16 md:h-24 lg:h-24 bg-slate-400`} key={index}>
                        {selectedImageURL && (
                            <>
                                <img className="h-full w-full object-cover border-black border-4" src={selectedImageURL} alt={'Selected Photo'} />
                                <div className='w-auto h-auto bg-black text-white absolute right-0 bottom-0 text-xs p-1'>{aspectRatio}</div>
                            </>
                        )}
                    </Dialog.Trigger>
                ))}
            </div>
                <Dialog.Portal>
                    <Dialog.Overlay className='fixed inset-0 bg-black/50'/>
                    <Dialog.Content style={{aspectRatio:previewAspectRatio}} className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black w-[calc(90vw)] h-auto max-h-[calc(80vh)] md:h4/6 md:w-auto lg:h-4/6  lg:w-auto  text-center aspect-[${previewAspectRatio}]`}>
                    <Dialog.Title className='text-white p-2'>
                        Your selected image 
                    </Dialog.Title>
                    {selectedImageURL &&(
                            <img className={`h-full w-auto object-cover border-black m-auto max-h-[90vh] border-2`} style={{aspectRatio:previewAspectRatio}} src={selectedImageURL} alt={'Selected Photo'} />
                    )}
                    <Dialog.Close>
                        <FiXSquare size={24} className='m-2 absolute top-0 right-0' style={{color:'white'}} />
                    </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        
    );
};

export default ImagePreview;