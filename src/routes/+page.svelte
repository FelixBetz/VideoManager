<script lang="ts">
	import DirTree from '$lib/DirTree.svelte';

	import type { Directory } from '$lib/types';
	import { onMount } from 'svelte';
	let { data } = $props();

	let rootDirectory: Directory = $derived(data.rootDirectory);

	let currentDir: Directory | null = $state(null);

	onMount(() => {
		currentDir = rootDirectory;
	});

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function getDirectory(pDirectroy: Directory) {
		currentDir = pDirectroy;
	}
</script>

<div class=" flex">
	<!-- Directory Tree -->
	<div class="directory-tree w-200px rounded-lg bg-gray-100 p-4 shadow-md">
		<DirTree {getDirectory} directory={rootDirectory} />
	</div>

	<!-- Video Gallery -->
	<div class="video-gallery-container flex-1 p-4">
		{#if currentDir}
			<h1 class="mb-4 text-xl font-bold">
				{currentDir.name} <span class="text-sm italic">({currentDir.videos.length} Videos)</span>
			</h1>
			{#if currentDir.videos.length === 0}
				<h1 class="text-sm italic">No videos</h1>
			{/if}

			<div
				class="video-gallery grid gap-3"
				style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));"
			>
				{#each currentDir.videos as video}
					<div class="video-card-container">
						<div class="video-card overflow-hidden rounded-lg bg-white shadow-md">
							<div class="video-body relative">
								<img
									src={video.thumbnailImg}
									alt="{video.title} thumbnail"
									class="static h-auto w-full"
								/>
								<img src={video.thumbnailGif} alt="{video.title} gif" class="gif h-auto w-full" />
								<div
									class="video-duration bg-opacity-75 absolute right-2 bottom-2 rounded bg-black px-2 py-1 text-xs text-white"
								>
									{formatDuration(video.durationSec)}
								</div>
							</div>
						</div>
						<div class="mt-0">
							<p class="text-base text-sm font-semibold">
								<a href={`/video/${video.id}`} target="_blank" rel="noopener noreferrer"
									>{video.title}</a
								>
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
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
	.directory-tree {
		width: 200px;
	}
	.video-card-container {
		width: 200px;
	}
</style>
