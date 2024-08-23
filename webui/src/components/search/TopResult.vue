<template>
	<div class="flex flex-col items-center justify-center">
		<router-link
			v-slot="{ navigate }"
			custom
			class="cursor-pointer"
			:to="{
				name: upperCaseFirstLowerCaseRest($attrs.info.type),
				params: { id: $attrs.info.id },
			}"
		>
			<div role="link" @click="navigate" @keypress.enter="navigate">
				<CoverContainer
					class="w-40 h-40"
					:is-rounded="$attrs.info.type !== 'artist'"
					:is-circle="$attrs.info.type === 'artist'"
					:cover="$attrs.info.picture"
					:link="$attrs.info.link"
					@click.stop="$emit('add-to-queue', $event)"
				/>

				<p
					class="mt-4 mb-1 text-xl text-center transition-colors duration-200 ease-in-out hover:text-primary"
				>
					{{ $attrs.info.title }}
				</p>
			</div>
		</router-link>

		<p class="mb-3 text-center secondary-text">
			{{ fansNumber }}
		</p>
		<span class="p-1 px-2 text-xs text-center capitalize bg-primary rounded-xl">
			{{ $tc(`globals.listTabs.${$attrs.info.type}`, 1) }}
		</span>
	</div>
</template>

<script>
import { upperCaseFirstLowerCaseRest } from "@/utils/texts";
import CoverContainer from "@components/globals/CoverContainer.vue";

export default {
	components: {
		CoverContainer,
	},
	computed: {
		fansNumber() {
			let number;

			try {
				number = this.$n(this.$attrs.info.nb_fan);
			} catch (error) {
				number = this.$n(this.$attrs.info.nb_fan, { locale: "en" });
			}

			return this.$attrs.info.type === "artist"
				? this.$t("search.fans", { n: number })
				: this.$t("globals.by", { artist: this.$attrs.info.artist }) +
						" - " +
						this.$tc("globals.listTabs.trackN", this.$attrs.info.nb_song);
		},
	},
	methods: {
		upperCaseFirstLowerCaseRest,
	},
};
</script>
