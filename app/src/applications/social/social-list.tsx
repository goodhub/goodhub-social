import { FC, useState, useEffect} from 'react';
import { FiCalendar, FiFacebook, FiInstagram, FiLinkedin, FiTwitter, FiGlobe} from 'react-icons/fi';
import { SiThreads } from 'react-icons/si';
import { useAuthStore } from '@/layout/Frame';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
  
  const SocialList: React.FC = () => {

    const authStore = useAuthStore();

    if (!authStore.isAuthorised){
      //console.log(authStore.isAuthorised);
      return;
    }

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className='w-full flex flex-col bg-orange-100 justify-between h-full'>
                <CardHeader>
                    <CardDescription className='flex mt-2 text-black'>
                        <span className='inline-block text-base mr-3 font-semibold'>Post: Thursday 10am</span>
                        <FiGlobe className='m-1' size='16'></FiGlobe>
                        <FiFacebook className='m-1'  size='16'></FiFacebook>
                        <FiInstagram className='m-1'  size='16'></FiInstagram>
                        <FiLinkedin className='m-1'  size='16'></FiLinkedin>
                        <SiThreads className='m-1'  size='16'></SiThreads>
                        <FiTwitter className='m-1'  size='16'></FiTwitter>
                    </CardDescription>
                    <img alt="" src="https://www.goodhub.org.uk/basketball_post.png" />
                </CardHeader>
                <CardContent>
                    <p>Dribble your way to the Meadows Community Centre next Sat for our basketball comp – only £5/team & FREE for spectators! Food and drink available, and music by DJ Pulley. #HoopsForHope</p>
                </CardContent>
                <CardFooter className='flex'>
                    <div className='flex gap-1 w-full justify-end'>
                        <Button type="submit" variant="outline" className='rounded-full ml-2 py-0 px-2 h-7'>Change when or where to post</Button>
                    </div>
                </CardFooter>
            </Card>
            <Card className='w-full'>
                <CardHeader>
                <CardDescription className='text-base inline-block mt-2 italic'>
                    Posted: Last Friday
                </CardDescription>
                    <img alt="" src="https://www.goodhub.org.uk/post_example.png" />
                </CardHeader>
                <CardContent>
                    <p>If you would like to make a donation to the Meadows Foodbank over the next couple of weeks, our most needed items are Cereal, Coffee, Squash, Tinned Fruit, Shampoo. Thank you for your continued support #MeadowsFoodbank</p>
                </CardContent>
                <CardFooter >
                    <div className='flex gap-1 w-full justify-end'>
                        <div className='flex gap-2'>
                            <button className=' rounded bg-gray-100 drop-shadow'>
                                <FiGlobe className='m-1' size='24'></FiGlobe>
                            </button>
                            <button className=' rounded bg-gray-100 drop-shadow'>
                                <FiFacebook className='m-1'  size='24'></FiFacebook>
                            </button>
                            <button className=' rounded bg-gray-100 drop-shadow'>
                                <FiInstagram className='m-1'  size='24'></FiInstagram>
                            </button>
                            <button className=' rounded bg-gray-100 drop-shadow'>
                                <FiLinkedin className='m-1'  size='24'></FiLinkedin>
                            </button>
                            <button className=' rounded bg-gray-100 drop-shadow'>
                                <SiThreads className='m-1'  size='24'></SiThreads>
                            </button>
                            <button className=' rounded bg-gray-100 drop-shadow'>
                                <FiTwitter className='m-1'  size='24'></FiTwitter>
                            </button>
                        </div>
                    </div>
                </CardFooter>
            </Card>

        </div>
    )
  }

  export default SocialList;