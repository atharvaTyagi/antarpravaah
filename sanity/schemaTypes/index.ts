import { type SchemaTypeDefinition } from 'sanity'
import { thought } from './thought'
import { testimonial } from './testimonial'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [thought, testimonial],
}
