export interface Video {
	id: number;
	uuid: string;
	title: string;
	videoPath: string;
	thumbnailImg: string;
	thumbnailGif: string;
	vttPath: string;
	orginalTitle: string;
	orginalUrl: string;
	durationSec: number;
	createdDate: Date;
	tags: string[];
}

export function defaultVideo(): Video {
	return {
		id: -1,
		uuid: '',
		title: '',
		videoPath: '',
		thumbnailImg: '',
		thumbnailGif: '',
		vttPath: '',
		orginalTitle: '',
		orginalUrl: '',
		durationSec: 0,
		createdDate: new Date(),
		tags: []
	};
}

export interface Directory {
	uuid: string;
	name: string;
	videoIds: number[];
	subDirectories: Directory[];
}

export interface DbDirectoryTree {
	id: number;
	tree: string;
	modifiedDate: string;
}

export interface DatabaseCol {
	name: string;
	type: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mapCb: null | ((x: any) => string);
}

export class DatabaseObject {
	tableName: string;
	cols: DatabaseCol[];

	constructor(pTableName: string, pCols: DatabaseCol[]) {
		this.tableName = pTableName;
		this.cols = pCols;
	}
	getCreateQuery(): string {
		const colStr = this.cols.map((col) => `${col.name} ${col.type}`).join(', ');
		return `CREATE TABLE IF NOT EXISTS ${this.tableName}(${colStr}) `;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getInsertQuery(obj: Record<string, any>): string {
		//skip 1st col (id col)
		const arr = this.cols.slice(1);

		const colsStr = arr.map((col) => col.name).join(', ');

		let queryString = `INSERT INTO ${this.tableName} (${colsStr})`;
		queryString += ' VALUES (' + this.mapValues(obj).join(',') + ')';

		return queryString;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getUpdateQuery(obj: Record<string, any>): string {
		//skip 1st col (id col)
		const arr = this.cols.slice(1);
		const values = this.mapValues(obj);

		const cols = [];
		for (let i = 0; i < arr.length; i++) {
			cols.push(arr[i].name + ' = ' + values[i]);
		}

		return `UPDATE ${this.tableName} SET ${cols.join(', ')} WHERE id = ${obj.id} `;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private mapValues(obj: Record<string, any>): any[] {
		const arr = this.cols.slice(1);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const retArr: any[] = [];
		arr.forEach((key) => {
			if (key.mapCb != null) {
				retArr.push(key.mapCb(obj[key.name]));
			} else {
				if (typeof obj[key.name] == 'string') {
					retArr.push('"' + obj[key.name] + '"');
				} else {
					retArr.push(obj[key.name].toString());
				}
			}
		});

		return retArr;
	}
}

export function isSubDirectory(parent: Directory, child: Directory): boolean {
	if (parent.uuid === child.uuid) return true;
	for (const subDir of parent.subDirectories) {
		if (isSubDirectory(subDir, child)) return true;
	}
	return false;
}

export function findAndMoveDirectory(
	directory: Directory,
	targetDirectory: Directory,
	draggedDirectory: Directory
) {
	for (let i = 0; i < directory.subDirectories.length; i++) {
		if (directory.subDirectories[i].uuid === draggedDirectory.uuid) {
			const [movedDirectory] = directory.subDirectories.splice(i, 1);
			targetDirectory.subDirectories.push(movedDirectory);
			return true;
		} else if (
			findAndMoveDirectory(directory.subDirectories[i], targetDirectory, draggedDirectory)
		) {
			return true;
		}
	}
	return false;
}

export function findAndDeleteDirectory(
	rootDirectory: Directory,
	toDeleteDirectory: Directory
): boolean {
	for (let i = 0; i < rootDirectory.subDirectories.length; i++) {
		if (rootDirectory.subDirectories[i].uuid === toDeleteDirectory.uuid) {
			const [deletedDirectory] = rootDirectory.subDirectories.splice(i, 1);
			// Add subdirectories of the deleted directory to the root directory
			rootDirectory.subDirectories.push(...deletedDirectory.subDirectories);
			rootDirectory.videoIds.push(...deletedDirectory.videoIds);
			return true;
		} else if (findAndDeleteDirectory(rootDirectory.subDirectories[i], toDeleteDirectory)) {
			return true;
		}
	}
	return false;
}
