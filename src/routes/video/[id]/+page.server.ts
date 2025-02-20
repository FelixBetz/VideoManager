import { type Video } from '$lib/types';

export function load({ params }) {
	console.log(params);
	const video: Video = { title: 'test', path: '/videos/test_video.mp4' };

	return video;
}
