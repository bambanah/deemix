import { ref } from "vue";
import { fetchData } from "@/utils/api";

const searchResult = ref({});

function performMainSearch(searchTerm) {
	fetchData("mainSearch", { term: searchTerm }).then((data) => {
		searchResult.value = data;
	});
}

export function useMainSearch() {
	return {
		searchResult,
		performMainSearch,
	};
}
