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
import pegSquareLogo from '../../images/peg_square_logo.svg'
import { waitUntil } from "workbox-core/_private";

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
        [lib, setLib] = createSignal(true),
        [initialBoardSetupOptions, setInitialBoardSetupOptions] = createSignal(false)
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



        // **** this NewBoardSetup may all become Loading component if you want/are okay with it *********
        <div className="NewBoardSetup flex flex-col w-full h-full justify-center relative">
            <div className="flex flex-col items-center">
                <img class='flex h-[11rem] mb-[1rem] self-center' src={pegSquareLogo} alt="peg application logo" />
                {/* ****** this Show handles the 'scan again' features of the old loading page fallback, so if I understand correct the show should be true while the app is successfully scanning, and the show should be False when the app is not scanning and we also do not have a layout. The user can then make the app scan again.  */}
                <Show when={true} fallback={
                    <div className="flex flex-col bg-red-200 justify-center items-center">
                        <p className='text-[.75rem] max-w-[30rem]'><span className='text-warning'>Oops!</span> We found something while scanning but we aren't able to display the board. Please check your connected drives or visit <span className='text-primary'>peg.software/help</span> for more information.</p>
                        <Button className={`btn-warning animate-bounce btn-xs mt-3`} onClick={() => { }} >
                            Scan Again
                        </Button>
                    </div>

                } >
                    <h4 className='mb-[3rem] animate-pulse text-base-300'>Scanning...</h4>
                </Show>

            </div>
            {/* **** the DivBelow called newboad is the one we can have handle all setup, it is the one that can appear after X seconds if we still dont have a keymap, also, you may want to set it so that this one doesn't show if the Scan Again div is up, just incase somehow that fucks something up that the user clicks setup new board while the app is in a weird state is all. if it doesn't matter then both can be up at the same time */}
            <div className="newboard flex flex-col items-center self-center absolute bottom-[.5rem]">
                <h2 className='text-[.9rem]'>Board Not Appearing?</h2>
                <p className='text-[.8rem] mb-2'>You may need to configure your board to work with Peg.</p>
                <Button className={`btn-success btn-xs mt-1 mb-3`} onClick={() => { setInitialBoardSetupOptions(true) }} >
                    Setup New Board
                </Button>
                <p className='text-[.75rem]'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam dolorum rerum, iste  ut modi.</p>
                {/* ******* all of this stuff open in modal? ****** good way to fit it all OR we can have it replace the animation for scanning that is also a good option and keeps it all on page ****** */}
                {renderSubViews()}
            </div>

            {/* *** I will dump this wherever the stuff ends up, i can do that */}
            {/* <Show when={initialBoardSetupOptions()} fallback={<div>Loading...</div>}>
                <Toggle label="Install Kmk?" name="kmk" value={kmk()} onChange={(e: any) => { setKmk(e.target.value) }} />
                <Toggle label="Install required libs?" name="lib" value={lib()} onChange={(e: any) => { setLib(e.target.value) }} />
            </Show> */}


        </div>
    );
}
