import { getVideo } from '$lib/DatabaseUtils';

export async function load({ params, locals }) {
	const id: number = parseInt(params.id, 10);

	return getVideo(locals.db, id);
}
