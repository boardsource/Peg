import { DiskManager } from "./diskManager";
import Electron, { ipcMain, webContents } from 'electron';


export class AppManager {
    diskManager: DiskManager;
    win: Electron.BrowserWindow
    constructor(win: Electron.BrowserWindow) {
        this.win = win;
        this.diskManager = new DiskManager(this)
    }
    run() {
        setTimeout(() => {
            console.log("running on main thread")
            this.diskManager.scanDrives()
        }, 1000);

    }
    public fileSave(event: Electron.IpcMainEvent, fileName: string, fileData: string) {
        console.log(fileName, fileData) // prints "ping"
        // event.reply('fileSave-reply', 'pong')
    }
    public UpdateKeyMap(keymap: string) {
        this.win.webContents.send('UpdateKeyMap', keymap);
    }
    public UpdateLayout(layout: string) {
        this.win.webContents.send('UpdateLayout', layout);
    }
}