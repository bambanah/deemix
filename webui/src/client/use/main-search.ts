import { fetchData } from "@/utils/api-utils.js";
import { ref } from "vue";

interface SearchResult {
	QUERY?: string;
	AUTOCORRECT?: boolean;
	ORDER?: string[];
	TOP_RESULT?: any[];
}

const searchResult = ref<SearchResult>({});

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
