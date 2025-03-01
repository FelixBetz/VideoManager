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
		onDragStart,
		onDelete
	}: {
		selectDirectory: (pDirectroy: Directory) => void;
		directory: Directory;
		currentDir: Directory | null;
		onDrop: (event: DragEvent, pDirectory: Directory) => void;
		onDragOver: (event: DragEvent) => void;
		onDragStart: (event: DragEvent, pDirectory: Directory) => void;
		onDelete: (pDirectory: Directory) => void;
	} = $props();

	function toggle() {
		expanded = !expanded;
	}

	function onConextMenu(event: MouseEvent) {
		event.preventDefault();
		menuX = event.clientX;
		menuY = event.clientY;
		showMenu = true;
	}

	let showMenu = $state(false);
	let menuX = $state(0);
	let menuY = $state(0);
</script>

<svelte:window onclick={() => (showMenu = false)} />
{#if showMenu}
	<div
		class="context-menu fixed z-50 rounded-md border border-gray-300 bg-white p-2 shadow-lg"
		style="top: {menuY}px; left: {menuX + 10}px;"
	>
		<ul>
			<li>
				<button
					class="menu-item flex w-full cursor-pointer items-center px-4 py-2 text-red-600 hover:bg-gray-100"
					onclick={() => onDelete(directory)}
				>
					<svg
						class="mr-2 h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 6h18M9 6v12m6-12v12M4 6l1 14a2 2 0 002 2h10a2 2 0 002-2l1-14"
						></path>
					</svg>
					Delete
				</button>
			</li>
			<li>
				<button
					class="menu-item flex w-full cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
				>
					Rename
				</button>
			</li>
		</ul>
	</div>
{/if}

<div
	class:selected={directory === currentDir}
	ondrop={(event) => onDrop(event, directory)}
	ondragover={onDragOver}
	ondragstart={(event) => onDragStart(event, directory)}
	role="director {directory.name}"
	draggable="true"
	oncontextmenu={onConextMenu}
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
					{onDelete}
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
