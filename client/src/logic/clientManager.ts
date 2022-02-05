import { ElectronEvents, KeyCode } from "../types/types";
import { Color } from "./color";
import { isKeyCode } from "./helpers";
import { KeyMap } from "./keymapManager";
import { ProgramSettings } from "./programSettings";
import { Subscribable } from "./subscribable";
import axios from "axios"

export class ClientManager extends Subscribable {
    private static instance: ClientManager;
    keymap: KeyMap
    waitingLayer: number | undefined = undefined;
    waitingIndex: number | undefined = undefined;
    waitingKey: boolean = false;
    waitingIsLed: boolean = false;
    scaning: boolean = false
    programSettings: ProgramSettings
    changesMade: boolean = false;
    platform: string
    isOnLine: boolean = true
    private constructor() {
        super();
        //@ts-ignore
        this.platform = window.electron.platform;
        this.keymap = KeyMap.getInstance()
        this.programSettings = ProgramSettings.getInstance()
        this.lessonToEvent(ElectronEvents.UpdateLayout, (args: string) => {
            console.log("got updated layout")
            this.scaning = false
            this.updateSubScribers()
            this.keymap.ParceLayout(args)
        })
        this.lessonToEvent(ElectronEvents.UpdateKeyMap, (args: string) => {
            console.log("got updated map")
            this.scaning = false
            this.updateSubScribers()
            this.keymap.StringToKeymap(args)
        })
        this.lessonToEvent(ElectronEvents.ScanAgain, () => {
            console.log("scaning again")
            this.scaning = true
            setTimeout(() => {

                this.updateSubScribers()
            }, 2000);
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
            if (!this.scaning && this.keymap.layout === undefined) {
                this.sendToBackend(ElectronEvents.Scan, "")
            }

        }, 2000);
        this.pingServer()


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

    public NoticeToUpdateKey(newKeyCode: KeyCode | Color) {
        if (this.waitingKey && this.waitingIndex !== undefined && this.waitingLayer !== undefined) {
            this.changesMade = true
            if (!this.waitingIsLed && "code" in newKeyCode) {
                this.keymap.ChangeKey(this.waitingLayer, this.waitingIndex, newKeyCode);

            }
            else if ("r" in newKeyCode) {
                // console.log("I must be a color", newKeyCode)
                this.keymap.ChangeLed(this.waitingLayer, this.waitingIndex, newKeyCode)
                //todo when you get here you the waiting key is waiting for LED input
            }
            this.waitingIndex = undefined;
            this.waitingLayer = undefined;
            this.waitingIsLed = false;
            this.waitingKey = false;
            this.updateSubScribers()

        }
    }
    public ForceKeyChange(layer: number, pos: number, newKey: KeyCode | Color) {
        if (isKeyCode(newKey)) {
            this.keymap.ChangeKey(layer, pos, newKey);
        } else {
            this.keymap.ChangeLed(layer, pos, newKey);
        }
        this.changesMade = true
        this.updateSubScribers()
    }

    public SaveMap() {
        if (this.changesMade) {
            this.sendToBackend(ElectronEvents.SaveMap, this.keymap.toString())
        }

    }

    async pingServer() {
        try {
            //todo change this to ping route
            await axios.get(`${this.programSettings.apiUrl}boards`)
            this.isOnLine = true
        } catch (error) {
            this.isOnLine = false
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