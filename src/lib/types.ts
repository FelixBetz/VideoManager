export interface Video {
	id: number;
	title: string;
	videoPath: string;
	thumbnailImg: string;
	thumbnailGif: string;

	orginalTitle: string;
	orginalUrl: string;
	directory: number | null;

	durationSec: number;
}

export interface Directory {
	id: number;
	name: string;
	parentDirectory: number | null;
	//needs to be parsed when loading from database
	subDirectories: Directory[];
	videos: Video[];
}
