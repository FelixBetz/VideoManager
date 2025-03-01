<script lang="ts">
	import { type Video } from '$lib/types';
	let { video = null }: { video: Video | null } = $props();
	let videoElement: HTMLVideoElement | undefined = $state();
	let previewCanvas: HTMLCanvasElement | undefined = $state();
	let previewContext: CanvasRenderingContext2D | null = $derived(
		previewCanvas === undefined ? null : previewCanvas.getContext('2d')
	);
	let previewTime = 0;
	let offscreenVideoElement: HTMLVideoElement | undefined = $state();

	function handleMouseMove(event: MouseEvent) {
		if (videoElement && previewCanvas && offscreenVideoElement) {
			const rect = videoElement.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = rect.bottom - previewCanvas.height - 30;
			const percentage = x / rect.width;
			previewTime = percentage * videoElement.duration;
			previewCanvas.style.left = `${x}px`;
			previewCanvas.style.top = `${y}px`; // Position above the cursor

			offscreenVideoElement.currentTime = previewTime;
			offscreenVideoElement.pause();
			offscreenVideoElement.onseeked = () => {
				if (previewContext && previewCanvas) {
					if (offscreenVideoElement) {
						previewContext.drawImage(
							offscreenVideoElement,
							0,
							0,
							previewCanvas.width,
							previewCanvas.height
						);
					}
				}
			};
		}
	}

	function handleMouseLeave() {
		if (previewCanvas) {
			previewCanvas.style.display = 'none';
		}
	}

	function handleMouseEnter() {
		if (previewCanvas) {
			previewCanvas.style.display = 'block';
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'f' || event.key === 'F') {
			if (videoElement && videoElement.requestFullscreen) {
				videoElement.requestFullscreen();
			}
		}
	}
</script>

<div class="video-wrapper flex flex-col items-center rounded-lg bg-gray-100 p-4 shadow-lg">
	{#if video}
		<h2 class="mb-4 text-2xl font-bold">{video.title}</h2>
		<div class="video-container relative">
			<video
				bind:this={videoElement}
				width="640"
				height="480"
				controls
				onmousemove={handleMouseMove}
				onmouseleave={handleMouseLeave}
				onmouseenter={handleMouseEnter}
				onkeydown={handleKeyDown}
				class="rounded-lg shadow-md"
			>
				<source src={video.videoPath} type="video/mp4" />
				<track kind="captions" src="captions.vtt" srclang="en" label="English" />
				Your browser does not support the video tag.
			</video>
			<div class="progress">
				<canvas
					class="preview absolute z-50 hidden"
					bind:this={previewCanvas}
					width="160"
					height="90"
				></canvas>
			</div>
			<video bind:this={offscreenVideoElement} class="hidden">
				<source src={video.videoPath} type="video/mp4" />
				<track kind="captions" src="captions.vtt" srclang="en" label="English" />
			</video>
		</div>
		<div class="video-info mt-4 text-center">
			<p class="text-sm text-gray-600">
				Original: <a href={video.orginalUrl} target="_blank" class="text-blue-500 underline"
					>{video.orginalTitle}</a
				>
			</p>
		</div>
	{/if}
</div>
