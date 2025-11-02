import { MetadataRoute } from 'next'

export const dynamic = 'force-static'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://namdapha.iitmbs.org',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://namdapha.iitmbs.org/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://namdapha.iitmbs.org/council',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://namdapha.iitmbs.org/teams',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://namdapha.iitmbs.org/events',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://namdapha.iitmbs.org/resources',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]
}
