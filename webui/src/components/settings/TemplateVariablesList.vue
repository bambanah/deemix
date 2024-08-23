<template>
	<BaseAccordion style="--arrow-v-align: baseline; margin-bottom: 3rem">
		<template #title>
			<slot name="title" />
		</template>

		<div
			class="flex flex-wrap p-4 space-x-2 rounded-2xl bg-background-secondary"
		>
			<span
				v-for="(templateVariable, i) in templateVariables"
				:key="i"
				class="inline-block p-2 mt-2 tracking-wider rounded cursor-pointer bg-panels-bg first:ml-2 hover:shadow-outline"
				@click="$emit('variable-click', templateVariable)"
			>
				{{ templateVariable }}
			</span>
		</div>
	</BaseAccordion>
</template>

<script>
import BaseAccordion from "@/components/globals/BaseAccordion.vue";

export default {
	components: { BaseAccordion },
	props: {
		templateVariables: {
			type: Array,
			required: true,
		},
	},
};
</script>
