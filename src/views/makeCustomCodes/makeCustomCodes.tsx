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
import Scroller from '../../components/scroller/scroller'
import HelpTooltip from "../../components/helpTooltip/helpTooltip";
import Textarea from '../../components/textarea/textarea'
import { Transition } from 'solid-transition-group'

const clientManager = ClientManager.getInstance()
const keycodes = KeyCodes.getInstance()


export default function MakeCustomCodes() {

  const [state, setState] = createStore({ display: "", code: "", description: "", showExport: true, showImport: false, importString: "", exportString: "" });

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
        <div className="flex w-full h-full bg-yellow-200">
          <textarea className='bg-red-200' name="importString" value={state.importString} onChange={onChange}></textarea>
          {/* <p>IMPORT IMPORT</p> */}
          <button onClick={importCodes}>
            import
          </button>
        </div>

      )
    }
  }
  const renderExport = () => {
    if (state.showExport) {
      return (
        <div className="flex w-full h-full">
          <textarea className='w-full border-none resize-none' name="ExportString" value={state.exportString}></textarea>
        </div>

      )
    }
  }
  const returnHaxorClasses = () => {
    return `tab tab-xs`
  }

  return (
    <MainView title="Custom Keycodes" description={`Custom keycode can be like macros and just send a whole word with a single keypress. 
        Or you can get into some more complex things and send a keycode on a tap and a totally different keycode when held. 
        This view will let you configure this feature`} supported={true} featureType={ShareableFeatureType.keyCodes} >
      <div className="flex h-full w-full relative">
        <div className="MakeCustomCodes flex flex-col flex-1 items-start mr-1">
          {/* <HelpTooltip>Key 'Label" used and displayed in Keymap Editor.</HelpTooltip> */}
          <div className="flex w-[40%]">
            <Input
              label="Label:"
              onChange={onChange} value={state.display}
              name="display"
              placeholder="Enter display name of key..."
              helpText='This is a test of help text 1ST!!!!'
            />
          </div>
          <div className="flex w-[100%]">
            <Textarea
              label="String Sent:"
              name="code" onChange={onChange} value={state.code}
              placeholder="Output of keypress..."
              helpText='This is a test of help text 2nd'
            />
          </div>
          <Textarea label="Description:"
            name="description" onChange={onChange} value={state.description}
            placeholder="Enter helpful reminders of what this keycode does..." />
          {/* <Input
            label="Description:"
            name="description" onChange={onChange} value={state.description}
            placeholder="Enter helpful reminders of what this keycode does..."
          /> */}
          <Button className={`btn-block mt-3`} onClick={saveKey} selected={state.description !== "" && state.code !== "" && state.display !== ""}>
            Save Key
          </Button>

          <div className="xXx_haxor_Display_xXx flex-grow self-center mt-4 w-full">
            <div className="flex flex-col items-center h-full">
              <div class="tabs tabs-boxed mb-3">
                <a class={`${returnHaxorClasses()} ${state.showExport ? 'tab-active' : ''}`} onClick={() => { setState({ showImport: false, showExport: true }) }}>EXPORT</a>
                <a class={`${returnHaxorClasses()} ${state.showImport ? 'tab-active' : ''}`} onClick={() => { setState({ showImport: true, showExport: false }) }}>IMPORT</a>
              </div>
              {/* {renderHaxorDiv()} */}
              <div className="importExportContainer flex rounded-lg shadow border flex-1 w-full overflow-hidden">
                {renderImport()}
                {renderExport()}
                {/* {renderHaxorDiv()} */}
              </div>


            </div>

            {/* <Button onClick={() => setState({ showImport: !state.showImport })} selected={state.showImport}>
              {!state.showImport ? " Show Import Key Codes" : "Hide Import Key Codes"}
            </Button>
            {renderImport()}
            <Button onClick={() => { setState({ showExport: !state.showExport }); exportCodes() }} selected={state.showExport}>
              {!state.showExport ? " Show Export Key Codes" : "Hide Export Key Codes"}
            </Button>
            {renderExport()} */}
          </div>
        </div>


        <div className="flex w-[300px] relative">
          {/* custom codes */}
          <div className="flex flex-col w-full">
            {/* <h3 className='bg-red-200 ml-4 text-lg w-full'>My Keycodes</h3> */}
            <Scroller stickySide='right' title='My Keycodes'>
              <For each={Array.from(keycodes.customCodes.values())} fallback={<div>Loading...</div>}>
                {(key) =>
                  <div className="flex mb-4 shadow shadow-md p-2 rounded rounded-lg">
                    <div className='flex flex-col w-full'>
                      <p className='text-[1.1rem] p-[.3rem]'>
                        {key.display}
                      </p>
                      <div className="flex flex-col">
                        <div className="flex flex-col w-full bg-base-300 rounded rounded-md p-[.4rem]">
                          <p className="text-[.8rem] text-primary-content">
                            Code
                          </p>
                          <span className="text-[.95rem]">{key.code}code here</span>
                        </div>
                      </div>
                      <p className={`p-[.28rem] text-[.7rem] border rounded-md my-1.5`}>
                        {key.Description}
                      </p>
                      <div className="flex mt-1">
                        <div className="w-1/2">
                          <ShareFeature featureType={ShareableFeatureType.keyCodes} keycode={key} fullWidthButton iconButton tinyButtons btnClasses='btn-outline' />
                        </div>
                        <span className="w-[15px]" />
                        <div className="w-1/2">
                          <Button
                            selected={true}
                            onClick={() => {
                              //@ts-ignore
                              keycodes.RemoveCustomCode(key.code)
                            }}
                            className='w-full btn-outline btn-error hover:btn-error gap-2'
                            icon
                            tinyButtons
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-[1.1rem] h-[1.1rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </For>
            </Scroller>
          </div>

        </div>




      </div>
    </MainView>
  );



}
