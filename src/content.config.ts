import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			tagline: z.string(),
			summary: z.string(),
			order: z.number(),
			draft: z.boolean().default(false),
			cover: image().optional(),
		}),
});

export const collections = { work };
