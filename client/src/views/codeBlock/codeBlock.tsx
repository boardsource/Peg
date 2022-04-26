import { createSignal, onCleanup, Show } from 'solid-js'
import MainView from '../../components/mainView/mainView'
import ShareFeature from '../../components/shareFeature/shareFeature'
import { KeyMap } from '../../logic/keymapManager'
import { ShareableFeatureType } from '../../types/types'

const keymap = KeyMap.getInstance()

export default function LED() {
    const [codeBlock, setcodeBlock] = createSignal(keymap.codeBlock)

    const subId2 = keymap.Subscribe(() => {
        setcodeBlock(keymap.codeBlock)
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
        <MainView title="Code Block">
            <Show when={codeBlock()} fallback={fallBack()}>
                <p>
                    Your current code block is:
                    <br />
                    <code style="white-space: pre-wrap">
                        # codeblock
                        {codeBlock()}
                        # codeblock
                    </code>
                </p>
                <ShareFeature featureType={ShareableFeatureType.codeBlocks} />

            </Show>


        </MainView>

    )
}

