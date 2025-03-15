import { VIDEO_UPLOAD_DIR } from '$env/static/private';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export async function GET({ params }) {
	const filePath = path.join(process.cwd(), VIDEO_UPLOAD_DIR, 'videos', params.path);

	if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
		throw error(404, 'File not found');
	}

	const fileStream = fs.createReadStream(filePath);
	const mimeType = getMimeType(filePath);
	const stream = new ReadableStream({
		start(controller) {
			fileStream.on('data', (chunk) => controller.enqueue(chunk));
			fileStream.on('end', () => controller.close());
			fileStream.on('error', (err) => controller.error(err));
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': mimeType,
			'Content-Disposition': `inline; filename="${path.basename(filePath)}"`
		}
	});
}

function getMimeType(filePath: string): string {
	const ext = path.extname(filePath).toLowerCase();
	const mimeTypes: { [key: string]: string } = {
		'.mp4': 'video/mp4',
		'.webm': 'video/webm',
		'.ogg': 'video/ogg',
		'.mov': 'video/quicktime'
	};
	return mimeTypes[ext] || 'application/octet-stream';
}
