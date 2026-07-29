import { defineField, defineType } from 'sanity'

export const thought = defineType({
  name: 'thought',
  title: 'Thought',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      description: 'The thought or pondering text',
      validation: (Rule) => Rule.required().min(10).custom((text) => {
        if (!text) return true;
        const wordCount = (text as string).trim().split(/\s+/).filter(Boolean).length;
        if (wordCount > 2000) return `Content must be 2000 words or fewer (currently ${wordCount} words)`;
        return true;
      }),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Optional image for this thought',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'The date this thought was published',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Set to true to make this thought visible on the website',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'content',
      media: 'image',
      published: 'published',
    },
    prepare(selection) {
      const { title, media, published } = selection
      return {
        title: title?.substring(0, 50) + (title?.length > 50 ? '...' : ''),
        subtitle: published ? '✓ Published' : '○ Draft',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
