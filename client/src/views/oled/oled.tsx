import { createSignal, For, onCleanup, Show } from 'solid-js'
import Button from '../../components/button/button'
import DownloadFeature from '../../components/downloadFeature/downloadFeature'
import LayerSelector from '../../components/layerSelector/layerSelector'
import LoopOverEnum from '../../components/loopOverEnum/loopOverEnum'
import MainView from '../../components/mainView/mainView'
import OledDisplay from '../../components/oled/oledDisplay/oledDisplay'
import TextOledDisplay from '../../components/oled/textOledDisplay/textOledDisplay'
import ShareFeature from '../../components/shareFeature/shareFeature'
import Toggle from '../../components/toggle/toggle'
import { ClientManager } from '../../logic/clientManager'
import { KeyMap } from '../../logic/keymapManager'
import { OledDisplayType, OledReactionType, ShareableFeatureType } from '../../types/types'
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
            <Button selected={changesMade()} onClick={saveMap} >
                save
            </Button>
            <ShareFeature featureType={ShareableFeatureType.oleds} />
            <DownloadFeature featureType={ShareableFeatureType.oleds} />


        </MainView>

    )
}