!(function (e, t) {
	"object" == typeof exports && "undefined" != typeof module
		? (module.exports = t())
		: "function" == typeof define && define.amd
		? define(t)
		: ((e =
				"undefined" != typeof globalThis
					? globalThis
					: e || self).ID3Writer = t());
})(this, function () {
	"use strict";
	function r(e) {
		return String(e)
			.split("")
			.map(function (e) {
				return e.charCodeAt(0);
			});
	}
	function o(e) {
		return new Uint8Array(r(e));
	}
	function c(e) {
		var t = new Uint8Array(2 * e.length);
		return new Uint16Array(t.buffer).set(r(e)), t;
	}
	function u(e) {
		var t = 255;
		return [(e >>> 24) & t, (e >>> 16) & t, (e >>> 8) & t, e & t];
	}
	return (function () {
		var e = t.prototype;
		function t(e) {
			if (!(e && "object" == typeof e && "byteLength" in e))
				throw new Error(
					"First argument should be an instance of ArrayBuffer or Buffer"
				);
			(this.arrayBuffer = e),
				(this.padding = 4096),
				(this.frames = []),
				(this.url = ""),
				(this.separateWithNull = !1);
		}
		return (
			(e._setIntegerFrame = function (e, t) {
				t =
					"TDAT" === e
						? String(parseInt(t, 10)).padStart(4, "0")
						: parseInt(t, 10);
				this.frames.push({
					name: e,
					value: t,
					size: 11 + t.toString().length,
					__type__: "Integer",
				});
			}),
			(e._setStringFrame = function (e, t) {
				t = t.toString();
				this.frames.push({
					name: e,
					value: t,
					size: 13 + 2 * t.length,
					__type__: "String",
				});
			}),
			(e._setPictureFrame = function (e, t, r, a) {
				var n = (function (e) {
						if (!e || !e.length) return null;
						if (255 === e[0] && 216 === e[1] && 255 === e[2])
							return "image/jpeg";
						if (137 === e[0] && 80 === e[1] && 78 === e[2] && 71 === e[3])
							return "image/png";
						if (71 === e[0] && 73 === e[1] && 70 === e[2]) return "image/gif";
						if (87 === e[8] && 69 === e[9] && 66 === e[10] && 80 === e[11])
							return "image/webp";
						var t = 73 === e[0] && 73 === e[1] && 42 === e[2] && 0 === e[3],
							r = 77 === e[0] && 77 === e[1] && 0 === e[2] && 42 === e[3];
						return t || r
							? "image/tiff"
							: 66 === e[0] && 77 === e[1]
							? "image/bmp"
							: 0 === e[0] && 0 === e[1] && 1 === e[2] && 0 === e[3]
							? "image/x-icon"
							: null;
					})(new Uint8Array(t)),
					i = r.toString();
				if (!n) throw new Error("Unknown picture MIME type");
				r || (a = !1),
					this.frames.push({
						name: "APIC",
						value: t,
						pictureType: e,
						mimeType: n,
						useUnicodeEncoding: a,
						description: i,
						size:
							((t = t.byteLength),
							(n = n.length),
							(i = i.length),
							11 + n + 1 + 1 + (a ? 2 + 2 * (i + 1) : i + 1) + t),
						__type__: "Picture",
					});
			}),
			(e._setLyricsFrame = function (e, t, r) {
				(e = e.split("").map(function (e) {
					return e.charCodeAt(0);
				})),
					(t = t.toString()),
					(r = r.toString());
				this.frames.push({
					name: "USLT",
					value: r,
					language: e,
					description: t,
					size: ((t = t.length), (r = r.length), 16 + 2 * t + 2 + 2 + 2 * r),
					__type__: "Lyrics",
				});
			}),
			(e._setCommentFrame = function (e, t, r) {
				(e = e.split("").map(function (e) {
					return e.charCodeAt(0);
				})),
					(t = t.toString()),
					(r = r.toString());
				this.frames.push({
					name: "COMM",
					value: r,
					language: e,
					description: t,
					size: ((t = t.length), (r = r.length), 16 + 2 * t + 2 + 2 + 2 * r),
					__type__: "Comment",
				});
			}),
			(e._setPrivateFrame = function (e, t) {
				e = e.toString();
				this.frames.push({
					name: "PRIV",
					value: t,
					id: e,
					size: ((e = e.length), (t = t.byteLength), 10 + e + 1 + t),
					__type__: "Private",
				});
			}),
			(e._setUserStringFrame = function (e, t) {
				(e = e.toString()), (t = t.toString());
				this.frames.push({
					name: "TXXX",
					description: e,
					value: t,
					size: ((e = e.length), (t = t.length), 13 + 2 * e + 2 + 2 + 2 * t),
					__type__: "UserString",
				});
			}),
			(e._setUrlLinkFrame = function (e, t) {
				t = t.toString();
				this.frames.push({
					name: e,
					value: t,
					size: 10 + t.length,
					__type__: "UrlLink",
				});
			}),
			(e._setPairedTextFrame = function (e, t) {
				var r;
				this.frames.push({
					name: e,
					value: t,
					size:
						((r = 0),
						t.forEach(function (e) {
							r += 2 + 2 * e[0].length + 2 + 2 + 2 * e[1].length + 2;
						}),
						11 + r),
					__type__: "PairedText",
				});
			}),
			(e._setSynchronisedLyricsFrame = function (e, t, r, a, n) {
				var i,
					n = n.toString(),
					a = a.split("").map(function (e) {
						return e.charCodeAt(0);
					});
				this.frames.push({
					name: "SYLT",
					value: t,
					language: a,
					description: n,
					type: e,
					timestampFormat: r,
					size:
						((n = n.length),
						(n *= 2),
						(i = 0),
						t.forEach(function (e) {
							i += 2 + 2 * e[0].length + 2 + 4;
						}),
						18 + n + 2 + i),
					__type__: "SynchronisedLyrics",
				});
			}),
			(e._setPopularimeterFrame = function (e, t, r) {
				var a = e.toString();
				(t = parseInt(t, 10)),
					void 0 !== r && (r = parseInt(Math.abs(r), 10)),
					this.frames.push({
						name: "POPM",
						value: t,
						email: a,
						count: r,
						size:
							10 +
							e.length +
							1 +
							1 +
							(e =
								void (e = 0) !== (r = r)
									? Math.max(Math.ceil(Math.log2(r + 1) / 8), 4)
									: e),
						__type__: "PopularimeterFrame",
					});
			}),
			(e.setFrame = function (e, t) {
				switch (e) {
					case "TPE1":
					case "TCOM":
					case "TPE2":
					case "TCON":
						if (!Array.isArray(t))
							throw new Error(e + " frame value should be an array of strings");
						var r = this.separateWithNull
								? String.fromCharCode(0)
								: "TCON" === e
								? ";"
								: "/",
							r = t.join(r);
						this._setStringFrame(e, r);
						break;
					case "TLAN":
					case "TIT1":
					case "TIT2":
					case "TIT3":
					case "TALB":
					case "TPE3":
					case "TPE4":
					case "TRCK":
					case "TPOS":
					case "TMED":
					case "TPUB":
					case "TCOP":
					case "TCMP":
					case "TKEY":
					case "TEXT":
					case "TSRC":
						this._setStringFrame(e, t);
						break;
					case "TBPM":
					case "TLEN":
					case "TDAT":
					case "TYER":
						this._setIntegerFrame(e, t);
						break;
					case "USLT":
						if (
							((t.language = t.language || "eng"),
							!("object" == typeof t && "description" in t && "lyrics" in t))
						)
							throw new Error(
								"USLT frame value should be an object with keys description and lyrics"
							);
						if (t.language && !t.language.match(/[a-z]{3}/i))
							throw new Error(
								"Language must be coded following the ISO 639-2 standards"
							);
						this._setLyricsFrame(t.language, t.description, t.lyrics);
						break;
					case "APIC":
						if (
							!(
								"object" == typeof t &&
								"type" in t &&
								"data" in t &&
								"description" in t
							)
						)
							throw new Error(
								"APIC frame value should be an object with keys type, data and description"
							);
						if (t.type < 0 || 20 < t.type)
							throw new Error("Incorrect APIC frame picture type");
						this._setPictureFrame(
							t.type,
							t.data,
							t.description,
							!!t.useUnicodeEncoding
						);
						break;
					case "TXXX":
						if (!("object" == typeof t && "description" in t && "value" in t))
							throw new Error(
								"TXXX frame value should be an object with keys description and value"
							);
						Array.isArray(t.value) &&
							((r = this.separateWithNull ? String.fromCharCode(0) : "/"),
							(t.value = t.value.join(r))),
							this._setUserStringFrame(t.description, t.value);
						break;
					case "WCOM":
					case "WCOP":
					case "WOAF":
					case "WOAR":
					case "WOAS":
					case "WORS":
					case "WPAY":
					case "WPUB":
						this._setUrlLinkFrame(e, t);
						break;
					case "COMM":
						if (
							((t.language = t.language || "eng"),
							!("object" == typeof t && "description" in t && "text" in t))
						)
							throw new Error(
								"COMM frame value should be an object with keys description and text"
							);
						if (t.language && !t.language.match(/[a-z]{3}/i))
							throw new Error(
								"Language must be coded following the ISO 639-2 standards"
							);
						this._setCommentFrame(t.language, t.description, t.text);
						break;
					case "PRIV":
						if (!("object" == typeof t && "id" in t && "data" in t))
							throw new Error(
								"PRIV frame value should be an object with keys id and data"
							);
						this._setPrivateFrame(t.id, t.data);
						break;
					case "IPLS":
						if (!Array.isArray(t) || !Array.isArray(t[0]))
							throw new Error("IPLS frame value should be an array of pairs");
						this._setPairedTextFrame(e, t);
						break;
					case "SYLT":
						if (
							!(
								"object" == typeof t &&
								"type" in t &&
								"text" in t &&
								"timestampFormat" in t
							)
						)
							throw new Error(
								"SYLT frame value should be an object with keys type, text and timestampFormat"
							);
						if (!Array.isArray(t.text) || !Array.isArray(t.text[0]))
							throw new Error(
								"SYLT frame text value should be an array of pairs"
							);
						if (t.type < 0 || 6 < t.type)
							throw new Error("Incorrect SYLT frame content type");
						if (t.timestampFormat < 1 || 2 < t.timestampFormat)
							throw new Error("Incorrect SYLT frame time stamp format");
						(t.language = t.language || "XXX"),
							(t.description = t.description || ""),
							this._setSynchronisedLyricsFrame(
								t.type,
								t.text,
								t.timestampFormat,
								t.language,
								t.description
							);
						break;
					case "POPM":
						if ("object" != typeof t || !("rating" in t))
							throw new Error(
								"POPM frame value should be an object with at least a rating key"
							);
						if (t.rating < 0 || 255 < t.rating)
							throw new Error("Incorrect POPM frame rating value");
						"email" in t || (t.email = ""),
							this._setPopularimeterFrame(t.email, t.rating, t.count);
						break;
					default:
						throw new Error("Unsupported frame " + e);
				}
				return this;
			}),
			(e.removeTag = function () {
				var e, t, r, a;
				this.arrayBuffer.byteLength < 10 ||
					((t = (e = new Uint8Array(this.arrayBuffer))[3]),
					(r =
						((a = [e[6], e[7], e[8], e[9]])[0] << 21) +
						(a[1] << 14) +
						(a[2] << 7) +
						a[3] +
						10),
					73 !== (a = e)[0] ||
						68 !== a[1] ||
						51 !== a[2] ||
						t < 2 ||
						4 < t ||
						(this.arrayBuffer = new Uint8Array(e.subarray(r)).buffer));
			}),
			(e.addTag = function () {
				this.removeTag();
				var e,
					t = [255, 254],
					r =
						10 +
						this.frames.reduce(function (e, t) {
							return e + t.size;
						}, 0) +
						this.padding,
					a = new ArrayBuffer(this.arrayBuffer.byteLength + r),
					n = new Uint8Array(a),
					i = 0,
					s = [],
					s = [73, 68, 51, 3];
				return (
					n.set(s, i),
					(i += s.length),
					i++,
					i++,
					(s = [
						((e = r - 10) >>> 21) & (r = 127),
						(e >>> 14) & r,
						(e >>> 7) & r,
						e & r,
					]),
					n.set(s, i),
					(i += s.length),
					this.frames.forEach(function (e) {
						switch (
							((s = o(e.name)),
							n.set(s, i),
							(i += s.length),
							(s = u(e.size - 10)),
							n.set(s, i),
							(i += s.length),
							(i += 2),
							e.__type__)
						) {
							case "UrlLink":
								(s = o(e.value)), n.set(s, i), (i += s.length);
								break;
							case "String":
								(s = [1].concat(t)),
									n.set(s, i),
									(i += s.length),
									(s = c(e.value)),
									n.set(s, i),
									(i += s.length);
								break;
							case "UserString":
							case "Lyrics":
							case "Comment":
								(s = [1]),
									(s = (s =
										"USLT" === e.name || "COMM" === e.name
											? s.concat(e.language)
											: s).concat(t)),
									n.set(s, i),
									(i += s.length),
									(s = c(e.description)),
									n.set(s, i),
									(i += s.length),
									(s = [0, 0].concat(t)),
									n.set(s, i),
									(i += s.length),
									(s = c(e.value)),
									n.set(s, i),
									(i += s.length);
								break;
							case "Integer":
								i++, (s = o(e.value)), n.set(s, i), (i += s.length);
								break;
							case "Private":
								(s = o(e.id)),
									n.set(s, i),
									(i += s.length),
									i++,
									n.set(new Uint8Array(e.value), i),
									(i += e.value.byteLength);
								break;
							case "Picture":
								(s = [e.useUnicodeEncoding ? 1 : 0]),
									n.set(s, i),
									(i += s.length),
									(s = o(e.mimeType)),
									n.set(s, i),
									(i += s.length),
									(s = [0, e.pictureType]),
									n.set(s, i),
									(i += s.length),
									e.useUnicodeEncoding
										? ((s = [].concat(t)),
										  n.set(s, i),
										  (i += s.length),
										  (s = c(e.description)),
										  n.set(s, i),
										  (i += s.length),
										  (i += 2))
										: ((s = o(e.description)),
										  n.set(s, i),
										  (i += s.length),
										  i++),
									n.set(new Uint8Array(e.value), i),
									(i += e.value.byteLength);
								break;
							case "PairedText":
								(s = [1]),
									n.set(s, i),
									(i += s.length),
									e.value.forEach(function (e) {
										(s = [].concat(t)),
											n.set(s, i),
											(i += s.length),
											(s = c(e[0].toString())),
											n.set(s, i),
											(i += s.length),
											(s = [0, 0].concat(t)),
											n.set(s, i),
											(i += s.length),
											(s = c(e[1].toString())),
											n.set(s, i),
											(i += s.length),
											(s = [0, 0]),
											n.set(s, i),
											(i += s.length);
									});
								break;
							case "SynchronisedLyrics":
								(s = (s = (s = (s = [1]).concat(e.language)).concat(
									e.timestampFormat
								)).concat(e.type)),
									n.set(s, i),
									(i += s.length),
									(s = [].concat(t)),
									n.set(s, i),
									(i += s.length),
									(s = c(e.description)),
									n.set(s, i),
									(i += s.length),
									(i += 2),
									e.value.forEach(function (e) {
										(s = [].concat(t)),
											n.set(s, i),
											(i += s.length),
											(s = c(e[0].toString())),
											n.set(s, i),
											(i += s.length),
											(s = [0, 0]),
											n.set(s, i),
											(i += s.length),
											(s = u(e[1])),
											n.set(s, i),
											(i += s.length);
									});
								break;
							case "PopularimeterFrame":
								(s = o(e.email)),
									n.set(s, i),
									(i += s.length),
									(i += 1),
									(s = [e.value]),
									n.set(s, i),
									(i += s.length),
									void 0 !== e.count &&
										((s = (function (e, t) {
											for (
												var r = Math.ceil(Math.log2(e + 1) / 8), a = [], n = 0;
												n < Math.max(r, t);
												n++
											)
												a.push((e / Math.pow(2, 8 * n)) & 255);
											return a.reverse();
										})(e.count, 4)),
										n.set(s, i),
										(i += s.length));
						}
					}),
					(i += this.padding),
					n.set(new Uint8Array(this.arrayBuffer), i),
					(this.arrayBuffer = a)
				);
			}),
			(e.getBlob = function () {
				return new Blob([this.arrayBuffer], { type: "audio/mpeg" });
			}),
			(e.getURL = function () {
				return (
					this.url || (this.url = URL.createObjectURL(this.getBlob())), this.url
				);
			}),
			(e.revokeURL = function () {
				URL.revokeObjectURL(this.url);
			}),
			t
		);
	})();
});
