<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';
	let { children } = $props();
</script>

<nav class="bg-gray-800 p-4">
	<ul class="flex space-x-4">
		<li>
			<a
				href="/"
				class="text-white no-underline hover:text-gray-400"
				class:font-bold={$page.url.pathname === '/'}
			>
				Videos
			</a>
		</li>
		<li>
			<a
				href="/add"
				class="text-white no-underline hover:text-gray-400"
				class:font-bold={$page.url.pathname === '/add'}
			>
				Add
			</a>
		</li>
	</ul>
</nav>
{@render children()}
