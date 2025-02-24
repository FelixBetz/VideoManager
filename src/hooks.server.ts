import type { Handle } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.locals.db) {
		// This will create the database within the `db.sqlite` file.
		const db = new sqlite3.Database('db.sqlite', (err) => {
			if (err) {
				throw err;
			}
		});

		// Set the db as our events.db variable.
		event.locals.db = db;

		// Create a table for videos
		const videoQuery = `
			CREATE TABLE IF NOT EXISTS videos (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				title TEXT,
				videoPath TEXT,
				thumbnailImg TEXT,
				thumbnailGif TEXT,
				orginalTitle TEXT,
				orginalUrl TEXT,
				directory INTEGER,
				durationSec INTEGER,
				tags TEXT
			)`;
		db.run(videoQuery, (err) => {
			if (err) {
				throw err;
			}
		});

		// Create a table for directorys
		const directoryQuery = `
			CREATE TABLE IF NOT EXISTS directories (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT,
				thumbnailPath TEXT,
				parentDirectory INTEGER,
				FOREIGN KEY (parentDirectory) REFERENCES directories(id)
			)`;
		db.run(directoryQuery, (err) => {
			if (err) {
				throw err;
			}

			// Insert the first directory entry with name 'root'
			/*const insertRootDirectory = `
				INSERT INTO directories (name, thumbnailPath, parentDirectory)
				VALUES ('root', "", NULL)
			`;
			db.run(insertRootDirectory, (err) => {
				if (err) {
					throw err;
				}
			});*/
		});
	}
	const resp = await resolve(event);
	return resp;
};
