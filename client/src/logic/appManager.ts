import { DiskManager } from "./diskManager";
import Electron, { app, ipcMain, BrowserWindow } from 'electron';
import { ElectronEvents, FileName } from "../types/types";

export class AppManager {
    diskManager: DiskManager;
    win: Electron.BrowserWindow
    constructor(bWin: Electron.BrowserWindow) {
        this.diskManager = new DiskManager(this)
        this.win = bWin;
    }

    run() {
        setTimeout(() => {
            console.log("running on main thread")
            this.diskManager.manageDriveScan()
        }, 1000);

    }
    public Scan(_event: Electron.IpcMainEvent, _fileName: string,) {
        if (this.diskManager !== undefined) {
            this.diskManager.manageDriveScan()

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

    public writeFile(event: Electron.IpcMainEvent, data: { fileData: string, path: string[] }) {

        this.diskManager.writeData(data)

    }

    public SendMiscEvent(event: ElectronEvents, data: any) {
        if (this.win)
            this.win.webContents.send(event, data);
    }

    public UpdateKeyMap(keymap: string) {
        if (this.win)
            this.win.webContents.send(ElectronEvents.UpdateKeyMap, keymap);
    }

    public UpdateLayout(layout: string) {
        if (this.win)
            this.win.webContents.send(ElectronEvents.UpdateLayout, layout);
    }
}