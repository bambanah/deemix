import { defineComponent } from "@vue/composition-api";

// https://vuejs.org/v2/guide/render-function.html
// https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
export const BaseTab = defineComponent({
	name: "BaseTab",
	functional: true,
	render(h, ctx) {
		return h(
			"li",
			{
				class: [ctx.data.class, "section-tabs__tab", "uppercase-first-letter"],
				on: ctx.data.on,
			},
			ctx.slots().default
		);
	},
});
