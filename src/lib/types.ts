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
		createdDate: new Date()
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

	getInsertQuery(): string {
		//skip 1st col (id col)
		const arr = this.cols.slice(1);

		const valuesStr = arr.map((col) => col.name).join(', ');
		const questionMarks = arr.map(() => '?').join(', ');

		return `INSERT INTO ${this.tableName} (${valuesStr}) VALUES (${questionMarks}) `;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mapInsertValues(obj: Record<string, any>): any[] {
		const arr = this.cols.slice(1);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const retArr: any[] = [];
		arr.forEach((key) => {
			retArr.push(obj[key.name]);
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
