import { Show, createState, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { ProgramSettings } from "../../logic/programSettings";
import Navigation from '../navigation/navigation';
const programSettings = ProgramSettings.getInstance()
import bsLogo from '../../images/boardsource_logo.svg'
import iconExternalLink from '../../images/icons/external_link.svg'


export default function Sidebar() {
    const [state, setState] = createStore({ darkMode: programSettings.darkmode })
    const setTheme = () => {
        setState({ darkMode: programSettings.darkmode })
    }
    programSettings.Subscribe(setTheme)
    const updateTheme = () => {
        programSettings.darkmode = !programSettings.darkmode
    }
    return (
        <div className="sidebar p-6 flex flex-col h-full rounded-xl">
            <div className="sidebar__logo text-center center"><p>logo here</p></div>
            <button type="button" onClick={updateTheme} class="inline-block px-6 py-2 border-2 border-purple-600 text-purple-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Theme</button>
            {/* <p>dark mode is {state.darkMode ? '' : 'NOT'} on</p> */}
            <Navigation />
            <div className="navigation__bottom flex flex-col w-full self-end">
                <img src={bsLogo} alt="boardsource.xyz logo" />
                <div className="flex self-end"> <a class="text-gray-400 text-[12px] font-thin" href="boardsource.xyz">boardsource.xyz</a>
                    {/* <img class="fill-blue-500" src={iconExternalLink} alt="exernal link icon" /></div> */}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-gray-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}