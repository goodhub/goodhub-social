/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import { FiSettings, FiWind } from 'react-icons/fi';
import { Container } from '../../components';
import { ApplicationConfig, useApplication } from '../utils';

const Example: FC = () => {
  const { user, client } = useApplication('example');
  const { data } = client.example.info.useQuery({ userId: user.id });

  const echo = client.example.echo.useMutation();

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl font-semibold">Example</h1>
      <Container className="p-6 flex flex-col justify-center gap-4">
        <p>{data?.description}</p>
        <button onClick={() => echo.mutate({ message: 'Hello world!' })}>Echo</button>
      </Container>
    </div>
  );
};

export default {
  name: 'Example',
  stage: 'Development',
  // Navigation is a list of links that will be rendered in the sidebar
  navigation: [
    {
      name: 'Example',
      path: 'example',
      icon: FiSettings,
      children: [
        {
          name: 'Breakout',
          path: '/example/breakout',
          icon: FiWind
        }
      ]
    }
  ],

  // Routes are the actual routes that will be rendered in the application
  routes: {
    // These routes will be rendered inside the main application frame
    dashboard: [{ path: 'example', element: <Example /> }],
    // These routes will be rendered as a standalone page with no frame
    standalone: [{ path: '/example/breakout', element: <p>This is a standalone page</p> }]
  }
} satisfies ApplicationConfig;
