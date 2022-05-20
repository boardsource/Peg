import { Show, createSignal, onMount, For, onCleanup } from "solid-js";

import { ElectronEvents, FileName, KeyCode } from "../../types/types"

import axios from "axios"
import { ProgramSettings } from "../../logic/programSettings";
import { ClientManager } from "../../logic/clientManager";
import Button from "../button/button";
import { Toast } from "../../logic/toast";
import Toggle from "../toggle/toggle";

import { KeyMap } from "../../logic/keymapManager";

const programSettings = ProgramSettings.getInstance()
const clientManager = ClientManager.getInstance()
const keyMap = KeyMap.getInstance()
type NewBoardSetupProps = {
};
type splitUpServerBoard = {
    creator: string;
    name: string;
    controller: string;
    config: string;
    side: string;
    _id: string;
    fullName: string;
}
type ServerBoard = {
    _id: string
    name: string
}
type FullServerBoard = {
    ID: string
    name: string
    Kb: string
    Layout: string
    Main: string
}
enum SubViews {

    PickBoard = "PickBoard",
    SelectDrive = "SelectDrive",
    Waiting = "Waiting"
}

const isLeftOrRight = (namePart?: string) => {
    if (namePart !== undefined) {
        if (namePart === "L" || namePart === "R") { return true }
    }
    return false
}
const isConfig = (namePart?: string) => {
    if (namePart !== undefined) {
        if (namePart === "wired" || namePart === "BLE") { return true }
    }
    return false
}



