import MainView from '../../components/mainView/mainView'
import { For, createSignal, onCleanup, Show } from 'solid-js'
import { Notification } from "../../logic/notification";
import { ElectronEvents, NotificationColor, Theme } from '../../types/types'
import { Modal } from "../../logic/modal";
import PppChecker from '../../components/pppChecker/pppChecker';
import Button from '../../components/button/button';
import { logIn } from '../../logic/helpers';
import { createStore } from 'solid-js/store';
import { ProgramSettings } from '../../logic/programSettings';
import Toggle from '../../components/toggle/toggle';
import { Toast } from '../../logic/toast'
import Input from '../../components/input/input'
import pegLogo from '../../images/peg_logo.svg'
import ShareExternalIcon from '../../images/icons/shareExternalIcon'
import HelpTooltip from '../../components/helpTooltip/helpTooltip';
import { ClientManager } from '../../logic/clientManager';
import FunctionManager from '../../logic/backends/web/functionManager';

const programSettings = ProgramSettings.getInstance()
const clientManager = ClientManager.getInstance()
const webfunctionManager = new FunctionManager()


function KmkUpDateModal() {
  const setPath = (paths: string) => {
    Toast.Info(`got this path for kmk install : ${paths}`)
    if (paths !== "") {
      let drivePath = paths
      clientManager.sendToBackend(ElectronEvents.InstallKmk, drivePath)
    }
  }
  clientManager.lessonToEvent(ElectronEvents.FilePickerClose, setPath)
  return (<div>
    To update KMK
    <br />
    <Button onClick={() => clientManager.sendToBackend(ElectronEvents.FilePicker, "")} selected={true}>
      select Drive
    </Button>
  </div>
  )
}

