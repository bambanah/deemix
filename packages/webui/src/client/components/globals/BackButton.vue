<template>
	<button
		aria-label="back"
		class="btn-primary z-10 m-0 flex h-12 w-12 items-center justify-center rounded-full border-solid border-transparent p-1 shadow-lg md:h-16 md:w-16"
		@click="router.back()"
	>
		<i class="material-icons mirrored text-3xl text-white md:text-4xl"
			>forward</i
		>
	</button>
</template>

<script setup lang="ts">
import router from "@/router";
</script>

<style scoped>
button {
	transition: background 200ms ease-in-out;
}
</style>
