<script setup lang="ts">
import { downloadQualities } from "@/data/qualities";
import { sendAddToQueue } from "@/utils/downloads";
import { emitter } from "@/utils/emitter";
import { copyToClipboard, generatePath } from "@/utils/utils";
import { computed, nextTick, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const contextMenu = ref<HTMLElement | null>(null);

const menuOpen = ref(false);
const xPos = ref<string | number>(0);
const yPos = ref<string | number>(0);
const deezerHref = ref("");
const generalHref = ref("");
const imgSrc = ref("");

const options = computed(() => {
	const options = {
		cut: {
			label: t("globals.cut"),
			show: false,
			position: 1,
			action: () => {
				document.execCommand("Cut");
			},
		},
		copy: {
			label: t("globals.copy"),
			show: false,
			position: 2,
			action: () => {
				document.execCommand("Copy");
			},
		},
		copyLink: {
			label: t("globals.copyLink"),
			show: false,
			position: 3,
			action: () => {
				copyToClipboard(generalHref.value);
			},
		},
		copyImageLink: {
			label: t("globals.copyImageLink"),
			show: false,
			position: 4,
			action: () => {
				copyToClipboard(imgSrc.value);
			},
		},
		copyDeezerLink: {
			label: t("globals.copyDeezerLink"),
			show: false,
			position: 5,
			action: () => {
				copyToClipboard(deezerHref.value);
			},
		},
		paste: {
			label: t("globals.paste"),
			show: false,
			position: 6,
			action: () => {
				// Paste does not always work
				if ("clipboard" in navigator) {
					navigator.clipboard.readText().then((text) => {
						document.execCommand("insertText", undefined, text);
					});
				} else {
					document.execCommand("paste");
				}
			},
		},
	};

	const nextValuePosition = Object.values(options).length + 1;

	downloadQualities.forEach((quality, index) => {
		options[quality.objName] = {
			label: `${t("globals.download", { thing: quality.label })}`,
			show: false,
			position: nextValuePosition + index,
			action: sendAddToQueue.bind(null, deezerHref.value, quality.value),
		};
	});

	return options;
});

const sortedOptions = computed(() => {
	return Object.values(options.value).sort((first, second) => {
		return first.position < second.position ? -1 : 1;
	});
});

function showSearchbarMenu(url) {
	const searchbar = document.getElementById("searchbar");
	searchbar.dataset.cmLink = url;
	const contextMenuEvent = {
		pageX: 115,
		pageY: 57,
		target: searchbar,
		dummy: true,
	};
	showMenu(contextMenuEvent);
	delete searchbar.dataset.cmLink;
}
function showMenu(contextMenuEvent) {
	const { pageX, pageY, target: elementClicked } = contextMenuEvent;
	const path = generatePath(elementClicked);
	let deezerLink = null;
	let isLinkOnly = false;

	// Searching for the first element with a data-link attribute
	// let deezerLink = this.searchForDataLink(...)
	for (let i = 0; i < path.length; i++) {
		if (path[i] == document) break;

		if (path[i].matches("[data-link]")) {
			deezerLink = path[i].dataset.link;
			break;
		}

		if (path[i].matches("[data-cm-link]")) {
			deezerLink = path[i].dataset.cmLink;
			break;
		}

		if (path[i].matches("[data-link-only]")) {
			deezerLink = path[i].dataset.linkOnly;
			isLinkOnly = true;
			break;
		}
	}

	const isLink = elementClicked.matches("a");
	const isImage = elementClicked.matches("img");
	const isSearchbar = elementClicked.matches("input#searchbar");
	const hasDeezerLink = !!deezerLink;

	if (!isLink && !isImage && !hasDeezerLink) return;

	if (!contextMenuEvent.dummy) contextMenuEvent.preventDefault();
	menuOpen.value = true;
	positionMenu(pageX, pageY);

	if (isLink) {
		// Show 'Copy Link' option
		generalHref.value = elementClicked.href;
		options.value.copyLink.show = true;
	}

	if (isImage) {
		// Show 'Copy Image Link' option
		imgSrc.value = elementClicked.src;
		options.value.copyImageLink.show = true;
	}

	if (deezerLink) {
		// Show 'Copy Deezer Link' option
		deezerHref.value = deezerLink;
		showDeezerOptions(isSearchbar, isLinkOnly);
	}
}
function hideMenu() {
	if (!menuOpen.value) return;

	// Finish all operations before closing (may be not necessary)
	nextTick()
		.then(() => {
			menuOpen.value = false;

			options.value.copyLink.show = false;
			options.value.copyDeezerLink.show = false;
			options.value.copyImageLink.show = false;

			downloadQualities.forEach((quality) => {
				options.value[quality.objName].show = false;
			});
		})
		.catch((err) => {
			console.error(err);
		});
}
function positionMenu(newX, newY) {
	xPos.value = `${newX}px`;
	yPos.value = `${newY}px`;

	nextTick().then(() => {
		const { innerHeight, innerWidth } = window;
		const menuXOffest = newX + contextMenu.value.getBoundingClientRect().width;
		const menuYOffest = newY + contextMenu.value.getBoundingClientRect().height;

		if (menuXOffest > innerWidth) {
			const difference = menuXOffest - innerWidth + 15;
			xPos.value = `${newX - difference}px`;
		}

		if (menuYOffest > innerHeight) {
			const difference = menuYOffest - innerHeight + 15;
			yPos.value = `${newY - difference}px`;
		}
	});
}
function showDeezerOptions(isSearchbar, isLinkOnly) {
	if (!isSearchbar) options.value.copyDeezerLink.show = true;

	if (!isLinkOnly)
		downloadQualities.forEach((quality) => {
			options.value[quality.objName].show = true;
		});
}

onMounted(() => {
	emitter.on("ContextMenu:searchbar", showSearchbarMenu);
	document.body.addEventListener("contextmenu", showMenu);
	document.body.addEventListener("click", hideMenu);
});
</script>

<template>
	<div
		v-show="menuOpen"
		ref="contextMenu"
		class="context-menu"
		:style="{ top: yPos, left: xPos }"
	>
		<button
			v-for="option of sortedOptions"
			v-show="option.show"
			:key="option.label"
			class="btn menu-option"
			@click.prevent="option.action"
		>
			<span class="menu-option__text">{{ option.label }}</span>
		</button>
	</div>
</template>

<style scoped>
.context-menu {
	position: absolute;
	top: 0;
	left: 0;
	min-width: 100px;
	border-radius: 7px;
	background: var(--secondary-background);
	box-shadow: 4px 10px 18px 0px hsla(0, 0%, 0%, 0.15);
	overflow: hidden;
	z-index: 10000;
}

.menu-option {
	display: flex;
	align-items: center;
	width: 100%;
	height: 40px;
	padding-left: 10px;
	padding-right: 10px;
	color: var(--foreground);
	cursor: pointer;
}
.menu-option:hover {
	background: var(--table-highlight);
	filter: brightness(150%);
}
.menu-option__text {
	text-transform: capitalize;
}

/* Resetting buttons only for this component (because the style is scoped) */
button {
	color: var(--primary-text);
	color: unset;
	background-color: var(--primary-color);
	background-color: unset;
	min-width: unset;
	position: unset;
	border: unset;
	border-radius: unset;
	font-family: unset;
	font-weight: unset;
	font-size: unset;
	padding: unset;
	margin-right: unset;
	height: unset;
	text-transform: unset;
	cursor: unset;
	transition: unset;
}
button:focus {
	outline: none;
}
button:active {
	background-color: unset;
	transform: unset;
}
button:hover {
	background: unset;
	border: unset;
}
</style>
