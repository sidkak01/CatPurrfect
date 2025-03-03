import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import cors from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { app as backendApp } from './backend/app';
import { connectToMongo, disconnectMongo } from './backend/mongo';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
app.use(cors());
app.use(express.json());

const angularApp = new AngularNodeAppEngine();

// Mount backend API - this needs to come before the static files middleware
app.use('/', backendApp);

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 5000;
  
  // Connect to MongoDB when server starts
  connectToMongo()
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
      });
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1);
    });
    
  // Handle shutdown gracefully
  process.on('SIGINT', async () => {
    await disconnectMongo();
    process.exit(0);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
