/**
 * @param {HTMLFormElement} formEl
 * @returns {function(item: string): {}}
 * @since	1.6.1
 */
export const getFormItem = (formEl) => (item) => {
	const element = formEl.elements.namedItem(item);

	return {
		[item]: element.value,
	};
};
