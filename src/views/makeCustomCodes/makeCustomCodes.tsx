import { Show, createSignal, onMount, onCleanup, For } from "solid-js";
import { createStore } from "solid-js/store";
import { KeyCode, ScrollerSides, ShareableFeatureType } from "../../types/types";
import { ClientManager } from "../../logic/clientManager";
import { KeyCodes } from "../../logic/keycodes";
import ShareFeature from "../../components/shareFeature/shareFeature";
import Button from "../../components/button/button";
import MainView from "../../components/mainView/mainView";
import Input from "../../components/input/input";
import Scroller from '../../components/scroller/scroller'
import Textarea from '../../components/textarea/textarea'
import { Toast } from "../../logic/toast";
import { ProgramSettings } from "../../logic/programSettings";

const clientManager = ClientManager.getInstance()
const keycodes = KeyCodes.getInstance()
const programSettings = ProgramSettings.getInstance()


export default function MakeCustomCodes() {

  // these are some maybe ghetto refs? tried following the docs but idk I guess they need to be defined better or some TS thing,but they do work
  let exportTextarea: HTMLTextAreaElement
  let importTextarea: HTMLTextAreaElement


  const [state, setState] = createStore({
    display: "",
    code: "",
    description: "",
    showExport: false,
    showImport: true,
    importString: "",
    exportString: "",
    customCodes: Array.from(keycodes.customCodes.values()),
    dev: programSettings.dev
  });
  const updateLocalState = () => {
    setState({ customCodes: Array.from(keycodes.customCodes.values()), dev: programSettings.dev })
    exportCodes()
  }
  const subId = clientManager.Subscribe(updateLocalState)
  const subId2 = programSettings.Subscribe(updateLocalState)

  onCleanup(() => {
    clientManager.Unsubscribe(subId);
    programSettings.Unsubscribe(subId2)


  })
  const onChange = (e: Event) => {
    //@ts-ignore
    setState({ [e.target.name]: e.target.value })
    //@ts-ignore
    if (e.target.name === "code" && !state.dev) {
      //@ts-ignore
      setState({ description: `send ${e.target.value} string ` })
    }
  }
  const saveKey = () => {
    if (state.display !== "" && state.code !== "" && state.description != "") {
      if (state.dev) {
        Toast.Warn("This keycode was made in dev mode and may not work or crash your keyboard.")
      }
      const newCode: KeyCode = {
        code: state.dev ? state.code : `send_string('${state.code}')`,
        display: state.display,
        keybinding: "",
        canHaveSub: false,
        canHaveSubNumber: false,
        subNumber: 0,
        Description: state.description
      }
      keycodes.AddCustomCode(newCode)
      updateLocalState()
    } else {
      Toast.Error("Keycode is missing a something")
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
    const exportJsonString = JSON.stringify(Array.from(keycodes.customCodes.values()), null, 2)
    setState({ exportString: exportJsonString })
  }
  const renderImport = () => {
    if (state.showImport) {
      return (
        <div className="flex w-full h-full">
          <textarea ref={importTextarea} className='w-full border-none resize-none p-2' name="importString" value={state.importString} onChange={onChange}></textarea>
          {/* <p>IMPORT IMPORT</p> */}
          <Button className='btn-success btn-outline absolute right-4 bottom-5' onClick={importCodes}>
            Import Keycodes
          </Button>
        </div >

      )
    }
  }
  const renderExport = () => {
    if (state.showExport) {
      return (
        <div className="flex w-full h-full">
          <textarea ref={exportTextarea} className='w-full border-none resize-none p-2' name="ExportString" value={state.exportString}></textarea>
        </div>

      )
    }
  }

  const returnTextAreaButtonAction = () => {
    if (state.showExport) {
      return (
        exportTextarea.select(), document.execCommand('copy')
      )

    } else {
      return (
        importTextarea.select(), document.execCommand('paste')
      )

    }
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

            />
          </div>
          <div className="flex w-[100%]">
            <Textarea
              label={state.dev ? "Full Custom Keycode:" : "String Sent:"}
              name="code" onChange={onChange} value={state.code}
              placeholder={state.dev ? "KC.LT(1, KC.BSPC, tap_time=100)" : "Output of keypress..."}
              helpText={state.dev ? "This needs to be a full key code like 'KC.MO(3)'" : "the output from the key press 'hello world' "}
            />
          </div>
          <Textarea label="Description:"
            name="description" onChange={onChange} value={state.description}
            placeholder="Enter helpful reminders of what this keycode does..." />

          <Button className={`btn-block mt-3`} onClick={saveKey} selected={state.description !== "" && state.code !== "" && state.display !== ""}>
            Save Key
          </Button>

          <div className="xXx_haxor_Display_xXx flex-grow self-center mt-4 w-full">
            <div className="flex flex-col items-center h-full">
              <div class="tabs tabs-boxed mb-3">
                <a class={`tab tab-xs ${state.showExport ? 'tab-active' : ''}`} onClick={() => {
                  setState({ showImport: false, showExport: true })
                  exportCodes()
                }}>EXPORT</a>
                <a class={`tab tab-xs ${state.showImport ? 'tab-active' : ''}`} onClick={() => { setState({ showImport: true, showExport: false }) }}>IMPORT</a>
              </div>

              <div className="importExportContainer flex rounded-lg shadow border flex-1 w-full overflow-scroll p-3 text-[.9rem] relative">
                <Button className='btn-outline btn-info !btn-xs absolute right-4 top-5' onClick={() => { returnTextAreaButtonAction() }}>
                  {state.showExport ? (
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  )}
                  {state.showExport ? 'COPY' : 'PASTE'}
                </Button>
                {renderImport()}
                {renderExport()}
              </div>
            </div>
          </div>
        </div>


        <div className="flex w-[300px] relative">
          {/* custom codes */}
          <div className="flex flex-col w-full">

            <Scroller stickySide={ScrollerSides.Right} title='My Keycodes'>
              <For each={state.customCodes} fallback={<div>Loading...</div>}>
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
                          <span className="text-[.95rem]">{key.code}</span>
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
                              updateLocalState()
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
