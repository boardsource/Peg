import { ElectronEvents, KeyCode, ModalDefault, SplitFlashStage, ToastLevel } from "../types/types";
import { Color } from "./color";
import { isKeyCode } from "./helpers";
import { KeyMap } from "./keymapManager";
import { ProgramSettings } from "./programSettings";
import { Subscribable } from "./subscribable";
import axios from "axios"
import { Modal } from "./modal";
import { Toast } from "./toast";
import WebBackend from "./backends/web/webBackend";

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
    canUnplug: boolean = true
    lostConnectionToBoard: boolean = false;
    kmkInstalled: boolean = true
    libInstalled: boolean = true;
    webBackend: WebBackend | undefined

    private constructor() {
        super();
        //@ts-ignore
        this.platform = window.electron.platform;
        this.keymap = KeyMap.getInstance()


        this.programSettings = ProgramSettings.getInstance()

        if (this.platform === "web") {
            this.webBackend = WebBackend.getInstance()
        }

        this.lessonToEvent(ElectronEvents.UpdateLayout, (args: string) => {
            this.scaning = false
            this.updateSubScribers()
            this.keymap.ParceLayout(args)
            if (this.SplitFlashDisplayState !== SplitFlashStage.MainSide) {
                this.ChangeSplitFlashDisplayState(SplitFlashStage.OffSide)
            }

        })
        this.lessonToEvent(ElectronEvents.UpdateKeyMap, (args: string) => {
            this.scaning = false
            if (!this.dontOverRide) {
                this.keymap.StringToKeymap(args)
            } else {
                this.keymap.oled = undefined
                const ledBackup = [...this.keymap.ledMap]
                const keymapBackup = [...this.keymap.keymap]
                this.keymap.StringToKeymap(args)
                this.keymap.ledMap = ledBackup
                this.keymap.keymap = keymapBackup
                this.ChangeSplitFlashDisplayState(SplitFlashStage.OffSide)
                Toast.Debug(`not over riding keymap saving ledMap and keymap `)
            }
            this.updateSubScribers()
        })
        this.lessonToEvent(ElectronEvents.ScanAgain, (_args: string) => {
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
                Toast.Debug(`Error in ReadSettings ${JSON.stringify(error)} `)
                console.log("error", error)
            }

        })

        this.lessonToEvent(ElectronEvents.ReadCustomCodes, (customCodesStr) => {
            try {
                const tempCustomCodes = JSON.parse(customCodesStr)
                const customKeycodes = tempCustomCodes as KeyCode[]
                this.keymap.codes.customCodes = new Map(customKeycodes.map(i => [i.code, i]));
            } catch (error) {
                Toast.Debug(`Error in ReadCustomCodes ${JSON.stringify(error)} `)
                console.log("error", error)
            }
        })

        this.lessonToEvent(ElectronEvents.MapSaved, () => {
            Toast.Success("keymap saved! You can unplug your keyboard if you want")
            this.canUnplug = true
            this.updateSubScribers()

            if (this.SplitFlashDisplayState === SplitFlashStage.OffSide) {
                this.ChangeSplitFlashDisplayState(SplitFlashStage.Finished)
            }
        })

        this.lessonToEvent(ElectronEvents.BoardChange, () => {
            Toast.Success("Detected New keyboard plugged in")
        })

        this.lessonToEvent(ElectronEvents.Toast, (data: { status: ToastLevel, message: string }) => {
            Toast.getInstance().show(data.message, data.status)
            if (data.status === ToastLevel.success) {
                if (!this.kmkInstalled && data.message.toLowerCase().includes("kmk")) {
                    console.log("kmk installed")
                    this.kmkInstalled = true
                }
                if (!this.libInstalled && data.message.toLowerCase().includes("lib")) {
                    console.log("lib installed")
                    this.libInstalled = true
                }
                if (!this.canUnplug && this.libInstalled && this.kmkInstalled) {
                    console.log("you good")
                    this.canUnplug = true
                    this.updateSubScribers()
                }
            }

        })
        this.lessonToEvent(ElectronEvents.LostConnectionToBoard, () => {
            if (!this.lostConnectionToBoard) {
                Toast.Warn(`Peg lost connection to ${this.keymap.keyLayout.features.name}`)
                this.lostConnectionToBoard = true
                setTimeout(() => {
                    this.lostConnectionToBoard = false
                }, 10000);
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
            ///issues/3 removed this
            // if (!this.scaning && this.keymap.layout === undefined) {
            //     this.sendToBackend(ElectronEvents.Scan, "")
            // }
            this.sendToBackend(ElectronEvents.ClientUp, "")
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
        Toast.Debug(`forcing all key change:  ${JSON.stringify({ layer, pos, newKey, isEncoder })} `)

    }
    public ForceAllLedChange(newColor: Color) {
        this.keymap.ChangeAllLeds(newColor)
        if (this.keymap.keyLayout.features.split) {
            this.ledChangesMadeAndIsSplit = true
        }
        this.changesMade = true
        this.updateSubScribers()
        Toast.Debug(`forcing all leds to new color:  ${JSON.stringify(newColor)} `)

    }
    public RemoveCodeBlock(index: number) {
        this.keymap.RemoveCodeBlock(index)
        this.NoticeAChangeWasMade()
    }

    public NoticeAChangeWasMade() {
        this.changesMade = true
        this.updateSubScribers()
    }

    public SaveMap() {
        Toast.Debug(`wanting to save map`)
        if (this.changesMade) {
            Toast.Info(`Saving Changes Dont Unplug Your Keyboard`)
            this.canUnplug = false
            this.sendToBackend(ElectronEvents.SaveMap, this.keymap.toString())
            this.changesMade = false
            Toast.Debug(`saving map`)
        }
        if (this.ledChangesMadeAndIsSplit) {
            Toast.Info(`Saving Changes Dont Unplug Your Keyboard`)
            const modal = Modal.getInstance()
            modal.OpenDefault("Split LED Flashing", false, ModalDefault.SplitFlashManager)
            this.dontOverRide = true
            Toast.Debug(`handling split led changes `)
        }

    }
    public ChangeSplitFlashDisplayState = (newDisplayState: SplitFlashStage) => {
        this.SplitFlashDisplayState = newDisplayState
        switch (newDisplayState) {
            case SplitFlashStage.Unplugged:
                this.sendToBackend(ElectronEvents.FreshDriveScan, "")
                Toast.Debug(`SplitFlashStage.Unplugged`)
                break;
            case SplitFlashStage.OffSide:
                if (this.keymap.keyLayout.features.rightSide) {
                    this.changesMade = true
                    setTimeout(() => {
                        this.SaveMap()
                    }, 1000);

                    this.ledChangesMadeAndIsSplit = false
                    Toast.Debug(`SplitFlashStage.OffSide`)
                }
            default:
                break;
        }
        this.updateSubScribers()
    }

    async pingServer() {
        axios.get(`${this.programSettings.apiUrl}hp-check`).then(() => {
            this.isOnLine = true
            Toast.Debug(`server on line`)
        }).catch(() => {
            this.isOnLine = false
            this.updateSubScribers()
            Toast.Debug(`error from server hp-check`)

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