import { defineStore } from "pinia";
import { computed, ref } from "vue";

/** Global loading state: pending API requests and route navigations */
export const useLoadingStore = defineStore("loading", () => {
	const activeRequests = ref(0);
	const isNavigating = ref(false);

	const isLoading = computed(
		() => activeRequests.value > 0 || isNavigating.value
	);

	function startRequest() {
		activeRequests.value++;
	}

	function finishRequest() {
		activeRequests.value = Math.max(0, activeRequests.value - 1);
	}

	function setNavigating(value: boolean) {
		isNavigating.value = value;
	}

	/** Tracks a promise as a pending request */
	function track<T>(promise: Promise<T>): Promise<T> {
		startRequest();
		return promise.finally(finishRequest);
	}

	return {
		activeRequests,
		isNavigating,
		isLoading,
		startRequest,
		finishRequest,
		setNavigating,
		track,
	};
});
