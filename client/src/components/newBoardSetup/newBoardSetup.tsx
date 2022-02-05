import { Show, createSignal, onMount, For } from "solid-js";
import { KeyMap } from "../../logic/keymapManager";
import { ElectronEvents, FileName, KeyCode } from "../../types/types"
import SingleUsableKeyCode from "../singleUsableKeyCode/singleUsableKeyCode";
import axios from "axios"
import { ProgramSettings } from "../../logic/programSettings";
import { ClientManager } from "../../logic/clientManager";
const programSettings = ProgramSettings.getInstance()
const clientManager = ClientManager.getInstance()
type NewBoardSetupProps = {
};
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


export default function NewBoardSetup(props: NewBoardSetupProps) {
    const [serverBoards, setServerBoards] = createSignal<ServerBoard[]>([])
        , [currentView, SetCurrentView] = createSignal(SubViews.Waiting)
    let fullServerBoard: FullServerBoard | undefined = undefined;
    const fetchServerBoards = async () => {
        const serverBoards = await axios.get(`${programSettings.apiUrl}boards`)
        setServerBoards(serverBoards.data)
    }
    const selectServerBoard = async (id: string) => {
        const serverBoard = await axios.get(`${programSettings.apiUrl}boards/${id}`)
        fullServerBoard = serverBoard.data
        SetCurrentView(SubViews.SelectDrive)
    }
    const setPath = (paths: string) => {
        if (paths !== "") {
            let drivePath = paths
            clientManager.sendToBackend(ElectronEvents.Savefile, { fileData: fullServerBoard?.Kb, path: [drivePath, FileName.kb] })
            clientManager.sendToBackend(ElectronEvents.Savefile, { fileData: fullServerBoard?.Main, path: [drivePath, FileName.main] })
            clientManager.sendToBackend(ElectronEvents.Savefile, { fileData: fullServerBoard?.Layout, path: [drivePath, FileName.layout] })
            // clientManager.sendToBackend("Scan", "")
        }


    }
    clientManager.lessonToEvent("FilePickerClose", setPath)
    onMount(() => {
        fetchServerBoards();
    });

    const renderSubViews = () => {
        switch (currentView()) {
            case SubViews.PickBoard:
                return (
                    <div className="NewBoardSetup__boards">
                        <For each={Array.from(serverBoards())} fallback={<div>Loading...</div>}>
                            {(board) =>
                                <button onClick={() => selectServerBoard(board._id)}>
                                    {board.name}
                                </button>
                            }
                        </For>
                    </div>)
            case SubViews.SelectDrive:
                return (
                    <div className="NewBoardSetup__drive">
                        <button onClick={() => clientManager.sendToBackend(ElectronEvents.FilePicker, "")}>
                            selectDrive
                        </button>
                    </div>)
            default:
                return (<div className="NewBoardSetup__buttons">
                    <button onClick={() => SetCurrentView(SubViews.PickBoard)}>
                        Yes
                    </button>
                    <button>
                        no keep looking I'll plug it in now
                    </button>
                </div>)
        }
    }
    return (
        <div className="NewBoardSetup">
            <h2>We cant find your board....Want to set one up?</h2>
            {renderSubViews()}
        </div>
    );
}
