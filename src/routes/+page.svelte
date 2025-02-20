<script lang="ts">
	import VideoGallery from '$lib/VideoGallery.svelte';

	let { data } = $props();
</script>

<VideoGallery videos={data.videos} />
