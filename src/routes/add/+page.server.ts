import type { Actions } from './$types';
import { type Video } from '$lib/types';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import { addVideo } from '$lib/DatabaseUtils';
import Vtt from 'vtt-creator';

const VIDEOS_PATH = '/videos';

function getVideoDuration(inputVideo: string) {
	return new Promise((resolve, reject) => {
		ffmpeg.ffprobe(inputVideo, (err, metadata) => {
			if (err) reject(err);
			else resolve(metadata.format.duration);
		});
	});
}

async function createThumbnail(pVideoFilePath: string, pThumbnailName: string, pDirPath: string) {
	await new Promise((resolve, reject) => {
		ffmpeg(pVideoFilePath)
			.screenshots({
				timestamps: ['00:00:01'], // Capture at 1 second
				filename: pThumbnailName,
				folder: pDirPath,
				size: '320x180'
			})
			.on('end', resolve)
			.on('error', reject);
	});
}

async function createGif(
	pVideoFilePath: string,
	pGifName: string,
	pDirPath: string,
	pDuration: number
) {
	const step = pDuration / 20; // Divide video into 10 equal segments
	const selectFilter = `select='isnan(prev_selected_t) + gt(t, prev_selected_t+${step.toFixed(2)})',setpts=N/FRAME_RATE/TB`;

	await new Promise((resolve, reject) => {
		ffmpeg(pVideoFilePath)
			.output(path.join(pDirPath, pGifName))
			.outputOptions([
				'-vf',
				`${selectFilter},scale=320:-1:flags=lanczos,setpts=15*PTS`, // Set playback speed to 2x
				'-vsync',
				'vfr', // Ensures only the selected frames appear
				'-loop',
				'0', // Infinite loop for GIF
				'-y'
			])
			.on('end', resolve)
			.on('error', reject)
			.run();
	});
}

async function createVtt(
	pVideoFilePath: string,
	pVttName: string,
	pDirAbsPath: string,
	pDirRelPath: string
) {
	const v = new Vtt();

	const duration = (await getVideoDuration(pVideoFilePath)) as number;
	for (let i = 0; i <= Math.floor(duration); i++) {
		const filename = `${path.parse(pVttName).name}_${i.toString()}.jpg`;
		await new Promise((resolve, reject) => {
			ffmpeg(pVideoFilePath)
				.screenshots({
					timestamps: [`00:00:${i.toString().padStart(2, '0')}`], // Capture at every second
					filename: filename,
					folder: pDirAbsPath,
					size: '320x180'
				})
				.on('end', resolve)
				.on('error', reject);
		});

		v.add(i, i + 1, path.join(pDirRelPath, filename) + '#xywh=0,0,320,180');
	}
	await fs.writeFile(path.join(pDirAbsPath, pVttName), v.toString());
}

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const videoFile = data.get('videoFile') as File;

		if (!videoFile) {
			return;
		}

		const uuid = uuidv4();

		const videoDirRelPath = path.join(VIDEOS_PATH, uuid);
		const videoDirAbsPath = path.join(process.cwd(), 'static', videoDirRelPath);

		const videoFileRelPath = path.join(videoDirRelPath, videoFile.name);
		const videoFileAbsPath = path.join(process.cwd(), 'static', videoFileRelPath);

		const thumbnailName = `${path.parse(videoFile.name).name}_thumbnail.jpg`;
		const gifName = `${path.parse(videoFile.name).name}_thumbnail.gif`;

		const vttFileName = `${path.parse(videoFile.name).name}.vtt`;
		const vttDirRelPath = path.join(videoDirRelPath, 'vtt');
		const vttDirAbsPath = path.join(process.cwd(), 'static', vttDirRelPath);
		const vttFileRelPath = path.join(vttDirRelPath, vttFileName);

		//create directories
		await fs.mkdir(videoDirAbsPath, { recursive: true });
		await fs.mkdir(vttDirAbsPath, { recursive: true });

		//save video file
		const buffer = await videoFile.arrayBuffer();
		await fs.writeFile(videoFileAbsPath, Buffer.from(buffer));
		const duration: number = (await getVideoDuration(videoFileAbsPath)) as number;

		createThumbnail(videoFileAbsPath, thumbnailName, videoDirAbsPath);
		createGif(videoFileAbsPath, gifName, videoDirAbsPath, duration);
		createVtt(videoFileAbsPath, vttFileName, vttDirAbsPath, vttDirRelPath);

		const video: Video = {
			id: -1, // will be created when inserting into database
			uuid: uuid,
			title: (data.get('title') as string) || '',
			videoPath: videoFileRelPath,
			thumbnailImg: path.join(videoDirRelPath, thumbnailName),
			thumbnailGif: path.join(videoDirRelPath, gifName),
			vttPath: vttFileRelPath,
			orginalTitle: (data.get('orginalTitle') as string) || '',
			orginalUrl: (data.get('orginalUrl') as string) || '',
			durationSec: Math.floor(duration),
			createdDate: new Date()
		};

		await addVideo(locals.db, video);
	}
} satisfies Actions;
