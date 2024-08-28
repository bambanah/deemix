import { defineComponent } from "vue";

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

export const BaseTabs = defineComponent({
	name: "BaseTabs",
	functional: true,
	render(h, ctx) {
		return h(
			"ul",
			{
				class: [ctx.data.class, "my-8", "section-tabs"],
				on: ctx.data.on,
			},
			ctx.slots().default
		);
	},
});
