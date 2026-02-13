import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const immersion = defineType({
  name: 'immersion',
  title: 'Immersion / Workshop',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of the immersion or workshop',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (auto-generated from title)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      hidden: true, // Hidden from Studio UI
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      description: 'Is this an immersion or a workshop?',
      options: {
        list: [
          { title: 'Immersion', value: 'immersion' },
          { title: 'Workshop', value: 'workshop' },
        ],
        layout: 'radio',
      },
      initialValue: 'immersion',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "2 Days", "6 Hours (10AM - 4PM)", "3 Hours"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'e.g., "English", "English and Hindi"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'prerequisite',
      title: 'Prerequisite',
      type: 'text',
      description: 'Age requirements and prior experience needed. Use line breaks for multiple lines.',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      description: 'e.g., "In-person", "Online", "Hybrid"',
      options: {
        list: [
          { title: 'In-person', value: 'In-person' },
          { title: 'Online', value: 'Online' },
          { title: 'Hybrid', value: 'Hybrid' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'text',
      description: 'Detailed description of the immersion/workshop',
      rows: 6,
      validation: (Rule) => Rule.required().min(50),
    }),
    defineField({
      name: 'whatToExpect',
      title: 'What To Expect',
      type: 'array',
      description: 'List of key takeaways or experiences',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Featured image for the card',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'Text for the call-to-action button',
      initialValue: 'Reserve your spot',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the carousel',
      initialValue: 0,
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Set to true to make this visible on the website',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      published: 'published',
      media: 'image',
    },
    prepare(selection) {
      const { title, type, published, media } = selection
      const typeLabel = type === 'immersion' ? '🌿 Immersion' : '🔧 Workshop'
      return {
        title: title,
        subtitle: `${typeLabel} ${published ? '✓ Published' : '○ Draft'}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
