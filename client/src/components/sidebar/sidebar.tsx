import { Show, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { ProgramSettings } from "../../logic/programSettings";
import Navigation from '../navigation/navigation';
const programSettings = ProgramSettings.getInstance()
import bsLogo from '../../images/boardsource_logo.svg'
import iconExternalLink from '../../images/icons/external_link.svg'


export default function Sidebar() {

    onMount(() => { console.log("ps", programSettings) })
    const [state, setState] = createStore({ darkMode: programSettings.darkmode })
    const setTheme = () => {
        setState({ darkMode: programSettings.darkmode })
    }
    programSettings.Subscribe(setTheme)
    const updateTheme = () => {
        programSettings.darkmode = !programSettings.darkmode
    }
    return (
        <>
            {/* <button type="button" onClick={updateTheme} class="inline-block px-6 py-2 border-2 border-purple-600 text-purple-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Theme</button> */}
            {/* <p>dark mode is {state.darkMode ? '' : 'NOT'} on</p> */}
            <Navigation />

        </>



    );
}