import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const training = defineType({
  name: 'training',
  title: 'Training Program',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of the training program',
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
      name: 'duration',
      title: 'Duration',
      type: 'text',
      description: 'Duration details. Use line breaks for multiple lines (e.g., "Total 30 hours\\n3-hour Classes\\nTwice a month")',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'text',
      description: 'Requirements to join. Use line breaks for multiple lines.',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      description: 'e.g., "In-person", "Online", "Hybrid - Online & In-person"',
      options: {
        list: [
          { title: 'In-person', value: 'In-person' },
          { title: 'Online', value: 'Online' },
          { title: 'Hybrid - Online & In-person', value: 'Hybrid - Online & In-person' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'e.g., "English", "English and Hindi", "English & Hindi"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
      description: 'Brief description of the training program',
      rows: 4,
      validation: (Rule) => Rule.required().min(30),
    }),
    defineField({
      name: 'whatYoullLearn',
      title: "What You'll Learn",
      type: 'array',
      description: 'List of key learning outcomes',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'Text for the call-to-action button',
      initialValue: 'Enroll in this Training',
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
      format: 'format',
      published: 'published',
    },
    prepare(selection) {
      const { title, format, published } = selection
      return {
        title: title,
        subtitle: `${format || 'No format'} ${published ? '✓ Published' : '○ Draft'}`,
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
