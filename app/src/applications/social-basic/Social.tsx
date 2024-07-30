/* eslint-disable react-refresh/only-export-components */
import { Button } from '@/components/ui/button';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { FiGlobe, FiSettings } from 'react-icons/fi';
import { ApplicationConfig, useApplication } from '../utils';

interface WebsiteFormFields {
  headline: string;
  color: string;
}

const Social: FC = () => {
  const { organisation, client } = useApplication('social');

  const [date] = client.social.color.useSuspenseQuery({ userId: 1, shade: 'dark' });
  const echo = client.social.echo.useMutation();
  const { register, handleSubmit, watch, setValue } = useForm<WebsiteFormFields>();

  const onSubmit = (data: WebsiteFormFields) => {
    echo.mutateAsync({ message: 'Hello world!' });
  };

  return (
    <div className="flex flex-col gap-4 text-gray-700">
      <div>
        <h2>Website</h2>
        <p>Instead of paying and managing a complicated website</p>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold">Website configuration</h2>
        <form className="flex flex-col gap-3 mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div></div>
          <div></div>
          <Button variant="outline" type="submit" className="mt-4">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

const Breakout: FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <header>
        <div className="w-full max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Website</h1>
          <div className="flex gap-4">
            <a href="/website">Edit</a>
            <a href="/website/breakout">Breakout</a>
          </div>
        </div>
      </header>
      <div>
        <div className="w-full flex-col max-w-6xl mx-auto px-6 py-8 flex justify-center items-centers">
          <h1 className="text-xl font-bold">Content</h1>
          <p className="text-gray-700">This is the content</p>
        </div>
      </div>
    </div>
  );
};

export default {
  name: 'Social',
  stage: 'GeneralAvailability',
  // Navigation is a list of links that will be rendered in the sidebar
  navigation: [
    {
      name: 'Social configuration',
      path: 'social-basic',
      icon: FiSettings,
      children: [
        {
          name: 'View social',
          path: '/social-basic/breakout',
          icon: FiGlobe
        }
      ]
    }
  ],

  // Routes are the actual routes that will be rendered in the application
  routes: {
    // These routes will be rendered inside the main application frame
    dashboard: [{ path: 'social-basic', element: <Social /> }],
    // These routes will be rendered as a standalone page with no frame
    standalone: [{ path: '/social-basic/breakout', element: <Breakout /> }]
  }
} satisfies ApplicationConfig;
