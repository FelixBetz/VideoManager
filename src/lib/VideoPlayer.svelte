<script lang="ts">
	let { src = '' } = $props();
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

<div class="video-container">
	<video
		bind:this={videoElement}
		width="640"
		height="480"
		controls
		onmousemove={handleMouseMove}
		onmouseleave={handleMouseLeave}
		onmouseenter={handleMouseEnter}
		onkeydown={handleKeyDown}
	>
		<source {src} type="video/mp4" />
		<track kind="captions" src="captions.vtt" srclang="en" label="English" />
		Your browser does not support the video tag.
	</video>
	<div class="progress">
		<canvas class="preview" bind:this={previewCanvas} width="160" height="90"></canvas>
	</div>
	<video bind:this={offscreenVideoElement} style="display: none;">
		<source {src} type="video/mp4" />
		<track kind="captions" src="captions.vtt" srclang="en" label="English" />
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
