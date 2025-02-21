import type { Actions } from './$types';
import type { Video } from '$lib/types';
import { promises as fs } from 'fs';
import path from 'path';

import ffmpeg from 'fluent-ffmpeg';
function getVideoDuration(inputVideo: string) {
	return new Promise((resolve, reject) => {
		ffmpeg.ffprobe(inputVideo, (err, metadata) => {
			if (err) reject(err);
			else resolve(metadata.format.duration);
		});
	});
}
export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const videoFile = data.get('videoFile') as File;

		const video: Video = {
			id: -1,
			title: (data.get('title') as string) || '',
			videoPath: '',
			thumbnailImg: '',
			thumbnailGif: '',
			orginalTitle: (data.get('orginalTitle') as string) || '',
			orginalUrl: (data.get('orginalUrl') as string) || '',
			directory: (data.get('directory') as string) || '',
			durationSec: 0,
			tags: ['Felix', 'hallo', 'qfsdf']
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

			// Generate GIF
			const gifDir = path.join(process.cwd(), 'static/thumbnails/');
			const gifName = `${path.parse(videoFile.name).name}.gif`;

			const duration: number = (await getVideoDuration(videoFilePath)) as number;

			const step = duration / 10; // Divide video into 10 equal segments
			const selectFilter = `select='isnan(prev_selected_t) + gt(t, prev_selected_t+${step.toFixed(2)})',setpts=N/FRAME_RATE/TB`;

			await new Promise((resolve, reject) => {
				ffmpeg(videoFilePath)
					.output(path.join(gifDir, gifName))
					.outputOptions([
						'-vf',
						`${selectFilter},scale=1280:-1:flags=lanczos,setpts=15*PTS`, // Set playback speed to 2x
						'-vsync',
						'vfr', // Ensures only the selected frames appear
						'-loop',
						'0', // Infinite loop for GIF
						'-y'
					])
					.on('end', resolve)
					.on('error', reject)
					.run();
			});

			video.durationSec = Math.floor(duration);

			video.videoPath = '/videos/' + videoFile.name;
			video.thumbnailImg = '/thumbnails/' + thumbnailName;
			video.thumbnailGif = '/thumbnails/' + gifName;
		}

		const db = locals.db;

		const insertVideoPromise = new Promise<void>((resolve, reject) => {
			const query = `
            INSERT INTO videos (title, videoPath, thumbnailImg, thumbnailGif, orginalTitle, orginalUrl, directory, durationSec, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
			db.run(
				query,
				[
					video.title,
					video.videoPath,
					video.thumbnailImg,
					video.thumbnailGif,
					video.orginalTitle,
					video.orginalUrl,
					video.directory,
					video.durationSec,
					video.tags.join(',')
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
