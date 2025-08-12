import { ref } from "vue";

const isOnline = ref(navigator.onLine);

window.addEventListener("online", () => {
	isOnline.value = true;
});

window.addEventListener("offline", () => {
	isOnline.value = false;
});

export const useOnline = () => ({ isOnline });
