import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { ClientManager } from "../../logic/clientManager";
import { randomNameGen, remoteContentPoster, ShareableFeatureToDisplayWord } from "../../logic/helpers";
import { KeyCodes } from "../../logic/keycodes";
import { KeyMap } from "../../logic/keymapManager";
import { Modal } from "../../logic/modal";
import { KeyCode, OledDisplayType, ShareableFeatureType } from "../../types/types";
import Button from "../button/button";
import Input from "../input/input";
const keymap = KeyMap.getInstance()
const keycodes = KeyCodes.getInstance()
const clientManager = ClientManager.getInstance()

type ShareFeatureProps = {
    featureType: ShareableFeatureType
    keycode?: KeyCode
    codeBlock?: string

};

const returnCode = (featureType: ShareableFeatureType, description: string, title: string, keycode?: KeyCode, codeBlock?: string) => {
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
            return JSON.stringify({ codeblock: `\n"""\n${title}\n${description}\n"""\n${codeBlock}` })

    }
}
type ShareModalProps = {
    featureType: ShareableFeatureType
    keycode?: KeyCode
    codeBlock?: string
    close: () => void

}

const ShareModal = (props: ShareModalProps) => {
    const [title, setTitle] = createSignal(""), [creator, setCreator] = createSignal(""), [description, setDescription] = createSignal("")
    return (
        <div>
            <div class="mb-3 xl:w-96">
                <Input
                    label="Title:"
                    name="Title"

                    value={title()}
                    placeholder={`My Awesome ${ShareableFeatureToDisplayWord(props.featureType)}`}
                    onChange={(e: any) => {//@ts-ignore
                        setTitle(e.target.value)
                    }}
                />

                <Input
                    label="Creator:"
                    name="Creator"
                    value={creator()}
                    placeholder={randomNameGen()}
                    onChange={(e: any) => {//@ts-ignore
                        setCreator(e.target.value)
                    }}
                />


            </div>

            <br />
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Description:</span>

                </label>
                <textarea
                    onChange={e => {//@ts-ignore
                        setDescription(e.target.value)
                    }}
                    class="textarea textarea-primary" placeholder="Your description"></textarea>

            </div>


            <Button selected={title() !== "" && description() !== "" && creator() !== ""} disabled={title() === "" || description() === "" || creator() === ""}

                className={'btn-outline'}
                onClick={() => {
                    remoteContentPoster(title(), description(), creator(), returnCode(props.featureType, description(), title(), props.keycode, props.codeBlock), props.featureType)
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
            <ShareModal featureType={props.featureType} keycode={props.keycode} codeBlock={props.codeBlock} close={() => modal.Close()} />))
    }

    return (
        <div className="ShareFeature">
            <Show when={isOnLine()} fallback={"You are currently off line and can not share."}>
                <Button className={'btn-outline'} onClick={share} selected={true}>
                    Share
                </Button>

            </Show>

        </div>

    );
}
