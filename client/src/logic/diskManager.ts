import { KeyMap } from "./keymapManager";
import { readdir } from 'fs/promises';
import { AppManager } from "./AppManager";
const nodeDiskInfo = require('node-disk-info')
import * as fs from 'fs/promises';
import path from 'path'
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
    appManager: AppManager;
    constructor(appManager: AppManager) {
        this.appManager = appManager
    }


    public async scanDrives() {
        try {
            const disks = await nodeDiskInfo.getDiskInfo()
            for (const disk of disks) {
                const files = await fs.readdir(disk.mounted);
                if (files.includes("main.py") && files.includes("layout.json")) {
                    this.kbDrive = `${disk.mounted}/`;
                    this.hasKeymap = `${this.kbDrive}main.py`
                    this.hasLayout = `${this.kbDrive}layout.json`
                    break
                }
            }
            if (this.kbDrive != "") {
                this.didNotFindDrive = false;

                if (this.hasKeymap != "") {
                    const mainPy = await fs.readFile(this.hasKeymap, 'utf8');
                    this.appManager.UpdateKeyMap(mainPy)
                }
                if (this.hasLayout != "") {
                    const layoutjson = await fs.readFile(this.hasLayout, 'utf8');
                    this.appManager.UpdateLayout(layoutjson)
                }
            }
            else {
                this.didNotFindDrive = true;
            }

        } catch (err) {
            console.error(err);
        }

    }
}