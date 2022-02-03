import { ElectronEvents, KeyCode } from "../types/types";
import { KeyMap } from "./keymapManager";
import { ProgramSettings } from "./programSettings";
import { Subscribable } from "./subscribable";

export class ClientManager extends Subscribable {
    private static instance: ClientManager;
    keymap: KeyMap
    waitingLayer: number | undefined = undefined;
    waitingIndex: number | undefined = undefined;
    waitingKey: boolean = false;
    waitingIsLed: boolean = false;
    scaning: boolean = false
    programSettings: ProgramSettings
    private constructor() {
        super();
        this.keymap = KeyMap.getInstance()
        this.programSettings = ProgramSettings.getInstance()
        this.lessonToEvent(ElectronEvents.UpdateLayout, (args: string) => {
            this.scaning = false
            this.updateSubScribers()
            this.keymap.ParceLayout(args)
        })
        this.lessonToEvent(ElectronEvents.UpdateKeyMap, (args: string) => {
            this.scaning = false
            this.updateSubScribers()
            this.keymap.StringToKeymap(args)
        })
        this.lessonToEvent(ElectronEvents.ScanAgain, () => {
            console.log("scaning again")
            setTimeout(() => {
                this.scaning = true
                this.updateSubScribers()
            }, 1000);
        })
        this.lessonToEvent(ElectronEvents.ReadSettings, (settingsStr) => {
            try {
                const tempSettings = JSON.parse(settingsStr)
                Object.keys(this.programSettings).forEach((key: string) => {
                    if (key !== "_apiUrl") {
                        const realKey = key.substring(1)
                        //@ts-ignore
                        this.programSettings[realKey] = tempSettings[realKey]
                    }
                });
            } catch (error) {
                console.log("error", error)
            }

        })

        this.lessonToEvent(ElectronEvents.ReadCustomCodes, (customCodesStr) => {
            try {
                const tempCustomCodes = JSON.parse(customCodesStr)
                const customKeycodes = tempCustomCodes as KeyCode[]
                this.keymap.codes.customCodes = new Map(customKeycodes.map(i => [i.code, i]));
            } catch (error) {
                console.log("error", error)
            }

        })

        this.programSettings.Subscribe(() => {
            this.sendToBackend(ElectronEvents.SaveSettings, JSON.stringify({ seven: this.programSettings.seven, darkmode: this.programSettings.darkmode, tooltips: this.programSettings.tooltips }))
        })
        setTimeout(() => {
            if (this.keymap.layout === undefined) {
                this.sendToBackend(ElectronEvents.Scan, "")
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
            this.sendToBackend(ElectronEvents.SaveMap, this.keymap.toString())
        }
    }

    sendToBackend(key: ElectronEvents, data: any) {
        //@ts-ignore
        window.electron.ipcRenderer.send(key, data)
    }
    lessonToEvent(key: string, callBack: (args: any) => void) {
        //@ts-ignore
        window.electron.ipcRenderer.on(key, (arg: any) => callBack(arg))
    }

}