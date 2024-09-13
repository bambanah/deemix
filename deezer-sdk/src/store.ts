import { atom } from "nanostores";

export const $cacheDir = atom<string | undefined>();

export const setDeezerCacheDir = (dir: string) => {
	$cacheDir.set(dir);
};
