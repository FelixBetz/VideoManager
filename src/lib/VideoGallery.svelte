<script lang="ts">
	import { type Video } from '$lib/types';

	let { videos = [] }: { videos: Video[] } = $props();
</script>

<div class="video-gallery grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each videos as video}
		<div class="video-card overflow-hidden rounded-lg bg-white shadow-md">
			<div class="video-header bg-gray-800 p-4 text-white">
				<h2 class="text-lg font-semibold">
					<a href={`/video/${video.id}`} target="_blank" rel="noopener noreferrer">{video.title}</a>
				</h2>
			</div>
			<div class="video-body">
				<img src={video.thumbnailImg} alt="{video.title} thumbnail" class="static h-auto w-full" />
				<img src={video.thumbnailGif} alt="{video.title} gif" class="gif h-auto w-full" />
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
