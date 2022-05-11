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
                <Button oneOffClasses={'btn-outline'} onClick={viewOptions} selected={true}>
                    Download more {ShareableFeatureToDisplayWord(props.featureType, true)}
                </Button>

            </Show>

        </div>

    );
}
