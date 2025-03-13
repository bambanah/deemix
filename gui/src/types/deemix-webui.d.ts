declare module "deemix-webui" {
    interface Settings {
        settings: {
            clearQueueOnExit: boolean;
            downloadLocation: string;
            [key: string]: any;
        };
    }

    interface DeemixApp {
        getSettings(): Settings;
        cancelAllDownloads(): void;
    }

    export const deemixApp: DeemixApp;
}