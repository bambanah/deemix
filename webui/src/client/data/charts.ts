import { fetchData } from "@/utils/api-utils";

export function getChartsData() {
	return fetchData("getCharts");
}

export function getChartTracks(chartId: string) {
	return fetchData("getChartTracks", { id: chartId });
}
