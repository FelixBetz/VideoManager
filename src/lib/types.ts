export interface Video {
	id: number;
	title: string;
	videoPath: string;
	thumbnailImg: string;
	thumbnailGif: string;
	orginalTitle: string;
	orginalUrl: string;
	durationSec: number;
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
