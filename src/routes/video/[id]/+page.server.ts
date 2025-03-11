import { getVideo, updateVideo } from '$lib/DatabaseUtils';
import type { Video } from '$lib/types';

import type { Actions } from './$types';

export async function load({ params, locals }) {
	const id: number = parseInt(params.id, 10);

	return getVideo(locals.db, id);
}

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		let title = data.get('title');
		let tags = JSON.parse((data.get('tags') as string) || '[]');
		const video: Video = JSON.parse((data.get('video') as string) || '{}');

		//validate
		if (
			typeof title == 'string' &&
			Array.isArray(tags) &&
			tags.every((tag) => typeof tag === 'string')
		) {
			tags = tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
			title = title.trim();
			if (title.trim() != '') {
				// Check if video is of type Video
				if (typeof video === 'object' && video !== null && 'id' in video) {
					video.title = title;
					video.tags = tags;
					await updateVideo(locals.db, video);
				}
			}
		}
	}
} satisfies Actions;
