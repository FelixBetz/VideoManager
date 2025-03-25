import { type DbDirectoryTree, type Directory, type Video } from '$lib/types';
import type { Database } from 'sqlite3';

import { v4 as uuidv4 } from 'uuid';
import { DatabaseObject } from './DatabaseObject';

function joinArray(arr: string[]): string {
	return '"' + arr.join(',') + '"';
}

function dateToString(pDate: string) {
	const timestamp = Date.parse(pDate.toString());

	return timestamp.toString();
}

export const videoDbOj = new DatabaseObject('videos', [
	{ name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT', mapCb: null },
	{ name: 'uuid', type: 'TEXT', mapCb: null },
	{ name: 'title', type: 'TEXT', mapCb: null },
	{ name: 'videoPath', type: 'TEXT', mapCb: null },
	{ name: 'thumbnailImg', type: 'TEXT', mapCb: null },
	{ name: 'thumbnailGif', type: 'TEXT', mapCb: null },
	{ name: 'vttPath', type: 'TEXT', mapCb: null },
	{ name: 'orginalTitle', type: 'TEXT', mapCb: null },
	{ name: 'orginalUrl', type: 'TEXT', mapCb: null },
	{ name: 'durationSec', type: 'TEXT', mapCb: null },
	{ name: 'createdDate', type: 'TEXT', mapCb: dateToString },
	{ name: 'tags', type: 'TEXT', mapCb: joinArray }
]);

export const directoryDbOj = new DatabaseObject('directories', [
	{ name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT', mapCb: null },
	{ name: 'tree', type: 'TEXT', mapCb: null },
	{ name: 'modifiedDate', type: 'TEXT', mapCb: null }
]);

export async function saveData(pDb: Database, pDataString: string) {
	const insertDirectoryPromise = new Promise<void>((resolve, reject) => {
		const query = 'INSERT INTO directories (tree, modifiedDate) VALUES (?, ?)';
		const modifiedDate = new Date();
		pDb.run(query, [pDataString, modifiedDate], (err: Error | null) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
	await insertDirectoryPromise;
}

export async function getVideo(pDb: Database, pId: number) {
	const loadVideoPromise = new Promise<Video[]>((resolve, reject) => {
		const query = 'SELECT * FROM videos WHERE id = ? ';
		pDb.all<Video>(query, [pId], (err: Error | null, rows: Video[]) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(rows);
		});
	});

	const videos: Video[] = await loadVideoPromise;

	videos.forEach((video) => {
		video.createdDate = new Date(parseInt(video.createdDate.toString()));
		if (typeof video.tags === 'string') {
			video.tags = (video.tags as string).split(',');
		}
	});

	return videos[0];
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

	let rootDirectory: Directory = { uuid: uuidv4(), name: '/', videoIds: [], subDirectories: [] };

	if (directoryTree) {
		try {
			rootDirectory = JSON.parse(directoryTree.tree);
		} catch (error) {
			console.error(error);
		}
	}

	//add videos to directories
	videos.forEach((video) => {
		video.createdDate = new Date(parseInt(video.createdDate.toString()));

		if (typeof video.tags === 'string') {
			video.tags = (video.tags as string).split(',');
		}

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

export async function addVideo(pDb: Database, pVideo: Video) {
	const insertVideoPromise = new Promise<void>((resolve, reject) => {
		pDb.run(videoDbOj.getInsertQuery(pVideo), [], (err: Error | null) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});

	await insertVideoPromise;
}

export async function updateVideo(pDb: Database, pVideo: Video) {
	const queryStr = videoDbOj.getUpdateQuery(pVideo);

	const updateVideoPromise = new Promise<void>((resolve, reject) => {
		pDb.run(queryStr, [], (err: Error | null) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});

	await updateVideoPromise;
}