export default function Options() {
  // toast.Info('yay you did a think')
  // toast.Success('lulu by Boardsource successfully connected')
  // toast.Warn(`This is a warning that your cars extended warranty is about to expire. Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ab quasi alias? Asperiores, ea adipisci velit reprehenderit ratione nobis harum ipsam delectus rerum ipsum corrupti odit porro. Ipsum, dignissimos in!`)
  // toast.Error(`Sadly you've encountered an error and it will result in your repurchasing PPP`)
  // toast.Debug(`Yeah that's a pretty gross bug tbh just going to have to tough it out on that one.`)


  const [email, setEmail] = createSignal(""),
    [password, setPassword] = createSignal(""),
    [options, setOptions] = createStore({
      debug: programSettings.debug,
      dev: programSettings.dev,
      toolTips: programSettings.tooltips,
      theme: programSettings.theme
    }),
    [webOptions, setWebOptions] = createStore({
      replReady: webfunctionManager.replReady,
      fileReady: webfunctionManager.fileReady,
      ideReady: webfunctionManager.ideReady,
      SerialEditing: null
    }),
    [platform, setPlatform] = createSignal(clientManager.platform)

  const updateLocalWebOptions = async (callBack: () => void) => {
    await callBack()
    setWebOptions({
      replReady: webfunctionManager.replReady,
      fileReady: webfunctionManager.fileReady,
      ideReady: webfunctionManager.ideReady,
    })
  }
  const updateLocalChanges = () => {
    setOptions({ debug: programSettings.debug, toolTips: programSettings.tooltips, theme: programSettings.theme, dev: programSettings.dev })
  }
  const subId = programSettings.Subscribe(updateLocalChanges)
  onCleanup(() => {
    programSettings.Unsubscribe(subId)
  })
  const updateCheckDebug = (e: any) => {
    programSettings.debug = e.target.value
  }
  const updateCheckDev = (e: any) => {
    programSettings.dev = e.target.value
  }
  const updateCheckToolTips = (e: any) => {
    programSettings.tooltips = e.target.value
  }
  const updateTheme = (e: any) => {
    programSettings.theme = e.target.value

  }
  const updateKmk = () => {
    const modal = Modal.getInstance()
    clientManager.sendToBackend(ElectronEvents.DownLoadKmk, "")
    modal.Open(`KmK Update`, true, (
      <KmkUpDateModal />
    )
    )
  }
  const checkForSerialEditing = async () => {
    const tempValue = await webfunctionManager.checkForSerialEditing()
    console.log("TEP VALUE", tempValue)
    //@ts-ignore
    setWebOptions({ ...webOptions, SerialEditing: tempValue })
  }

  const checkBoolAndReturnBadge = (boolValue: Boolean, setupFunction: () => void) => {
    if (boolValue) {
      return <div class="badge badge-sm badge-outline badge-success">True</div>

    } else {
      return <div class="badge badge-sm badge-outline badge-error" onClick={setupFunction}>False</div>
    }
  }
  const wipeDrive = () => {
    const confirm = window.confirm("this will wipe your drive are you sure you want to continue?")
    if (confirm) {
      webfunctionManager.wipeDrive()
    }
  }

  return (
    <MainView title="Options" supported={true}>

      <div className="flex flex-1 w-full">
        <div className="flex flex-col items-start w-[70%] mr-[1.5rem] relative">
          <h3 className='text-[1.2rem] mb-2'>Program Settings</h3>
          <h4 className='mb-1 text-primary'>Appearance</h4>
          <p className='text-[.85rem] mb-[.2rem]'>Theme:</p>
          <div class="dropdown w-[10rem] mb-5">
            <PppChecker fallback={(
              <select class="select select-sm select-primary w-full max-w-xs" onChange={updateTheme}>
                <option disabled selected>Select Theme</option>
                <For each={Object.keys(Theme)} fallback={<div>Loading...</div>}>
                  {(key) => {
                    if (key === Theme.light || key === Theme.dark || Theme.cupcake) {
                      return (
                        <>
                          <option>{key}</option>
                        </>
                      )
                    } else {
                      <option disabled>{key}:with pro account</option>
                    }
                  }}
                </For>
              </select>
            )}>
              <select class="select select-primary w-full max-w-xs" onChange={updateTheme}>
                <option disabled selected>Select Themes</option>
                <For each={Object.keys(Theme)} fallback={<div>Loading...</div>}>
                  {(key) => (
                    <>
                      <option >{key}</option>
                    </>
                  )}
                </For>
              </select>
            </PppChecker>
          </div>


          <div className="toggles w-[15rem]">
            <div className="flex flex-col mb-5">
              <h4 className='mb-1 text-primary'>Other</h4>
              <div className="flex flex-1 justify-between">
                <label className='text-[.85rem]' htmlFor="tooltips">Show Tooltips</label>
                <Toggle label="" name="tooltips" value={options.toolTips} onChange={updateCheckToolTips} />
              </div>
            </div>

            <div className="flex flex-col mb-5">
              <h4 className='mb-1 text-primary'>Advanced</h4>
              <div className="flex flex-1 justify-between mb-1">
                <label className='text-[.85rem]' htmlFor="tooltips">Show Debug Mode</label>
                <HelpTooltip title={"Debug_Mode"}>
                  This mode Will yell at you with a bunch of stuff you dont care about 99% of the time.
                </HelpTooltip>
                <Toggle label="" name="debug" value={options.debug} onChange={updateCheckDebug} />
              </div>
              <div className="flex flex-1 justify-between">
                <label className='text-[.85rem]' htmlFor="tooltips">Dev Mode</label>
                <HelpTooltip title={"Dev_Mode"}>
                  This mode lets you do things that could break your keyboard.
                  You should understand KmK/your keyboard or have backups before you start messing around.
                </HelpTooltip>
                <Toggle label="" name="dev" value={options.dev} onChange={updateCheckDev} />
              </div>
            </div>
            <Show when={options.dev}>
              <Button onClick={updateKmk}>
                Update KmK
              </Button>
            </Show>
          </div>
          <div className="flex absolute justify-between bottom-0 w-[40%] rounded rounded-xl bg-base-200 pl-5 py-3">
            <div className="flex flex-col">
              <h3 className='mb-1 text-primary text-[1.1rem]'>Looking For Help?</h3>
              <div className="flex flex-col">
                <a href="https://peg.software/docs/Peg_Client/" target='blank' className='flex items-center link text-sm mb-1' >Peg Documentation <span className='ml-1'><ShareExternalIcon size={3} /></span></a>
                <a href="https://github.com/KMKfw/kmk_firmware/tree/master/docs" target='blank' className='flex items-center link text-sm mb-1' >KMK Documentation <span className='ml-1'><ShareExternalIcon size={3} /></span></a>
                <a href="https://discord.gg/D2wbZWGFMJ" target='blank' className='flex items-center link text-sm mb-1' >Discord <span className='ml-1'><ShareExternalIcon size={3} /></span></a>
                {/* <a href="#" className='flex items-center link text-sm mb-1' >Contact <span className='ml-1'><ShareExternalIcon size={3} /></span></a> */}
              </div>
            </div>
            {/* <div className="my-2 mr-4 rounded rounded-md bg-base-100 w-[50%]">

            </div> */}

          </div>


        </div>
        <div className="flex flex-col flex-1">
          <Show when={platform() === "web"} fallback="" >
            <h3 className='text-[1.2rem] text-center mb-2'>Web Settings</h3>
            <p>With peg 1.0 on the web you have more options.<br />
              below you will find some settings for just the web platform</p>
            <div className="flex flex-col w-full">
              <div className="flex w-full justify-between items-center mb-1">
                <h4 className='text-[.9rem]'>Repl Ready:</h4>
                {checkBoolAndReturnBadge(webOptions.replReady,
                  () => updateLocalWebOptions(webfunctionManager.replReadyCheck))}
              </div>
              <div className="flex w-full justify-between items-center mb-1">
                <h4 className='text-[.9rem]'>File API Ready:</h4>
                {checkBoolAndReturnBadge(webOptions.fileReady,
                  () => updateLocalWebOptions(webfunctionManager.fileReadyCheck))}
              </div>
              <div className="flex w-full justify-between items-center mb-1">
                <h4 className='text-[.9rem]'>Manager Ready:</h4>
                {checkBoolAndReturnBadge(webOptions.ideReady,
                  () => updateLocalWebOptions(webfunctionManager.ideReadyCheck))}
              </div>

            </div>
            <Button className={`btn-success mt-3 mb-[1rem]`}
              selected={webOptions.ideReady}
              onClick={() => checkForSerialEditing()}>
              Serial Editing {webOptions.SerialEditing == null ? "Unset" : webOptions.SerialEditing ? "On" : "Off"}
            </Button>
            <Button className={`btn-success mt-3 mb-[1rem]`}
              selected={webOptions.ideReady}
              onClick={webfunctionManager.setupSerialEditing}>
              Setup Serial Editing
            </Button>
            <Button className={`btn-success mt-3 mb-[1rem]`}
              selected={webOptions.ideReady}
              onClick={webfunctionManager.setupFileEditing}>
              Setup File Editing
            </Button>
            <Button className={`btn-error mt-3 mb-[1rem]`}

              onClick={wipeDrive}>
              Wiepe Drive
            </Button>

          </Show>

        </div>


      </div>
    </MainView >
  )
}