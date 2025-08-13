import { decode } from "html-entities";

export class Lyrics {
	id: string;
	sync: string;
	unsync: string;
	syncID3: any[];

	constructor(lyr_id = "0") {
		this.id = lyr_id;
		this.sync = "";
		this.unsync = "";
		this.syncID3 = [];
	}

	parseLyrics(lyricsAPI) {
		this.unsync = lyricsAPI.LYRICS_TEXT || "";
		if (lyricsAPI.LYRICS_SYNC_JSON) {
			const syncLyricsJson = lyricsAPI.LYRICS_SYNC_JSON;
			let timestamp = "";
			let milliseconds = 0;
			for (let line = 0; line < syncLyricsJson.length; line++) {
				const currentLine = decode(syncLyricsJson[line].line);
				if (currentLine !== "") {
					timestamp = syncLyricsJson[line].lrc_timestamp;
					milliseconds = parseInt(syncLyricsJson[line].milliseconds);
					this.syncID3.push([currentLine, milliseconds]);
				} else {
					let notEmptyLine = line + 1;
					while (syncLyricsJson[notEmptyLine].line === "") notEmptyLine += 1;
					timestamp = syncLyricsJson[notEmptyLine].lrc_timestamp;
				}
				this.sync += timestamp + currentLine + "\r\n";
			}
		}
	}
}
