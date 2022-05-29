
import { DiskManager } from "./diskManager";
import Electron, { app, ipcMain, BrowserWindow } from 'electron';
import { ElectronEvents, FileName, ToastLevel } from "../types/types";




export class AppManager {
    private static instance: AppManager;
    diskManager: DiskManager;
    win: Electron.BrowserWindow
    private constructor(bWin: Electron.BrowserWindow) {
        this.diskManager = new DiskManager(this)
        this.win = bWin;
        this.diskManager.readProPlan()
        console.log("making a AppManager")

    }
    public static getInstance(bWin: Electron.BrowserWindow): AppManager {
        console.log("getting a AppManager")
        if (!AppManager.instance) {
            AppManager.instance = new AppManager(bWin);

        }
        return AppManager.instance;
    }

    run() {
        setTimeout(() => {
            this.diskManager.manageDriveScan()
            this.diskManager.readProPlan()
        }, 2000);

    }
    public ClientUp() {
        this.diskManager.readProPlan()
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
            this.diskManager.freshDriveScan(true)
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

    public ClientToast(status: ToastLevel, message: string) {
        this.SendMiscEvent(ElectronEvents.Toast, { status, message })

    }

}