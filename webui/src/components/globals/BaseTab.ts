import { defineComponent } from "vue";

export const BaseTab = defineComponent({
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
