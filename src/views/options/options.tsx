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
import ShareExternalIcon from '../../images/icons/shareExternalIcon'

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
              <div className="flex flex-1 justify-between">
                <label className='text-[.85rem]' htmlFor="tooltips">Show Debug Mode</label>
                <Toggle label="" name="debug" value={options.debug} onChange={updateCheckDebug} />
              </div>
            </div>
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
          <h3 className='text-[1.2rem] text-center mb-2'>Account Settings</h3>
          <div className="flex flex-col flex-1 rounded-xl px-4 pt-4 pb-0">
            <PppChecker false fallback={
              <div className="flex flex-col">
                <div className="flex w-full justify-between items-center mb-1">
                  <h4 className='text-[.9rem]'>Account Level:</h4>
                  <div class="badge badge-sm badge-outline badge-success">Pro License</div>
                </div>
                <p className='text-center mt-5 border border-success rounded rounded-lg p-3 text-[1.2rem]'>Thank you for purchasing a Peg Pro License or bundled product. </p>
                <div className="flex justify-center items-center flex-1 w-[10rem] self-center my-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2284.97729 975.98346">
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                        <rect className="cls-1 fill-[none] stroke-[28px] stroke-[#805ff7]" x="105.03159" y="105.03159" width="765.92028" height="765.92028" rx="163.19043" transform="translate(-202.13279 487.99173) rotate(-45)" />
                        <circle className="cls-2 fill-[none] stroke-[28px] stroke-[#98fce9]" cx="205.74182" cy="487.99173" r="108.35348" />
                        <path className="cls-3 stroke-3 fill-base-content" d="M1343.39623,245.39066q46.66113,0,82.69727,22.99023,36.0293,23.001,57.30468,63.1377,21.26369,40.14843,21.27442,92.30566,0,52.16309-21.27442,92.64844-21.28125,40.50147-57.64843,63.82422-36.38379,23.33936-81.667,23.334a143.352,143.352,0,0,1-45.63867-7.20605,154.96131,154.96131,0,0,1-39.46093-19.55957,152.45471,152.45471,0,0,1-31.56934-29.167,150.288,150.288,0,0,1-21.96094-36.03028l12.35352-9.60742V715.49515a20.3575,20.3575,0,0,1-5.834,14.41113,19.44,19.44,0,0,1-14.75488,6.17676,20.53225,20.53225,0,0,1-15.09863-6.17676,19.75079,19.75079,0,0,1-6.17578-14.41113v-447.458a21.1641,21.1641,0,0,1,5.833-15.09765q5.82276-6.17726,15.44141-6.17676a19.44,19.44,0,0,1,14.75488,6.17676,21.21059,21.21059,0,0,1,5.834,15.09765v74.11914l-9.6084-5.49023a119.50789,119.50789,0,0,1,20.24512-38.08887,138.57486,138.57486,0,0,1,70.34472-47.01074A159.16167,159.16167,0,0,1,1343.39623,245.39066Zm-3.43164,38.43164q-37.05908,0-65.19726,18.18652-28.14844,18.19189-44.26465,49.41211-16.13379,31.23633-16.12793,72.40332,0,40.50147,16.12793,72.7461,16.11621,32.26611,44.26465,50.4414,28.13232,18.1919,65.19726,18.18653,36.36768,0,64.168-18.18653,27.79395-18.17579,43.92187-50.4414,16.11622-32.25,16.12793-72.7461,0-40.48534-16.12793-72.05957-16.13378-31.55859-43.92187-49.75586Q1376.33716,283.833,1339.96459,283.8223Z" />
                        <path class="cls-3 fill-base-content" d="M1745.5515,605.68949q-53.53125,0-93.67773-22.64746a161.72266,161.72266,0,0,1-62.79492-63.13868q-22.64795-40.48535-22.64746-94.707,0-58.32275,22.99023-99.51074,22.98486-41.17676,59.707-63.48145,36.70459-22.29345,77.89258-22.30371a166.51288,166.51288,0,0,1,58.67774,10.63672,147.1139,147.1139,0,0,1,50.4414,31.56934q21.95655,20.94287,35.6875,51.12793,13.71973,30.208,14.41113,70.001a18.64552,18.64552,0,0,1-6.17578,14.06934,20.315,20.315,0,0,1-14.41211,5.833H1590.45092l-8.23535-37.05957h269.71l-8.92188,8.23535V380.58792q-2.751-32.25-20.58886-54.55957a122.06732,122.06732,0,0,0-42.89258-34.31347,120.12638,120.12638,0,0,0-52.501-12.01075,118.1296,118.1296,0,0,0-42.20605,8.23536,110.80949,110.80949,0,0,0-39.11817,25.73632q-17.50049,17.5005-28.48047,44.6084-10.98632,27.11865-10.98144,64.167,0,40.50147,16.47168,73.43262a127.14809,127.14809,0,0,0,47.35351,52.15723q30.88184,19.22168,74.80469,19.2168,23.32324,0,42.54981-6.86329a123.67422,123.67422,0,0,0,33.9707-18.18652,134.06647,134.06647,0,0,0,24.36328-23.67676q6.85254-6.17724,14.41211-6.17675a16.73278,16.73278,0,0,1,12.69629,5.49023,17.64009,17.64009,0,0,1,5.14648,12.35352q0,8.23534-6.8623,14.4121-20.58839,24.70607-53.53027,42.89258Q1784.66967,605.67874,1745.5515,605.68949Z" />
                        <path class="cls-3 fill-base-content" d="M2111.3474,239.90042a147.66985,147.66985,0,0,1,56.27539,10.63672,165.21381,165.21381,0,0,1,45.6377,27.45117q19.56006,16.8252,30.54,35.6875,10.96875,18.88331,10.98047,36.0293l-10.98047-16.4707V269.41019a21.168,21.168,0,0,1,5.833-15.09863,20.71489,20.71489,0,0,1,29.51074,0,21.21379,21.21379,0,0,1,5.833,15.09863V567.25785q0,54.20506-22.64746,91.96191a148.3247,148.3247,0,0,1-61.42188,57.30469q-38.78173,19.55859-88.1875,19.55859a221.55511,221.55511,0,0,1-50.44238-6.17676q-26.42725-6.17577-45.29492-15.78418-18.88331-9.61817-21.61719-19.90234-4.81055-6.17578-4.46094-12.00977a13.76442,13.76442,0,0,1,5.14648-9.95117q6.85254-4.80908,14.75586-1.02929,7.88086,3.76317,22.99024,9.95117,6.17578,2.0581,18.18652,6.17675a207.99425,207.99425,0,0,0,28.1377,7.20606,176.54338,176.54338,0,0,0,33.28418,3.08789q61.7666,0,96.08008-35.34375,34.30956-35.354,34.31445-92.30469V504.11917l6.8623,2.0586a118.24,118.24,0,0,1-20.24511,42.5498,135.00421,135.00421,0,0,1-33.28516,31.22559,155.82674,155.82674,0,0,1-85.09863,25.73633q-48.04542,0-85.78516-24.02051-37.752-24.01466-59.707-65.19629-21.97266-41.17675-21.96094-94.02149,0-52.147,21.96094-93.67773,21.95508-41.51367,59.707-65.19629Q2063.98315,239.89946,2111.3474,239.90042Zm4.11817,39.11817q-37.06054,0-66.91309,18.52929-29.85351,18.53028-46.667,51.12793-16.8252,32.60449-16.81445,73.77539,0,41.17677,16.81445,74.11915,16.80762,32.9414,46.667,51.81445,29.85353,18.8833,66.91309,18.873,37.73438,0,67.25586-18.53028,29.499-18.52881,46.667-51.12793,17.146-32.58837,17.15723-75.14844,0-42.54345-17.15723-74.80468-17.16212-32.25-46.667-50.44141Q2153.20482,279.02932,2115.46557,279.01859Z" />
                      </g>
                    </g>
                  </svg>
                </div>
                <p className='text-center text-[.75rem]'>You are helping support KMK Firmware, XYZ Charity, and further development of hardware and software for hobbyist electronics and input devices.</p>
              </div>
            }>
              <div className="flex w-full justify-between items-center mb-1">
                <h4 className='text-[.9rem]'>Account Level:</h4>
                <div class="badge badge-sm badge-outline badge-warning">Free</div>
              </div>
              <div className="flex flex-col flex-1">

                <Input name='string' label='Email' placeholder='Enter Email Address...' className='!input-sm' value={email()} onChange={(e) => {
                  //@ts-ignore
                  setEmail(e.target.value)
                }} />
                <Input name="password" label='Password' type="password" placeholder='Enter Password...' value={password()} onChange={(e) => {
                  //@ts-ignore
                  setPassword(e.target.value)
                }} />
                <Button className='btn-success mt-3 mb-[1rem]' selected={email() !== "" && password() !== ""} onClick={() => logIn(email(), password())}>
                  Sign In
                </Button>
                <div className="border rounded rounded-md px-3 pt-2 pb-[.5rem] mb-4">
                  <h4 className='text-[.7rem]'>
                    Login to Peg using your <a className='link link-primary' href="boardsource.xyz" target='blank'>Boardsource.xyz</a> account. Ensure that it is the account used to <a className='link link-primary' href={programSettings.PppBuyLink} target='blank'>purchase your Peg license</a>.
                  </h4>
                </div>
                <div className="flex flex-col flex-1 w-full border border-primary px-3 py-2 rounded rounded-md relative">
                  <div className="flex flex-col">
                    <h5 className='text-[1rem] mb-[.4rem]'>Peg Pro License Features:</h5>
                    <ul className='list-disc list-inside text-[.75rem]'>
                      <li>Single per-key RGB Mapping</li>
                      <li>Extensive OLED Customization</li>
                      <li>Online Sharing/Downloading</li>
                    </ul>
                  </div>
                  <div className="flex justify-center items-center flex-1 w-[10rem] self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2284.97729 975.98346">
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <rect className="cls-1 fill-[none] stroke-[28px] stroke-[#805ff7]" x="105.03159" y="105.03159" width="765.92028" height="765.92028" rx="163.19043" transform="translate(-202.13279 487.99173) rotate(-45)" />
                          <circle className="cls-2 fill-[none] stroke-[28px] stroke-[#98fce9]" cx="205.74182" cy="487.99173" r="108.35348" />
                          <path className="cls-3 stroke-3 fill-base-content" d="M1343.39623,245.39066q46.66113,0,82.69727,22.99023,36.0293,23.001,57.30468,63.1377,21.26369,40.14843,21.27442,92.30566,0,52.16309-21.27442,92.64844-21.28125,40.50147-57.64843,63.82422-36.38379,23.33936-81.667,23.334a143.352,143.352,0,0,1-45.63867-7.20605,154.96131,154.96131,0,0,1-39.46093-19.55957,152.45471,152.45471,0,0,1-31.56934-29.167,150.288,150.288,0,0,1-21.96094-36.03028l12.35352-9.60742V715.49515a20.3575,20.3575,0,0,1-5.834,14.41113,19.44,19.44,0,0,1-14.75488,6.17676,20.53225,20.53225,0,0,1-15.09863-6.17676,19.75079,19.75079,0,0,1-6.17578-14.41113v-447.458a21.1641,21.1641,0,0,1,5.833-15.09765q5.82276-6.17726,15.44141-6.17676a19.44,19.44,0,0,1,14.75488,6.17676,21.21059,21.21059,0,0,1,5.834,15.09765v74.11914l-9.6084-5.49023a119.50789,119.50789,0,0,1,20.24512-38.08887,138.57486,138.57486,0,0,1,70.34472-47.01074A159.16167,159.16167,0,0,1,1343.39623,245.39066Zm-3.43164,38.43164q-37.05908,0-65.19726,18.18652-28.14844,18.19189-44.26465,49.41211-16.13379,31.23633-16.12793,72.40332,0,40.50147,16.12793,72.7461,16.11621,32.26611,44.26465,50.4414,28.13232,18.1919,65.19726,18.18653,36.36768,0,64.168-18.18653,27.79395-18.17579,43.92187-50.4414,16.11622-32.25,16.12793-72.7461,0-40.48534-16.12793-72.05957-16.13378-31.55859-43.92187-49.75586Q1376.33716,283.833,1339.96459,283.8223Z" />
                          <path class="cls-3 fill-base-content" d="M1745.5515,605.68949q-53.53125,0-93.67773-22.64746a161.72266,161.72266,0,0,1-62.79492-63.13868q-22.64795-40.48535-22.64746-94.707,0-58.32275,22.99023-99.51074,22.98486-41.17676,59.707-63.48145,36.70459-22.29345,77.89258-22.30371a166.51288,166.51288,0,0,1,58.67774,10.63672,147.1139,147.1139,0,0,1,50.4414,31.56934q21.95655,20.94287,35.6875,51.12793,13.71973,30.208,14.41113,70.001a18.64552,18.64552,0,0,1-6.17578,14.06934,20.315,20.315,0,0,1-14.41211,5.833H1590.45092l-8.23535-37.05957h269.71l-8.92188,8.23535V380.58792q-2.751-32.25-20.58886-54.55957a122.06732,122.06732,0,0,0-42.89258-34.31347,120.12638,120.12638,0,0,0-52.501-12.01075,118.1296,118.1296,0,0,0-42.20605,8.23536,110.80949,110.80949,0,0,0-39.11817,25.73632q-17.50049,17.5005-28.48047,44.6084-10.98632,27.11865-10.98144,64.167,0,40.50147,16.47168,73.43262a127.14809,127.14809,0,0,0,47.35351,52.15723q30.88184,19.22168,74.80469,19.2168,23.32324,0,42.54981-6.86329a123.67422,123.67422,0,0,0,33.9707-18.18652,134.06647,134.06647,0,0,0,24.36328-23.67676q6.85254-6.17724,14.41211-6.17675a16.73278,16.73278,0,0,1,12.69629,5.49023,17.64009,17.64009,0,0,1,5.14648,12.35352q0,8.23534-6.8623,14.4121-20.58839,24.70607-53.53027,42.89258Q1784.66967,605.67874,1745.5515,605.68949Z" />
                          <path class="cls-3 fill-base-content" d="M2111.3474,239.90042a147.66985,147.66985,0,0,1,56.27539,10.63672,165.21381,165.21381,0,0,1,45.6377,27.45117q19.56006,16.8252,30.54,35.6875,10.96875,18.88331,10.98047,36.0293l-10.98047-16.4707V269.41019a21.168,21.168,0,0,1,5.833-15.09863,20.71489,20.71489,0,0,1,29.51074,0,21.21379,21.21379,0,0,1,5.833,15.09863V567.25785q0,54.20506-22.64746,91.96191a148.3247,148.3247,0,0,1-61.42188,57.30469q-38.78173,19.55859-88.1875,19.55859a221.55511,221.55511,0,0,1-50.44238-6.17676q-26.42725-6.17577-45.29492-15.78418-18.88331-9.61817-21.61719-19.90234-4.81055-6.17578-4.46094-12.00977a13.76442,13.76442,0,0,1,5.14648-9.95117q6.85254-4.80908,14.75586-1.02929,7.88086,3.76317,22.99024,9.95117,6.17578,2.0581,18.18652,6.17675a207.99425,207.99425,0,0,0,28.1377,7.20606,176.54338,176.54338,0,0,0,33.28418,3.08789q61.7666,0,96.08008-35.34375,34.30956-35.354,34.31445-92.30469V504.11917l6.8623,2.0586a118.24,118.24,0,0,1-20.24511,42.5498,135.00421,135.00421,0,0,1-33.28516,31.22559,155.82674,155.82674,0,0,1-85.09863,25.73633q-48.04542,0-85.78516-24.02051-37.752-24.01466-59.707-65.19629-21.97266-41.17675-21.96094-94.02149,0-52.147,21.96094-93.67773,21.95508-41.51367,59.707-65.19629Q2063.98315,239.89946,2111.3474,239.90042Zm4.11817,39.11817q-37.06054,0-66.91309,18.52929-29.85351,18.53028-46.667,51.12793-16.8252,32.60449-16.81445,73.77539,0,41.17677,16.81445,74.11915,16.80762,32.9414,46.667,51.81445,29.85353,18.8833,66.91309,18.873,37.73438,0,67.25586-18.53028,29.499-18.52881,46.667-51.12793,17.146-32.58837,17.15723-75.14844,0-42.54345-17.15723-74.80468-17.16212-32.25-46.667-50.44141Q2153.20482,279.02932,2115.46557,279.01859Z" />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="flex text-center">
                    <p className='text-[.65rem]'>To learn more about our pricing, features, and licenses please visit <a href='https://peg.software' className='link link-primary' target='_blank'>peg.software</a>.</p>
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