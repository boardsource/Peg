import { ElectronEvents, OledDisplayType, OledPixel, OledReactionType, OledTextSection } from "../types/types"
import { ClientManager } from "./clientManager"
import { Subscribable } from "./subscribable"
export class Oled extends Subscribable {
    display: number[][]
    layers: number[][][] = [[], [], [], [], [], [], [], []]
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
            { 0: OledReactionType.layer, 1: ["", "", "", "", "", "", "", ""] },
            { 0: OledReactionType.layer, 1: ["", "", "", "", "", "", "", ""] },
            { 0: OledReactionType.layer, 1: ["", "", "", "", "", "", "", ""] },
            { 0: OledReactionType.layer, 1: ["", "", "", "", "", "", "", ""] },
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
        let tempDisplayPixels = [...this.display]
        data.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                tempDisplayPixels[rowIndex][col] = 1
            });
        });
        this.display = tempDisplayPixels
        this.updateSubScribers()
    }

    indexToXYCords(index: number, fromDisplay: boolean): OledPixel {
        const pixelIndex = fromDisplay ? index : index / 4
        const x = Math.round(pixelIndex % 128)
        const y = Math.round(pixelIndex / 128)
        return { x, y }
    }

    oledPixelsToNestedArray = (pixels: OledPixel[], layer: number) => {
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

    public UpdateImageReactionType(newReactionType: OledReactionType) {
        this.imgReactionType = newReactionType
        console.log(this)
        this.changesMade()
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
        const cleanedArray = this.oledPixelsToNestedArray(oledArray, layer)
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
        const cleanedString = `[${fromBoard}]`
            .replaceAll("0:", '"0":')
            .replaceAll("1:", '"1":')
            .replaceAll("OledReactionType.STATIC", '"STATIC"')
            .replaceAll("OledReactionType.LAYER", '"LAYER"')
        try {
            const tempData = JSON.parse(cleanedString)
            if (this.displayType === OledDisplayType.text) {
                this.textDisplay = tempData
            }
        } catch (error) {
            console.log("error parsing oled map", error)
        }
    }

    oledReactionTypeToString(reactionType: OledReactionType) {
        switch (reactionType) {
            case OledReactionType.layer:

                return "OledReactionType.LAYER"

            case OledReactionType.static:
                return "OledReactionType.STATIC"
        }
    }

    oledDisplayTypeToString(displayType: OledDisplayType) {
        switch (displayType) {
            case OledDisplayType.image:
                return "OledDisplayMode.IMG"
            case OledDisplayType.text:
                return "OledDisplayMode.TXT"
        }
    }
    stringToOledReactionType(strReactionType: string) {

    }


    public ToString(): string {
        let pegmapString
        switch (this.displayType) {
            case OledDisplayType.image:
                this.layers[this.currentSelectedLayer] = this.display
                const currentClientManager = ClientManager.getInstance()
                switch (this.imgReactionType) {
                    case OledReactionType.layer:
                        pegmapString = ` OledData(image={0:${this.oledReactionTypeToString(OledReactionType.layer)},1:["1.bmp","2.bmp","3.bmp","4.bmp","5.bmp","6.bmp","7.bmp","8.bmp"]})`
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[0], fileNumber: 1 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[1], fileNumber: 2 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[2], fileNumber: 3 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[3], fileNumber: 4 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[4], fileNumber: 5 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[5], fileNumber: 6 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[6], fileNumber: 7 })
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[7], fileNumber: 8 })
                        break
                    case OledReactionType.static:
                        pegmapString = ` OledData(image={0:${this.oledReactionTypeToString(OledReactionType.static)},1:["1.bmp"]})`
                        this.layers[0] = this.display
                        currentClientManager.sendToBackend(ElectronEvents.SaveOled, { fileData: this.layers[0], fileNumber: 1 })
                        break
                }
                break;
            case OledDisplayType.text:
                const oledDataVariables = ["corner_one", "corner_two", "corner_three", "corner_four"]
                try {
                    if (this.textDisplay) {
                        const textMapStr = this.textDisplay.map((section, index) => {

                            return `${oledDataVariables[index]}={0:${this.oledReactionTypeToString(section[0])},1:${JSON.stringify(section[1])}}`
                        })
                        pegmapString = `OledData(${textMapStr.join(",")})`
                    } else {
                        pegmapString = `OledData(${oledDataVariables[0]}={0:OledReactionType.LAYER,1:["error","2","3","4"]},${oledDataVariables[1]}={0:OledReactionType.LAYER,1:["in","2","3","4"]},${oledDataVariables[2]}={0:OledReactionType.LAYER,1:["making","2","3","4"]},${oledDataVariables[3]}={0:OledReactionType.LAYER,1:["display","2","3","4"]})`

                    }
                } catch (error) {
                    pegmapString = `OledData(${oledDataVariables[0]}={0:OledReactionType.LAYER,1:["error","2","3","4"]},${oledDataVariables[1]}={0:OledReactionType.LAYER,1:["in","2","3","4"]},${oledDataVariables[2]}={0:OledReactionType.LAYER,1:["making","2","3","4"]},${oledDataVariables[3]}={0:OledReactionType.LAYER,1:["display","2","3","4"]})`

                }
                break;
        }
        // this is max level jank there is a extra spce in flip value so that true and flase are the same length
        return `# oled\noled_ext = Oled(${pegmapString},toDisplay=${this.oledDisplayTypeToString(this.displayType)},flip=${this.flip ? " True" : "False"})\n# oled`
    }



}