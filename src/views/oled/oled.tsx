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
import HelpTooltip from '../../components/helpTooltip/helpTooltip'

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
    <MainView title='OLED' description={`
        OLEDs are displays used on keyboards. OLEDs can display a wide range of items, examples are displaying the current layer or a static image of your choosing.`} supported={keymap.keyLayout && keymap.keyLayout.features.oled} featureType={ShareableFeatureType.oleds}>
      <div className="flex flex-col flex-1 w-full relative">
        <div className="flex flex-col">
          <div className="flex">
            <h3>OLED Display Mode</h3><HelpTooltip>testing</HelpTooltip>
          </div>
          <LoopOverEnum enum={OledDisplayType} buttonOnClick={changeOledDisplayType} selected={OledType()} defaultButtons /> <div className="flex mb-[60px]">
          </div>
        </div>
        <div className="flex w-4/6 flex-col">
          <div className="blackHole flex bg-black w-f w-[640px] h-[160px] rounded-lg">
            {renderOledEditor()}
          </div>
        </div>
        <div className="flex justify-self-end absolute right-0 top-0">
          <LayerSelector isLed={false} />
        </div>
      </div>
      <div className="oled__info w-full">
        <h3 className='text-xl mb-1'>Options</h3>
        <div className="mb-1.5">
          <Toggle label="Flip Display" name="flip" value={flip()} onChange={flipDisplay} />
        </div>
        <h4 className='text-md text-base-content mb-1.5'>OLED Display Mode</h4>
        <p className='text-xs text-neutral mb-1'>
          <span className='badge badge-primary badge-outline badge-sm mr-1'>IMAGE</span>
          is when Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi error expedita.</p>
        <p className='text-xs text-neutral mb-1'>
          <span className='badge badge-primary badge-outline badge-sm mr-1'>TEXT</span>
          is when Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi error expedita.</p>
        <h4 className='text-md text-base-content mb-1.5'>Text Options</h4>
        <p className='text-xs text-neutral mb-1'>
          <span className='badge badge-warning badge-outline badge-sm mr-1'>LAYER</span>
          Is Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus esse doloribus.</p>
        <p className='text-xs text-neutral mb-1'>
          <span className='badge badge-warning badge-outline badge-sm mr-1'>STATIC</span>
          Et magnam nihil labore quis, neque iusto fuga autem accusantium! END END END</p>
      </div>

      <div className="flex flex-col">

      </div>
      {/* <Button selected={changesMade()} onClick={saveMap} >
        SAVE
      </Button> */}
    </MainView>
  )
}