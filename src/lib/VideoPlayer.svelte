<script lang="ts">
	export let videoSrc = '/videos/test_video.mp4';
	let videoElement: HTMLVideoElement;
	let previewCanvas: HTMLCanvasElement;
	let previewContext: CanvasRenderingContext2D | null = null;
	let previewTime = 0;
	let offscreenVideoElement: HTMLVideoElement;

	function handleMouseMove(event: MouseEvent) {
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
			if (previewContext) {
				previewContext.drawImage(
					offscreenVideoElement,
					0,
					0,
					previewCanvas.width,
					previewCanvas.height
				);
			}
		};
	}

	function handleMouseLeave() {
		previewCanvas.style.display = 'none';
	}

	function handleMouseEnter() {
		previewCanvas.style.display = 'block';
	}

	$: if (previewCanvas) {
		previewContext = previewCanvas.getContext('2d');
	}
</script>

<div class="video-container">
	<video
		bind:this={videoElement}
		width="640"
		height="480"
		controls
		on:mousemove={handleMouseMove}
		on:mouseleave={handleMouseLeave}
		on:mouseenter={handleMouseEnter}
	>
		<source src={videoSrc} type="video/mp4" />
		<track kind="captions" src="captions.vtt" srclang="en" label="English">
		Your browser does not support the video tag.
	</video>
	<div class="progress">
		<canvas class="preview" bind:this={previewCanvas} width="160" height="90"></canvas>
	</div>
	<video bind:this={offscreenVideoElement} style="display: none;">
		<source src={videoSrc} type="video/mp4" />
		<track kind="captions" src="captions.vtt" srclang="en" label="English">
	</video>
</div>

<style>
	.preview {
		position: absolute;
		display: none;
		z-index: 1000; /* Ensure the preview is always on top */
	}
	.progress:hover .preview {
		display: block;
	}
</style>
