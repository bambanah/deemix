export function standardizeData(rawObj, formatFunc) {
  if (!rawObj.hasLoaded) {
    return null;
  } else {
    const { data: rawData } = rawObj;
    const formattedData = [];

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
