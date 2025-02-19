import { type Directory } from '$lib/types';

export async function fetchVideos(): Promise<Directory> {
	const res = await fetch('/api/videos');
	if (!res.ok) {
		throw new Error('Failed to fetch videos');
	}
	const data: Directory = await res.json();
	return data;
}
