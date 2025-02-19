<script lang="ts">
	import { onMount } from 'svelte';
	import { type Directory } from '$lib/types';
	import { fetchVideos } from '$lib/api';
	import VideoGallery from '$lib/VideoGallery.svelte';

	let data: Directory | null = $state(null);
	async function fetchData(): Promise<void> {
		try {
			data = await fetchVideos();
		} catch (error) {
			console.error(error);
		}
	}

	onMount(() => {
		fetchData();
	});
</script>

<VideoGallery {data} />

<ul>
	{#if data}
		<h1>{data.name}</h1>
		{#each data.videos as video}
			<li>{video.name}</li>
		{/each}
	{/if}
</ul>
