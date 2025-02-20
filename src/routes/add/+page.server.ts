import type { Actions } from './$types';
import type { Video } from '$lib/types';
import { promises as fs } from 'fs';
import path from 'path';

import ffmpeg from 'fluent-ffmpeg';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const videoFile = data.get('videoFile') as File;

		const video: Video = {
			id: -1,
			title: (data.get('title') as string) || '',
			videoPath: '',
			thumbnailPath: '',
			orginalTitle: (data.get('orginalTitle') as string) || '',
			orginalUrl: (data.get('orginalUrl') as string) || '',
			directory: (data.get('directory') as string) || ''
		};

		if (videoFile) {
			const videoFilePath = path.join(process.cwd(), 'static/videos', videoFile.name);
			const buffer = await videoFile.arrayBuffer();
			await fs.writeFile(videoFilePath, Buffer.from(buffer));

			// Generate thumbnail (screenshot)
			const thumbnailsDir = path.join(process.cwd(), 'static/thumbnails/');

			const thumbnailName = `${path.parse(videoFile.name).name}.jpg`;

			await new Promise((resolve, reject) => {
				ffmpeg(videoFilePath)
					.screenshots({
						timestamps: ['00:00:01'], // Capture at 1 second
						filename: thumbnailName,
						folder: thumbnailsDir,
						size: '1280x720'
					})
					.on('end', resolve)
					.on('error', reject);
			});

			video.videoPath = '/videos/' + videoFile.name;
			video.thumbnailPath = '/thumbnails/' + thumbnailName;
		}

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
