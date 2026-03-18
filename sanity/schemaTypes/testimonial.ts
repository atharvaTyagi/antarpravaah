import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name of the person giving the testimonial',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'workshop',
      title: 'Workshop / Service',
      type: 'string',
      description: 'The workshop or service they attended',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'text',
      description: 'The testimonial content',
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'The date this testimonial was published',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Set to true to make this testimonial visible on the website',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'workshop',
      published: 'published',
    },
    prepare(selection) {
      const { title, subtitle, published } = selection
      return {
        title: title,
        subtitle: `${subtitle} ${published ? '✓ Published' : '○ Draft'}`,
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
