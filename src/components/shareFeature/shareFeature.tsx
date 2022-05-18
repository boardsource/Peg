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
import Textarea from '../textarea/textarea'

const keymap = KeyMap.getInstance()
const keycodes = KeyCodes.getInstance()
const clientManager = ClientManager.getInstance()

type ShareFeatureProps = {
    featureType: ShareableFeatureType
    keycode?: KeyCode
    codeBlock?: string,
    className?: string,
    fullWidthButton?: boolean,
    iconButton?: boolean,
    tinyButtons?: boolean
    btnClasses?: string,

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
                    className='input-primary'
                    value={title()}
                    placeholder={`My Awesome ${ShareableFeatureToDisplayWord(props.featureType)}`}
                    onChange={(e: any) => {//@ts-ignore
                        setTitle(e.target.value)
                    }}
                />

                <Input
                    label="Creator:"
                    name="Creator"
                    className='input-primary'
                    value={creator()}
                    placeholder={randomNameGen()}
                    onChange={(e: any) => {//@ts-ignore
                        setCreator(e.target.value)
                    }}
                />


            </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Description:</span>

                </label>
                <Textarea
                    onChange={e => {//@ts-ignore
                        setDescription(e.target.value)
                    }}
                    className="textarea textarea-primary" placeholder="Your description"></Textarea>

            </div>

            <div className="flex w-full justify-end">
                <Button selected={title() !== "" && description() !== "" && creator() !== ""} disabled={title() === "" || description() === "" || creator() === ""}
                    icon
                    className={`btn-outline, mt-4 w-[200px] ${title() !== "" && description() !== "" && creator() !== "" ? 'btn-success btn-outline' : 'btn-outline'}`}
                    onClick={() => {
                        remoteContentPoster(title(), description(), creator(), returnCode(props.featureType, description(), title(), props.keycode, props.codeBlock), props.featureType)
                        props.close()
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-[.45rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>

                    Share
                </Button>
            </div>

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
        modal.Open(`Share Your ${ShareableFeatureToDisplayWord(props.featureType)}`, true, (
            <ShareModal featureType={props.featureType} keycode={props.keycode} codeBlock={props.codeBlock} close={() => modal.Close()} />))
    }

    return (
        <div className="ShareFeature">
            <Show when={isOnLine()} fallback={"You are currently off line and can not share."}>
                <Button className={`${props.fullWidthButton ? 'w-full' : ''} ${props.iconButton ? 'gap-2' : ''}} ${props.btnClasses}`} tinyButtons={props.tinyButtons} onClick={share} selected={true}>
                    <Show when={props.iconButton} fallback={''}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-[.45rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </Show>
                    Share
                </Button>

            </Show>

        </div>

    );
}
