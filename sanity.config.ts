'use client';
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from '@sanity/vision';
import { PluginOptions, defineConfig } from 'sanity';
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash';
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId, studioUrl } from '@/sanity/lib/api';
import { pageStructure, singletonPlugin } from '@/sanity/plugins/settings';
import { assistWithPresets } from '@/sanity/plugins/assist';
import spillested from '@/sanity/schemas/documents/spillested';
import arrangement from '@/sanity/schemas/documents/arrangement';
import settings from '@/sanity/schemas/singletons/settings';
import { resolveHref } from '@/sanity/lib/utils';

const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation;

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: [
      // Singletons
      settings,
      // Documents
      arrangement,
      spillested,
    ],
  },
  plugins: [
    presentationTool({
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/arrangement/:slug',
            filter: `_type == "arrangement" && slug.current == $slug`,
          },
        ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'caution',
          }),
          arrangement: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('arrangement', doc?.slug)!,
                },
                homeLocation,
              ],
            }),
          }),
        },
      },
      previewUrl: { previewMode: { enable: '/api/draft' } },
    }),
    structureTool({ structure: pageStructure([settings]) }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([settings.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Sets up AI Assist with preset prompts
    // https://www.sanity.io/docs/ai-assist
    assistWithPresets(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    process.env.NODE_ENV === 'development' &&
      visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
});
