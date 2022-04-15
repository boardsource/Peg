import { Show, createSignal, onMount, For, createResource, onCleanup } from "solid-js";
import { ClientManager } from "../../logic/clientManager";
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

        <For each={Array.from(Array(props.isLed ? 5 : 4))} fallback={<div>Loading...</div>}>
            {(_, index) => (
                <button className={`$inline-block px-2 py-1 border-2  border-purple-600 ${currentLayer() === index() ? "bg-purple-600 text-white" : " text-purple-600"} font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                    onClick={() => {
                        clientManager.ChangeLayer(index())
                        clientManager.TellThemToUpdate()
                    }}
                >
                    {index() === 4 ? `underglow` : `layer ${index()}`}
                </button>
            )}
        </For>


    );
}
