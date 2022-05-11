import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { ClientManager } from "../../logic/clientManager";
import { remoteContentPoster, ShareableFeatureToDisplayWord } from "../../logic/helpers";
import { KeyCodes } from "../../logic/keycodes";
import { KeyMap } from "../../logic/keymapManager";
import { Modal } from "../../logic/modal";
import { KeyCode, OledDisplayType, ShareableFeatureType } from "../../types/types";
import Button from "../button/button";
const keymap = KeyMap.getInstance()
const keycodes = KeyCodes.getInstance()
const clientManager = ClientManager.getInstance()

type ShareFeatureProps = {
    featureType: ShareableFeatureType
    keycode?: KeyCode
};

const returnCode = (featureType: ShareableFeatureType, keycode?: KeyCode) => {
    switch (featureType) {
        case ShareableFeatureType.keyMaps:
            return JSON.stringify(keymap.layersToString())
        case ShareableFeatureType.ledMaps:
            return JSON.stringify(keymap.ledMap)
        case ShareableFeatureType.keyCodes:
            return JSON.stringify(keycode)
        case ShareableFeatureType.oleds:
            const dataToReturn = {
                displayType: keymap.oled?.displayType,
                display: keymap.oled?.displayType === OledDisplayType.image ?
                    keymap.oled?.layers : keymap.oled?.textDisplay,
                imgReactionType: keymap.oled?.imgReactionType
            }
            return JSON.stringify(dataToReturn)
        case ShareableFeatureType.codeBlocks:
            return JSON.stringify({ codeblock: keymap.codeBlock })

    }
}
type ShareModalProps = {
    featureType: ShareableFeatureType
    keycode?: KeyCode
    close: () => void

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
            <Button oneOffClasses={'btn-outline'} selected={title() !== "" && description() !== ""}
                onClick={() => {
                    remoteContentPoster(title(), description(), returnCode(props.featureType, props.keycode), props.featureType)
                    props.close()
                }}>
                Save
            </Button>
        </div>)
}

export default function ShareFeature(props: ShareFeatureProps) {
    const [isOnLine, setIsOnLine] = createSignal(clientManager.isOnLine)

    const subId = clientManager.Subscribe(() => {
        setIsOnLine(clientManager.isOnLine)
    })

    onCleanup(() => {
        clientManager.Unsubscribe(subId)
    })
    const share = () => {
        const modal = Modal.getInstance()
        modal.Open(`Share your ${ShareableFeatureToDisplayWord(props.featureType)}`, true, (
            <ShareModal featureType={props.featureType} keycode={props.keycode} close={() => modal.Close()} />))
    }

    return (
        <div className="ShareFeature">
            <Show when={isOnLine()} fallback={"You are currently off line and can not share."}>
                <Button oneOffClasses={'btn-outline'} onClick={share} selected={true}>
                    Share
                </Button>

            </Show>

        </div>

    );
}
