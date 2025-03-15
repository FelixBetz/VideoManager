import type { Handle } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';
import { directoryDbOj, videoDbOj } from '$lib/DatabaseUtils';

import { SQL_DIR } from '$env/static/private';
import path from 'path';

const DATABASE_PATH = path.join(process.cwd(), SQL_DIR + 'db.sqlite');

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.locals.db) {
		// This will create the database within the `db.sqlite` file.
		const db = new sqlite3.Database(DATABASE_PATH, (err) => {
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
