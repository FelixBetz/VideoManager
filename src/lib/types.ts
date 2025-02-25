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
	name: string;
	videoIds: number[];
	subDirectories: Directory[];
}

export interface DbDirectoryTree {
	id: number;
	tree: string;
	modifiedDate: string;
}
