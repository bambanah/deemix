export const getFormItem = (formEl: HTMLFormElement) => (item: string) => {
	const element = formEl.elements.namedItem(item);

	return {
		[item]:
			element instanceof HTMLInputElement ||
			element instanceof HTMLTextAreaElement ||
			element instanceof HTMLSelectElement ||
			element instanceof RadioNodeList
				? element.value
				: element,
	};
};
