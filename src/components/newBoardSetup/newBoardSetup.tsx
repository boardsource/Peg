import { Show, createSignal, onMount, For } from "solid-js";
import { KeyMap } from "../../logic/keymapManager";
import { ElectronEvents, FileName, KeyCode } from "../../types/types"
import SingleUsableKeyCode from "../singleUsableKeyCode/singleUsableKeyCode";
import axios from "axios"
import { ProgramSettings } from "../../logic/programSettings";
import { ClientManager } from "../../logic/clientManager";
import Button from "../button/button";
import { Toast } from "../../logic/toast";
import Toggle from "../toggle/toggle";
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
    const [serverBoards, setServerBoards] = createSignal<ServerBoard[]>([]),
        [currentView, SetCurrentView] = createSignal(SubViews.Waiting),
        [kmk, setKmk] = createSignal(true),
        [boardName, setBoardName] = createSignal(""),
        [lib, setLib] = createSignal(true)
    let fullServerBoard: FullServerBoard | undefined = undefined;
    const fetchServerBoards = async () => {
        clientManager.sendToBackend(ElectronEvents.DownLoadKmk, "")
        const serverBoards = await axios.get(`${programSettings.apiUrl}boards`)
        setServerBoards(serverBoards.data)
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

    const renderSubViews = () => {
        switch (currentView()) {
            case SubViews.PickBoard:
                return (
                    <div className="NewBoardSetup__boards flex flex-col">
                        <For each={Array.from(serverBoards())} fallback={<div>Loading...</div>}>
                            {(board) =>
                                <Button onClick={() => selectServerBoard(board._id, board.name)} selected={false}>
                                    {board.name}
                                </Button>
                            }
                        </For>
                    </div>)
            case SubViews.SelectDrive:
                return (
                    <div className="NewBoardSetup__drive flex flex-col">
                        <p>Selected Keyboard: {boardName()}</p>
                        <p>Next select your CircuitPython Drive</p>
                        <Button onClick={() => clientManager.sendToBackend(ElectronEvents.FilePicker, "")} selected={true}>
                            select Drive
                        </Button>
                    </div>)
            default:
                return (<div className="NewBoardSetup__buttons flex">
                    <Button onClick={() => SetCurrentView(SubViews.PickBoard)} selected={true}>
                        Yes
                    </Button>
                    <Button selected={false} onClick={() => { Toast.Info("This Button Does nothing but show you a waist of a toast HAHAH\nOk Im done plug in your board ") }}>
                        no keep looking I'll plug it in now
                    </Button>
                </div>)
        }
    }
    return (
        <div className="NewBoardSetup">
            <h2>We cant find your board....Want to set one up?</h2>
            <Toggle label="Install Kmk?" name="kmk" value={kmk()} onChange={(e: any) => { setKmk(e.target.value) }} />
            <Toggle label="Install required libs?" name="lib" value={lib()} onChange={(e: any) => { setLib(e.target.value) }} />
            {renderSubViews()}
        </div>
    );
}
