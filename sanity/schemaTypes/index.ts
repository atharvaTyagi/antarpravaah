import { type SchemaTypeDefinition } from 'sanity'
import { thought } from './thought'
import { testimonial } from './testimonial'
import { immersion } from './immersion'
import { training } from './training'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [thought, testimonial, immersion, training],
}
