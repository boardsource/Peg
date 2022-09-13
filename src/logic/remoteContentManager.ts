import { FeatureResponse, OledDisplayType, ShareableFeatureType } from "../types/types";
import { ProgramSettings } from "./programSettings";
import axios from "axios"
import { Subscribable } from "./subscribable";
import { Toast } from "./toast";
import { KeyMap } from "./keymapManager";
import { Oled } from "./oled";
import { KeyCodes } from "./keycodes";
import { ShareableFeatureToDisplayWord } from "./helpers";
import { Color } from "./color";


export class RemoteContentManager extends Subscribable {
    featureType: ShareableFeatureType
    keyboard: string
    programSettings: ProgramSettings
    listOfFeatures: FeatureResponse[] = []
    selectedFeature?: FeatureResponse


    constructor(featureType: ShareableFeatureType, keyboard: string) {
        super()
        this.featureType = featureType
        this.keyboard = keyboard
        this.programSettings = ProgramSettings.getInstance()

    }

    public GetFeatureList() {
        axios.get(`${this.programSettings.apiUrl}feature/${this.featureType}`).then(response => {
            if (response.status === 200) {
                this.listOfFeatures = response.data
                this.updateSubScribers()
            } else {
                Toast.Error(`Error in getting community features`)
            }
        }).catch(error => {
            Toast.Error(`Error in getting community features`)

        })

    }

    public GetFeature(feature: FeatureResponse) {
        axios.get(`${this.programSettings.apiUrl}feature/single/${feature._id}`).then(response => {
            if (response.status === 200) {
                this.selectedFeature = { ...feature, code: response.data }
                this.updateSubScribers()
            } else {
                Toast.Error(`Error in getting community features`)
            }
        }).catch(error => {
            Toast.Error(`Error in getting community features`)

        })
    }
    pingDownload() {
        if (this.selectedFeature !== undefined) {
            axios.get(`${this.programSettings.apiUrl}feature/logdownload/${this.selectedFeature?._id}`).then(_ => {

            }).catch(error => {
                console.log("error posting download stat", error)
            })
        }
    }

    ApplyFeature() {
        const keymap = KeyMap.getInstance()
        const layout = keymap.keyLayout.features
        const keycodes = KeyCodes.getInstance()
        if (this.selectedFeature?.code) {
            this.pingDownload()
            try {
                switch (this.featureType) {
                    case ShareableFeatureType.keyMaps:
                        Toast.Debug(`old keymap length ${keymap.keymap.length}`)
                        if (layout.name === this.selectedFeature.keyboard) {
                            const keymap = JSON.parse(this.selectedFeature?.code)
                            const fullKeymap = keymap.map((layerString: String) => {
                                const strCodesForLayer = keycodes.SwapCustoms(layerString.replaceAll("[", "").replaceAll("]", "")).split(",")
                                return strCodesForLayer.map(stringCode => keycodes.KeyCodeForString(stringCode))
                            })
                            keymap.keymap = fullKeymap
                            Toast.Debug(`new keymap length ${keymap.keymap.length}`)
                        } else {
                            Toast.Error(`Currently we dont support adding a keymap from another keyboard.`)
                        }


                        break;

                    case ShareableFeatureType.ledMaps:
                        Toast.Debug(`old ledMap length ${keymap.ledMap.length}`)
                        if (layout.name === this.selectedFeature.keyboard && layout.perkey) {
                            const ledmap = JSON.parse(this.selectedFeature?.code)
                            keymap.ledMap = ledmap.map((tempColor:{r:number,g:number,b:number})=>new Color(tempColor.r,tempColor.g,tempColor.b))
                            Toast.Debug(`new ledMap length ${keymap.ledMap.length}`)
                        } else {
                            Toast.Error(`Currently we dont support adding a ledmap from another keyboard.`)
                        }

                        break;

                    case ShareableFeatureType.keyCodes:
                        const newCode = JSON.parse(this.selectedFeature?.code)
                        keycodes.AddCustomCode(newCode)

                        break;

                    case ShareableFeatureType.oleds:
                        if (layout.oled) {
                            const oled = new Oled();
                            const oledData = JSON.parse(this.selectedFeature?.code)
                            oled.displayType = oledData.displayType
                            oled.imgReactionType = oledData.imgReactionType
                            if (oledData.displayType === OledDisplayType.image) {
                                oled.layers = oledData.display
                            } else if (oledData.displayType === OledDisplayType.text) {
                                oled.textDisplay = oledData.display
                            }
                            keymap.oled = oled

                        } else {
                            Toast.Error(`Your currently selected keyboard does not support Oleds 
                    I dont know how you got here but sorry cant just add them with code`)

                        }
                        break;

                    case ShareableFeatureType.codeBlocks:

                        const codeBlock = JSON.parse(this.selectedFeature?.code).codeblock
                        if (keymap.codeBlock === undefined) {
                            keymap.codeBlock = []
                        }

                        keymap.codeBlock.push(codeBlock)
                        break;


                }
                Toast.Success(`Updated your keyboard with the new ${ShareableFeatureToDisplayWord(this.featureType)}`)
                this.selectedFeature = undefined
            } catch (error) {
                Toast.Error(`There was an error adding the feature to your board`)
            }
        }

    }

}
