import { KeyCode, ShareableFeatureType } from "../types/types";
import { Color } from "./color";
import { KeyMap } from "./keymapManager";
import { ProgramSettings } from "./programSettings";
import axios from "axios"
import { Toast } from "./toast";


export const isColor = (color: any): color is Color => "r" in color
export const isKeyCode = (keyCode: any): keyCode is KeyCode => "code" in keyCode
export const ShareableFeatureToDisplayWord = (featureType: ShareableFeatureType) => {
    switch (featureType) {
        case ShareableFeatureType.keyMaps:
            return "Key Map"
        case ShareableFeatureType.ledMaps:
            return "Led Map"
        case ShareableFeatureType.keyCodes:
            return "Keycode"
        case ShareableFeatureType.oleds:
            return "Oled"
        case ShareableFeatureType.codeBlocks:
            return "Code Block"

    }

}
export const remoteContentPoster = async (title: string,
    description: string,
    code: string,
    featureType: ShareableFeatureType
) => {

    let universal: boolean = true, displayWord: string = ShareableFeatureToDisplayWord(featureType)
    switch (featureType) {
        case ShareableFeatureType.keyMaps:
            universal = false
            break
        case ShareableFeatureType.ledMaps:
            universal = false
            break
        default:
            universal = true
            break;
    }

    const programSettings = ProgramSettings.getInstance()
    const keyboard = KeyMap.getInstance().keyLayout.features.name
    const version = programSettings.version

    const payload = {
        title,
        description,
        keyboard,
        universal,
        code,
        version,
        featureType
    }

    axios.post(`${programSettings.apiUrl}feature`, payload).then(response => {
        if (response.status === 200) {
            Toast.Success(`Posted your ${displayWord}`)
        } else {
            Toast.Error(`Error in posting your ${displayWord}`)

        }
    }).catch(error => {
        console.log("error in posting ")
        Toast.Error(`Error in posting your ${displayWord}`)
    })


}
