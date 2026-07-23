import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
