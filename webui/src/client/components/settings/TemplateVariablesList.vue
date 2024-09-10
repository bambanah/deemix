<script setup lang="ts">
import BaseAccordion from "@/components/globals/BaseAccordion.vue";

interface Props {
	templateVariables: string[];
}

const { templateVariables } = defineProps<Props>();
</script>

<template>
	<BaseAccordion style="--arrow-v-align: baseline; margin-bottom: 3rem">
		<template #title>
			<slot name="title"></slot>
		</template>

		<div
			class="bg-background-secondary flex flex-wrap space-x-2 rounded-2xl p-4"
		>
			<span
				v-for="(templateVariable, i) in templateVariables"
				:key="i"
				class="bg-panels-bg hover:shadow-outline mt-2 inline-block cursor-pointer rounded p-2 tracking-wider first:ml-2"
				@click="$emit('variable-click', templateVariable)"
			>
				{{ templateVariable }}
			</span>
		</div>
	</BaseAccordion>
</template>