export default function NewBoardSetupModal(props: NewBoardSetupProps) {
    const [serverBoards, setServerBoards] = createSignal<splitUpServerBoard[]>([]),
        [serverBoardFilters, setServerBoardFilters] = createSignal<Map<string, Map<string, splitUpServerBoard[]>>>(new Map()),
        [currentFilter, setCurrentFilter] = createSignal("All"),
        [currentView, SetCurrentView] = createSignal(SubViews.Waiting),
        [kmk, setKmk] = createSignal(true),
        [boardName, setBoardName] = createSignal(""),
        [lib, setLib] = createSignal(true)

    let fullServerBoard: FullServerBoard | undefined = undefined;
    const buildFilters = (serverBoardsData: ServerBoard[]) => {

        const filters: Map<string, Map<string, splitUpServerBoard[]>> = new Map();
        const allMap = new Map()
        allMap.set("All", new Map())
        filters.set("All", allMap)

        serverBoardsData.forEach(serverBoard => {
            const nameParts = serverBoard.name.split("-")
            let splitUpBoard: splitUpServerBoard = {
                fullName: serverBoard.name,
                creator: nameParts[0],
                name: nameParts[1],
                controller: "integrated",
                config: "wired",
                side: isLeftOrRight(nameParts[nameParts.length - 1]) ? nameParts[nameParts.length - 1] : "OP",
                _id: serverBoard._id

            }
            if (nameParts.length > 2) {
                for (let index = 2; index < nameParts.length; index++) {
                    const namePart = nameParts[index];
                    if (isConfig(namePart)) {
                        splitUpBoard.config = namePart
                        continue
                    } else if (isLeftOrRight(namePart)) {
                        continue
                    } else {
                        splitUpBoard.controller = namePart
                    }
                }
            }
            let tempValue = filters.get("All")
            if (tempValue !== undefined) {
                const tempAll = tempValue.get("All")
                if (tempAll !== undefined) {
                    tempValue.set("All", [...tempAll, splitUpBoard])
                    filters.set("All", tempValue)
                }

            }

            const fieldsWeWantToFilterBy = ["creator", "name", "controller", "config", "side"]
            fieldsWeWantToFilterBy.forEach(key => {

                let category = filters.get(key)
                if (category === undefined) {
                    category = new Map()
                }
                //@ts-ignore
                const value = splitUpBoard[key]
                if (value !== undefined) {
                    let tempValue = category.get(value)
                    if (tempValue !== undefined) {
                        category.set(value, [...tempValue, splitUpBoard])
                    } else {
                        category.set(value, [splitUpBoard])
                    }
                }

                filters.set(key, category)
            })
        })
        setServerBoardFilters(filters)
        let tempValue = filters.get("All")
        if (tempValue !== undefined) {
            const tempAll = tempValue.get("All")
            if (tempAll !== undefined) {
                setServerBoards(tempAll)
            }
        }

    }
    const fetchServerBoards = async () => {
        clientManager.sendToBackend(ElectronEvents.DownLoadKmk, "")
        const serverBoards = await axios.get(`${programSettings.apiUrl}boards`)
        buildFilters(serverBoards.data)
    }
    const selectServerBoard = async (id: string, name: string) => {
        const serverBoard = await axios.get(`${programSettings.apiUrl}boards/${id}`)
        fullServerBoard = serverBoard.data
        setBoardName(name)
        SetCurrentView(SubViews.SelectDrive)
    }
    const setPath = (paths: string) => {
        if (paths !== "") {
            let drivePath = paths
            clientManager.sendToBackend(ElectronEvents.Savefile, { fileData: fullServerBoard?.Kb, path: [drivePath, FileName.kb] })
            clientManager.sendToBackend(ElectronEvents.Savefile, { fileData: fullServerBoard?.Main, path: [drivePath, FileName.main] })
            clientManager.sendToBackend(ElectronEvents.Savefile, { fileData: fullServerBoard?.Layout, path: [drivePath, FileName.layout] })
            if (kmk()) {
                clientManager.sendToBackend(ElectronEvents.InstallKmk, drivePath)
            }
            if (lib() && boardName() !== "") {
                clientManager.sendToBackend(ElectronEvents.DownLoadAndInstallLib, { boardName: boardName(), path: drivePath })
            } else if (lib() && boardName() === "") {
                Toast.Error("Sorry you wanted libs installed too but something happened and I dont have the data I need go to https://github.com/daysgobye/pegBoards and look for them")
            }

        }


    }
    clientManager.lessonToEvent(ElectronEvents.FilePickerClose, setPath)
    onMount(() => {
        fetchServerBoards();
    });
    const filterBoards = (key: string, category: string) => {
        const newList = serverBoardFilters().get(category)?.get(key)
        if (newList !== undefined) {
            setCurrentFilter(key)
            setServerBoards(newList)
        }

    }

    const renderSubViews = () => {
        switch (currentView()) {
            case SubViews.PickBoard:
                return (
                    <div className="NewBoardSetup__boards flex flex-col">
                        <div >
                            <div className="flex flex-col">
                                <For each={Array.from(serverBoardFilters().keys())} fallback={<div>Loading...</div>}>
                                    {(category) => {
                                        const filters = serverBoardFilters().get(category)
                                        if (filters !== undefined) {


                                            return (
                                                <div className="flex ">
                                                    <p>
                                                        {category}:
                                                    </p>

                                                    <For each={Array.from(filters.keys())} fallback={<div>Loading...</div>}>
                                                        {(filter) =>
                                                        (
                                                            <Button onClick={() => filterBoards(filter, category)} selected={currentFilter() === filter}>
                                                                {filter}
                                                            </Button>
                                                        )
                                                        }
                                                    </For>
                                                </div>
                                            )
                                        }
                                    }
                                    }
                                </For>
                            </div>
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <td>creator</td>
                                        <td>name</td>
                                        <td>controller</td>
                                        <td>config</td>
                                        <td>side</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody className="overflow-y-scroll">
                                    <For each={serverBoards()} fallback={<div>Loading...</div>}>
                                        {(board, index) =>

                                        (<tr>
                                            <th>{index() + 1}</th>
                                            <td>{board.creator}</td>
                                            <td>{board.name}</td>
                                            <td>{board.controller}</td>
                                            <td>{board.config}</td>
                                            <td>{board.side}</td>
                                            <td>
                                                <Button onClick={() => selectServerBoard(board._id, board.fullName)} selected={false}>
                                                    select
                                                </Button>
                                            </td>
                                        </tr>)
                                        }
                                    </For>
                                </tbody>
                            </table>
                        </div>
                    </div>)
            case SubViews.SelectDrive:
                return (
                    <div className="NewBoardSetup__drive flex flex-col">
                        <Toggle label="Install Kmk?" name="kmk" value={kmk()} onChange={(e: any) => { setKmk(e.target.value) }} />
                        <Toggle label="Install required libs?" name="lib" value={lib()} onChange={(e: any) => { setLib(e.target.value) }} />
                        <p>Selected Keyboard: {boardName()}</p>
                        <p>Next select your CircuitPython Drive</p>
                        <Button onClick={() => clientManager.sendToBackend(ElectronEvents.FilePicker, "")} selected={true}>
                            select Drive
                        </Button>
                    </div>)
            default:

                return (<div className="NewBoardSetup__buttons flex">
                    <p>
                        Plug in your circuitpython drive. When you can see a small external storage plugged into your computer click next
                    </p>
                    <Button onClick={() => SetCurrentView(SubViews.PickBoard)} selected={true}>
                        Next
                    </Button>
                </div>)
        }
    }
    return (



        <div className="NewBoardSetup flex flex-col w-full h-full justify-center relative">

            {renderSubViews()}

        </div>
    );
}
