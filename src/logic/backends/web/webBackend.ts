import { ElectronEvents } from "../../../types/types";
import IdeManger from "./ideManager";
type Subscriber = { event: ElectronEvents, callBack: (args: any) => void }

class WebBackend {
    private static instance: WebBackend;
    subscribers: Subscriber[] = []
    SendMiscEvent = this.reply
    ideManger: IdeManger
    private constructor() {
        this.ideManger = IdeManger.getInstance(this)
        //@ts-ignore
        window.electron = {
            platform: "web",

            ipcRenderer: {

                send: this.send.bind(this),
                on: this.on.bind(this),

                once(channel: any, func: any) {
                    console.log("on", func, "on", channel)

                },
            },
        }

        // this.SendMiscEvent(ElectronEvents.IsProPlan, true)
    }

    public static getInstance(): WebBackend {
        if (!WebBackend.instance) {
            WebBackend.instance = new WebBackend();
        }
        return WebBackend.instance;
    }

    private send(key: ElectronEvents, data: any) {
        switch (key) {
            case ElectronEvents.ClientUp:
                this.clientUp()
                break;
            case ElectronEvents.Scan:
                this.driveScan(data)
                break;
            case ElectronEvents.SaveMap:
                this.saveMap(data)
                break;
            case ElectronEvents.Savefile:
                this.saveFile(data)
                break;
            case ElectronEvents.SaveOled:
                this.saveOled(data)
                break;
            case ElectronEvents.ReadOled:
                this.readOled(data)
                break;

            case ElectronEvents.FilePicker:
                this.filePicker()
                break;

            case ElectronEvents.SaveSettings:
                this.saveSettings(data)
                break;
            case ElectronEvents.SaveCustomCodes:
                this.saveCustomKeyCode(data)
                break;

            case ElectronEvents.FreshDriveScan:
                this.driveScan(data)
                break;


            default:
                console.log("got key", key, "data", data, "dont know what to do")
                break;
        }

    }

    private on(channel: ElectronEvents, callBack: (args: any) => void) {
        this.subscribers.push({ event: channel, callBack: callBack })
    }

    reply(key: ElectronEvents, data: any) {
        this.subscribers.forEach(subscriber => {
            if (subscriber.event === key) {
                subscriber.callBack(data)
            }
        })

    }
    private async filePicker() {
        const drivePath = ""
        console.log("todo, file picker")
        // const drivePath = await dialog.showOpenDialogSync(mainWindow, {
        //     properties: ['openFile', 'openDirectory']
        //   })
        this.reply(ElectronEvents.FilePickerClose, drivePath ? drivePath[0] : '')
    }
    private async readOled(fileNumber: number) {
        console.log("todo, read oled")

    }
    private async saveOled(data: { fileData: number[][], fileNumber: number | string }) {
        console.log("todo, save oled")

    }
    private async saveFile(data: { fileData: string, path: string[] }) {
        console.log("todo, save file")

    }
    private async saveMap(data: string) {

        console.log("todo, save map", data)
        this.ideManger.savefile("/main.py", data)

    }
    private async saveCustomKeyCode(data: string) {
        console.log("todo, save keycode, localstorage")

    }
    private async saveSettings(data: string) {
        console.log("todo, save settings localstorage")

    }
    private async driveScan(data: string) {
        console.log("driveScan")

    }
    private async clientUp() {
        console.log("client up")
        this.SendMiscEvent(ElectronEvents.IsProPlan, true)


    }





}

export default WebBackend