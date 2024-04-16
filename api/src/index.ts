import { config } from 'dotenv';
config();

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { router } from './trpc.js';

const { default: Example } = await import('./applications/example/Example.js');

const routes = router({
  [Example.id]: Example.router
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
