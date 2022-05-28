import { Show, createSignal, onMount, For, onCleanup, batch } from "solid-js";

import { ElectronEvents, FileName, KeyCode, Layout } from "../../types/types"

import axios from "axios"
import { ProgramSettings } from "../../logic/programSettings";
import { ClientManager } from "../../logic/clientManager";
import Button from "../button/button";
import { Toast } from "../../logic/toast";
import Toggle from "../toggle/toggle";

import { KeyMap } from "../../logic/keymapManager";
import { MiscKeymapParts } from "../../logic/miscKeyMapParts";

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
    Waiting = "Waiting",
    SplitStartOver = "SplitStartOver"
}
enum NameParts {
    Creator = "creator",
    Name = "name",
    Controller = "controller",
    Config = "config",
    Side = "side"
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
const nameIsSplit = (name: string) => {
    return name.endsWith("L") || name.endsWith("R")
}



export default function NewBoardSetupModal(props: NewBoardSetupProps) {
    const [serverBoards, setServerBoards] = createSignal<splitUpServerBoard[]>([]),
        [filteredBoards, setFilteredBoards] = createSignal<splitUpServerBoard[]>([]),
        [serverBoardFilters, setServerBoardFilters] = createSignal<Map<NameParts, Set<string>>>(new Map()),
        [currentFilter, setCurrentFilter] = createSignal<Map<NameParts, Set<string>>>(new Map()),
        [currentFilterStrs, setCurrentFilterStrs] = createSignal<string[]>([]),
        [currentView, SetCurrentView] = createSignal(SubViews.Waiting),
        [kmk, setKmk] = createSignal(true),
        [boardName, setBoardName] = createSignal(""),
        [lib, setLib] = createSignal(true),
        [secondPass, setSecondPass] = createSignal(false)


    let fullServerBoard: FullServerBoard | undefined = undefined;
    const buildFilters = (serverBoardsData: ServerBoard[]) => {
        let splitBoards: splitUpServerBoard[] = [];
        let boardNames = new Set<string>()
        let boardCreators = new Set<string>()
        let boardControllers = new Set<string>()
        let boardConfigs = new Set<string>()
        let boardSides = new Set<string>()
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
            splitBoards.push(splitUpBoard)
            boardNames.add(splitUpBoard.name)
            boardCreators.add(splitUpBoard.creator)
            boardControllers.add(splitUpBoard.controller)
            boardConfigs.add(splitUpBoard.config)
            boardSides.add(splitUpBoard.side)
        })
        let availableFilters: Map<NameParts, Set<string>> = new Map()
        availableFilters.set(NameParts.Creator, boardCreators)
        availableFilters.set(NameParts.Name, boardNames)
        availableFilters.set(NameParts.Controller, boardControllers)
        availableFilters.set(NameParts.Config, boardConfigs)
        availableFilters.set(NameParts.Side, boardSides)

