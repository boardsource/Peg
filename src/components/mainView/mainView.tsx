// import anime from 'animejs/lib/anime.es.js';
import { onCleanup, onMount } from 'solid-js'
// import { Transition } from 'solid-transition-group'
import { createSignal } from 'solid-js'
import { ClientManager } from '../../logic/clientManager'
import { ToolTip } from '../../logic/tooltip'
import { ShareableFeatureType } from '../../types/types'
import Button from '../button/button'
import DownloadFeature from '../downloadFeature/downloadFeature'
import ShareFeature from '../shareFeature/shareFeature'
import HelpTooltip from '../../components/helpTooltip/helpTooltip'
import PppChecker from '../pppChecker/pppChecker'
import { ProgramSettings } from '../../logic/programSettings'
import PppFallback from '../../components/pppFallback/pppFallback'

const toolTip = ToolTip.getInstance()
const clientManager = ClientManager.getInstance()
const programSettings = ProgramSettings.getInstance()


type MainViewProps = {
    title: string,
    description?: string,
    children: any
    supported: boolean
    featureType?: ShareableFeatureType
    ppp?: boolean
}

export default function MainView(props: MainViewProps) {
    const [changesMade, SetChangesMade] = createSignal(clientManager.changesMade)
    const updateLocalChangesMade = () => {
        SetChangesMade(clientManager.changesMade)
    }
    const subId = clientManager.Subscribe(updateLocalChangesMade)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)

    })
    const renderIfCan = () => {
        if (props.supported) {
            if (props.ppp) {
                return (<PppChecker fallback={PppFallback} >
                    {/* return (<PppChecker fallback={(<p>
                    Pro Account Feature
                    This feature is limited to pro accounts, pick up a pro account <a href={programSettings.PppBuyLink} target="blank"> here </a>to unlock this and many more features.
                </p>)} > */}
                    {props.children}
                </PppChecker>)
            } else {
                return props.children
            }

        } else {
            return (<p>
                This feature is supported by PEG but is not supported by your current keyboard.
            </p>)
        }
    }
    const returnShare = () => {

        if (props.featureType) {
            if (props.featureType !== ShareableFeatureType.keyCodes && props.featureType !== ShareableFeatureType.codeBlocks) {
                return (<>

                    <ShareFeature iconButton featureType={props.featureType} />
                    <div className="ml-2">
                        <DownloadFeature featureType={props.featureType} />
                    </div>


                </>)
            } else {
                return (<>
                    <DownloadFeature featureType={props.featureType} />
                </>
                )
            }
        }
    }
    const mouseEnter = (event: Event) => {
        if (props.description) {
            const description = props.description
            const title = props.title
            //@ts-ignore
            toolTip.Show(event.clientX, event.clientY, title, description)
        }
    }
    const mouseLeave = (event: Event) => {
        if (props.description) {
            toolTip.Hide()
        }
    }

    return (
        <div className="mainview flex flex-col flex-1 items-start">
            <div className="flex flex-col">
                <h1 className="flex mb-4 text-xl text-[22px] mb-3 tracking-wide truncate">
                    {props.title}
                    <HelpTooltip title={props.title}>
                        {props.description}
                    </HelpTooltip>
                    {/* <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 fill-slate-300 ml-1 mt-.75"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        onMouseEnter={mouseEnter}
                        onMouseLeave={mouseLeave}
                    >
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                    </svg> */}
                </h1>
                <div className="communityFeatures flex mb-5 origin-left btn-size-override-xxs">
                    {returnShare()}
                </div>

            </div>
            {/* <p className='text-slate-400 text-sm'>{props.description}</p> */}


            {renderIfCan()}


            {/* {show() && ( */}

            {/* )} */}
            {/* </Transition> */}

        </div >
    )
}

