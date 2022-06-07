import { ClientManager } from "../../logic/clientManager"
import { ElectronEvents } from "../../types/types"
import "./menubar.sass"
const clientManager = ClientManager.getInstance()
export default function Menubar() {
    const minimizeWindow = () => {
        clientManager.sendToBackend(ElectronEvents.WindowMinimize, "")
        //bird boi will make this minimize the window
    }
    const fullscreenWindow = () => {
        clientManager.sendToBackend(ElectronEvents.WindowFullScreen, "")
        //bird boi will make this fullscreen the window
    }
    const exitWindow = () => {
        clientManager.sendToBackend(ElectronEvents.WindowClose, "")
        //bird boi will make this exit the window
    }
    return (
        <div className="menubar flex absolute w-full ">
            <div className="dragbar flex"></div>
            {/* <p>mac here</p> */}
            <div className={`menubar__controls absolute flex right-0 mr-1 mt-1 ${clientManager.platform === "darwin" ? "" : ""}`}>
                <button className='p-1 rounded-md hover:bg-black hover:bg-opacity-5 transition duration-200' onClick={minimizeWindow}>
                    <svg className='stroke-slate-500 hover:stroke-purple-600' xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
                    </svg>
                </button>
                <button className='p-1 rounded-md hover:bg-black hover:bg-opacity-5 transition duration-200' onClick={fullscreenWindow}>
                    <svg className='stroke-slate-500 hover:stroke-purple-600' xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
                <button className='p-1 rounded-md hover:bg-black hover:bg-opacity-5 transition duration-200' onClick={exitWindow}>
                    <svg className='stroke-slate-500 hover:stroke-purple-600' xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    )
}