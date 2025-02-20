import { type Video } from '$lib/types';

export function load({ params }) {
	const video: Video = {
		title: 'test',
		videoPath: '/videos/test_video.mp4',
		orginalTitle: 'orgTitle',
		orginalUrl: 'orgUrl',
		thumbnailPath: '',
		directory: ''
	};

	return video;
}
