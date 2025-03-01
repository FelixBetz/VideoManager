<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultVideo, type Video } from '$lib/types';

	function resetFields() {
		video.title = 'test_video.mp4';

		video.orginalTitle = 'dummy';
		video.orginalUrl = 'dummy';
	}

	let video: Video = $state(defaultVideo());

	onMount(() => {
		resetFields();
	});
</script>

<h1 class="mb-4 text-2xl font-bold">Add Video</h1>

<form class="space-y-4" method="POST" enctype="multipart/form-data">
	<div>
		<label for="title" class="block text-sm font-medium text-gray-700">Title:</label>
		<input
			type="text"
			id="title"
			name="title"
			bind:value={video.title}
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
			name="orginalTitle"
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
			name="orginalUrl"
			bind:value={video.orginalUrl}
			required
			class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		/>
	</div>

	<div>
		<label for="videoFile" class="block text-sm font-medium text-gray-700">Upload Video File:</label
		>
		<input
			type="file"
			id="videoFile"
			name="videoFile"
			accept="video/*"
			required
			class="mt-1 block h-32 w-full rounded-md border-4 border-dotted border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm"
		/>
	</div>
	<button
		type="submit"
		class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
	>
		Add Video
	</button>
</form>
