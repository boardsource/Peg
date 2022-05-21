import { createSignal, For, onCleanup, Show } from 'solid-js'
import LayerSelector from '../../components/layerSelector/layerSelector'
import LoopOverEnum from '../../components/loopOverEnum/loopOverEnum'
import MainView from '../../components/mainView/mainView'
import OledDisplay from '../../components/oled/oledDisplay/oledDisplay'
import TextOledDisplay from '../../components/oled/textOledDisplay/textOledDisplay'
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
    [imgReactionType, setImgReactionType] = createSignal(currentOled ? currentOled.imgReactionType : OledReactionType.layer),
    [flip, setflip] = createSignal(currentOled ? currentOled.flip : false),
    [supportsOled, setSupportsOled] = createSignal(keymap.keyLayout && keymap.keyLayout.features.oled)
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
  const subId2 = currentOled ? currentOled.Subscribe(() => {
    setImgReactionType(currentOled ? currentOled.imgReactionType : OledReactionType.layer)
  }) : false
  const subId3 = keymap.Subscribe(() => {
    setSupportsOled(keymap.keyLayout && keymap.keyLayout.features.oled)
    currentOled = keymap.oled
    if (currentOled) {
      setImgReactionType(currentOled.imgReactionType)
      setflip(currentOled.flip)
      SetOledType(currentOled.displayType)
      console.log("supportsOled", supportsOled())
    }
  })


  onCleanup(() => {
    clientManager.Unsubscribe(subId)
    keymap.Unsubscribe(subId3)
    if (subId2 && currentOled) {
      currentOled.Unsubscribe(subId2)
    }
  })


  const changeOledDisplayType = (newType: OledDisplayType) => {
    SetOledType(newType)
    if (currentOled) {
      currentOled.displayType = newType
    }
    clientManager.NoticeAChangeWasMade()
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
    <MainView title='OLED' ppp={true} description={`
        OLEDs are displays used on keyboards. OLEDs can display a wide range of items, examples are displaying the current layer or a static image of your choosing.`}
      supported={supportsOled()}
      featureType={ShareableFeatureType.oleds}>
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
          <Show when={OledType() === OledDisplayType.text || imgReactionType() === OledReactionType.layer}>
            <LayerSelector isLed={false} />
          </Show>
        </div>
      </div>
      <div className="oled__info w-full">
        <h3 className='text-xl'>Options</h3>
        <div className="flex mb-1.5">
          <Toggle label="Flip Display" name="flip" value={flip()} onChange={flipDisplay} /><HelpTooltip>Toggle Flip Display to ON in order to rotate the image/layout of your OLED by 180°</HelpTooltip>
        </div>
        <h4 className='text-md text-base-content mb-1.5  mt-2'>OLED Display Mode</h4>
        <p className='text-xs text-neutral mb-1'>
          <span className='badge badge-primary badge-outline badge-sm mr-1'>IMAGE</span>
          is when Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi error expedita.</p>
        <p className='text-xs text-neutral mb-1'>
          <span className='badge badge-primary badge-outline badge-sm mr-1'>TEXT</span>
          is when Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi error expedita.</p>
        <h4 className='text-md text-base-content mb-1.5 mt-2'>Text Options</h4>
        <p className='text-xs text-neutral mb-1'>
          <span className='badge badge-warning badge-outline badge-sm mr-1'>STATIC</span>
          Et magnam nihil labore quis, neque iusto fuga autem accusantium! END END END</p>
        <p className='text-xs text-neutral mb-1'>
          <span className='badge badge-warning badge-outline badge-sm mr-1'>LAYER</span>
          Is Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus esse doloribus.</p>
      </div>

      <div className="flex flex-col">

      </div>
      {/* <Button selected={changesMade()} onClick={saveMap} >
        SAVE
      </Button> */}
    </MainView>
  )
}