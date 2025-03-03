declare module "electron-window-state-manager" {
    interface WindowStateOptions {
        defaultWidth?: number;
        defaultHeight?: number;
        defaultX?: number;
        defaultY?: number;
    }

    class WindowStateManager {
        constructor(windowName: string, options: WindowStateOptions);
        width: number;
        height: number;
        x: number;
        y: number;
        maximized: boolean;
        saveState(window: Electron.BrowserWindow): void;
    }

    export default WindowStateManager;
}