import FileApiFileManager from "./fileManagers/fileApiFileManager";
import IFileManager from "./fileManagers/ifileManager";
import SerialFileManager from "./fileManagers/serialFileManager";
import { ConnectionType, FileTreeData } from "../../../types/types"
import { Subscribable } from "../../subscribable";
import { ProgramSettings } from "../../programSettings";


class Ide extends Subscribable {
    private static instance: Ide;
    files = new Map<string, string>();
    connection: IFileManager;
    fileSystem: FileTreeData = {
        title: "unset",
        key: "unset",
        children: []
    }
    connectionType: ConnectionType = ConnectionType.Serial
    changesMade: boolean = false
    private constructor() {
        super()
        this.connectionType = ProgramSettings.getInstance().connectionType

        if (this.connectionType === ConnectionType.FileApi) {
            console.log("setting file connection")
            this.connection = new FileApiFileManager()
        } else if (this.connectionType === ConnectionType.Serial) {
            console.log("setting serial connection")
            this.connection = new SerialFileManager()
        } else {
            this.connection = new FileApiFileManager()

        }
    }

    public static getInstance(): Ide {
        if (!Ide.instance) {
            Ide.instance = new Ide();
        }
        return Ide.instance;
    }

    public get hasFileSystem() {
        if (this.fileSystem.title === "unset") {
            return false
        } else {
            return true
        }
    }

    public get connected() {
        return this.connection.connected
    }

    changeConnectionType = (newType: ConnectionType) => {
        if (newType !== this.connectionType) {
            console.log("changing connection type")
            this.connectionType = newType
            console.log(newType, ConnectionType.FileApi, typeof newType)
            if (newType === ConnectionType.FileApi) {
                console.log("swapping connection")
                this.connection = new FileApiFileManager()
            }
            if (newType === ConnectionType.Serial) {
                console.log("swapping connection")
                this.connection = new SerialFileManager()
            }

            console.log(this)
        }
    }



    getFileSystem = async () => {
        const tempFileSystem = await this.connection.getFileSystem()
        this.fileSystem = tempFileSystem
        this.updateSubScribers()
        return this
    }


    getFile = async (path: any): Promise<string> => {
        if (!this.files.has(path)) {
            try {
                const file = await this.connection.readFile(path)
                this.files.set(path, file)
                console.log(file)
                return file

            } catch (error) {
                console.log("error reading file", error)
                return ""
            }

        } else {
            const file = `${this.files.get(path)}`
            return file
        }

    }



    saveFile = async (path: string) => {
        const fileToBeSaved = await this.getFile(path)
        console.log({ path, fileToBeSaved })
        const file = await this.connection.writeFile(path, fileToBeSaved)
        return this

    }

    makeNewFile = async (path: string, name: string) => {
        await this.connection.makeFile(path, name)
        this.getFileSystem()
        return this

    }
    makeNewDir = async (path: string, name: string) => {
        await this.connection.makeDir(path, name)
        this.getFileSystem()
        return this

    }

    updateFile = (path: string, newFile: string) => {
        this.files.set(path, newFile)
        this.changesMade = true
        this.updateSubScribers()
        return this

    }

    open = async () => {
        await this.connection.open()
        return this

    }
}

export default Ide