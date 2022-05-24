
import { DiskManager } from "./diskManager";
import Electron, { app, ipcMain, BrowserWindow } from 'electron';
import { ElectronEvents, FileName } from "../types/types";




export class AppManager {
    diskManager: DiskManager;
    win: Electron.BrowserWindow
    constructor(bWin: Electron.BrowserWindow) {
        this.diskManager = new DiskManager(this)
        this.win = bWin;
        this.diskManager.readProPlan()

    }

    run() {
        setTimeout(() => {
            console.log("running on main thread")
            this.diskManager.manageDriveScan()
        }, 1000);
    }
    public async DownloadKmk() {
        if (this.diskManager !== undefined) {
            this.diskManager.DownloadKmk()
        }
    }
    public async InstallKmk(path: string) {
        if (this.diskManager !== undefined) {
            this.diskManager.InstallKmk(path)
        }
    }
    public async DownloadAndInstallLib(BoardName: string, path: string) {
        if (this.diskManager !== undefined) {
            this.diskManager.DownloadAndInstallLib(BoardName, path)
        }
    }
    public Scan(_event: Electron.IpcMainEvent, _fileName: string,) {
        if (this.diskManager !== undefined) {
            this.diskManager.manageDriveScan()

        }
    }
    public FreshScan(_event: Electron.IpcMainEvent, _fileName: string,) {
        if (this.diskManager !== undefined) {
            this.diskManager.freshDriveScan()
        }
    }


    public SaveSetting(event: Electron.IpcMainEvent, fileData: string, eventType: ElectronEvents) {
        if (eventType === ElectronEvents.SaveSettings) {
            this.diskManager.saveSettings(fileData, FileName.settings)
        } else if (eventType === ElectronEvents.SaveCustomCodes) {
            this.diskManager.saveSettings(fileData, FileName.customCodes)
        }
    }

    public fileSave(event: Electron.IpcMainEvent, fileData: string) {
        this.diskManager.saveFile(fileData)
    }

    public oledSave(event: Electron.IpcMainEvent, data: { fileData: number[][], fileNumber: number | string }) {
        this.diskManager.wrightOledBmp(data.fileData, data.fileNumber)
    }
    public oledread(event: Electron.IpcMainEvent, fileNumber: number) {
        this.diskManager.readOledBmp(fileNumber)
    }

    public writeFile(event: Electron.IpcMainEvent, data: { fileData: string, path: string[] }) {
        this.diskManager.writeData(data)
    }

    public saveProPlan(event: Electron.IpcMainEvent, id: string) {
        this.diskManager.setProPlan(id)
    }

    public SendMiscEvent(event: ElectronEvents, data: any) {
        console.log("sending to the frontend", data)
        if (this.win)
            this.win.webContents.send(event, data);
    }

    public UpdateKeyMap(keymap: string) {
        console.log("updated", keymap !== undefined)
        if (this.win)
            this.win.webContents.send(ElectronEvents.UpdateKeyMap, keymap);
    }

    public UpdateLayout(layout: string) {
        console.log("updated", layout !== undefined)
        if (this.win)
            this.win.webContents.send(ElectronEvents.UpdateLayout, layout);
    }

    public UpdateOled(oledData: number[][], fileNumber: number | string) {
        console.log("updated", oledData !== undefined)
        if (this.win)
            this.win.webContents.send(ElectronEvents.UpdateOled, { oledData, fileNumber });
    }

}