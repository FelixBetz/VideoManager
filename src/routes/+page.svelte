<script lang="ts">
	import { type Video } from '$lib/types';
	let { data } = $props();

	let videos: Video[] = $derived(data.videos);

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
</script>

<div class="video-gallery grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8">
	{#each videos as video}
		<div class="video-card overflow-hidden rounded-lg bg-white shadow-md">
			<div class="video-header bg-gray-800 p-1 ps-3 text-white">
				<h2 class="text-base font-semibold">
					<a href={`/video/${video.id}`} target="_blank" rel="noopener noreferrer">{video.title}</a>
				</h2>
			</div>
			<div class="video-body relative">
				<img src={video.thumbnailImg} alt="{video.title} thumbnail" class="static h-auto w-full" />
				<img src={video.thumbnailGif} alt="{video.title} gif" class="gif h-auto w-full" />
				<div
					class="video-duration bg-opacity-75 absolute right-2 bottom-2 rounded bg-black px-2 py-1 text-xs text-white"
				>
					{formatDuration(video.durationSec)}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.video-body img {
		display: block;
	}
	.video-body img.gif {
		display: none;
	}
	.video-card:hover .video-body img.static {
		display: none;
	}
	.video-card:hover .video-body img.gif {
		display: block;
	}
</style>
