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
    close: () => void
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
                side: isLeftOrRight(nameParts[nameParts.length - 1]) ? nameParts[nameParts.length - 1] : "N/A",
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
            props.close()
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

    const returnStyledTableItem = (item: string) => {
        let tableItemClasses = ' '
        let tableBadgeClasses = 'badge badge-outline badge-sm '
        switch (item) {
            case 'blok':
                tableItemClasses += tableBadgeClasses + ' badge-primary'
                break
            case 'integrated':
                tableItemClasses += tableBadgeClasses + ' badge-base-300'
                break
            case 'wired':
                tableItemClasses += tableBadgeClasses + ' badge-secondary'
                break
            case 'N/A':
                tableItemClasses += ' text-base-300'
                break
            default:
                tableItemClasses += ''

        }
        return (
            <span className={`${tableItemClasses}`}>{item}</span>
        )

    }
    const renderSubViews = () => {
        switch (currentView()) {
            case SubViews.PickBoard:
                return (
                    <div className="NewBoardSetup__boards flex flex-col h-[550px]">
                        <div className='flex flex-col w-full h-full bg-yellow-200' >
                            <div className="flex flex-col bg-red-200">
                                <For each={Array.from(serverBoardFilters().keys())} fallback={<div>Loading...</div>}>
                                    {(category) => {
                                        const filters = serverBoardFilters().get(category)
                                        // if (category === 'creator' || category === 'name') {

                                        // }
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
                            <div className="flex flex-1 items-start w-full bg-green-200 overflow-scroll">
                                <table className="table table-compact max-w-[100%] w-full">
                                    <thead>
                                        <tr>
                                            {/* <th></th> */}
                                            <td>Creator</td>
                                            <td>Name</td>
                                            <td>Controller</td>
                                            <td>Config</td>
                                            <td>Side</td>
                                            <td>Configure</td>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        <For each={serverBoards()} fallback={<div>Loading...</div>}>
                                            {(board, index) =>

                                            (<tr>
                                                {/* <th>{index() + 1}</th> */}
                                                <td>{board.creator}</td>
                                                <td>{board.name}</td>
                                                <td>{returnStyledTableItem(board.controller)}</td>
                                                {/* <td>{board.controller === 'blok' ? (
                                                    <span className={`${tableBadgeStyles} badge-primary`}>{board.controller}</span>
                                                ) : board.controller}
                                                </td> */}
                                                <td>{returnStyledTableItem(board.config)}</td>
                                                <td>{returnStyledTableItem(board.side)}</td>
                                                <td>
                                                    <Button onClick={() => selectServerBoard(board._id, board.fullName)} className={`!btn-xs`} selected={false}>
                                                        select
                                                    </Button>
                                                </td>
                                            </tr>)
                                            }
                                        </For>
                                    </tbody>
                                </table>
                            </div>

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

                return (
                    <div className="NewBoardSetup__buttons flex flex-col justify-center items-center">
                        <p>
                            Plug in your CircuitPython Drive. When you see the drive mount in your system click the Next button below.
                        </p>
                        <Button className='btn-success w-full mt-5' onClick={() => SetCurrentView(SubViews.PickBoard)} selected={false}>
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
