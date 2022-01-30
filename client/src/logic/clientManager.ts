import { KeyCode } from "../types/types";
import { KeyMap } from "./keymapManager";

export class ClientManager {
    private static instance: ClientManager;
    keymap: KeyMap
    waitingLayer: number = 0;
    waitingIndex: number = 0;
    waitingKey: boolean = false;
    waitingIsLed: boolean = false;
    private constructor() {
        this.keymap = KeyMap.getInstance()
        this.lessonToEvent("UpdateLayout", (args: string) => { this.keymap.ParceLayout(args) })
        this.lessonToEvent("UpdateKeyMap", (args: string) => { this.keymap.StringToKeymap(args) })
        this.sendToBackend("Scan", "")
    }

    public static getInstance(): ClientManager {
        if (!ClientManager.instance) {
            ClientManager.instance = new ClientManager();
        }
        return ClientManager.instance;
    }

    public NoticeThatKeyIsWaiting(index: number, layer: number, isLed: boolean) {
        this.waitingIndex = index;
        this.waitingLayer = layer;
        this.waitingIsLed = isLed;
        this.waitingKey = true;
        console.log("waiting", { ...this })
    }

    public NoticeToUpdateKey(newKeyCode: KeyCode) {
        if (this.waitingKey) {
            if (!this.waitingIsLed) {
                this.keymap.ChangeKey(this.waitingLayer, this.waitingIndex, newKeyCode);
                console.log("updating", { ...this.keymap })

            }
            else {
                //todo
            }
        }
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