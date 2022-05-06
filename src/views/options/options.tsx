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
const programSettings = ProgramSettings.getInstance()



export default function Options() {

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
      <Toggle label="Tool Tips" name="tooltips" value={options.toolTips} onChange={updateCheckToolTips} />
      <Toggle label="Debug Mode" name="debug" value={options.debug} onChange={updateCheckDebug} />

      <div className="testToggle">
        <p>SELECT THEME:</p>
        <div class="dropdown">

          <PppChecker fallback={(
            <select class="select select-primary w-full max-w-xs" onChange={updateTheme}>
              <option disabled selected>Theme</option>
              <For each={Object.keys(Theme)} fallback={<div>Loading...</div>}>
                {(key) => {
                  if (key === Theme.light || key === Theme.dark || Theme.cupcake) {
                    return (
                      <>
                        <option >{key}</option>
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
              <option disabled selected>Themes</option>
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



        <PppChecker false>
          <h2>
            Log in to gain pro plan features
          </h2>
          email:
          <br />
          <input type="text" value={email()} onChange={(e) => {
            //@ts-ignore
            setEmail(e.target.value)
          }} />
          <br />
          password:
          <br />
          <input type="password" value={password()} onChange={(e) => {
            //@ts-ignore
            setPassword(e.target.value)
          }} />
          <br />

          <Button selected={email() !== "" && password() !== ""} onClick={() => logIn(email(), password())}>
            Sign in
          </Button>


        </PppChecker>
      </div>
    </MainView >
  )
}