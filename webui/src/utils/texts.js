/**
 * @param {string}	text
 */
export const upperCaseFirstLowerCaseRest = (text) =>
	text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
