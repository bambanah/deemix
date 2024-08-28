<template>
	<button
		class="btn-primary z-10 m-0 flex h-16 w-16 items-center justify-center rounded-full border-solid border-transparent p-1"
		@click="router.back()"
	>
		<i class="material-icons mirrored text-4xl text-white">forward</i>
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
