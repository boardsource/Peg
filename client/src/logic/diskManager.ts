import { KeyMap } from "./keymapManager";
import { app } from 'electron';

import { readdir } from 'fs/promises';
//@ts-ignore
import { AppManager } from "./AppManager";
const nodeDiskInfo = require('node-disk-info')
import * as fs from 'fs/promises';
import path from 'path'
import { ElectronEvents, FileName } from "../types/types";
type DiskInfo = {
    filesystem: string
    blocks: number
    used: number
    available: number
    capacity: string
    mounted: string
}
export class DiskManager {

    keymap: string = "";
    kbDrive: string = "";
    hasKeymap: string = "";
    hasLayout: string = "";
    didNotFindDrive: boolean = false;
    keepLooking: boolean = true;
    isScaning: boolean = false;
    haveToldClientAboutScaning: boolean = false;

    appManager: AppManager;
    constructor(appManager: AppManager) {
        this.appManager = appManager
        console.log("setting up diskmanager")
        this.loadFromCacheIfCan()
    }
    async loadFromCacheIfCan() {
        const dataStr = await this.readCache()
        console.log("trying to read cache:", dataStr)
        if (dataStr !== "") {
            const data = JSON.parse(dataStr)
            this.hasLayout = data.hasLayout
            this.hasKeymap = data.hasKeymap
            this.kbDrive = data.kbDrive
            this.didNotFindDrive = false
        }
    }

    delay(time: number) {
        return new Promise(res => setTimeout(res, time))
    };

    public async manageDriveScan() {
        if (!this.didNotFindDrive && this.hasKeymap !== "" && this.hasLayout !== "") {
            const layoutjson = await fs.readFile(this.hasLayout, 'utf8');
            this.appManager.UpdateLayout(layoutjson)
            const mainPy = await fs.readFile(this.hasKeymap, 'utf8');
            this.appManager.UpdateKeyMap(mainPy)
        }
        if (!this.isScaning) {

            console.log("scaning")
            this.isScaning = true
            await this.scanDrives()
            if (this.didNotFindDrive && this.keepLooking) {

                console.log("scaning again")
                if (!this.haveToldClientAboutScaning) {
                    this.appManager.SendMiscEvent(ElectronEvents.ScanAgain, {})
                    this.haveToldClientAboutScaning = true
                }
                await this.delay(1000)
                this.manageDriveScan()


            }
        }
    }

    async readCache(): Promise<string> {
        try {
            const tmpPath = path.join(app.getPath("temp"), 'peg.temp')
            const data = await fs.readFile(tmpPath, 'utf8');
            return data

        } catch (error) {
            console.log("error in reading cache data", error)
            return ""
        }
    }

    async cacheData(data: string) {
        try {
            const tmpPath = path.join(app.getPath("temp"), 'peg.temp')
            const newFile = await fs.writeFile(tmpPath, data, 'utf8');
            // console.log("newFile from cache", newFile)
        } catch (error) {
            console.log("error in writing cache data", error)
        }
    }

    async readSettings(event: ElectronEvents, fileName: FileName) {
        try {
            const tmpPath = path.join(app.getPath("appData"), fileName)
            const data = await fs.readFile(tmpPath, 'utf8');
            this.appManager.SendMiscEvent(event, data)
            console.log("reading Settings", data)

        } catch (error) {
            console.log("error in reading cache data", error)
            return ""
        }
    }

    async saveSettings(data: string, fileName: FileName) {
        try {
            const tmpPath = path.join(app.getPath("appData"), fileName)
            const newFile = await fs.writeFile(tmpPath, data, 'utf8');
            console.log("saving Settings")
        } catch (error) {
            console.log("error in writing settings data", error)
        }

    }

    public async scanDrives() {
        try {
            const disks = await nodeDiskInfo.getDiskInfo()
            // console.log("platform = ", process.platform)
            for (const disk of disks) {
                if (process.platform !== "win32") {
                    if (!disk.mounted.startsWith("/")) {
                        console.log("not fucking with ", disk)
                        continue
                    }
                }

                const files = await fs.readdir(disk.mounted);
                if (files.includes("main.py") && files.includes("layout.json")) {
                    this.kbDrive = `${disk.mounted}/`;
                    this.hasKeymap = `${this.kbDrive}main.py`
                    this.hasLayout = `${this.kbDrive}layout.json`
                    break
                }
            }
            if (this.kbDrive !== "") {
                this.didNotFindDrive = false;
                this.haveToldClientAboutScaning = false
                let tempData: any = { kbDrive: this.kbDrive }
                if (this.hasKeymap !== "") {
                    const mainPy = await fs.readFile(this.hasKeymap, 'utf8');
                    this.appManager.UpdateKeyMap(mainPy)
                    tempData["hasKeymap"] = this.hasKeymap
                }
                if (this.hasLayout !== "") {
                    const layoutjson = await fs.readFile(this.hasLayout, 'utf8');
                    this.appManager.UpdateLayout(layoutjson)
                    tempData["hasLayout"] = this.hasLayout
                }
                this.cacheData(JSON.stringify(tempData))
            }
            else {
                this.didNotFindDrive = true;
                this.isScaning = false

            }

        } catch (err) {
            console.error(err);
        }

    }
    public async saveFile(newMap: string, retry: boolean = false) {
        try {
            if (this.kbDrive !== "") {
                if (this.hasKeymap !== "") {
                    const newFile = await fs.writeFile(this.hasKeymap, newMap, 'utf8');
                    console.log("newFile from save", newFile)
                }
            }
            else {
                if (!retry) {
                    await this.loadFromCacheIfCan()
                    this.saveFile(newMap, true)
                }
                //todo alaert user map did not update
                console.log("dont have the needed stuff")

            }
        } catch (error) {
            console.log("error in writing map", error)

            //todo alaert user map did not update
        }

    }
    public async writeData(data: { fileData: string, path: string[] }) {
        try {


            const writepath = path.join(...data.path)
            const newFile = await fs.writeFile(writepath, data.fileData, 'utf8');
            console.log("force write data")

        } catch (error) {
            console.log("error in writing map", error)

            //todo alaert user map did not update
        }

    }
}