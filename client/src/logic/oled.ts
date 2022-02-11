import { OledPixel } from "../types/types"
import { Subscribable } from "./subscribable"

export class Oled extends Subscribable {
    display: number[][]
    pegMap: number[][] = []
    constructor() {
        super()
        //todo from string
        this.display = Array(32).fill(false).map(bool => Array(128).fill(false).map(bool => 0))
    }

    toString(): string {

        //todo 
        return ""
    }

    DisplayBlack() {
        this.display = this.display.map(row => row.map(pixel => 0))
    }

    displayFromPegMap() {
        this.DisplayBlack()
        console.log("transfer this ?", this.pegMap)
        let tempDisplayPixes = [...this.display]
        this.pegMap.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                tempDisplayPixes[rowIndex][col] = 1
            });
        });
        this.display = tempDisplayPixes
        this.updateSubScribers()
    }

    indexToXYCords(index: number): OledPixel {
        const pixelIndex = index / 4
        const x = Math.round(pixelIndex % 128)
        const y = Math.round(pixelIndex / 128)
        return { x, y }
    }

    oledPixeslToNestedArray = (pixels: OledPixel[]) => {
        let finalArray = Array(32).fill(false)
        pixels.forEach(pixel => {
            if (!finalArray[pixel.y - 1]) {
                finalArray[pixel.y - 1] = []
            }
            finalArray[pixel.y - 1].push(pixel.x)
        });

        const cleanedArray = finalArray.map((row: number[] | boolean) => {
            if (typeof row === "boolean") {
                return []
            } else {
                return row
            }
        })
        this.pegMap = cleanedArray

    }

    public UpdateDisplayPixel(row: number, col: number) {
        console.log("you know Im changing shit")
        if (this.display[row][col] === 0) {
            this.display[row][col] = 1
        } else {
            this.display[row][col] = 0
        }
        this.updateSubScribers()
    }

    public DataToPegMap(data: Uint8ClampedArray) {
        let oledArray = []
        for (var i = 0; i < data.length; i += 4) {
            if (data[i] >= 120) {
                oledArray.push(this.indexToXYCords(i))
            } else {
                continue
            }
        }
        this.oledPixeslToNestedArray(oledArray)
        this.displayFromPegMap()
    }


}