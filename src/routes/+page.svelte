<script lang="ts">
	import DirTree from '$lib/DirTree.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { formatDuration, removeNumber } from '$lib/utils';
	import {
		type Directory,
		type Video,
		isSubDirectory,
		findAndMoveDirectory,
		findAndDeleteDirectory
	} from '$lib/types';
	import { onMount } from 'svelte';

	let { data } = $props();

	let rootDirectory: Directory = $state(data.rootDirectory);

	let currentDir: Directory | null = $state(null);

	let videos: Video[] = $derived(
		!currentDir
			? []
			: data.videos.filter((video) => currentDir && currentDir.videoIds.includes(video.id))
	);

	let newDirName = $state('');

	let isListView = $state(false);

	onMount(() => {
		currentDir = rootDirectory;
	});

	function selectDirectory(pDirectory: Directory) {
		currentDir = pDirectory;
	}

	function addDirectory() {
		if (currentDir && newDirName.trim()) {
			rootDirectory.subDirectories.push({
				uuid: uuidv4(),
				name: newDirName,
				subDirectories: [],
				videoIds: []
			});
			newDirName = '';
		}
	}

	function onDragStartVideo(event: DragEvent, pVideo: Video) {
		if (event.dataTransfer) {
			event.dataTransfer.setData(
				'application/json',
				JSON.stringify({ isVideo: true, id: pVideo.id })
			);
		}
	}

	function onDragStartDirectory(event: DragEvent, pDirectory: Directory) {
		if (event.dataTransfer) {
			event.dataTransfer.setData(
				'application/json',
				JSON.stringify({ isVideo: false, directory: pDirectory })
			);
		}
	}

	function onDrop(event: DragEvent, pDirectory: Directory) {
		event.preventDefault();
		if (event.dataTransfer) {
			const data = JSON.parse(event.dataTransfer.getData('application/json'));

			// Dragging a video
			if (data.isVideo && currentDir && currentDir !== pDirectory) {
				const dragVideoId = data.id;
				currentDir.videoIds = removeNumber(currentDir.videoIds, dragVideoId);
				pDirectory.videoIds.push(dragVideoId);
			}
			//Dragging a directory
			else {
				const draggedDirectory: Directory = data.directory;
				if (
					draggedDirectory.uuid != pDirectory.uuid &&
					draggedDirectory.uuid != rootDirectory.uuid
				) {
					if (!isSubDirectory(draggedDirectory, pDirectory)) {
						findAndMoveDirectory(rootDirectory, pDirectory, draggedDirectory);
					}
				}
			}
		}
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function delteDirectory(pDiretory: Directory) {
		findAndDeleteDirectory(rootDirectory, pDiretory);
	}
</script>

<div class=" flex">
	<!-- Directory Tree -->
	<div class="directory-tree w-200px overflow-y-auto rounded-lg bg-gray-100 p-4 pt-1 shadow-md">
		<DirTree
			{selectDirectory}
			directory={rootDirectory}
			{currentDir}
			{onDrop}
			{onDragOver}
			onDragStart={onDragStartDirectory}
			onDelete={delteDirectory}
		/>
		<div class="mt-2 flex items-center">
			<input
				type="text"
				bind:value={newDirName}
				placeholder="New directory name"
				class="flex-grow rounded border p-1 text-xs"
				style="width: calc(100% - 40px);"
				onkeydown={(e) => e.key === 'Enter' && addDirectory()}
			/>
			<button
				onclick={addDirectory}
				class="ml-1 rounded bg-blue-500 p-1 pr-2 pl-2 text-xs text-white"
			>
				+
			</button>
		</div>

		<form method="POST">
			<input type="hidden" name="rootDirectory" value={JSON.stringify(rootDirectory)} />
			<button type="submit" class="rounded bg-blue-500 p-1 pr-2 pl-2 text-xs text-white"
				>save</button
			>
		</form>
	</div>

	<!-- Video Gallery -->
	<div class="video-gallery-container flex-1 overflow-y-auto p-4 pt-1">
		{#if currentDir}
			<div class="mb-4 flex items-center justify-between">
				<h1 class="text-xl font-bold">
					{currentDir.name}
					<span class="text-sm italic">({currentDir.videoIds.length} Videos) </span>
				</h1>

				<div class="inline-flex">
					<button
						aria-label="Video View"
						class="m-0 rounded-l p-2 pr-1 text-gray-800 hover:bg-gray-500 hover:text-gray-300 {!isListView
							? 'bg-blue-300'
							: 'bg-gray-400'}"
						onclick={() => (isListView = false)}
					>
						<svg
							class="mr-2 h-4 w-4 fill-current"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect x="3" y="3" width="7" height="7"></rect>
							<rect x="14" y="3" width="7" height="7"></rect>
							<rect x="14" y="14" width="7" height="7"></rect>
							<rect x="3" y="14" width="7" height="7"></rect>
						</svg>
					</button>
					<button
						aria-label="List View"
						class="m-0 rounded-r p-2 pr-1 text-gray-800 hover:bg-gray-500 hover:text-gray-300 {isListView
							? 'bg-blue-300'
							: 'bg-gray-400'}"
						onclick={() => (isListView = true)}
					>
						<svg
							class="mr-2 h-4 w-4 fill-current"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="8" y1="6" x2="21" y2="6"></line>
							<line x1="8" y1="12" x2="21" y2="12"></line>
							<line x1="8" y1="18" x2="21" y2="18"></line>
							<line x1="3" y1="6" x2="3" y2="6"></line>
							<line x1="3" y1="12" x2="3" y2="12"></line>
							<line x1="3" y1="18" x2="3" y2="18"></line>
						</svg>
					</button>
				</div>
			</div>

			{#if videos.length === 0}
				<h1 class="text-sm italic">No videos</h1>
			{/if}

			{#if isListView}
				<ul class="video-list">
					{#each videos as video}
						<li
							class="video-list-item"
							ondragstart={(event) => onDragStartVideo(event, video)}
							role="video {video.title}"
						>
							<a href={`/video/${video.id}`} target="_blank" rel="noopener noreferrer">
								{video.title} ({formatDuration(video.durationSec)})
							</a>
						</li>
					{/each}
				</ul>
			{:else}
				<div
					class="video-gallery grid gap-3"
					style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));"
				>
					{#each videos as video}
						<!-- todo ondragend={() => (dragVideoId = -1)}-->
						<div
							class="video-card-container"
							ondragstart={(event) => onDragStartVideo(event, video)}
							role="video {video.title}"
						>
							<a href={`/video/${video.id}`}>
								<div class="video-card overflow-hidden rounded-lg bg-white shadow-md">
									<div class="video-body relative">
										<img
											src={video.thumbnailImg}
											alt="{video.title} thumbnail"
											class="static h-auto w-full"
										/>
										<img
											src={video.thumbnailGif}
											alt="{video.title} gif"
											class="gif h-auto w-full"
										/>
										<div
											class="video-duration bg-opacity-75 absolute right-2 bottom-2 rounded bg-black px-2 py-1 text-xs text-white"
										>
											{formatDuration(video.durationSec)}
										</div>
									</div>
								</div>
								<div class="mt-0">
									<p class="text-base text-sm font-semibold">
										{video.title}
									</p>
								</div>
							</a>
						</div>
					{/each}
				</div>
			{/if}
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
		max-height: 100vh;
	}
	.video-card-container {
		width: 200px;
	}
	.video-list {
		list-style-type: none;
		padding: 0;
	}
	.video-list-item {
		padding: 8px;
		border-bottom: 1px solid #ddd;
	}
	.video-gallery-container {
		max-height: 100vh;
	}
</style>
