import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { remoteContentPoster, ShareableFeatureToDisplayWord } from "../../logic/helpers";
import { KeyMap } from "../../logic/keymapManager";
import { Modal } from "../../logic/modal";
import { OledDisplayType, ShareableFeatureType } from "../../types/types";
import Button from "../button/button";
const keymap = KeyMap.getInstance()
type ShareFeatureProps = {
    featureType: ShareableFeatureType
};

const returnCode = (featureType: ShareableFeatureType) => {
    switch (featureType) {
        case ShareableFeatureType.keyMaps:
            return ""
        case ShareableFeatureType.ledMaps:
            return ""
        case ShareableFeatureType.keyCodes:
            return ""
        case ShareableFeatureType.oleds:
            const dataToReturn = {
                display: keymap.oled?.displayType === OledDisplayType.image ?
                    keymap.oled?.layers : keymap.oled?.textDisplay,
                imgReactionType: keymap.oled?.imgReactionType
            }
            return JSON.stringify(dataToReturn)
        case ShareableFeatureType.codeBlocks:
            return ""

    }
}
type ShareModalProps = {
    featureType: ShareableFeatureType

}

const ShareModal = (props: ShareModalProps) => {
    const [title, setTitle] = createSignal(""), [description, setDescription] = createSignal("")
    return (
        <div>
            <div class="mb-3 xl:w-96">
                <label for="title" class="form-label inline-block mb-2 text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                    id="title"
                    placeholder={`My Awesome ${ShareableFeatureToDisplayWord(props.featureType)}`}
                    onChange={e => {//@ts-ignore
                        setTitle(e.target.value)
                    }}
                />
            </div>

            <br />
            <div class="mb-3 xl:w-96">
                <label for="description" class="form-label inline-block mb-2 text-gray-700">
                    Description
                </label>
                <textarea
                    onChange={e => {//@ts-ignore
                        setDescription(e.target.value)
                    }}
                    class="form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    id="description"
                    rows="3"
                    placeholder="Your description"
                ></textarea>
            </div>
            <Button selected={title() !== "" && description() !== ""} onClick={() => remoteContentPoster(title(), description(), returnCode(props.featureType), props.featureType)}>
                Save
            </Button>
        </div>)
}

export default function ShareFeature(props: ShareFeatureProps) {

    const share = () => {
        const modal = Modal.getInstance()
        modal.Open(`Share your ${ShareableFeatureToDisplayWord(props.featureType)}`, true, (
            <ShareModal featureType={props.featureType} />))
    }

    return (
        <div className="ShareFeature">
            <Button onClick={share} selected={true}>
                share
            </Button>

        </div>

    );
}
