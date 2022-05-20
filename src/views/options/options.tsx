import MainView from '../../components/mainView/mainView'
import { For, createSignal, onCleanup } from 'solid-js'
import { Notification } from "../../logic/notification";
import { NotificationColor, Theme } from '../../types/types'
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

const programSettings = ProgramSettings.getInstance()

const toast = Toast.getInstance()



export default function Options() {
  // toast.Info('yay you did a think')
  // toast.Success('lulu by Boardsource successfully connected')
  // toast.Warn(`This is a warning that your cars extended warranty is about to expire. Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ab quasi alias? Asperiores, ea adipisci velit reprehenderit ratione nobis harum ipsam delectus rerum ipsum corrupti odit porro. Ipsum, dignissimos in!`)
  // toast.Error(`Sadly you've encountered an error and it will result in your repurchasing PPP`)
  // toast.Debug(`Yeah that's a pretty gross bug tbh just going to have to tough it out on that one.`)


  const [email, setEmail] = createSignal(""),
    [password, setPassword] = createSignal(""),
    [options, setOptions] = createStore({ debug: programSettings.debug, toolTips: programSettings.tooltips, theme: programSettings.theme })
  const updateLocalChanges = () => {
    setOptions({ debug: programSettings.debug, toolTips: programSettings.tooltips, theme: programSettings.theme })
    console.log({ debug: programSettings.debug, toolTips: programSettings.tooltips })
  }
  const subId = programSettings.Subscribe(updateLocalChanges)
  onCleanup(() => {
    programSettings.Unsubscribe(subId)
  })
  const updateCheckDebug = (e: any) => {
    programSettings.debug = e.target.value
  }
  const updateCheckToolTips = (e: any) => {
    programSettings.tooltips = e.target.value
  }
  const updateTheme = (e: any) => {
    programSettings.theme = e.target.value

  }

  return (
    <MainView title="Options" supported={true}>

      <div className="flex flex-1 w-full">
        <div className="flex flex-col items-start w-[70%] mr-[1.5rem]">
          <h3 className='text-[1.2rem] mb-3'>Program Settings</h3>
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
              <div className="flex flex-1 justify-between">
                <label className='text-[.85rem]' htmlFor="tooltips">Show Debug Mode</label>
                <Toggle label="" name="debug" value={options.debug} onChange={updateCheckDebug} />
              </div>
            </div>
          </div>



        </div>
        <div className="flex flex-col flex-1">
          <h3 className='text-[1.2rem] text-center mb-3'>Account Settings</h3>
          <div className="flex flex-col flex-1 rounded-xl p-4">
            <PppChecker false fallback={`testing if this works`}>
              <div className="flex w-full justify-between items-center mb-1">
                <h4 className='text-[.9rem]'>Account Level:</h4>
                <div class="badge badge-sm badge-outline badge-warning">Free</div>
              </div>
              <div className="flex flex-col flex-1">

                <Input name='string' label='Email' placeholder='Enter Email Address...' className='!input-sm' value={email()} onChange={(e) => {
                  //@ts-ignore
                  setEmail(e.target.value)
                }} />
                <Input name="password" label='Password' placeholder='Enter Password...' value={password()} onChange={(e) => {
                  //@ts-ignore
                  setPassword(e.target.value)
                }} />
                <Button className='btn-success mt-3 mb-[1rem]' selected={email() !== "" && password() !== ""} onClick={() => logIn(email(), password())}>
                  Sign In
                </Button>
                <div className="border rounded rounded-md px-3 pt-2 pb-[.1rem] mb-4">
                  <h4 className='text-[.7rem]'>
                    Login to Peg using your <a className='link link-primary' href="boardsource.xyz" target='blank'>Boardsource.xyz</a> account. Ensure that it is the account used to <a className='link link-primary' href="#" target='blank'>purchase your Peg license</a>.
                  </h4>
                </div>
                <div className="flex flex-col flex-1 w-full border border-primary px-3 py-2 rounded rounded-md relative">
                  <div className="flex flex-col">
                    <h5 className='text-[1rem] mb-[.4rem]'>Peg Pro Licenses Offer:</h5>
                    <ul className='list-disc list-inside text-[.75rem]'>
                      <li>Single per-key RGB Mapping</li>
                      <li>Extensive OLED Customization</li>
                      <li>Online Sharing/Downloading</li>
                    </ul>
                  </div>
                  <div className="flex justify-center items-center flex-1">
                    <img src={pegLogo} className='h-[60%]' alt="peg logo" />
                  </div>
                  <div className="flex text-center">
                    <p className='text-[.65rem]'>To learn more about our pricing, features, and licenses please visit <a href='#' className='link link-primary' target='_blank'>peg.software</a>.</p>
                  </div>
                </div>
              </div>

            </PppChecker>
          </div>
        </div>


      </div>
    </MainView >
  )
}