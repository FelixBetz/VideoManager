import { parseData } from '$lib/DatabaseHelper';
export async function load({ locals }) {
	return parseData(locals.db);
}
