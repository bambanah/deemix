<template>
	<button
		class="btn-primary border-transparent border-solid flex items-center justify-center p-1 m-0 w-16 h-16 rounded-full z-10"
		@click="$router.back()"
	>
		<i class="material-icons mirrored text-4xl text-white">forward</i>
	</button>
</template>

<style scoped>
button {
	transition: background 200ms ease-in-out;
}
</style>
