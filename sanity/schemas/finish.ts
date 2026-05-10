export default {
  name: 'finish',
  title: 'Finish',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'tagline', title: 'Tagline', type: 'string' },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['Texture', 'Pearlescent', 'Stucco', 'Metallic', 'Stone & Concrete', 'Glaze', 'Polished Plaster'] } },
    { name: 'hero_image', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'macro_image_4k', title: 'Macro Image 4K', type: 'image' },
    { name: 'hero_video', title: 'Hero Video (Mux)', type: 'string' },
    { name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image' }] },
    { 
      name: 'technical_specs', 
      title: 'Technical Specs', 
      type: 'object',
      fields: [
        { name: 'type_of_surface', type: 'string' },
        { name: 'base_coat', type: 'string' },
        { name: 'application', type: 'string' },
        { name: 'coverage', type: 'string' },
        { name: 'drying_time', type: 'string' },
        { name: 'pack_size', type: 'string' },
      ]
    },
    { name: 'application_steps', title: 'Application Steps', type: 'array', of: [{ type: 'block' }] },
  ]
}
