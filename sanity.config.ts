'use client'

/**
 * Sanity Studio Configuration
 * 
 * This file configures the Sanity Studio for content management.
 * Run `npx sanity dev` to start the local studio.
 * Run `npx sanity deploy` to deploy a hosted studio.
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

// Default values for development - these will be overridden by env vars in production
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'w9hoo18a'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'antar-pravaah-studio',
  title: 'Antar Pravaah CMS',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2026-01-31' }),
  ],

  schema,
})
