import "./oledDisplay.sass"
import { Show, createSignal, onMount, For, onCleanup, createReaction, Index } from "solid-js";
import { createStore } from "solid-js/store";
import { magicNumbers } from "../../../magicNumbers";
import { OledPixel } from "../../../types/types";
import { KeyMap } from "../../../logic/keymapManager";
const keymap = KeyMap.getInstance()
type OledDisplayProps = {

};


export default function OledDisplay(props: OledDisplayProps) {
    let currentOled = keymap.oled
    const subId = keymap.Subscribe(() => { currentOled = keymap.oled })
    // const [displayPixes, setDisplayPixes] = createSignal(currentOled?.display)
    const [displayPixes, setDisplayPixes] = createStore({ pixels: currentOled?.display, mouseDown: false })
    let updates = 0
    const prosessUpdates = () => {
        if (displayPixes.mouseDown && updates < 5) {

        } else {
            updates = 0
            renderTheDirtyWay()
        }

    }
    const subId2 = currentOled ? currentOled.Subscribe(() => {
        // setDisplayPixes(currentOled?.display)
        // setDisplayPixes({ pixels: currentOled?.display })
        updates++
        prosessUpdates()
    }) : false

    onCleanup(() => {
        keymap.Unsubscribe(subId);
        if (subId2 && currentOled) {
            currentOled.Unsubscribe(subId2)
        }

    })
    const drag = (row: number, col: number) => {
        if (displayPixes.mouseDown) {
            currentOled?.UpdateDisplayPixel(row, col)
        }
    }

    // never do this
    const renderTheDirtyWay = () => {
        const pixels = currentOled ? currentOled.display : []
        const victomDiv = document.getElementsByClassName("oledDisplay__victom")
        if (victomDiv[0].childElementCount === 0) {
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
                    colButton.addEventListener("click", () => { currentOled?.UpdateDisplayPixel(rowIndex, colIndex) })
                    colButton.addEventListener("mouseenter", () => { drag(rowIndex, colIndex) })
                    colButton.style.width = `${magicNumbers.oledPixel}px`
                    rowDiv.appendChild(colButton)
                })
                victomDiv[0].appendChild(rowDiv)
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
        <div className="oledDisplay flex flex-col" onMouseDown={() => setDisplayPixes({ mouseDown: true })} onMouseUp={() => setDisplayPixes({ mouseDown: false })}>
            <div className="oledDisplay__victom"></div>
            {/* <Index each={displayPixes.pixels} fallback={<div>Loading...</div>}>
                {(row, rowindex) => (
                    <div className="oledDisplay__row flex ">
                        <Index each={row()} fallback={<div>Loading...</div>}>
                            {(col, colindex) => {
                                // console.log("pixelis ", col(), colindex, rowindex)
                                return (
                                    <button className={`oledDisplay__row__pixel ${col() === 0 ? "bg-black" : "bg-white"}`}
                                        onClick={() => currentOled?.UpdateDisplayPixel(rowindex, colindex)}
                                        onMouseEnter={() => drag(rowindex, colindex)}
                                        style={`width: ${magicNumbers.oledPixel}px;`}
                                    >

                                    </button>
                                )
                            }}
                        </Index >
                    </div>
                )}
            </Index> */}
        </div>
    );
}


