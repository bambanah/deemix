/**
 * The passed date is less than 3 days distant from today, therefore it's considered a new release, if referring to a track or album.
 */
export function checkNewRelease(dateToCheck: Date): boolean {
	const now = new Date();
	now.setHours(0, 0, 0, 0);

	dateToCheck = new Date(dateToCheck);
	dateToCheck.setDate(dateToCheck.getDate() + 3);

	return now.getTime() <= dateToCheck.getTime();
}
