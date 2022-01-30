import { KeyMap } from "./keymapManager";
import { readdir } from 'fs/promises';
import drivelist from "drivelist"
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
                    // string keymapText = this.loadTextFile(hasKeymap);
                    // this.mainKeymap.StringToKeymap(keymapText);
                }
                if (this.hasLayout != "") {
                    // string layoutText = this.loadTextFile(hasLayout);
                    // this.mainKeymap.ParceLayout(layoutText);
                }
            }
            else {
                this.didNotFindDrive = true;
            }

        } catch (err) {
            console.error(err);
        }


        // DriveInfo[] allDrives = DriveInfo.GetDrives();
        // for (int i = 0; i < allDrives.Length; i++)
        // {
        //     DriveInfo d = allDrives[i];
        //     if (d.IsReady == true)
        //     {
        //         if (d.VolumeLabel.StartsWith("C") || d.VolumeLabel.StartsWith("/boot"))
        //         {
        //             continue;
        //         }
        //         if (System.IO.Directory.Exists("" + d.VolumeLabel + "/"))
        //         {
        //             string[] files = System.IO.Directory.GetFiles("" + d.VolumeLabel + "/");
        //             string filesString = string.Join(",", files);
        //             if (filesString.Contains("main.py") && filesString.Contains("layout.json"))
        //             {
        //                 this.kbDrive = "" + d.VolumeLabel + "/";
        //                 this.hasKeymap = "" + kbDrive + "main.py";
        //                 this.hasLayout = "" + kbDrive + "layout.json";
        //                 break;
        //             }
        //         }
        //     }
        // }
        // if (this.kbDrive != "")
        // {
        //     didNotFindDrive = false;
        //     this.mainKeymap = Keymap.Instance();
        //     if (hasKeymap != "")
        //     {
        //         string keymapText = this.loadTextFile(hasKeymap);
        //         this.mainKeymap.StringToKeymap(keymapText);
        //     }
        //     if (hasLayout != "")
        //     {
        //         string layoutText = this.loadTextFile(hasLayout);
        //         this.mainKeymap.ParceLayout(layoutText);
        //     }
        // }
        // else
        // {
        //     didNotFindDrive = true;
        // }
    }
}