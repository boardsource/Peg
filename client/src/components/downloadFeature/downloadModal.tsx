import { createSignal, For, onCleanup, onMount } from "solid-js"
import { RemoteContentManager } from "../../logic/remoteContentManager"
import { ShareableFeatureType } from "../../types/types"
import Paragraph from "../paragraph/paragraph"

type ShareModalProps = {
    featureType: ShareableFeatureType
    keyboard: string
    close: () => void

}

export default function DownloadModal(props: ShareModalProps) {
    const remoteContentManager = new RemoteContentManager(props.featureType, props.keyboard)
    const [listOfFeatures, setListOfFeatures] = createSignal(remoteContentManager.listOfFeatures)

    const subId = remoteContentManager.Subscribe(() => {
        setListOfFeatures(remoteContentManager.listOfFeatures)
    })
    onMount(() => {
        remoteContentManager.GetFeatureList()
    })

    onCleanup(() => {
        remoteContentManager.Unsubscribe(subId)
    })
    return (
        <div>
            <For each={listOfFeatures()} fallback={<div>Loading...</div>}>
                {(feature, index) => (
                    <div>
                        <h3>
                            {feature.title}
                        </h3>
                        <Paragraph truncate={20}>
                            originally made for: {feature.keyboard}
                        </Paragraph>
                        <p>
                            {feature.description}
                        </p>

                    </div>

                )}

            </For>



        </div>)
}