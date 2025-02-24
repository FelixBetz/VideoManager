import type { Directory, Video } from '$lib/types';

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
	const loadDirectoryDataPromise = new Promise<Directory[]>((resolve, reject) => {
		const db = locals.db;
		const query = 'SELECT * FROM directories';
		db.all<Video>(query, (err: Error | null, rows: Directory[]) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
	const directories: Directory[] = await loadDirectoryDataPromise;
	directories.forEach((dir) => {
		dir.subDirectories = [];
		dir.videos = [];
	});

	//add root directory
	const rootDirectory: Directory = {
		id: 0,
		name: 'root',
		thumbnailPath: '',
		parentDirectory: null,
		subDirectories: [],
		videos: []
	};

	//add videos to directory
	videos.forEach((video) => {
		let isFound = false;
		for (let i = 0; i < directories.length; i++) {
			if (directories[i].id == video.directory) {
				isFound = true;
				directories[i].videos.push(video);
				break;
			}
		}
		if (!isFound) {
			rootDirectory.videos.push(video);
		}
	});

	//add subdirectories to directories
	directories.forEach((dir) => {
		if (dir.parentDirectory == null) {
			rootDirectory.subDirectories.push(dir);
		} else {
			for (let i = 0; i < directories.length; i++) {
				if (directories[i].id == dir.parentDirectory) {
					directories[i].subDirectories.push(dir);
					break;
				}
			}
		}
	});

	return { rootDirectory };
}
