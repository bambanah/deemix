/**
 * Climbs the DOM until the root is reached, storing every node passed.
 */
export function generatePath(el: HTMLElement): Array<any> {
	if (!el) {
		throw new Error("No element passed to the generatePath function!");
	}

	const path = [el];

	while (
		(el = el.parentNode as HTMLElement) &&
		el !== document.documentElement
	) {
		path.push(el);
	}

	return path;
}

export function isValidURL(text: string): boolean {
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

export function convertDuration(duration: number): string {
	const mm = Math.floor(duration / 60);

	// Convert from seconds only to mm:ss format
	const ss = duration - mm * 60; // Add leading zero if ss < 0

	return mm + ":" + (ss < 10 ? "0" : "") + ss;
}

export function convertDurationSeparated(
	duration: number
): [number, number, number] {
	let mm = Math.floor(duration / 60);

	const hh = Math.floor(mm / 60);
	const ss = duration - mm * 60;

	mm -= hh * 60;

	return [hh, mm, ss];
}

/**
 * Workaround to copy to the clipboard cross-OS by generating a
 * ghost input and copying the passed string
 */
export function copyToClipboard(text: string) {
	const ghostInput = document.createElement("input");

	document.body.appendChild(ghostInput);
	ghostInput.setAttribute("type", "text");
	ghostInput.setAttribute("value", text);
	ghostInput.select();
	ghostInput.setSelectionRange(0, 99999);
	document.execCommand("copy");
	ghostInput.remove();
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
	func: F,
	waitFor: number
): (...args: Parameters<F>) => void {
	let timeout: NodeJS.Timeout;

	return (...args: Parameters<F>): void => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), waitFor);
	};
}

/**
 * @param		{object|array}	obj
 * @param		{...any}				props
 * @returns	{any|null}			property requested
 * @since		0.0.0
 */
export function getPropertyWithFallback(
	obj: object | Array<any>,
	...props: any[]
): any | null {
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
	debounce,
};
