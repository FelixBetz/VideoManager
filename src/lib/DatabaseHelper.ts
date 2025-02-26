import type { DbDirectoryTree, Directory, Video } from '$lib/types';
import type { Database } from 'sqlite3';

export async function saveData(pDb: Database, pDataString: string) {
	const insertDirectoryPromise = new Promise<void>((resolve, reject) => {
		const query = 'INSERT INTO directories (tree) VALUES (?)';
		pDb.run(query, pDataString, (err: Error | null) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
	await insertDirectoryPromise;
}

export async function parseData(pDb: Database) {
	//load videos from database
	const loadVideoDataPromise = new Promise<Video[]>((resolve, reject) => {
		const query = 'SELECT * FROM videos';
		pDb.all<Video>(query, (err: Error | null, rows: Video[]) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
	const videos: Video[] = await loadVideoDataPromise;

	//load the latest directory entry from database
	const loadLatestDirectoryDataPromise = new Promise<DbDirectoryTree | undefined>(
		(resolve, reject) => {
			//	const db = locals.db;
			const query = 'SELECT * FROM directories ORDER BY id DESC LIMIT 1';
			pDb.get<DbDirectoryTree>(query, (err: Error | null, row: DbDirectoryTree | undefined) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(row);
			});
		}
	);
	const directoryTree: DbDirectoryTree | undefined = await loadLatestDirectoryDataPromise;

	let rootDirectory: Directory = { name: '/', videoIds: [], subDirectories: [] };

	if (directoryTree) {
		try {
			rootDirectory = JSON.parse(directoryTree.tree);
		} catch (error) {
			console.error(error);
		}
	}

	//add videos to directories
	videos.forEach((video) => {
		if (!isVideoIdInDiretory(rootDirectory, video.id)) {
			rootDirectory.videoIds.push(video.id);
		}
	});
	return { rootDirectory, videos };
}

export function isVideoIdInDiretory(pDirectory: Directory, pVideoId: number): boolean {
	if (pDirectory.videoIds.includes(pVideoId)) {
		return true;
	}

	for (const subDirectory of pDirectory.subDirectories) {
		if (isVideoIdInDiretory(subDirectory, pVideoId)) {
			return true;
		}
	}
	return false;
}
