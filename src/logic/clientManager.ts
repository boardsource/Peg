import { ElectronEvents, KeyCode, ModalDefault, SplitFlashStage } from "../types/types";
import { Color } from "./color";
import { isKeyCode } from "./helpers";
import { KeyMap } from "./keymapManager";
import { ProgramSettings } from "./programSettings";
import { Subscribable } from "./subscribable";
import axios from "axios"
import { Modal } from "./modal";
import { Toast } from "./toast";

export class ClientManager extends Subscribable {
    private static instance: ClientManager;
    keymap: KeyMap
    waitingLayer: number | undefined = undefined;
    waitingIndex: number | undefined = undefined;
    waitingKey: boolean = false;
    waitingIsEncoder: boolean = false
    waitingIsLed: boolean = false;
    scaning: boolean = false
    programSettings: ProgramSettings
    changesMade: boolean = false;
    ledChangesMadeAndIsSplit: boolean = false;
    platform: string
    isOnLine: boolean = true
    dontOverRide: boolean = false
    currentLayer: number = 0
    SplitFlashDisplayState: SplitFlashStage = SplitFlashStage.MainSide

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
            if (this.SplitFlashDisplayState !== SplitFlashStage.MainSide) {
                this.ChangeSplitFlashDisplayState(SplitFlashStage.OffSide)
            }

        })
        this.lessonToEvent(ElectronEvents.UpdateKeyMap, (args: string) => {
            console.log("got updated map")
            this.scaning = false
            if (!this.dontOverRide) {
                this.keymap.StringToKeymap(args)
            } else {
                console.log("Im not over riding")
                const ledBackup = [...this.keymap.ledMap]
                const keymapBackup = [...this.keymap.keymap]
                this.keymap.StringToKeymap(args)
                this.keymap.ledMap = ledBackup
                this.keymap.keymap = keymapBackup
                this.ChangeSplitFlashDisplayState(SplitFlashStage.OffSide)
            }
            this.updateSubScribers()
        })
        this.lessonToEvent(ElectronEvents.ScanAgain, (_args: string) => {
            console.log("scaning again")
            this.scaning = true
            setTimeout(() => {
                this.updateSubScribers()
            }, 2000);
        })
        this.lessonToEvent(ElectronEvents.UpdateOled, (args: { oledData: number[][], fileNumber: number | string }) => {
            this.keymap.oled?.RecievImgDataFromBackEnd(args.oledData, Number(args.fileNumber))
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

        this.lessonToEvent(ElectronEvents.MapSaved, () => {
            Toast.Success("keymap saved!")
            console.log("todo notify that map was saved")
            if (this.SplitFlashDisplayState === SplitFlashStage.OffSide) {
                this.ChangeSplitFlashDisplayState(SplitFlashStage.Finished)
            }
        })
        this.lessonToEvent(ElectronEvents.IsProPlan, () => {
            this.programSettings.PPP = true
        })


        this.programSettings.Subscribe(() => {
            this.sendToBackend(ElectronEvents.SaveSettings,
                JSON.stringify({
                    seven: this.programSettings.seven,
                    theme: this.programSettings.theme,
                    tooltips: this.programSettings.tooltips,
                    debug: this.programSettings.debug
                }))
        })
        setTimeout(() => {
            if (!this.scaning && this.keymap.layout === undefined) {
                this.sendToBackend(ElectronEvents.Scan, "")
            }

        }, 2000);
        this.pingServer()


    }
    public ChangeLayer(newLayer: number) {
        this.currentLayer = newLayer
        this.updateSubScribers()

    }

    public static getInstance(): ClientManager {
        if (!ClientManager.instance) {
            ClientManager.instance = new ClientManager();
        }
        return ClientManager.instance;
    }
    public TellThemToUpdate() {
        this.updateSubScribers()
    }

    public NoticeThatKeyIsWaiting(index: number, isLed: boolean, isEncoder: boolean) {
        this.waitingIndex = index;
        this.waitingLayer = this.currentLayer;
        this.waitingIsLed = isLed;
        this.waitingIsEncoder = isEncoder
        this.waitingKey = true;
        this.updateSubScribers()
    }

    public NoticeToUpdateKey(newKeyCode: KeyCode | Color) {
        if (this.waitingKey && this.waitingIndex !== undefined && this.waitingLayer !== undefined) {
            this.changesMade = true
            if (!this.waitingIsLed && "code" in newKeyCode) {
                this.keymap.ChangeKey(this.waitingLayer, this.waitingIndex, newKeyCode, this.waitingIsEncoder);

            }
            else if ("r" in newKeyCode) {
                // console.log("I must be a color", newKeyCode)
                this.keymap.ChangeLed(this.waitingLayer, this.waitingIndex, newKeyCode)
                if (this.keymap.keyLayout.features.split) {
                    this.ledChangesMadeAndIsSplit = true
                }
            }
            this.waitingIndex = undefined;
            this.waitingLayer = undefined;
            this.waitingIsLed = false;
            this.waitingKey = false;
            this.updateSubScribers()

        }
    }
    public ForceKeyChange(layer: number, pos: number, newKey: KeyCode | Color, isEncoder: boolean) {
        if (isKeyCode(newKey)) {
            this.keymap.ChangeKey(layer, pos, newKey, isEncoder);
        } else {
            this.keymap.ChangeLed(layer, pos, newKey);
            if (this.keymap.keyLayout.features.split) {
                this.ledChangesMadeAndIsSplit = true
            }
        }
        this.changesMade = true
        this.updateSubScribers()
    }
    public ForceAllLedChange(newColor: Color) {
        this.keymap.ChangeAllLeds(newColor)
        if (this.keymap.keyLayout.features.split) {
            this.ledChangesMadeAndIsSplit = true
        }
        this.changesMade = true
        this.updateSubScribers()
    }

    public NoticeAChangeWasMade() {
        this.changesMade = true
        this.updateSubScribers()
    }

    public SaveMap() {
        console.log("saving key map")
        if (this.changesMade) {
            this.sendToBackend(ElectronEvents.SaveMap, this.keymap.toString())
            this.changesMade = false
        }
        if (this.ledChangesMadeAndIsSplit) {
            const modal = Modal.getInstance()
            modal.OpenDefault("Split Led Flashing", false, ModalDefault.SplitFlashManager)
            this.dontOverRide = true

        }

    }
    public ChangeSplitFlashDisplayState = (newDisplayState: SplitFlashStage) => {
        this.SplitFlashDisplayState = newDisplayState
        switch (newDisplayState) {
            case SplitFlashStage.Unplugged:
                this.sendToBackend(ElectronEvents.FreshDriveScan, "")
                break;
            case SplitFlashStage.OffSide:
                if (this.keymap.keyLayout.features.rightSide) {
                    this.changesMade = true
                    this.SaveMap()
                }
            default:
                break;
        }
        this.updateSubScribers()
    }

    async pingServer() {
        axios.get(`${this.programSettings.apiUrl}hp-check`).then(() => {
            this.isOnLine = true
        }).catch(() => {
            this.isOnLine = false
            this.updateSubScribers()
        })
    }

    sendToBackend(key: ElectronEvents, data: any) {
        //@ts-ignore
        window.electron.ipcRenderer.send(key, data)

    }
    lessonToEvent(key: ElectronEvents, callBack: (args: any) => void) {
        //@ts-ignore
        window.electron.ipcRenderer.on(key, (arg: any) => {
            try {
                callBack(arg)
            } catch (error) {
                Toast.Error(`error in handling event:${key}`)

                console.log("error in handling event from backend", `event:${key}`, error)
            }

        })
    }

}