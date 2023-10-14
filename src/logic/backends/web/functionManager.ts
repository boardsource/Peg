import { BootOptions, ConnectionType } from "../../../types/types"
import FileApiFileManager from "./fileManagers/fileApiFileManager"
import { delay } from "./helper"
import Ide from "./ide"
import { Serial } from "./serial"

export default class FunctionManager {
    replReady: boolean = false
    fileReady: boolean = false
    ideReady: boolean = false
    ideManager: Ide
    fileManager: FileApiFileManager
    serial: Serial
    bootSettings: BootOptions = {}
    constructor() {
        this.serial = Serial.getInstance()
        this.ideManager = Ide.getInstance()
        this.fileManager = new FileApiFileManager()
    }

    replReadyCheck = async () => {
        if (this.serial.connected) {
            return await delay(20)
        } else {
            this.serial.open()
            await this.serial.getReplConnection()
            this.replReady = true
        }
    }

    fileReadyCheck = async () => {
        if (this.fileManager.connected) {
            return delay(20)
        } else {
            await this.fileManager.open()
            await this.fileManager.getFileSystem()
            this.fileReady = true
        }
    }

    ideReadyCheck = async () => {
        if (this.ideManager.connected) {
            return delay(20)
        } else {
            await this.ideManager.open()
            await this.ideManager.getFileSystem()
            this.ideReady = true
        }
    }

    checkForSerialEditing = async () => {
        await this.ideReadyCheck()
        const bootPy = await this.ideManager.getFile("/boot.py")
        if (bootPy.includes(`storage.remount("/", False)`)) {
            this.bootSettings.serialEditing = true
            return true
        }
        this.bootSettings.serialEditing = false
        return false
    }

    setupSerialEditing = async () => {
        await this.checkForSerialEditing()
        if (this.bootSettings.serialEditing) {
            alert("you are already good to go")
        } else {
            await this.ideReadyCheck()
            let bootPy = await this.ideManager.getFile("/boot.py")
            bootPy += `import storage\r\nstorage.remount("/", False)`
            this.ideManager.updateFile("/boot.py", bootPy)
            this.ideManager.saveFile("/boot.py")
        }
    }

    setupFileEditing = async () => {
        await this.checkForSerialEditing()
        if (!this.bootSettings.serialEditing) {
            alert("you are already good to go")
        } else {
            this.ideManager.changeConnectionType(ConnectionType.FileApi)
            await this.ideReadyCheck()
            let bootPy = await this.ideManager.getFile("/boot.py")
            bootPy += `import storage\r\nstorage.remount("/", True)`
            this.ideManager.updateFile("/boot.py", bootPy)
            this.ideManager.saveFile("/boot.py")
        }
    }

    wipeDrive = async () => {
        await this.replReadyCheck()
        this.serial.writeStringToByte("import storage")
        await delay()
        this.serial.writeStringToByte("storage.erase_filesystem()")
        await delay()
    }
}