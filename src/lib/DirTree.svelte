<script lang="ts">
	import DirTree from './DirTree.svelte';
	import type { Directory } from './types';

	let {
		getDirectory,
		directory = {
			id: 0,
			name: '',
			thumbnailPath: '',
			parentDirectory: null,
			subDirectories: [],
			videos: []
		}
	}: { getDirectory: (pDirectroy: Directory) => void; directory: Directory } = $props();
</script>

<ul class="list-disc pl-5">
	<li class="text-lg font-bold">
		<button onclick={() => getDirectory(directory)}>{directory.name}</button>
	</li>
	<ul>
		{#each directory.subDirectories as subdir}
			<li>
				<DirTree {getDirectory} directory={subdir} />
			</li>
		{/each}
	</ul>
</ul>
