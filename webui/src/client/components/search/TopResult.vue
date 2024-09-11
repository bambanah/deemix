<script setup lang="ts">
import { upperCaseFirstLowerCaseRest } from "@/utils/texts";
import CoverContainer from "@/components/globals/CoverContainer.vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t, n } = useI18n();

interface Props {
	info: {
		type: string;
		id: string;
		title: string;
		picture: string;
		link: string;
		artist: string;
		nb_fan: number;
		nb_song: string;
	};
}

const { info } = defineProps<Props>();

const fansNumber = computed(() => {
	let number: string;

	if (info.nb_fan) {
		try {
			number = n(info.nb_fan);
		} catch {
			number = n(info.nb_fan, { locale: "en" });
		}
	}

	return info.type === "artist"
		? t("search.fans", { n: number })
		: t("globals.by", { artist: info.artist }) +
				" - " +
				t("globals.listTabs.trackN", info.nb_song);
});
</script>

<template>
	<div class="flex flex-col items-center justify-center">
		<router-link
			v-slot="{ navigate }"
			custom
			:to="{
				name: upperCaseFirstLowerCaseRest(info.type),
				params: { id: info.id },
			}"
		>
			<div role="link" class="cursor-pointer" @click="navigate">
				<CoverContainer
					class="h-40 w-40"
					:is-rounded="info.type !== 'artist'"
					:is-circle="info.type === 'artist'"
					:cover="info.picture"
					:link="info.link"
					@click.stop="$emit('add-to-queue', $event)"
				/>

				<p
					class="hover:text-primary mb-1 mt-4 text-center text-xl transition-colors duration-200 ease-in-out"
				>
					{{ info.title }}
				</p>
			</div>
		</router-link>

		<p class="secondary-text mb-3 text-center">
			{{ fansNumber }}
		</p>
		<span class="bg-primary rounded-xl p-1 px-2 text-center text-xs capitalize">
			{{ t(`globals.listTabs.${info.type}`, 1) }}
		</span>
	</div>
</template>
