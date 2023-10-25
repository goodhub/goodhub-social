import { config } from 'dotenv';
config();

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { router } from './trpc.js';

const { default: Example } = await import('./applications/example/Example.js');
const { default: Website } = await import('./applications/website/Website.js');

const routes = router({
  [Example.id]: Example.router,
  [Website.id]: Website.router
});

export type AppRouter = typeof routes;

const server = createHTTPServer({
  middleware: cors(),
  router: routes
});

const port = Number(process.env.PORT);
if (isNaN(port)) {
  throw new Error('PORT is not a number');
}

server.listen(port);
