export class CustomDate {
	day: string;
	month: string;
	year: string;

	constructor(day = "00", month = "00", year = "XXXX") {
		this.day = day;
		this.month = month;
		this.year = year;
		this.fixDayMonth();
	}

	fixDayMonth() {
		if (parseInt(this.month) > 12) {
			const monthTemp = this.month;
			this.month = this.day;
			this.day = monthTemp;
		}
	}

	format(template: string) {
		template = template.replaceAll(/D+/g, this.day);
		template = template.replaceAll(/M+/g, this.month);
		template = template.replaceAll(/Y+/g, this.year);
		return template;
	}
}
