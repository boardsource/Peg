import { createSignal, For, onCleanup, Show } from 'solid-js'
import DownloadFeature from '../../components/downloadFeature/downloadFeature'
import MainView from '../../components/mainView/mainView'
import ShareFeature from '../../components/shareFeature/shareFeature'
import { KeyMap } from '../../logic/keymapManager'
import { ShareableFeatureType } from '../../types/types'

const keymap = KeyMap.getInstance()

export default function LED() {
    const [codeBlocks, setCodeBlock] = createSignal(keymap.codeBlock)

    const subId2 = keymap.Subscribe(() => {
        setCodeBlock(keymap.codeBlock)
    })

    onCleanup(() => {

        keymap.Unsubscribe(subId2)
    })
    const fallBack = () => {
        return (
            <p>
                Your keyboard does not have a code block currently. Download one with the button below or wrap any code in "# codeblock"
            </p>
        )
    }
    return (
        <MainView title="Code Block" description={`A code block is a way for you to run some custom code and keep it around. 
        Is there a feature you want but not supported by PEG? 
        configure it though code and keep it in your keymap as you configure everything else with PEG.
         This  view will let you see your code block `} supported={true} featureType={ShareableFeatureType.codeBlocks}>

            <For each={codeBlocks()} fallback={fallBack()}>
                {(codeBlock, i) => (
                    <div className="mb-3">
                        <h3>
                            Code block {i() + 1} is:
                        </h3>
                        <p>
                            <br />
                            <code style="white-space: pre-wrap">
                                # codeblock
                                {codeBlock}
                                # codeblock
                            </code>
                        </p>
                        <ShareFeature featureType={ShareableFeatureType.codeBlocks} codeBlock={codeBlock} />
                    </div>
                )}

            </For>



        </MainView>

    )
}

