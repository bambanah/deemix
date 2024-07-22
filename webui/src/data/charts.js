import { fetchData } from '@/utils/api'

export function getChartsData () {
  return fetchData('getCharts')
}

export function getChartTracks (chartId) {
  return fetchData('getChartTracks', { id: chartId })
}
