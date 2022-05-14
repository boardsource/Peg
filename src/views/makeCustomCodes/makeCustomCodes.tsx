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
        <>
          {/* <textarea name="importString" cols="30" rows="10" value={state.importString} onChange={onChange}></textarea> */}
          <p>IMPORT IMPORT</p>
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
        // <textarea name="ExportString" cols="30" rows="10" value={state.exportString}></textarea>
        <p>testing export</p>
      )
    }
  }
  const returnHaxorClasses = () => {
    return `tab tab-xs`
  }
  // const renderHaxorDiv = () => {
  //   if (state.showImport) {
  //     return (
  //       <>
  //         <Transition
  //           onEnter={(el, done) => {
  //             const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
  //               duration: 600
  //             });
  //             a.finished.then(done);
  //           }}
  //           onExit={(el, done) => {
  //             const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
  //               duration: 600
  //             });
  //             a.finished.then(done);
  //           }}
  //         >
  //           <Show when={state.showImport === true} fallback={""}>
  //             <p>IMPORT IMPORT IMPORT</p>
  //           </Show >
  //         </Transition>
  //         <textarea name="importString" cols="30" rows="10" value={state.importString} onChange={onChange}></textarea>
  //         <button onClick={importCodes}>
  //           import
  //         </button>
  //       </>
  //     )
  //   } else {
  //     return (
  //       <textarea name="ExportString" cols="30" rows="10" value={state.exportString}></textarea>
  //     )
  //   }

  // }

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
              <div className="importExportContainer flex rounded-lg shadow border flex-1 w-full">
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
        <div className="flex w-[300px] h-full relative overflow-scroll">
          {/* custom codes */}
          <Scroller stickySide='right'>
            <For each={Array.from(keycodes.customCodes.values())} fallback={<div>Loading...</div>}>
              {(key) =>

                <div className="flex mb-4 shadow shadow-md p-2 rounded rounded-lg">
                  <div className='flex flex-col w-full'>
                    <p>
                      Display: {key.display}
                    </p>
                    <div className="flex flex-col">
                      <p>
                        Code
                      </p>
                      <div className="flex w-full bg-base-300 rounded rounded-md">{key.code}</div>
                    </div>
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
                </div>
              }
            </For>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorem officia aliquid placeat provident ratione dolore modi maiores, earum alias vero. Laborum maxime eius nobis fugiat tenetur, sunt ullam dolores voluptate.
              Perferendis mollitia eius ipsa praesentium quidem. Alias soluta odio libero molestiae voluptatibus ut exercitationem id perferendis, quasi obcaecati totam consectetur necessitatibus possimus. Magni natus nobis laboriosam deserunt! Ad, similique provident.
              Repudiandae, repellat perspiciatis? Suscipit, amet? Non similique atque vitae quam ratione. Natus obcaecati repellat impedit at omnis voluptatum, porro ducimus expedita possimus iste sed totam velit eius doloribus facilis cum?
              In eos a repellendus eligendi temporibus non, quis optio error, itaque, inventore impedit aut velit vero. Quae unde fugit voluptatum, ad at enim aliquid atque adipisci dolor, cumque numquam quos?
              Eaque omnis reprehenderit ab aperiam officia, ex consequatur quo, voluptas veritatis sequi temporibus? Beatae architecto, soluta dolorum numquam placeat voluptatum animi dolores tempora vero obcaecati corrupti minima sunt dolorem tempore!
              Cupiditate aliquid quidem reiciendis sed at? Placeat omnis vel similique porro, natus id suscipit! Suscipit, sint. Quibusdam, quidem alias delectus soluta veniam iste asperiores similique, eius praesentium eveniet accusamus recusandae?
              Vero placeat quo odit earum. Sequi tempora facere minus fuga dolorem quos eligendi cumque? Sed, deserunt neque magni voluptatibus pariatur nihil facilis quod nostrum, maiores, repudiandae quia porro vitae autem!
              Blanditiis, sunt repellat. Aperiam deleniti delectus assumenda incidunt dolores aliquid id similique dolorem, placeat explicabo est, cum quisquam! Ducimus quia eos unde? Adipisci iusto minus, corporis laborum accusamus et molestiae!</p>
          </Scroller>
        </div>
      </div>
    </MainView>
  );



}
