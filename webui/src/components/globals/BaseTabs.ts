import { defineComponent } from "vue";

// https://vuejs.org/v2/guide/render-function.html
// https://vuejs.org/v2/guide/render-function.html#createElement-Arguments

export const BaseTabs = defineComponent({
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
