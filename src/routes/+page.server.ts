import { type Video } from '$lib/types';

export async function load({ locals }) {
	const loadDataPromise = new Promise<Video[]>((resolve, reject) => {
		const db = locals.db;
		const query = 'SELECT * FROM videos';
		db.all<Video>(query, (err: Error | null, rows: Video[]) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
	const videosFromDb: Video[] = await loadDataPromise;
	const videos = videosFromDb.map((video) => ({
		...video,
		videoPath: `/videos/${video.videoPath}`
	}));

	return { videos };
}
