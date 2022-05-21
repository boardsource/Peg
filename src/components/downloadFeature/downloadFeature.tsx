import { ShareableFeatureType } from "../../types/types";
import Button from "../button/button";
import { Modal } from "../../logic/modal";
import { createSignal, onCleanup, Show } from "solid-js";
import { ClientManager } from "../../logic/clientManager";
import { ShareableFeatureToDisplayWord } from "../../logic/helpers";
import DownloadModal from "./downloadModal"
const clientManager = ClientManager.getInstance()

type DownloadFeatureProps = {
    featureType: ShareableFeatureType
};
export default function DownloadFeature(props: DownloadFeatureProps) {
    const [isOnLine, setIsOnLine] = createSignal(clientManager.isOnLine)

    const subId = clientManager.Subscribe(() => {
        setIsOnLine(clientManager.isOnLine)
    })

    onCleanup(() => {
        clientManager.Unsubscribe(subId)
    })
    const viewOptions = () => {
        const modal = Modal.getInstance()
        modal.Open(`Download a New ${ShareableFeatureToDisplayWord(props.featureType)}`, true, (
            <DownloadModal featureType={props.featureType} close={() => modal.Close()} keyboard={clientManager.keymap.keyLayout.features.name} />
        )
        )
    }

    return (
        <div className="DownloadFeature">
            <Show when={isOnLine()} fallback={`You are currently off line and can not download any ${ShareableFeatureToDisplayWord(props.featureType)}.`}>
                <Button className={'btn-outline gap-2'} onClick={viewOptions} selected={true}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Download more {ShareableFeatureToDisplayWord(props.featureType, true)}
                </Button>

            </Show>

        </div>

    );
}
