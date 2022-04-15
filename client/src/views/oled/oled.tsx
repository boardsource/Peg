import { createSignal, For, onCleanup, Show } from 'solid-js'
import LayerSelector from '../../components/layerSelector/layerSelector'
import LoopOverEnum from '../../components/loopOverEnum/loopOverEnum'
import MainView from '../../components/mainView/mainView'
import OledDisplay from '../../components/oled/oledDisplay/oledDisplay'
import TextOledDisplay from '../../components/oled/textOledDisplay/textOledDisplay'
import Toggle from '../../components/toggle/toggle'
import { ClientManager } from '../../logic/clientManager'
import { KeyMap } from '../../logic/keymapManager'
import { OledDisplayType, OledReactionType } from '../../types/types'
const clientManager = ClientManager.getInstance()

const keymap = KeyMap.getInstance()

export default function OLED() {
    let currentOled = keymap.oled
    const [currentLayer, setCurrentLayer] = createSignal(clientManager.currentLayer),
        [OledType, SetOledType] = createSignal(currentOled ? currentOled.displayType : OledDisplayType.image),
        [flip, setflip] = createSignal(currentOled ? currentOled.flip : false),
        [changesMade, SetChangesMade] = createSignal(clientManager.changesMade)
    const changeLayer = (newLayer: number) => {
        if (newLayer !== currentLayer()) {
            currentOled?.ChangeLayer(currentLayer(), newLayer)
            setCurrentLayer(newLayer)
        }
    }
    const updateLocalChangesMade = () => {
        if (clientManager.currentLayer !== currentLayer()) {
            changeLayer(clientManager.currentLayer)
        }
        SetChangesMade(clientManager.changesMade)
        if (currentOled) {
            setflip(currentOled.flip)
        }
    }
    const flipDisplay = (e: any) => {
        if (currentOled) {
            currentOled.UpdateFlip(e.target.value)
        }
    }
    const subId = clientManager.Subscribe(updateLocalChangesMade)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)
    })


    const changeOledDisplayType = (newType: OledDisplayType) => {
        SetOledType(newType)
        if (currentOled) {
            currentOled.displayType = newType
        }
        clientManager.NoticeAChangeWasMade()
    }
    const saveMap = () => {
        clientManager.SaveMap()
    }
    const renderOledEditor = () => {
        if (OledType() === OledDisplayType.image) {
            return (
                <OledDisplay currentLayer={currentLayer} />
            )
        } else {
            return (
                <TextOledDisplay currentLayer={currentLayer} />
            )
        }
    }
    return (
        <MainView title='OLED' description={""}>
            <Toggle label="flipDisplay" name="flip" value={flip()} onChange={flipDisplay} />
            <div className="flex flex-row">
                <LoopOverEnum enum={OledDisplayType} buttonOnClick={changeOledDisplayType} selected={OledType()} defaultButtons />
            </div>
            <div className="flex flex-row">
                {renderOledEditor()}
                <LayerSelector isLed={false} />
            </div>
            <button class={`${changesMade() ? "inline-block px-2 py-2 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out" :
                "inline-block px-2 py-2 bg-gray-200 text-gray-700 font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out"}`}
                onClick={saveMap}>
                save
            </button>
        </MainView>

    )
}