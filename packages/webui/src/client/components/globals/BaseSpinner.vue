<script setup lang="ts">
const { size = 20 } = defineProps<{ size?: number }>();
</script>

<template>
	<span
		class="base-spinner"
		role="status"
		aria-live="polite"
		:style="{ width: `${size}px`, height: `${size}px` }"
	>
		<span class="sr-only">Loading</span>
	</span>
</template>

<style scoped>
.base-spinner {
	display: inline-block;
	flex-shrink: 0;
	border: 2px solid currentColor;
	border-right-color: transparent;
	border-radius: 50%;
	animation: base-spinner-rotate 0.75s linear infinite;
	vertical-align: middle;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

@keyframes base-spinner-rotate {
	to {
		transform: rotate(360deg);
	}
}

@media (prefers-reduced-motion: reduce) {
	.base-spinner {
		animation-duration: 1.5s;
	}
}
</style>
