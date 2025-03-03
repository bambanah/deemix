import { contextBridge, ipcRenderer } from "electron";

// Create loading screen styles
const style = document.createElement("style");
style.textContent = `
.loading-screen {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #1a1a1a;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	transition: opacity 0.3s ease-out;
}

.loading-screen.hidden {
	opacity: 0;
	pointer-events: none;
}

.loading-screen__spinner {
	width: 50px;
	height: 50px;
	border: 3px solid #333;
	border-top-color: #00e676;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.loading-screen__text {
	margin-top: 20px;
	color: #fff;
	font-family: system-ui, -apple-system, sans-serif;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}
`;

document.head.appendChild(style);

// Create loading screen element
const loadingScreen = document.createElement("div");
loadingScreen.className = "loading-screen";
loadingScreen.innerHTML = `
	<div class="loading-screen__spinner"></div>
	<div class="loading-screen__text">Loading deemix...</div>
`;

document.body.appendChild(loadingScreen);

// Hide loading screen when the app is ready
window.addEventListener("load", () => {
	// Give a small delay to ensure everything is loaded
	setTimeout(() => {
		loadingScreen.classList.add("hidden");
		setTimeout(() => loadingScreen.remove(), 300);
	}, 1000);
});

// Expose IPC functions to renderer
contextBridge.exposeInMainWorld("electron", {
	openDownloadsFolder: () => ipcRenderer.send("openDownloadsFolder"),
	selectDownloadFolder: (downloadLocation: string) =>
		ipcRenderer.send("selectDownloadFolder", downloadLocation),
	onDownloadFolderSelected: (callback: (path: string) => void) =>
		ipcRenderer.on("downloadFolderSelected", (_event, path) => callback(path)),
});
