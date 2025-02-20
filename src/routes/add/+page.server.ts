import type { Actions } from './$types';

import type { Video } from '$lib/types';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const video: Video = {
			id: -1,
			title: (data.get('title') as string) || '',
			videoPath: (data.get('videoPath') as string) || '',
			thumbnailPath: (data.get('thumbnailPath') as string) || '',
			orginalTitle: (data.get('orginalTitle') as string) || '',
			orginalUrl: (data.get('orginalUrl') as string) || '',
			directory: (data.get('directory') as string) || ''
		};

		const db = locals.db;

		const insertVideoPromise = new Promise<void>((resolve, reject) => {
			const query = `
            INSERT INTO videos (title, videoPath, thumbnailPath, orginalTitle, orginalUrl, directory)
            VALUES (?, ?, ?, ?, ?, ?)
            `;
			db.run(
				query,
				[
					video.title,
					video.videoPath,
					video.thumbnailPath,
					video.orginalTitle,
					video.orginalUrl,
					video.directory
				],
				(err: Error | null) => {
					if (err) {
						reject(err);
						return;
					}
					resolve();
				}
			);
		});

		await insertVideoPromise;
	}
} satisfies Actions;
