import "./oledDisplay.sass"
import { Show, createSignal, onMount, For, onCleanup, createReaction, Index } from "solid-js";
import { createStore } from "solid-js/store";
import { magicNumbers } from "../../../magicNumbers";
import { OledReactionType } from "../../../types/types";
import { KeyMap } from "../../../logic/keymapManager";
import { ClientManager } from "../../../logic/clientManager";
import OledImageUpLoader from "../oledImageUploader/oledImageUpLoader";
import LoopOverEnum from "../../loopOverEnum/loopOverEnum";
import Button from "../../button/button";
const clientManager = ClientManager.getInstance()
const keymap = KeyMap.getInstance()
type OledDisplayProps = {
  currentLayer: () => number
};


export default function OledDisplay(props: OledDisplayProps) {

  let currentOled = keymap.oled
  const [imgReactionType, setImgReactionType] = createSignal(currentOled ? currentOled.imgReactionType : OledReactionType.layer)
  const subId = keymap.Subscribe(() => { currentOled = keymap.oled })
  // const [displayPixels, setDisplayPixels] = createSignal(currentOled?.display)
  const [displayPixels, setDisplayPixels] = createStore({ pixels: currentOled?.display, mouseDown: false })
  let updates = 0
  const prosessUpdates = () => {
    if (displayPixels.mouseDown && updates < 5) {

    } else {
      updates = 0
      renderTheDirtyWay()
    }

  }
  const subId2 = currentOled ? currentOled.Subscribe(() => {
    updates++
    prosessUpdates()
    setImgReactionType(currentOled ? currentOled.imgReactionType : OledReactionType.layer)
  }) : false

  onCleanup(() => {
    keymap.Unsubscribe(subId);
    if (subId2 && currentOled) {
      currentOled.Unsubscribe(subId2)
    }

  })
  const clearDisplay = () => {
    if (currentOled) {
      currentOled.DisplayBlack()
      currentOled.changesMade()
    }
  }

  const drag = (row: number, col: number) => {
    if (displayPixels.mouseDown) {
      currentOled?.UpdateDisplayPixel(row, col)
      clientManager.NoticeAChangeWasMade()
    }
  }

  // never do this. They think I cant force updates I'll show them
  const renderTheDirtyWay = () => {
    const pixels = currentOled ? currentOled.display : []
    const victimDiv = document.getElementsByClassName("oledDisplay__victim")
    if (victimDiv[0].childElementCount === 0) {
      pixels.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add("flex")
        rowDiv.classList.add("oledDisplay__row")
        row.forEach((col, colIndex) => {
          const colButton = document.createElement('button');
          colButton.classList.add("flex")
          colButton.classList.add("oledDisplay__row__pixel")
          colButton.classList.add(col === 0 ? "bg-black" : "bg-white")
          colButton.id = `row-${rowIndex}-col-${colIndex}`
          colButton.addEventListener("click", () => {
            currentOled?.UpdateDisplayPixel(rowIndex, colIndex)
            clientManager.NoticeAChangeWasMade()
          })
          colButton.addEventListener("mouseenter", () => { drag(rowIndex, colIndex) })
          colButton.style.width = `${magicNumbers.oledPixel}px`
          rowDiv.appendChild(colButton)
        })
        victimDiv[0].appendChild(rowDiv)
      })
    } else {
      pixels.forEach((row, rowIndex) => {

        row.forEach((col, colIndex) => {
          const colButton = document.getElementById(`row-${rowIndex}-col-${colIndex}`)
          if (colButton) {
            const classes = colButton.classList
            if (col === 0 && classes.contains("bg-white")) {
              colButton.classList.remove("bg-white")
              colButton.classList.add("bg-black")
            } else if (col === 1 && classes.contains("bg-black")) {
              colButton.classList.remove("bg-black")
              colButton.classList.add("bg-white")
            }
          }

        })

      })
    }
  }

  setTimeout(() => {
    renderTheDirtyWay()
  }, 500)
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">

        <div className="oledDisplay flex flex-col flex-1 rounded-lg w-[640px] h-[160px] overflow-hidden" onMouseDown={() => setDisplayPixels({ mouseDown: true })} onMouseUp={() => setDisplayPixels({ mouseDown: false })}>
          <div className="oledDisplay__victim"></div>
        </div>
      </div>
      <div className="mt-2.5">
        <LoopOverEnum enum={OledReactionType} buttonOnClick={(newValue: OledReactionType) => currentOled?.UpdateImageReactionType(newValue)} selected={imgReactionType()} defaultButtons oledInfo tinyButtons />
        <Button onClick={clearDisplay} selected={false}>
          Clear Display
        </Button>
        <OledImageUpLoader currentLayer={props.currentLayer} />

      </div>

    </div>


  );
}


