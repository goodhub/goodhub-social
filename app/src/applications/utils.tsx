import { Outlet, RouteObject } from 'react-router';

export interface NavigationObject {
  path: string;
  name: string;
  icon: IconType;
  children?: NavigationObject[];
}

export interface ApplicationConfig {
  name: string;
  stage: 'GeneralAvailability' | 'Experiment' | 'Development';
  navigation: NavigationObject[];
  routes: {
    dashboard: RouteObject[];
    standalone?: RouteObject[];
  };
}

import type { AppRouter } from '../../../api/src';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { createTRPCReact } from '@trpc/react-query';
import { Suspense, useState } from 'react';
import { IconType } from 'react-icons';

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3001',
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: 'Bearer [ANYTHING]'
            };
          }
        })
      ]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export const useApplication = (id: keyof AppRouter['_def']['procedures']) => {
  return {
    user: {
      id: 1
    },
    organisation: {
      id: 1
    },
    app: { id },
    client: trpc
  };
};
