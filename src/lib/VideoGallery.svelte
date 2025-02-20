<script lang="ts">
	import { type Video } from '$lib/types';
	import VideoPlayer from './VideoPlayer.svelte';
	let { videos = [] }: { videos: Video[] } = $props();
</script>

<div class="video-gallery grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each videos as video}
		<div class="video-card overflow-hidden rounded-lg bg-white shadow-md">
			<div class="video-header bg-gray-800 p-4 text-white">
				<h2 class="text-lg font-semibold">{video.title}</h2>
			</div>
			<div class="video-body">
				<VideoPlayer src={video.videoPath} />
			</div>
		</div>
	{/each}
</div>
