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

export interface DbDirectory {
	id: number;
	name: string;
	subDirectories: string;
	videos: string;
}

export interface Directory {
	id: number;
	name: string;
	subDirectories: Directory[];
	subDirectoriesIds: number[];
	videos: Video[];
	videosIds: number[];
}
