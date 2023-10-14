import { ElectronEvents } from "../../../types/types";
import { Subscribable } from "../../subscribable";
import { delay } from "./helper";
import Ide from "./ide";
import WebBackend from "./webBackend";



class IdeManger extends Subscribable {
    private static instance: IdeManger;
    ide: Ide
    webBackend: WebBackend

    private constructor(webBackend: WebBackend) {
        super()
        this.webBackend = webBackend
        this.ide = Ide.getInstance()
    }

    public static getInstance(webBackend: WebBackend): IdeManger {
        if (!IdeManger.instance) {
            IdeManger.instance = new IdeManger(webBackend);
        }
        return IdeManger.instance;
    }

    public get connected() {
        return this.ide.connected
    }

    async connect() {
        await this.ide.open()
        await delay()

        // await this.ide.getFileSystem()
        // await delay()

        // console.log("done getting file sytem ", this.ide.fileSystem)
        const mainPy = await this.ide.getFile("/main.py")
        if (mainPy) {
            this.webBackend.reply(ElectronEvents.UpdateKeyMap, mainPy)
            // console.log("main", mainPy)
        }

        const layoutJson = await this.ide.getFile("/layout.json")
        if (layoutJson) {
            this.webBackend.reply(ElectronEvents.UpdateLayout, layoutJson)
            console.log("json", layoutJson)
        }



    }



}

export default IdeManger