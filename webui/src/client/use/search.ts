import { fetchData } from "@/utils/api-utils";
import { ref } from "vue";

interface Result {
	next?: string;
	total?: number;
	type?: string;
	data?: any[];
	error?: string;
}

const result = ref<Result>({});

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
