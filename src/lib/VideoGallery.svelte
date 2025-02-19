<script lang="ts">
	import { type Directory } from '$lib/types';

	import VideoPlayer from './VideoPlayer.svelte';
	let { data = null }: { data: Directory | null } = $props();
</script>

<h1>sdfadfs</h1>
{#if data}
	<div class="video-gallery">
		{#each data.videos as video}
			<div>
				<h2>{video.name}</h2>
				<h2>{video.path}</h2>
				<VideoPlayer videoSrc={video.path} />
			</div>
		{/each}
	</div>
{/if}

<style>
	.video-gallery {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}
</style>
