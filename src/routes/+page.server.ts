import path from 'path';
import fs from 'fs';
import { type Directory } from '$lib/types';

export function load({ params }) {
	const DIR_PATH = '/videos/';

	const rootPath = path.join(process.cwd(), 'static/' + DIR_PATH);

	const files = fs.readdirSync(rootPath);
	const directory: Directory = {
		name: 'videos',
		videos: files.map((file) => ({ title: file, path: DIR_PATH + file }))
	};
	return directory;
}
