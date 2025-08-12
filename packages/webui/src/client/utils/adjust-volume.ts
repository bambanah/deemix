// https://stackoverflow.com/questions/7451508/html5-audio-playback-with-fade-in-and-fade-out#answer-13149848
export function adjustVolume(
	element: HTMLAudioElement,
	newVolume: number,
	{ duration = 1000, easing = swing, interval = 13 } = {}
) {
	const originalVolume = element.volume;
	const delta = newVolume - originalVolume;

	if (!delta || !duration || !easing || !interval) {
		element.volume = newVolume;
		return Promise.resolve();
	}

	const ticks = Math.floor(duration / interval);
	let tick = 1;

	return new Promise<void>((resolve) => {
		const timer = setInterval(() => {
			element.volume = originalVolume + easing(tick / ticks) * delta;
			if (++tick === ticks) {
				clearInterval(timer);
				resolve();
			}
		}, interval);
	});
}

export function swing(p: number) {
	return 0.5 - Math.cos(p * Math.PI) / 2;
}
