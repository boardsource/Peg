import { app } from 'electron';
import { download } from "electron-dl"
//@ts-ignore
import { AppManager } from "./AppManager";
const nodeDiskInfo = require('node-disk-info')
const bitmapManipulation = require("bitmap-manipulation");

import * as fs from 'fs/promises';
import path from 'path'
import { ElectronEvents, FileName, Layout, ToastLevel } from "../types/types";
import { ProgramSettings } from "./programSettings";
//@ts-ignore
import DecompressZip from 'decompress-zip'

const programSettings = ProgramSettings.getInstance()
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
    kmkPath: string = ""
    didNotFindDrive: boolean = false;
    keepLooking: boolean = true;
    isScaning: boolean = false;
    haveToldClientAboutScaning: boolean = false;
    interval?: NodeJS.Timeout
    currentLayout?: Layout
    appManager: AppManager;
    fromSplitManager: boolean = false
    constructor(appManager: AppManager) {
        this.appManager = appManager
        console.log("setting up diskmanager")
        this.loadFromCacheIfCan()
        this.kmkPath = path.join(app.getPath("temp"), 'kmk.zip')
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

    public async freshDriveScan(fromSplitManager: boolean = false) {
        this.fromSplitManager = fromSplitManager
        this.keymap = "";
        this.kbDrive = "";
        this.hasKeymap = "";
        this.hasLayout = "";
        this.didNotFindDrive = false;
        this.keepLooking = true;
        this.isScaning = false;
        this.currentLayout = undefined
        this.cacheData("")
        this.manageDriveScan()

    }
    holdCurrentBoard(layout: string) {
        let change = false
        try {
            const tempLayout: Layout = JSON.parse(layout)
            if (!this.currentLayout && tempLayout.features !== undefined && tempLayout.features.name !== undefined && tempLayout.features.creator !== undefined && tempLayout.features.rightSide !== undefined) {
                this.currentLayout = tempLayout
                console.log("saving what we have")
            }
            if (this.currentLayout !== undefined && tempLayout.features !== undefined && tempLayout.features.name !== undefined && tempLayout.features.creator !== undefined && tempLayout.features.rightSide !== undefined) {
                if (tempLayout.features.name !== this.currentLayout.features.name || tempLayout.features.creator !== this.currentLayout.features.creator || tempLayout.features.rightSide !== this.currentLayout.features.rightSide) {
                    console.log("we got changes")
                    change = true
                }
            }

        } catch (error) {
            console.log("error reading json", error)
        }
        return change
    }
    async pingDrive() {
        try {
            const files = await fs.readdir(this.kbDrive);
            if (files.includes("main.py") && files.includes("layout.json")) {
                if (this.hasLayout !== "") {
                    const layoutJson = await fs.readFile(this.hasLayout, 'utf8');
                    const hasChanged = this.holdCurrentBoard(layoutJson)
                    if (hasChanged) {
                        this.appManager.SendMiscEvent(ElectronEvents.BoardChange, "")
                        if (this.interval) {
                            clearInterval(this.interval);
                            this.interval = undefined
                        }
                        if (!this.fromSplitManager) {
                            this.freshDriveScan()
                        }
                    }

                }
            }
        } catch (error) {
            if (!this.fromSplitManager) {
                this.appManager.SendMiscEvent(ElectronEvents.LostConnectionToBoard, "")
                this.freshDriveScan()
            }

        }
    }
    async managePingDrive() {
        if (this.kbDrive) {
            if (this.interval === undefined) {
                const intervalTime = 5000
                const interval = setInterval(() => {
                    this.pingDrive()
                }, intervalTime)
                this.interval = interval
            }
        } else {
            await this.scanDrives(true)
            this.managePingDrive()
        }
    }


    public async DownloadAndInstallLib(BoardName: string, drivePath: string) {
        try {
            const libDir = path.join(drivePath, "lib")
            await fs.rm(libDir, { recursive: true });
            console.log(`${libDir} is deleted!`);
        } catch (error) {
            console.log("error removing old libs", error)
        }
        download(this.appManager.win, `${programSettings.apiUrl}lib/${BoardName}.zip`, {
            directory: app.getPath("temp"),
            filename: `${BoardName}.zip`,
            onCompleted: (file: any) => {
                try {
                    const srcPath = path.join(app.getPath("temp"), `${BoardName}.zip`)
                    const zip = new DecompressZip(srcPath);
                    zip.extract({
                        path: drivePath,
                    });
                    zip.on("extract", () => {
                        this.appManager.ClientToast(ToastLevel.success, "Installed libs")
                    })
                    zip.on("error", () => {
                        this.appManager.ClientToast(ToastLevel.error, "Error extracting libs")
                    })

                } catch (error) {
                    console.log("error extracting libs", error)
                    this.appManager.ClientToast(ToastLevel.error, "Error extracting libs")

                }
            }
        }).catch((error: Error) => {
            console.log("error downloading libs", error)
            this.appManager.ClientToast(ToastLevel.error, "Error downloading libs")



        })


    }

    public async DownloadKmk() {
        download(this.appManager.win, `${programSettings.apiUrl}kmk.zip`, {
            directory: app.getPath("temp"),
            filename: "kmk.zip",
            onCompleted: (file: any) => {
                this.appManager.ClientToast(ToastLevel.success, "Downloaded KmK")
            }

        }).catch((error: Error) => { console.log("Error", error) })
    }



    public async InstallKmk(drivePath: string) {
        try {
            const zip = new DecompressZip(this.kmkPath);
            zip.extract({
                path: drivePath,
            });
            zip.on("extract", () => {
                this.appManager.ClientToast(ToastLevel.success, "Installed KmK")
            })
            zip.on("error", (error: any) => {
                console.log("error extracting kmk", error)
                this.appManager.ClientToast(ToastLevel.error, "Error extracting KmK")
            })
        } catch (error) {
            console.log("error extracting kmk", error)
            this.appManager.ClientToast(ToastLevel.error, "Error extracting KmK")
        }

    }
    public async manageDriveScan() {
        try {
            if (!this.didNotFindDrive && this.hasKeymap !== "" && this.hasLayout !== "") {
                const layoutjson = await fs.readFile(this.hasLayout, 'utf8');
                this.appManager.UpdateLayout(layoutjson)
                const mainPy = await fs.readFile(this.hasKeymap, 'utf8');
                this.appManager.UpdateKeyMap(mainPy)
            }
            if (!this.isScaning) {
                this.isScaning = true
                await this.scanDrives()
                if (this.didNotFindDrive && this.keepLooking) {
                    await this.delay(1000)
                    console.log("scaning again")
                    if (!this.haveToldClientAboutScaning) {
                        this.appManager.SendMiscEvent(ElectronEvents.ScanAgain, "scaning again")
                        this.haveToldClientAboutScaning = true
                    }
                    this.manageDriveScan()
                }
            }

        } catch (error) {
            console.log("error in scanning again", error, this)
        }
        this.managePingDrive()

    }
    async readProPlan() {
        try {
            const tmpPath = path.join(app.getPath("temp"), 'ppp.temp')
            const data = await fs.readFile(tmpPath, 'utf8');
            this.appManager.SendMiscEvent(ElectronEvents.IsProPlan, true)

        } catch (error) {
            console.log("error in reading pro plan", error)
            return ""
        }
    }

    async setProPlan(id: string) {
        try {

            console.log("settings pro plan", id)
            const data = id
            const tmpPath = path.join(app.getPath("temp"), 'ppp.temp')
            const newFile = await fs.writeFile(tmpPath, data, 'utf8');
            this.appManager.SendMiscEvent(ElectronEvents.IsProPlan, true)

            // console.log("newFile from cache", newFile)
        } catch (error) {
            console.log("error in writing pro plan", error)
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
            console.log("reading Settings", tmpPath)

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

    public async scanDrives(dontUpdate: boolean = false) {
        try {
            const disks = await nodeDiskInfo.getDiskInfo()

            for (const disk of disks) {
                if (process.platform !== "win32") {
                    if (!disk.mounted.startsWith("/") || disk.used === 0) {
                        console.log("not messing with ")
                        continue
                    }
                }

                try {
                    const files = await fs.readdir(disk.mounted);
                    if (files.includes("main.py") && files.includes("layout.json")) {
                        this.kbDrive = `${disk.mounted}/`;
                        this.hasKeymap = `${this.kbDrive}main.py`
                        this.hasLayout = `${this.kbDrive}layout.json`
                        break
                    }
                } catch {
                    console.log("this is not the drive you are looking for")
                    continue
                }

            }
            if (this.kbDrive !== "") {
                this.didNotFindDrive = false;
                this.haveToldClientAboutScaning = false
                this.fromSplitManager = false
                let tempData: any = { kbDrive: this.kbDrive }

                if (this.hasKeymap !== "") {
                    const mainPy = await fs.readFile(this.hasKeymap, 'utf8');
                    if (!dontUpdate) {
                        this.appManager.UpdateKeyMap(mainPy)
                    }

                    tempData["hasKeymap"] = this.hasKeymap
                }
                if (this.hasLayout !== "") {
                    const layoutjson = await fs.readFile(this.hasLayout, 'utf8');
                    if (!dontUpdate) {
                        this.appManager.UpdateLayout(layoutjson)
                    }
                    tempData["hasLayout"] = this.hasLayout
                }
                this.cacheData(JSON.stringify(tempData))
            }
            else {
                this.didNotFindDrive = true;
                this.isScaning = false

            }

        } catch (err) {
            console.error("err in  scanDrives: ", err);
        }

    }

    public async saveFile(newMap: string, retry: boolean = false) {
        try {
            if (this.kbDrive !== "") {
                if (this.hasKeymap !== "") {
                    const newFile = await fs.writeFile(this.hasKeymap, newMap, 'utf8');
                    this.appManager.SendMiscEvent(ElectronEvents.MapSaved, "")
                    console.log("newFile from save", newFile)
                }
            }
            else {
                if (!retry) {
                    await this.loadFromCacheIfCan()
                    this.saveFile(newMap, true)
                } else {
                    await this.scanDrives(true)
                    this.saveFile(newMap, true)

                }
                //todo alaert user map did not update
                console.log("dont have the needed stuff")

            }
        } catch (error) {
            console.log("error in writing map", error)
            this.appManager.ClientToast(ToastLevel.error, `Error in saving map.`)

            //todo alaert user map did not update
        }

    }

    public async writeData(data: { fileData: string, path: string[] }) {
        try {
            const writepath = path.join(...data.path)
            const newFile = await fs.writeFile(writepath, data.fileData, 'utf8');
            console.log("force write data")
            if (data.path[1] === FileName.main) {
                const codePyPath = path.join(data.path[0], "code.py")
                const files = await fs.readdir(data.path[0]);
                if (files.includes("code.py")) {
                    console.log("removing code.py")
                    fs.unlink(codePyPath)
                }
            } else {
                this.appManager.ClientToast(ToastLevel.success, `${data.path[1]} Saved`)
            }
        } catch (error) {
            this.appManager.ClientToast(ToastLevel.error, `Error when saving ${path.join("/")}`)
            console.log("error in writing map", error)
            //todo alaert user map did not update
        }

    }

    public async wrightOledBmp(fileData: number[][], fileNumber: number | string, retry: boolean = false) {
        try {
            if (this.kbDrive !== "") {

                let bitmap = new bitmapManipulation.BMPBitmap(128, 32, 1);
                fileData.forEach((row, i) => {
                    row.forEach((pxl, ii) => {
                        if (pxl === 1) {
                            bitmap.setPixel(ii, i, 0xff)
                        }
                    })
                })
                bitmap.save(`${this.kbDrive}/${fileNumber}.bmp`);
            } else {
                if (!retry) {
                    await this.loadFromCacheIfCan()
                    this.wrightOledBmp(fileData, fileNumber, true)
                } else {
                    await this.scanDrives(true)
                    this.wrightOledBmp(fileData, fileNumber, true)
                }
                //todo alaert user map did not update
                console.log("dont have the needed stuff")
                // console.log("missing kb drive", this)
            }
        } catch (error) {
            console.log("error in writing map", error)

            //todo alaert user map did not update
        }
    }

    public async readOledBmp(fileNumber: number | string, retry: boolean = false) {
        console.log("drive letter", this.kbDrive)
        if (this.kbDrive !== "") {
            console.log(" I got to look for a bmp by the number of ", this, fileNumber, `${this.kbDrive}${fileNumber}.bmp`)
            let data = []
            let oldFile = bitmapManipulation.BMPBitmap.fromFile(`${this.kbDrive}${fileNumber}.bmp`)
            for (let row = 0; row < 32; row++) {
                let tempRow = []
                for (let col = 0; col < 128; col++) {
                    const value = oldFile.getPixel(col, row)
                    tempRow.push(value === 255 ? 1 : 0)
                }
                data.push(tempRow)
            }
            this.appManager.UpdateOled(data, fileNumber)
        } else {
            if (!retry) {
                await this.loadFromCacheIfCan()
                this.readOledBmp(fileNumber, true)
            } else {
                await this.scanDrives(true)
                this.readOledBmp(fileNumber, true)
            }
            //todo alaert user map did not update
            console.log("dont have the needed stuff")
            console.log("missing kb drive", this)
        }

    }
}