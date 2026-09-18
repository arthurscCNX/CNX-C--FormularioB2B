import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: site.url, lastModified: agora, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${site.url}/formulario-b2b`,
      lastModified: agora,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
