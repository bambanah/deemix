export function standardizeData(
	rawObj: { data?: any; hasLoaded?: any; error?: any },
	formatFunc: (data: any) => any
) {
	if (!rawObj.hasLoaded) {
		return null;
	} else {
		const { data: rawData } = rawObj;
		const formattedData: any[] = [];

		for (const dataElement of rawData) {
			const formatted = formatFunc(dataElement);

			formattedData.push(formatted);
		}

		return {
			data: formattedData,
			hasLoaded: rawObj.hasLoaded,
			error: rawObj.error,
		};
	}
}
