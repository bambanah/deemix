<template>
	<details
		:class="[data.staticClass, { 'with-arrow': props.withArrow }]"
		:style="data.staticStyle"
	>
		<summary class="cursor-pointer">
			<slot name="title">Setting</slot>
		</summary>

		<div class="my-5 space-y-5">
			<slot name="default"></slot>
		</div>
	</details>
</template>

<script>
export default {
	props: {
		withArrow: {
			type: Boolean,
			default: true,
		},
	},
};
</script>

<style>
details > summary::marker {
	display: none;
}

details.with-arrow > summary::marker {
	display: initial;
	vertical-align: var(--arrow-v-align, super);
}
</style>