        batch(() => {
            setServerBoards(splitBoards)
            setServerBoardFilters(availableFilters)
            setFilteredBoards(splitBoards)
        })

    }
    const scanAgain = () => {
        if (!clientManager.scaning && clientManager.keymap.layout === undefined) {
            clientManager.sendToBackend(ElectronEvents.Scan, "")
        }
    }

    const filterBoards = () => {
        const tempCurrentFilter = currentFilter()
        if (tempCurrentFilter.size > 0) {
            return serverBoards().filter(board => {
                let match = true
                for (let i = 0; i < Array.from(tempCurrentFilter.keys()).length; i++) {
                    const category = Array.from(tempCurrentFilter.keys())[i];
                    const tempCategory = tempCurrentFilter.get(category)
                    if (tempCategory && tempCategory.size > 0) {
                        if (match) {
                            match = tempCategory.has(board[category])
                        }
                    }
                }
                return match
            })
        } else {
            return serverBoards()
        }
    }
    const fetchServerBoards = async () => {
        clientManager.sendToBackend(ElectronEvents.DownLoadKmk, "")
        const serverBoards = await axios.get(`${programSettings.apiUrl}boards`)
        buildFilters(serverBoards.data)
    }
    onMount(() => {
        fetchServerBoards();
    });
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
            try {
                if (fullServerBoard?.Layout) {
                    const layoutJson: Layout = JSON.parse(fullServerBoard?.Layout)
                    const bootPy = MiscKeymapParts.MakeBootPy(layoutJson.features.name, layoutJson.features.split, layoutJson.features.rightSide, layoutJson.features.bootSize)
                    clientManager.sendToBackend(ElectronEvents.Savefile, { fileData: bootPy, path: [drivePath, FileName.boot] })
                }

            } catch (error) {
                console.log("error making boot.py", error)
            }
            if (nameIsSplit(boardName())) {
                if (secondPass()) {
                    scanAgain()
                    props.close()
                } else {
                    SetCurrentView(SubViews.SplitStartOver)
                    setSecondPass(true)
                }


            } else { props.close() }
        }
    }
    clientManager.lessonToEvent(ElectronEvents.FilePickerClose, setPath)
    const addFilters = (key: string, category: NameParts) => {

        let tempCategory = currentFilter().get(category)
        let tempCurrentFilterStrs = new Set(currentFilterStrs())
        if (tempCategory !== undefined) {
            if (category === NameParts.Name || category === NameParts.Creator) {
                if (tempCategory.has(key)) {
                    tempCategory.clear()
                    tempCurrentFilterStrs.delete(key)
                } else {
                    tempCategory.clear()
                    tempCategory.add(key)
                }
            } else {
                if (tempCategory.has(key)) {
                    tempCategory.delete(key)
                    tempCurrentFilterStrs.delete(key)
                } else {
                    tempCategory.add(key)
                    tempCurrentFilterStrs.add(key)
                }
            }
            setCurrentFilter(currentFilter().set(category, tempCategory))
        } else {
            setCurrentFilter(currentFilter().set(category, new Set([key])))
            tempCurrentFilterStrs.add(key)
        }
        batch(() => {
            setFilteredBoards(filterBoards())
            setCurrentFilterStrs([...tempCurrentFilterStrs])
        })
    }
    const returnFilterButtons = (category: NameParts) => {
        const filters = serverBoardFilters().get(category)
        if (filters !== undefined) {
            if (category === NameParts.Name || category === NameParts.Creator) {
                return (<div className="flex ">
                    <p className='text-[.85rem] mb-[.2rem]'>{category}:</p>
                    <div class="dropdown w-[10rem] mb-5">

                        <select class="select select-primary w-full max-w-xs" onChange={(e) => {
                            //@ts-ignores
                            addFilters(e.target.value, category)
                        }
                        }>
                            <option disabled selected>Select {category}</option>
                            <For each={Array.from(filters)}>
                                {(filter) => (
                                    <>
                                        <option>{filter}</option>
                                    </>
                                )}
                            </For>
                        </select>
                    </div>
                </div>)
            } else {
                return (
                    <div className="flex ">
                        <p>
                            {category}:
                        </p>

                        <For each={Array.from(filters)}>
                            {(filter) => (
                                <Button onClick={() => addFilters(filter, category)} selected={currentFilterStrs().includes(filter)}>
                                    {filter}
                                </Button>
                            )
                            }
                        </For>
                    </div>
                )
            }
        } else {
            return ""
        }
    }
    const getOtherSide = () => {
        const oldBoardName = boardName()
        let tempName = ``
        if (oldBoardName.endsWith("-L")) {
            tempName = `${oldBoardName}`.replace(/.$/, "R")
        } else {
            tempName = `${oldBoardName}`.replace(/.$/, "L")
        }
        const officalName = serverBoards().find(board => board.fullName === tempName)
        console.log("off", officalName, tempName)
        return officalName

    }
    const splitStartOver = (pickedBoard?: splitUpServerBoard) => {
        if (pickedBoard !== undefined) {
            selectServerBoard(pickedBoard._id, pickedBoard.fullName)
        } else {
            SetCurrentView(SubViews.Waiting)
        }
    }
    const renderSubViews = () => {
        switch (currentView()) {
            case SubViews.PickBoard:
                return (
                    <div className="NewBoardSetup__boards flex flex-col h-[550px]">
                        <div className='flex flex-col w-full h-full bg-yellow-200' >
                            <div className="flex flex-col bg-red-200">
                                {returnFilterButtons(NameParts.Creator)}
                                {returnFilterButtons(NameParts.Name)}
                                {returnFilterButtons(NameParts.Controller)}
                                {returnFilterButtons(NameParts.Side)}
                                {returnFilterButtons(NameParts.Config)}
                            </div>
                            <div className="flex flex-1 items-start w-full bg-green-200 overflow-scroll">
                                <table className="table table-compact max-w-[100%] w-full">
                                    <thead>
                                        <tr>
                                            <td>Creator</td>
                                            <td>Name</td>
                                            <td>Controller</td>
                                            <td>Config</td>
                                            <td>Side</td>
                                            <td>Configure</td>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        <For each={filteredBoards()} fallback={<div>No matches</div>}>
                                            {(board) =>

                                            (<tr>
                                                <td>{board.creator}</td>
                                                <td>{board.name}</td>
                                                <td>{returnStyledTableItem(board.controller)}</td>

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
            case SubViews.SplitStartOver:
                const maybeOtherSide = getOtherSide(),
                    hasOtherSide = maybeOtherSide !== undefined
                return (
                    <div className="NewBoardSetup__split flex flex-col">
                        <p>
                            You complected the new board setup with a split. Do you want to flash the other side {hasOtherSide ? `with ${maybeOtherSide.fullName}?` : "?"}
                            {" "}If so unplug your current side right now and plug in the new side then push the the button below.
                        </p>
                        <div className="flex">
                            <Button className='btn-success mt-5' onClick={() => {
                                splitStartOver(maybeOtherSide)
                            }} selected={true}>
                                yes
                            </Button>
                            <Show when={hasOtherSide}>
                                <Button className='btn-success mt-5' onClick={splitStartOver} selected={true}>
                                    yes but not that board
                                </Button>
                            </Show>
                            <Button className='btn-success mt-5' onClick={() => props.close()} selected={false}>
                                no get me out
                            </Button>
                        </div>

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
