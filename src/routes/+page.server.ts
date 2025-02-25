import type { DbDirectory, Directory, Video } from '$lib/types';
import { jsonStringToArray } from '../hooks.server.js';

export async function load({ locals }) {
	//load videos from database
	const loadVideoDataPromise = new Promise<Video[]>((resolve, reject) => {
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
	const videos: Video[] = await loadVideoDataPromise;

	//load directories from database
	const loadDirectoryDataPromise = new Promise<DbDirectory[]>((resolve, reject) => {
		const db = locals.db;
		const query = 'SELECT * FROM directories';
		db.all<Video>(query, (err: Error | null, rows: DbDirectory[]) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
	const dbDirectories: DbDirectory[] = await loadDirectoryDataPromise;

	const directories: Directory[] = [];
	dbDirectories.forEach((dbDirectory) => {
		directories.push({
			id: dbDirectory.id,
			name: dbDirectory.name,
			subDirectories: [],
			subDirectoriesIds: jsonStringToArray(dbDirectory.subDirectories),
			videos: [],
			videosIds: jsonStringToArray(dbDirectory.videos)
		});
	});

	//add root directory
	const rootDirectory: Directory = {
		id: 0,
		name: 'root',
		subDirectories: [],
		subDirectoriesIds: [],
		videos: [],
		videosIds: []
	};

	//add videos to directories
	videos.forEach((video) => {
		let hasDirectory = false;
		directories.forEach((directory) => {
			if (directory.videosIds.includes(video.id)) {
				hasDirectory = true;
				directory.videos.push(video);
			}
		});
		if (!hasDirectory) {
			rootDirectory.videos.push(video);
			rootDirectory.videosIds.push(video.id);
		}
	});

	//add directories to root
	rootDirectory.subDirectoriesIds = directories.map((directory) => directory.id);
	directories.forEach((directory) => {
		rootDirectory.subDirectoriesIds = removeNumbers(
			rootDirectory.subDirectoriesIds,
			directory.subDirectoriesIds
		);
	});

	addSubDirectories(rootDirectory, directories);

	return { rootDirectory };
}

function removeNumbers(arr: number[], numbersToRemove: number[]): number[] {
	const removeSet = new Set(numbersToRemove);
	return arr.filter((n) => !removeSet.has(n));
}

function findDbDirectoryById(directories: Directory[], id: number): number {
	for (let i = 0; i < directories.length; i++) {
		if (directories[i].id === id) {
			return i;
		}
	}
	return -1;
}
function addSubDirectories(directory: Directory, allDirectories: Directory[]) {
	directory.subDirectoriesIds.forEach((id) => {
		const dirIdx = findDbDirectoryById(allDirectories, id);
		if (dirIdx !== -1) {
			const subDirectory = allDirectories[dirIdx];
			directory.subDirectories.push(subDirectory);
			addSubDirectories(subDirectory, allDirectories);
		}
	});
}
