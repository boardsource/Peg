import { FileTreeData } from "../../../../types/types";
import { comparStrings, delay, escapeCharacters } from "../helper";
import { Serial } from "../serial";
import IFileManager from "./ifileManager";

export default class SerialFileManager implements IFileManager {
    connection: any;
    _connected: boolean = false
    haveFileSystem: boolean = false
    inUse: boolean = false

    constructor() {
        this.connection = Serial.getInstance()
        this._connected = this.connection.connected
    }

    public get connected() {
        return this._connected ? this._connected : this.connection.connected
    }
    waitUntilCanUse = async () => {
        while (this.inUse) {
            await delay(100)
        }
        return true
    }
    setUsing = (newValue: boolean) => {
        this.inUse = newValue
    }

    open = async () => {
        this.connection.open()
        return new Promise(resolve => {
            const loop = setInterval(() => {
                if (this.connection.port) {
                    if (this.connection.port.opened()) {
                        this._connected = true
                        resolve(true)
                    }
                }
            }, 100);

        });
    }
    close = () => {
        this.connection.close()
        this._connected = false
    }

    getFileSystem = async () => {
        const getFiles = async (path: string) => {
            await delay()
            let files: string = await this.connection.sendAndStealResponse(`print(os.listdir("${path}"))`)
            return files
        }
        const possessFiles = async (tmpfiles: string, parent: string): Promise<FileTreeData> => {
            let jsonFiles
            let tempTree: FileTreeData = {
                title: parent,
                key: parent,
                children: []
            }
            try {
                jsonFiles = JSON.parse(tmpfiles.replaceAll(`'`, `"`))
            } catch (error) {
                console.log("error parcing tmpfiles", tmpfiles, parent)
                return tempTree
            }
            // console.log(jsonFiles)

            for (const file of jsonFiles) {
                if (file !== "System Volume Information") {

                    if (file.includes(".")) {
                        const newPath = parent + "/" + file
                        tempTree.children?.push({
                            title: file,
                            key: newPath.replaceAll("//", "/")
                        })
                    } else {
                        const newPath = parent + "/" + file
                        const newFiles = await getFiles(newPath)
                        const tempFiles = await possessFiles(newFiles, newPath)
                        const children = Array.isArray(tempFiles.children) && tempFiles.children.length > 0 ? [...tempFiles.children] : []
                        tempTree.children?.push({
                            title: file,
                            key: newPath.replaceAll("//", "/"),
                            children
                        })
                    }
                }
            };
            return tempTree
        }
        await this.waitUntilCanUse()
        this.setUsing(true)
        await this.connection.getReplConnection()
        this.connection.toggleLock(true)
        this.connection.writeStringToByte("import os")
        const files = await getFiles("/")
        const data = await possessFiles(files, "/")
        this.setUsing(false)
        this.connection.toggleLock(false)
        this.haveFileSystem = true
        return data
    }
    readFile = async (path: string) => {
        const getLine = async (lineNumber: number) => {
            console.log("getting line", lineNumber)
            this.connection.writeStringToByte(`print(l[${lineNumber}])`)
            await delay(200)
        }
        await this.waitUntilCanUse()
        this.setUsing(true)
        await this.connection.getReplConnection()

        this.connection.toggleLock(true)
        this.connection.writeStringToByte("import os")
        await delay()
        this.connection.writeStringToByte(`f=open("${path}","r")`)
        await delay()
        this.connection.writeStringToByte(`l=f.readlines()`)
        await delay()
        let numOfLines = await this.connection.sendAndStealResponse(`print(len(l))`)
        await delay()
        // console.log("going to get lines", numOfLines)
        const responsesPreFile = this.connection.responses.length
        for (let i = 0; i < Number(numOfLines); i++) {
            await getLine(i)
        }
        this.connection.writeStringToByte("f.close()")
        this.setUsing(false)
        this.connection.toggleLock(false)
        const fileResponses = [...this.connection.responses].splice(responsesPreFile, this.connection.responses.length - 1)
        const filtered: string[] = fileResponses.filter(res => !res.startsWith(">>> "))
        const file = filtered.join("")
        return file
    }
    writeFile = async (path: string, newFile: string) => {
        const checkSum = true
        await this.waitUntilCanUse()
        this.setUsing(true)
        await this.connection.getReplConnection()
        this.connection.toggleLock(true)
        this.connection.writeStringToByte("import os")
        await delay()
        this.connection.writeStringToByte(`f=open("${path}","w")`)
        await delay()
        this.connection.writeStringToByte(`nf='''${escapeCharacters(newFile)}'''`)
        await delay()
        this.connection.writeStringToByte("f.write(nf)")
        await delay()
        this.connection.writeStringToByte("f.close()")
        await delay()
        this.connection.writeStringToByte("os.sync()")
        this.setUsing(false)
        this.connection.toggleLock(false)
        if (checkSum) {
            const savedFile = await this.readFile(path)
            if (comparStrings(savedFile, newFile)) {
                this.connection.communicate(`ToolBox Info: File Saved! ${path} was saved successfully.`)
            } else {
                this.connection.communicate(`ToolBox ERROR: File Saved... ${path} was saved but something is wrong.`)
            }
        }
    }

    makeDir = async (path: string, name: string) => {
        const newPath = `${path}/${name}`
        await this.waitUntilCanUse()
        this.setUsing(true)
        await this.connection.getReplConnection()
        this.connection.toggleLock(true)
        this.connection.writeStringToByte("import os")
        await delay()
        this.connection.writeStringToByte(`is.mkdir(${newPath})`)
        await delay()
        this.connection.writeStringToByte("os.sync()")
        this.setUsing(false)
        this.connection.toggleLock(false)

    }
    makeFile = async (path: string, name: string) => {
        const newPath = `${path}/${name}`

        await this.waitUntilCanUse()
        this.setUsing(true)
        await this.connection.getReplConnection()
        this.connection.toggleLock(true)
        this.connection.writeStringToByte("import os")
        await delay()
        this.connection.writeStringToByte(`f=open("${newPath}","w")`)
        await delay()
        this.connection.writeStringToByte("os.sync()")
        this.setUsing(false)
        this.connection.toggleLock(false)
    }

}