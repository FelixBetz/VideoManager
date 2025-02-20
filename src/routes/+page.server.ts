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
	const videos: Video[] = await loadDataPromise;

	return { videos };
}
