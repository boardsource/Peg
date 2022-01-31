import { KeyCode } from "../types/types";
import { KeyMap } from "./keymapManager";
import { Subscribable } from "./subscribable";

export class ClientManager extends Subscribable {
    private static instance: ClientManager;
    keymap: KeyMap
    waitingLayer: number | undefined = undefined;
    waitingIndex: number | undefined = undefined;
    waitingKey: boolean = false;
    waitingIsLed: boolean = false;
    private constructor() {
        super();
        this.keymap = KeyMap.getInstance()
        this.lessonToEvent("UpdateLayout", (args: string) => { this.keymap.ParceLayout(args) })
        this.lessonToEvent("UpdateKeyMap", (args: string) => { this.keymap.StringToKeymap(args) })

        console.log("startup", this.keymap.layout)
        setTimeout(() => {
            if (this.keymap.layout === undefined) {
                this.sendToBackend("Scan", "")
            }

        }, 1000);

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
        this.updateSubScribers()
    }

    public NoticeToUpdateKey(newKeyCode: KeyCode) {
        if (this.waitingKey && this.waitingIndex !== undefined && this.waitingLayer !== undefined) {
            if (!this.waitingIsLed) {
                this.keymap.ChangeKey(this.waitingLayer, this.waitingIndex, newKeyCode);

            }
            else {
                //todo when you get here you the waiting key is waiting for LED input
            }
            this.waitingIndex = undefined;
            this.waitingLayer = undefined;
            this.waitingIsLed = false;
            this.waitingKey = false;
            this.updateSubScribers()
            this.sendToBackend("SaveMap", this.keymap.toString())
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