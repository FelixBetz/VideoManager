export function removeNumber(arr: number[], numToRemove: number): number[] {
	return arr.filter((n) => n !== numToRemove);
}
export function formatDuration(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
export function removeFileExtension(filePath: string): string {
	return filePath.replace(/\.[^/.]+$/, ''); // Removes the last extension
}
