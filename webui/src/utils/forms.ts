export const getFormItem = (formEl: HTMLFormElement) => (item: string) => {
	const element = formEl.elements.namedItem(item);

	return {
		[item]: element?.value,
	};
};
