<script setup lang="ts">
defineProps({
	withArrow: {
		type: Boolean,
		default: true,
	},
});
</script>

<template>
	<details :class="{ 'with-arrow': withArrow }">
		<summary class="cursor-pointer">
			<slot name="title">Setting</slot>
		</summary>

		<div class="my-5 space-y-5">
			<slot name="default"></slot>
		</div>
	</details>
</template>

<style>
details > summary::marker {
	display: none;
}

details.with-arrow > summary::marker {
	display: initial;
	vertical-align: var(--arrow-v-align, super);
}
</style>
