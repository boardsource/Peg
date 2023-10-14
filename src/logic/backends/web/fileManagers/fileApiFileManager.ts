import { FileTreeData, Handle } from "../../../../types/types";
import { delay, findItemInTree } from "../helper";

import IFileManager from "./ifileManager";

export default class FileApiFileManager implements IFileManager {
    connection: any;
    fileSystem: FileTreeData = {
        title: "unset",
        key: "unset",
        children: []
    }
    haveFileSystem: boolean = false
    directoryHandle: FileSystemDirectoryHandle | undefined

    constructor() {
    }
    public get connected() {
        return this.directoryHandle !== undefined
    }
    open = async () => {
        window.alert("as soon as you close this a file window will pop up you need to select your CircuitPython drive.")
        //@ts-ignore
        this.directoryHandle = await window.showDirectoryPicker();
    }
    close = () => {

    }
    getFileSystem = async () => {
        const possessFiles = async (dirHandle: FileSystemDirectoryHandle, parent: string) => {
            let tempTree: FileTreeData = {
                title: parent,
                key: parent,
                children: []
            }
            //@ts-ignore
            for await (let [name, handle] of dirHandle) {
                if (name !== "System Volume Information") {
                    if (handle.kind !== 'directory') {
                        const newPath = parent + "/" + name
                        tempTree.children?.push({
                            title: name,
                            key: newPath.replaceAll("//", "/"),
                            handle
                        })
                    } else {
                        const newPath = parent + "/" + name
                        const tempFiles = await possessFiles(handle, newPath)
                        const children = Array.isArray(tempFiles.children) && tempFiles.children.length > 0 ? [...tempFiles.children] : []
                        tempTree.children?.push({
                            title: name,
                            key: newPath.replaceAll("//", "/"),
                            handle,
                            children
                        })
                    }
                }
            };
            return tempTree
        }
        if (!this.directoryHandle) {
            //@ts-ignore
            this.directoryHandle = await window.showDirectoryPicker();
        }
        if (this.directoryHandle) {
            const data = await possessFiles(this.directoryHandle, "/")
            this.haveFileSystem = true
            this.fileSystem = data
            return data
        } else {
            return {
                title: "unset",
                key: "unset",
                children: []
            }
        }
    }
    fileForHandle = async (handle: Handle) => {
        const file = await handle.getFile();
        const contents = await file.text();
        console.log(contents)
        return contents;
    }

    writeToHandle = async (handle: Handle, contents: string) => {
        // Create a FileSystemWritableFileStream to write to.
        const writable = await handle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(contents);
        // Close the file and write the contents to disk.
        await writable.close();
    }
    readFile = async (path: string) => {
        if (this.haveFileSystem) {
            const itemFromTree = findItemInTree(path, this.fileSystem)
            if (itemFromTree && itemFromTree.handle) {
                return await this.fileForHandle(itemFromTree.handle)
            }
        }
        await delay()
        return ""
    }
    writeFile = (path: string, newFile: string) => {
        if (this.haveFileSystem) {
            const itemFromTree = findItemInTree(path, this.fileSystem)
            if (itemFromTree && itemFromTree.handle) {
                this.writeToHandle(itemFromTree.handle, newFile)
            }
        }
    }

    makeDir = (path: string, name: string) => {
        window.alert("not implemented")

    }
    makeFile = (path: string, name: string) => {
        window.alert("not implemented")

    }

}
