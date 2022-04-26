import { Show, createSignal, onMount, For, createResource, onCleanup } from "solid-js";
import { ClientManager } from "../../logic/clientManager";
import Button from "../button/button";
const clientManager = ClientManager.getInstance();
type LayerSelectorProps = {
    // currentLayer: () => number
    // setCurrentLayer: (layer: number) => void
    isLed: boolean
};


export default function LayerSelector(props: LayerSelectorProps) {
    const [currentLayer, setCurrentLayer] = createSignal(clientManager.currentLayer)
    const updateLayer = () => {
        setCurrentLayer(clientManager.currentLayer)
    }

    const subId = clientManager.Subscribe(updateLayer)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)
    })
    //todo map over underglow leds and show that when layer === 4
    return (

        <For each={Array.from(Array(props.isLed ? 2 : 4))} fallback={<div>Loading...</div>}>
            {(_, index) => (
                <Button onClick={() => {
                    clientManager.ChangeLayer(index())
                    clientManager.TellThemToUpdate()
                }} selected={currentLayer() === index()}>
                    {index() === 1 && props.isLed ? `underglow` : `layer ${index()}`}
                </Button>

            )}
        </For>


    );
}
