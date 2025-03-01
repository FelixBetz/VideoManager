<script lang="ts">
	import VideoPlayer from '$lib/VideoPlayer.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<VideoPlayer video={data} />
