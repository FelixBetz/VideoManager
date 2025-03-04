<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultVideo, type Video } from '$lib/types';
	import { removeFileExtension } from '$lib/utils';

	function resetFields() {
		video.title = '';

		video.orginalTitle = '';
		video.orginalUrl = '';
	}

	let video: Video = $state(defaultVideo());
	let videoPreviewUrl: string | null = $state(null);

	onMount(() => {
		resetFields();
	});
	function onFileSelected(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			const fileName = removeFileExtension(file.name);

			video.title = fileName;
			video.orginalTitle = fileName;

			const url = URL.createObjectURL(file);
			videoPreviewUrl = url;
		}
	}
</script>

<h1 class="mb-6 text-3xl font-extrabold text-gray-900">Add Video</h1>

<form
	class="space-y-6 rounded-lg bg-white p-6 shadow-md"
	method="POST"
	enctype="multipart/form-data"
>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
		<div class="col-span-2 sm:col-span-1">
			<label for="videoFile" class="block text-sm font-medium text-gray-700"
				>Upload Video File:</label
			>
			<input
				type="file"
				id="videoFile"
				name="videoFile"
				accept="video/*"
				required
				class="mt-2 block w-full rounded-md border-2 border-dotted border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				oninput={onFileSelected}
			/>
		</div>
		<div class="col-span-2 sm:col-span-1 sm:row-span-6">
			{#if videoPreviewUrl}
				<div class="mt-4 sm:mt-0">
					<label for="videoPreview" class="block text-sm font-medium text-gray-700"
						>Video Preview:</label
					>
					<video
						id="videoPreview"
						oncanplay={(e) => {
							const videoElement = e.target as HTMLVideoElement;
							videoElement.playbackRate = 5.0;
							videoElement.muted = true;
							videoElement.play();
						}}
						class="mt-2 w-full max-w-xs rounded-md border border-gray-300"
						src={videoPreviewUrl}
					>
						<track
							kind="captions"
							src="captions.vtt"
							srclang="en"
							label="English captions"
							default
						/>
					</video>
				</div>
			{/if}
		</div>
		<div class="col-span-2 sm:col-span-1">
			<label for="title" class="block text-sm font-medium text-gray-700">Title:</label>
			<input
				type="text"
				id="title"
				name="title"
				bind:value={video.title}
				required
				class="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="col-span-2 sm:col-span-1">
			<label for="orginalTitle" class="block text-sm font-medium text-gray-700"
				>Original Title:</label
			>
			<input
				type="text"
				id="orginalTitle"
				name="orginalTitle"
				bind:value={video.orginalTitle}
				required
				class="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="col-span-2 sm:col-span-1">
			<label for="orginalUrl" class="block text-sm font-medium text-gray-700">Original URL:</label>
			<input
				type="text"
				id="orginalUrl"
				name="orginalUrl"
				bind:value={video.orginalUrl}
				required
				class="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
	</div>

	<button
		type="submit"
		class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
	>
		Add Video
	</button>
</form>
