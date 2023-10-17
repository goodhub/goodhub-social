import { config } from 'dotenv';
config();

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { router } from './trpc';

const { default: Example } = await import('./applications/example/Example');
const { default: Website } = await import('./applications/website/Website');

const routes = router({
  [Example.id]: Example.router,
  [Website.id]: Website.router
});

export type AppRouter = typeof routes;

const server = createHTTPServer({
  middleware: cors(),
  router: routes
});

server.listen(3001);
