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
        <div className="layer-selector flex flex-col items-end scale-90 origin-top mr-3">
            <h3>Layers</h3>
            <For each={Array.from(Array(props.isLed ? 2 : 8))} fallback={<div>Loading...</div>}>
                {(_, index) => (
                    <button class={`btn btn-circle btn-sm btn-primary mb-1 ${currentLayer() === index() ? '' : 'btn-outline'}`}
                        onClick={() => {
                            clientManager.ChangeLayer(index())
                            clientManager.TellThemToUpdate()
                        }}
                    //  selected={currentLayer() === index()}
                    >
                        {/* <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg> */}
                        {index() === 1 && props.isLed ? `underglow` : `${index()}`}
                    </button>
                    // <Button onClick={() => {
                    //     clientManager.ChangeLayer(index())
                    //     clientManager.TellThemToUpdate()
                    // }} selected={currentLayer() === index()}>
                    //     {index() === 1 && props.isLed ? `underglow` : `layer ${index()}`}
                    // </Button>

                )}
            </For>
        </div>



    );
}
