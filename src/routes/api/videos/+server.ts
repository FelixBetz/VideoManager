import { json } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs';
import { type Directory } from '$lib/types';

export function GET() {
	const DIR_PATH = 'videos/';

	const rootPath = path.join(process.cwd(), 'static/' + DIR_PATH);

	const files = fs.readdirSync(rootPath);
	const directory: Directory = {
		name: 'videos',
		videos: files.map((file) => ({ name: file, path: DIR_PATH + file }))
	};

	return json(directory);
}
