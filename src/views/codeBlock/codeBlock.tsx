import { createSignal, For, onCleanup, Show } from 'solid-js'
import DownloadFeature from '../../components/downloadFeature/downloadFeature'
import MainView from '../../components/mainView/mainView'
import ShareFeature from '../../components/shareFeature/shareFeature'
import { KeyMap } from '../../logic/keymapManager'
import { ShareableFeatureType } from '../../types/types'
import Button from '../../components/button/button'

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
        <MainView title="Code Blocks" description={`A code block is a way for you to run some custom code and keep it around. 
        Is there a feature you want but not supported by PEG? 
        configure it though code and keep it in your keymap as you configure everything else with PEG.
         This  view will let you see your code block `} supported={true} featureType={ShareableFeatureType.codeBlocks}>
            <div className="flex w-full h-full overflow-scroll">
                <div className="flex flex-col w-[70%] h-[400px]">
                    <For each={codeBlocks()} fallback={fallBack()}>
                        {(codeBlock, i) => (
                            <div className="mb-3 rounded rounded-lg border pt-4 pr-4 pl-4 pb-3 hover:translate-x-[.65rem] transition">

                                <p className='mb-2 border rounded rounded-md p-3 bg-base-200 text-[.8rem]'>
                                    <code style="white-space: pre-wrap">
                                        # codeblock
                                        {codeBlock}
                                        # codeblock
                                    </code>
                                </p>
                                <div className="flex justify-between w-full">
                                    <ShareFeature featureType={ShareableFeatureType.codeBlocks} codeBlock={codeBlock} iconButton btnClasses='btn-outline mr-1' />
                                    {/* delete button here for codeblock, should probably prompt with a modal as well to confirm */}
                                    <Button
                                        selected={true}
                                        // onClick={() => {
                                        //   //@ts-ignore
                                        //   keycodes.RemoveCustomCode(key.code)
                                        // }}
                                        className='btn btn-ghost hover:btn-error gap-2'
                                        icon
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-[1.1rem] h-[1.1rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>

        </MainView>
    )
}

