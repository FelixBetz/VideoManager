import { type Video } from '$lib/types';

export async function load({ params, locals }) {
	const id: number = parseInt(params.id, 10);
	const db = locals.db;

	const loadVideoPromise = new Promise<Video>((resolve, reject) => {
		const query = 'SELECT * FROM videos WHERE id = ?';
		db.get<Video>(query, [id], (err: Error | null, row: Video) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(row);
		});
	});

	const video: Video = await loadVideoPromise;

	return video;
}
