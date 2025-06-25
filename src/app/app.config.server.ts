import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
// import { provideServerRouting } from '@angular/ssr';
import { provideRouter } from '@angular/router';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // provideServerRouting(serverRoutes),
    provideRouter(serverRoutes)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
