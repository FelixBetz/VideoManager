import type { Handle } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';
import { directoryDbOj, videoDbOj } from '$lib/DatabaseUtils';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.locals.db) {
		// This will create the database within the `db.sqlite` file.
		const db = new sqlite3.Database('db.sqlite', (err) => {
			if (err) {
				console.log(err);
			}
		});

		// Set the db as our events.db variable.
		event.locals.db = db;

		db.run(videoDbOj.getCreateQuery(), (err) => {
			if (err) {
				console.log(err);
			}
		});

		// Create a table for directories
		db.run(directoryDbOj.getCreateQuery(), (err) => {
			if (err) {
				console.log(err);
			}
		});
	}
	const resp = await resolve(event);
	return resp;
};
