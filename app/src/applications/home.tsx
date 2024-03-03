

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Button } from "@/components/ui/button"
  

  const Home = () => {
    return  <div>
              <Card className="w-full md:w-3/5 max-w-full m-auto">
        <CardHeader className='px-4 py-5 md:px-6 md:py-6'>
          <CardTitle className='text-3xl'>Welcome!</CardTitle>
          <CardDescription className='text-base md:text-xl'>
            We help community organisations with their social media and websites for free.<br/>
            <span className='pt-2 inline-block'><a className='text-blue-600 cursor-pointer'>Register here</a>, or sign in below</span>
          </CardDescription>
        </CardHeader>
        <CardContent className='px-4 md:px-6'>
          <form>
          <img className='w-full h-28 md:h-36 object-cover rounded-xl aspect-video mb-4' src='https://www.goodhub.org.uk/organisations_hero_small.jpg' />
            <div className="grid w-full items-center gap-4 ">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className='text-base md:text-lg'>Email</Label>
                <Input className='text-base md:text-lg' id="name" type="email" placeholder="Your email address" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className='text-base md:text-lg' htmlFor="password">Password</Label>
                <Input className='text-base md:text-lg' id="password" type="password" placeholder="Password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end px-4 md:px-6">
          <Button className='text-base md:text-lg'>Sign in</Button>
        </CardFooter>
      </Card>
            </div>
  }

  export default Home;