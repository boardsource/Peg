import { ElectronEvents, OledDisplayType, OledPixel, OledReactionType, OledTextSection } from "../types/types"
import { ClientManager } from "./clientManager"
import { Subscribable } from "./subscribable"
export class Oled extends Subscribable {
    display: number[][]
    layers: number[][][] = [[], [], [], []]
    displayType: OledDisplayType = OledDisplayType.image
    imgReactionType: OledReactionType = OledReactionType.layer
    currentSelectedLayer: number = 0
    textDisplay?: OledTextSection[]
    flip: boolean = true
    constructor() {
        super()
        this.display = this.returnBlackScreen()
        this.layers = this.layers.map(layer => this.returnBlackScreen())
        this.makeTextDisplayBlank()
    }
    changesMade() {
        this.updateSubScribers()
        const currentClientManager = ClientManager.getInstance()
        currentClientManager.NoticeAChangeWasMade()
    }

    makeTextDisplayBlank() {
        this.textDisplay = [
            { 0: OledReactionType.layer, 1: ["", "", "", ""] },
            { 0: OledReactionType.layer, 1: ["", "", "", ""] },
            { 0: OledReactionType.layer, 1: ["", "", "", ""] },
            { 0: OledReactionType.layer, 1: ["", "", "", ""] },
        ]
    }
    returnBlackScreen() {
        return Array(32).fill(false).map(bool => Array(128).fill(false).map(bool => 0))
    }

    DisplayBlack() {
        this.display = this.display.map(row => row.map(pixel => 0))
    }

    ChangeLayer(oldLayer: number, newLayer: number) {
        this.layers[oldLayer] = this.display
        this.display = this.layers[newLayer]
        this.currentSelectedLayer = newLayer
        this.updateSubScribers()
    }

    displayFromNestedArray(data: number[][]) {
        this.DisplayBlack()
        let tempDisplayPixes = [...this.display]
        data.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                tempDisplayPixes[rowIndex][col] = 1
            });
        });
        this.display = tempDisplayPixes
        this.updateSubScribers()
    }

    indexToXYCords(index: number, fromDisplay: boolean): OledPixel {
        const pixelIndex = fromDisplay ? index : index / 4
        const x = Math.round(pixelIndex % 128)
        const y = Math.round(pixelIndex / 128)
        return { x, y }
    }

    oledPixeslToNestedArray = (pixels: OledPixel[], layer: number) => {
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
        return cleanedArray
    }

    public UpdateDisplayPixel(row: number, col: number) {
        if (this.display[row][col] === 0) {
            this.display[row][col] = 1
        } else {
            this.display[row][col] = 0
        }
        this.changesMade()
    }

    public UpdateFlip(newFlip: boolean) {
        this.flip = newFlip
        this.changesMade()
    }

    public UpdateTextDisplaySection(section: 0 | 1 | 2 | 3, newValue: string) {
        if (this.textDisplay) {
            // current layer is 0-3 length of this array is = to the amount of layers we support atm 4
            if (this.textDisplay[section][1].length >= this.currentSelectedLayer + 1) {
                while (this.textDisplay[section][1].length < this.currentSelectedLayer + 1) {
                    this.textDisplay[section][1].push("")
                }
            }
            this.textDisplay[section][1][this.currentSelectedLayer] = newValue
            this.changesMade()
        } else {
            this.makeTextDisplayBlank()
            this.UpdateTextDisplaySection(section, newValue)
        }
    }
    public UpdateTextDisplaySectionReactionType(section: 0 | 1 | 2 | 3, newReactionType: OledReactionType) {

        if (this.textDisplay) {
            this.textDisplay[section][0] = newReactionType
            this.changesMade()
        } else {
            this.makeTextDisplayBlank()
            this.UpdateTextDisplaySectionReactionType(section, newReactionType)
        }
    }

    public DataToPegMap(data: Uint8ClampedArray, layer: number) {
        let oledArray = []
        for (var i = 0; i < data.length; i += 4) {
            if (data[i] >= 120) {
                oledArray.push(this.indexToXYCords(i, false))
            } else {
                continue
            }
        }
        const cleanedArray = this.oledPixeslToNestedArray(oledArray, layer)
        this.displayFromNestedArray(cleanedArray)
        const currentClientManager = ClientManager.getInstance()
        currentClientManager.NoticeAChangeWasMade()

    }
    public RecievImgDataFromBackEnd(imgData: number[][], layer: number) {

        this.layers[layer - 1] = imgData
        if (this.currentSelectedLayer === layer - 1) {
            this.display = imgData
        }
    }

    public FromString(fromBoard: string) {
        try {
            const tempData = JSON.parse(fromBoard.replaceAll("0:", '"0":').replaceAll("1:", '"1":'))
            if (this.displayType === OledDisplayType.text) {
                this.textDisplay = tempData
            }
        } catch (error) {
            console.log("error parsing oled map", error)
        }
    }


    public ToString(): string {
        let pegmapString
        switch (this.displayType) {
            case OledDisplayType.image:
                this.layers[this.currentSelectedLayer] = this.display
                const currentClientManager = ClientManager.getInstance()
                switch (this.imgReactionType) {
                    case OledReactionType.layer:
                        pegmapString = ` [{0:"LAYER",1:["1.bmp","2.bmp","3.bmp","4.bmp"]}]`
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[0], fileNumber: 1 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[1], fileNumber: 2 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[2], fileNumber: 3 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[3], fileNumber: 4 })
                        break
                    case OledReactionType.static:
                        pegmapString = ` [{0:"STATIC",1:["1.bmp"]}]`
                        this.layers[0] = this.display
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[0], fileNumber: 1 })
                        break
                }
                break;
            case OledDisplayType.text:
                try {
                    if (this.textDisplay) {
                        const textMapStr = this.textDisplay.map(section => {
                            return `{0:"${section[0]}",1:${JSON.stringify(section[1])}}`
                        })
                        pegmapString = `[${textMapStr.join(",")}]`
                    } else {
                        pegmapString = `[{0:"LAYER",1:["error","2","3","4"]},{0:"LAYER",1:["in","2","3","4"]},{0:"LAYER",1:["making","2","3","4"]},{0:"LAYER",1:["display","2","3","4"]}]`

                    }
                } catch (error) {
                    pegmapString = `[{0:"LAYER",1:["error","2","3","4"]},{0:"LAYER",1:["in","2","3","4"]},{0:"LAYER",1:["making","2","3","4"]},{0:"LAYER",1:["display","2","3","4"]}]`

                }
                break;
        }
        // this is max level jank there is a extra spce in flip value so that true and flase are the same length
        return `# oled\noled_ext = oled(keyboard,\n${pegmapString},toDisplay='${this.displayType}',flip=${this.flip ? " True" : "False"})\n# oled`
    }



}