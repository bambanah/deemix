import { ref } from "vue";
import { fetchData } from "@/utils/api-utils";

const result = ref({});

function performSearch({ term, type, start = 0, nb = 30 }) {
	fetchData("search", {
		term,
		type,
		start,
		nb,
	}).then((data) => {
		result.value = data;
	});
}

export function useSearch() {
	return {
		result,
		performSearch,
	};
}
