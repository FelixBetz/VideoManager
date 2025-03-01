<script lang="ts">
	import { type Video } from '$lib/types';
	import { onMount } from 'svelte';
	let { video }: { video: Video } = $props();

	onMount(async () => {
		const Plyr = (await import('plyr')).default;

		//https://github.com/sampotts/plyr/tree/master#preview-thumbnails
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const player = new Plyr('#player', {
			enabled: true,

			// Logging to console
			debug: false,

			// Default time to skip when rewind/fast forward
			seekTime: 10,

			// Default volume
			volume: 1,
			muted: false,

			// Display the media duration on load in the current time position
			// If you have opted to display both duration and currentTime, this is ignored
			displayDuration: true,

			// Invert the current time to be a countdown
			invertTime: true,

			// Clicking the currentTime inverts it's value to show time left rather than elapsed
			toggleInvert: true,

			// Click video container to play/pause
			clickToPlay: true,

			// Auto hide the controls
			hideControls: true,

			// Reset to start when playback ended
			resetOnEnd: false,

			// Disable the standard context menu
			disableContextMenu: true,

			// Set loops
			loop: {
				active: false
				// start: null,
				// end: null,
			},

			// Speed default and options to display
			speed: {
				selected: 1,
				// The options to display in the UI, if available for the source media (e.g. Vimeo and YouTube only support 0.5x-4x)
				options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4]
			},

			// Keyboard shortcut settings
			keyboard: {
				focused: true,
				global: true
			},

			// Display tooltips
			tooltips: {
				controls: true,
				seek: true
			},

			// Captions settings
			captions: {
				active: false,
				language: 'auto',
				// Listen to new tracks added after Plyr is initialized.
				// This is needed for streaming captions, but may result in unselectable options
				update: false
			},

			// Fullscreen settings
			fullscreen: {
				enabled: true, // Allow fullscreen?
				fallback: true, // Fallback using full viewport/window
				iosNative: false // Use the native fullscreen in iOS (disables custom controls)
				// Selector for the fullscreen container so contextual / non-player content can remain visible in fullscreen mode
				// Non-ancestors of the player element will be ignored
				// container: null, // defaults to the player element
			},

			// Local storage
			storage: {
				enabled: true,
				key: 'plyr'
			},

			// Default controls
			controls: [
				'play-large',
				//'restart',
				'rewind',
				'play',
				'fast-forward',
				'progress',
				'current-time',
				'duration',
				'mute',
				'volume',
				//'captions',
				'settings',
				'pip',
				//'airplay',
				'download',
				'fullscreen'
			],
			settings: ['speed'],

			// Preview Thumbnails plugin
			previewThumbnails: {
				enabled: true,
				src: [video?.vttPath]
			}
		});
	});
</script>

<div class="video-wrapper flex flex-col items-center rounded-lg bg-gray-100 p-4 shadow-lg">
	{#if video}
		<h2 class="mb-4 text-2xl font-bold">{video.title}</h2>
		<div class="video-container relative rounded-lg" style="width: 640px; height: 480px">
			<video id="player" controls data-poster={video.thumbnailImg}>
				<source src={video.videoPath} type="video/mp4" />
				<track kind="captions" label="English captions" srclang="en" default />
			</video>
		</div>
		<div class="video-info mt-4 text-center">
			<p>{video.createdDate}</p>
			<p class="text-sm text-gray-600">
				Original: <a href={video.orginalUrl} target="_blank" class="text-blue-500 underline"
					>{video.orginalTitle}</a
				>
			</p>
		</div>
	{/if}
</div>
