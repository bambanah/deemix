/**
 * Climbs the DOM until the root is reached, storing every node passed.
 * @param  {HTMLElement} el
 * @return {Array}    Contains all the nodes between el and the root
 * @since  0.0.0
 */
export function generatePath(el) {
	if (!el) {
		throw new Error("No element passed to the generatePath function!");
	}

	const path = [el];

	while ((el = el.parentNode) && el !== document) {
		path.push(el);
	}

	return path;
}

/**
 * @param {string} text
 * @returns {boolean}
 * @since  0.0.0
 */
export function isValidURL(text) {
	const lowerCaseText = text.toLowerCase();

	if (lowerCaseText.startsWith("http")) {
		if (
			lowerCaseText.includes("deezer.com") ||
			lowerCaseText.includes("deezer.page.link") ||
			lowerCaseText.includes("open.spotify.com") ||
			lowerCaseText.includes("link.tospotify.com")
		) {
			return true;
		}
	} else if (lowerCaseText.startsWith("spotify:")) {
		return true;
	}
	return false;
}

/**
 * @param  {number} duration
 * @returns {string}
 * @since  0.0.0
 */
export function convertDuration(duration) {
	const mm = Math.floor(duration / 60);

	// Convert from seconds only to mm:ss format
	let ss = duration - mm * 60; // Add leading zero if ss < 0

	if (ss < 10) {
		ss = "0" + ss;
	}

	return mm + ":" + ss;
}

/**
 * @param {number} duration
 * @returns {[number, number, number]}
 * @since 0.0.0
 */
export function convertDurationSeparated(duration) {
	let mm = Math.floor(duration / 60);

	const hh = Math.floor(mm / 60);
	const ss = duration - mm * 60;

	mm -= hh * 60;

	return [hh, mm, ss];
}

/**
 * @param  {number} x
 * @returns {string}
 * @since  0.0.0
 * @deprecated
 */
export const numberWithDots = (x) =>
	x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// On scroll event, returns currentTarget = null
// Probably on other events too
export function debounce(func, wait, immediate) {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		const later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

/**
 * Workaround to copy to the clipboard cross-OS by generating a
 * ghost input and copying the passed String
 *
 * @param  {string} text Text to copy
 * @returns void
 * @since  0.0.0
 */
export function copyToClipboard(text) {
	const ghostInput = document.createElement("input");

	document.body.appendChild(ghostInput);
	ghostInput.setAttribute("type", "text");
	ghostInput.setAttribute("value", text);
	ghostInput.select();
	ghostInput.setSelectionRange(0, 99999);
	document.execCommand("copy");
	ghostInput.remove();
}

/**
 * @param  {object|array} obj
 * @param  {...any}    props
 * @returns {any|null}   property requested
 * @since  0.0.0
 */
export function getPropertyWithFallback(obj, ...props) {
	for (const prop of props) {
		// Example: this.is.an.example
		const hasDotNotation = /\./.test(prop);

		// Searching the properties in the object
		const valueToTest = hasDotNotation
			? prop.split(".").reduce((o, i) => {
					if (o) return o[i];
					return undefined;
				}, obj)
			: obj[prop];

		if (typeof valueToTest !== "undefined") {
			return valueToTest;
		}
	}

	return null;
}

export default {
	isValidURL,
	convertDuration,
	convertDurationSeparated,
	numberWithDots,
	debounce,
};
