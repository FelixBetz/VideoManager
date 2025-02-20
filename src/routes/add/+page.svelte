<script lang="ts">
	import { onMount } from 'svelte';
	import { type Video } from '$lib/types';

	function resetFields() {
		video.title = 'test_video.mp4';
		video.videoPath = 'test_video.mp4';
		video.thumbnailPath =
			'https://fastly.picsum.photos/id/417/1280/720.jpg?hmac=KP-fN2UIbyTCrkYJm9Rrvauae7hUfY4u-QWR6dFIaGQ';
		video.orginalTitle = 'dummy';
		video.orginalUrl = 'dummy';
		video.directory = 'dummy';
	}

	let video: Video = $state({
		id: -1,
		title: '',
		videoPath: '',
		thumbnailPath: '',
		orginalTitle: '',
		orginalUrl: '',
		directory: ''
	});

	function addVideo() {
		resetFields;
	}

	onMount(() => {
		resetFields();
	});
</script>

<pre>{JSON.stringify(video, null, 2)}</pre>

<h1 class="mb-4 text-2xl font-bold">Add Video</h1>

<form on:submit|preventDefault={addVideo} class="space-y-4">
	<div>
		<label for="title" class="block text-sm font-medium text-gray-700">Title:</label>
		<input
			type="text"
			id="title"
			bind:value={video.title}
			required
			class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		/>
	</div>
	<div>
		<label for="videoPath" class="block text-sm font-medium text-gray-700">Video Path:</label>
		<input
			type="text"
			id="videoPath"
			bind:value={video.videoPath}
			required
			class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		/>
	</div>
	<div>
		<label for="thumbnailPath" class="block text-sm font-medium text-gray-700"
			>Thumbnail Path:</label
		>
		<input
			type="text"
			id="thumbnailPath"
			bind:value={video.thumbnailPath}
			required
			class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		/>
	</div>
	<div>
		<label for="orginalTitle" class="block text-sm font-medium text-gray-700">Original Title:</label
		>
		<input
			type="text"
			id="orginalTitle"
			bind:value={video.orginalTitle}
			required
			class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		/>
	</div>
	<div>
		<label for="orginalUrl" class="block text-sm font-medium text-gray-700">Original URL:</label>
		<input
			type="text"
			id="orginalUrl"
			bind:value={video.orginalUrl}
			required
			class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		/>
	</div>
	<div>
		<label for="directory" class="block text-sm font-medium text-gray-700">Directory:</label>
		<input
			type="text"
			id="directory"
			bind:value={video.directory}
			required
			class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		/>
	</div>
	<button
		type="submit"
		class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
		>Add Video</button
	>
</form>
