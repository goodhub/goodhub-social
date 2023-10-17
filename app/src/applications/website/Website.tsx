/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { FiGlobe, FiSettings } from 'react-icons/fi';
import { Container, Title } from '../../components';
import { ApplicationConfig, useApplication } from '../utils';

interface WebsiteFormFields {
  headline: string;
  color: string;
}

const Website: FC = () => {
  const { organisation, client } = useApplication('website');

  const { data } = client.website.infoForOrganisation.useQuery({ organisationId: organisation.id });
  const updateInfoForOrganisation = client.website.updateInfoForOrganisation.useMutation();

  const { register, handleSubmit, watch, setValue } = useForm<WebsiteFormFields>({ defaultValues: data });

  const onSubmit = (data: WebsiteFormFields) => {
    updateInfoForOrganisation.mutate({
      organisationId: organisation.id,
      ...data
    });
  };

  return (
    <div className="flex flex-col gap-4 text-gray-700">
      <div>
        <Title Icon={FiGlobe}>Website</Title>
        <p>Instead of paying and managing a complicated website</p>
      </div>
      <Container className="p-6">
        <h2 className="text-xl font-semibold">Website configuration</h2>
        <form className="flex flex-col gap-3 mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div></div>
          <div></div>
          <button type="submit" className="mt-4">
            Save
          </button>
        </form>
      </Container>
    </div>
  );
};

const Breakout: FC = () => {
  const { organisation, client } = useApplication('website');
  const { data } = client.website.infoForOrganisation.useQuery({ organisationId: organisation.id });

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
      <div style={{ background: data?.color }} className="w-full">
        <div className="w-full max-w-6xl mx-auto px-6 py-16 flex justify-center items-centers">
          <h1 className="text-white text-4xl font-bold">{data?.headline}</h1>
        </div>
      </div>
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
  name: 'Website',
  stage: 'GeneralAvailability',
  // Navigation is a list of links that will be rendered in the sidebar
  navigation: [
    {
      name: 'Website configuration',
      path: 'website',
      icon: FiSettings,
      children: [
        {
          name: 'View website',
          path: '/website/breakout',
          icon: FiGlobe
        }
      ]
    }
  ],

  // Routes are the actual routes that will be rendered in the application
  routes: {
    // These routes will be rendered inside the main application frame
    dashboard: [{ path: 'website', element: <Website /> }],
    // These routes will be rendered as a standalone page with no frame
    standalone: [{ path: '/website/breakout', element: <Breakout /> }]
  }
} satisfies ApplicationConfig;
