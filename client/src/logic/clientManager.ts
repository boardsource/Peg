export class ClientManager {
    private static instance: ClientManager;

    private constructor() {
    }

    public static getInstance(): ClientManager {
        if (!ClientManager.instance) {
            ClientManager.instance = new ClientManager();
        }
        return ClientManager.instance;
    }
    sendToBackend(key: string, data: any) {
        //@ts-ignore
        window.electron.ipcRenderer.send(key, data)
    }
    lessonToEvent(key: string, callBack: (args: any) => void) {
        //@ts-ignore
        window.electron.ipcRenderer.on(key, (arg: any) => callBack(arg))
    }

}