/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module "vue" {
	import { CompatVue } from "@vue/runtime-dom";
	const Vue: CompatVue;
	export default Vue;
	export * from "@vue/runtime-dom";
	const { configureCompat } = Vue;
	export { configureCompat };
}

declare global {
	interface Location {
		base: string;
	}
	interface String {
		capitalize(): string;
	}
}

export {};
