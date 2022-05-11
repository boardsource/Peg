import { Show, createSignal, onMount, onCleanup, For } from "solid-js";
import { createStore } from "solid-js/store";
import { KeyCode, ShareableFeatureType } from "../../types/types";
import { ClientManager } from "../../logic/clientManager";
import { KeyCodes } from "../../logic/keycodes";
import ShareFeature from "../../components/shareFeature/shareFeature";
import Button from "../../components/button/button";
import DownloadFeature from "../../components/downloadFeature/downloadFeature";
import MainView from "../../components/mainView/mainView";
import Input from "../../components/input/input";
const clientManager = ClientManager.getInstance()
const keycodes = KeyCodes.getInstance()


export default function MakeCustomCodes() {

    const [state, setState] = createStore({ display: "", code: "", description: "", showExport: false, showImport: false, importString: "", exportString: "" });

    const onChange = (e: Event) => {
        //@ts-ignore
        setState({ [e.target.name]: e.target.value })
        //@ts-ignore
        if (e.target.name === "code") {
            //@ts-ignore
            setState({ description: `send ${e.target.value} string ` })
        }
    }
    const saveKey = () => {
        if (state.display !== "" && state.code !== "" && state.description != "") {
            const newCode: KeyCode = {
                code: `send_string('${state.code}')`,
                display: state.display,
                keybinding: "",
                canHaveSub: false,
                canHaveSubNumber: false,
                subNumber: 0,
                Description: state.description
            }
            keycodes.AddCustomCode(newCode)
        } else {
            // todo error
        }
    }
    const importCodes = () => {
        const tempNewCodes = JSON.parse(state.importString)
        const newCodes = tempNewCodes as KeyCode[]
        newCodes.forEach(newCode => {
            keycodes.AddCustomCode(newCode)
        });

    }
    const exportCodes = () => {
        const exportJsonString = JSON.stringify(Array.from(keycodes.customCodes.values()))
        setState({ exportString: exportJsonString })
    }
    const renderImport = () => {
        if (state.showImport) {
            return (
                <>
                    <textarea name="importString" cols="30" rows="10" value={state.importString} onChange={onChange}></textarea>
                    <button onClick={importCodes}>
                        import
                    </button>
                </>
            )
        }
    }
    const renderExport = () => {
        if (state.showExport) {
            return (
                <textarea name="ExportString" cols="30" rows="10" value={state.exportString}></textarea>
            )
        }
    }

    return (
        <MainView title="Custom Keycodes" description={`Custom keycode can be like macros and just send a whole word with a single keypress. 
        Or you can get into some more complex things and send a keycode on a tap and a totally different keycode when held. 
        This view will let you configure this feature`} supported={true} featureType={ShareableFeatureType.keyCodes} >
            <div className="flex">
                <div className="MakeCustomCodes flex flex-col">
                    <Input
                        label="Display text:"
                        onChange={onChange} value={state.display}
                        name="display"
                        placeholder="Display text for UI"
                    />
                    <Input
                        label="String to send text:"
                        name="code" onChange={onChange} value={state.code}
                        placeholder="Key output"
                    />
                    <Input
                        label="Description text:"
                        name="description" onChange={onChange} value={state.description}
                        placeholder="For tool tip"
                    />


                    <Button onClick={saveKey} selected={state.description !== "" && state.code !== "" && state.display !== ""}>

                        Save Key
                    </Button>

                    <Button onClick={() => setState({ showImport: !state.showImport })} selected={state.showImport}>

                        {!state.showImport ? " Show Import Key Codes" : "Hide Import Key Codes"}
                    </Button>

                    {renderImport()}
                    <Button onClick={() => { setState({ showExport: !state.showExport }); exportCodes() }} selected={state.showExport}>

                        {!state.showExport ? " Show Export Key Codes" : "Hide Export Key Codes"}
                    </Button>

                    {renderExport()}



                </div>
                <div className="flex flex-col">

                    custom codes
                    <For each={Array.from(keycodes.customCodes.values())} fallback={<div>Loading...</div>}>
                        {(key) =>
                            <div>
                                <p>
                                    code: {key.code}
                                </p>
                                <p>
                                    display: {key.display}
                                </p>
                                <p>
                                    Description: {key.Description}
                                </p>
                                <div className="flex">
                                    <ShareFeature featureType={ShareableFeatureType.keyCodes} keycode={key} />
                                    <Button
                                        selected={true}
                                        onClick={() => {
                                            //@ts-ignore
                                            keycodes.RemoveCustomCode(key.code)
                                        }}>
                                        delete
                                    </Button>
                                </div>

                            </div>
                        }
                    </For>
                </div>

            </div>
        </MainView>
    );



}
