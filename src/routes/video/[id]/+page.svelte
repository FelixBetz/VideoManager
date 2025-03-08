<script lang="ts">
	import VideoPlayer from '$lib/VideoPlayer.svelte';
	import { tick } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let isEditing = $state(false);

	let video = $state(data);

	let editScrollAnker: HTMLElement | undefined = $state();

	let editTitle = $state('');
	let editTags: string[] = $state([]);

	async function toggleEdit() {
		isEditing = !isEditing;
		if (isEditing) {
			editTitle = video.title;
			editTags = video.tags;
		}

		await tick();
		editScrollAnker?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

{#if video}
	<div class="video-wrapper 100 flex flex-col items-center p-4">
		<h2 class="mb-4 text-2xl font-bold">{video.title}</h2>

		<div class="relative mx-auto w-full max-w-4xl">
			<VideoPlayer video={data} />

			<div class="mt-1 w-full">
				<ul class="flex flex-wrap items-center justify-start space-x-2">
					{#each video.tags as tag}
						<li class="mr-2 rounded-full bg-blue-500 px-3 py-1 text-sm text-white">{tag}</li>
					{/each}
					{#if !isEditing}
						<li class="ml-auto">
							<button
								class="focus:ring-opacity-50 m-0 flex items-center justify-center text-blue-500 underline hover:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
								onclick={toggleEdit}
							>
								Edit
							</button>
						</li>
						<li class="mr-1 ml-1">|</li>
					{/if}
					<li class="text-sm text-gray-600" class:ml-auto={isEditing}>
						Original:
						<a
							href={video.orginalUrl}
							target="_blank"
							class="text-blue-500 underline hover:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							{video.orginalTitle}
						</a>
					</li>
					<li class="mr-1 ml-1">|</li>
					<li class=" text-sm text-gray-600">
						{video.createdDate.toLocaleDateString('de-DE', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric'
						})}
					</li>
				</ul>
			</div>

			{#if isEditing}
				<form
					class="space-y-6 rounded-lg bg-white p-6 shadow-md"
					method="POST"
					enctype="multipart/form-data"
				>
					<div class="mt-4 w-full rounded-lg bg-gray-100 p-4 pt-1 shadow-md">
						<div class="mt-4">
							<h1 class="text-xl font-semibold text-gray-800">Edit Video Details</h1>
							<label for="title" class="mt-2 block text-sm font-medium text-gray-700">Title:</label>
							<input
								id="title"
								type="text"
								name="title"
								bind:value={editTitle}
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							/>
						</div>

						<div class="mt-4">
							<label for="tags" class="block text-sm font-medium text-gray-700">Tags:</label>
							<div class="mt-1 flex flex-wrap space-x-2">
								{#each editTags as _, index}
									<div class="flex items-center space-x-1">
										<input
											type="text"
											bind:value={editTags[index]}
											class="rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
										/>
										<button
											type="button"
											class="text-red-500 hover:text-red-700 focus:outline-none"
											onclick={() => editTags.splice(index, 1)}
										>
											&times;
										</button>
									</div>
								{/each}

								<button
									type="button"
									class="ml-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 p-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
									onclick={() => editTags.push('')}
								>
									Add Tag
								</button>
							</div>
						</div>

						<div class="mt-4 flex justify-end space-x-2">
							<button
								type="submit"
								class="focus:ring-opacity-50 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
							>
								Save Changes
							</button>
							<button
								class="focus:ring-opacity-50 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
								onclick={toggleEdit}
							>
								Cancel
							</button>
						</div>
					</div>

					<div bind:this={editScrollAnker} class="mt-4"></div>
					<input type="hidden" name="tags" value={JSON.stringify(editTags)} />
					<input type="hidden" name="video" value={JSON.stringify(video)} />
				</form>
			{/if}
		</div>
	</div>
{/if}
