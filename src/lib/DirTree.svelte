<script lang="ts">
	import DirTree from './DirTree.svelte';
	import type { Directory } from './types';
	import { slide } from 'svelte/transition';

	let expanded = $state(true);

	let {
		directory = {
			uuid: '',
			name: '',
			subDirectories: [],
			videoIds: []
		},
		currentDir = null,
		selectDirectory,
		onDrop,
		onDragOver,
		onDragStart
	}: {
		selectDirectory: (pDirectroy: Directory) => void;
		directory: Directory;
		currentDir: Directory | null;
		onDrop: (event: DragEvent, pDirectory: Directory) => void;
		onDragOver: (event: DragEvent) => void;
		onDragStart: (event: DragEvent, pDirectory: Directory) => void;
	} = $props();

	function toggle() {
		expanded = !expanded;
	}
</script>

<div
	class:selected={directory === currentDir}
	ondrop={(event) => onDrop(event, directory)}
	ondragover={onDragOver}
	ondragstart={(event) => onDragStart(event, directory)}
	role="director {directory.name}"
	draggable="true"
>
	<button class:expanded class="dir-button" onclick={() => selectDirectory(directory)}
		>{directory.name}
	</button>

	{#if directory.subDirectories.length > 0}
		<button onclick={toggle}>{expanded ? '🡅' : '🠟'}</button>
	{/if}
</div>
{#if expanded}
	<ul transition:slide={{ duration: 300 }} class="tree-item">
		{#each directory.subDirectories as subdir}
			<li>
				<DirTree
					{selectDirectory}
					directory={subdir}
					{currentDir}
					{onDragOver}
					{onDrop}
					{onDragStart}
				/>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.dir-button {
		padding: 0 0 0 1.5em;
		background: url(folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
		border: none;
		font-size: 14px;
	}

	.expanded {
		background-image: url(folder-open.svg);
	}

	.tree-item {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #ff3e00;
	}

	.tree-item > li {
		padding: 0.2em 0;
	}

	.selected {
		font-weight: bold;
		background-color: #e0e0e0;
	}
</style>
