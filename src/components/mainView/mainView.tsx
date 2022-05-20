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
import PppFallback from '../../components/pppFallback/pppFallback'
import { KeyMap } from '../../logic/keymapManager'
import LoadingBoard from '../loadingBoard/loadingBoard'


type MainViewProps = {
    title: string,
    description?: string,
    children: any
    supported: boolean
    featureType?: ShareableFeatureType
    ppp?: boolean
    showNoBoardFallBack?: boolean
}

export default function MainView(props: MainViewProps) {

    const renderNoBoard = () => {
        if (props.showNoBoardFallBack) {
            return (
                <LoadingBoard>
                    {props.children}
                </LoadingBoard>
            )
        } else {
            return props.children
        }
    }

    const renderIfCan = () => {
        if (props.supported) {
            if (props.ppp) {
                return (<PppChecker fallback={<PppFallback />} >
                    {renderNoBoard()}
                </PppChecker>)
            } else {
                return renderNoBoard()
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


    return (
        <div className="mainview flex flex-col flex-1 items-start">
            <div className="flex flex-col">
                <h1 className="flex mb-4 text-xl text-[22px] mb-3 tracking-wide truncate">
                    {props.title}
                    <HelpTooltip title={props.title}>
                        {props.description}
                    </HelpTooltip>

                </h1>
                <div className="communityFeatures flex mb-5 origin-left btn-size-override-xxs">
                    {returnShare()}
                </div>

            </div>
            {renderIfCan()}
        </div >
    )
}

