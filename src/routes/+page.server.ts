import { parseData, saveData } from '$lib/DatabaseHelper';
export async function load({ locals }) {
	return parseData(locals.db);
}

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const rootDirectoryJson = formData.get('rootDirectory');
		if (typeof rootDirectoryJson === 'string') {
			saveData(locals.db, rootDirectoryJson);
		} else {
			throw new Error('Invalid form data');
		}

		return parseData(locals.db);
	}
};
