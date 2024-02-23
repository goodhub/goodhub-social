import React, { useState, useEffect} from 'react';
import partnerData from '../base-data/partner-organisations';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

import { useSelectedPartnersStore } from '../social-wizard'; // Path to your store
import { Label } from '@/components/ui/label';



// Iterate over the keys of the partnerData object
const partnerItems = Object.entries(partnerData).map(([key, value]) => {
    return {
        name: key, // Assuming the key is the name of the partner
        description: value.description,
        svg: value.svg
    };
});



const PartnerList: React.FC = () => {

    const store = useSelectedPartnersStore();

    const selectedPartners = store.selectedPartners;
    const previousSelectedPartners = store.previousSelectedPartners
    const togglePartnerSelection = store.togglePartnerSelection;

    useEffect(() => {
        // // Function to capture the current state into a previous state variable
        store.setPreviousSelectedPartners(selectedPartners)
        // Return a cleanup function if needed
        return () => {
            // Perform cleanup here if necessary
        };
    }, []); // Empty dependency array ensures the effect runs only once after initial render


    return (
        <div>
            {partnerItems.map((partner, index) => (
                <div key={partner.name}>   
                    <div className='flex my-2 w-full justify-start items-center max-h-12 h-12 overflow-hidden' >
                        <Checkbox      
                            checked={selectedPartners.includes(partner.name)}
                            onClick={() => togglePartnerSelection(partner.name)}
                            id={`partner-${partner.name}`}
                        />
                        <Label htmlFor={`partner-${partner.name}`} className="flex items-center text">
                            <img src={`data:image/svg+xml,${encodeURIComponent(partner.svg)}`} className='w-24 mx-2' alt={partner.description} />
                            <div className='text md:text-lg'>{partner.description}</div>
                        </Label>
                    </div>
                    <Separator />
                </div>
            ))}
        </div>
    );
}

export default PartnerList;
