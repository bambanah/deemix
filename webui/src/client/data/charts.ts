import { fetchData } from "@/utils/api";

export function getChartsData() {
	return fetchData("getCharts");
}

export function getChartTracks(chartId: string) {
	return fetchData("getChartTracks", { id: chartId });
}
