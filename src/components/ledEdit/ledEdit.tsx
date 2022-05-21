import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import HelpText from '../../components/helpText/helpText'
import { KeyMap } from "../../logic/keymapManager";
import { KeyCode, LayoutKey } from "../../types/types"
import "color-picker-web-component"
import { ClientManager } from "../../logic/clientManager";
import { Color } from "../../logic/color";
import UsableLedColors from "../usableLedColors/usableLedColors";
import Button from "../button/button";
import { ProgramSettings } from "../../logic/programSettings";
import { Toast } from "../../logic/toast";
const programSettings = ProgramSettings.getInstance()
const clientManager = ClientManager.getInstance()
type LedEditProps = {

};

export default function LedEdit(props: LedEditProps) {
    const [currentColor, setCurrentColor] = createStore({ r: 0, g: 0, b: 0 }),
        [ppp, SetPpp] = createSignal(programSettings.PPP)
    const updateLocalChangesMade = () => {
        SetPpp(programSettings.PPP)
    }
    const subId = programSettings.Subscribe(updateLocalChangesMade)
    onCleanup(() => {
        programSettings.Unsubscribe(subId)
    })
    const setColor = () => {
        clientManager.NoticeToUpdateKey(new Color(currentColor.r, currentColor.g, currentColor.b))
    }
    const setAllToColor = () => {
        clientManager.ForceAllLedChange(new Color(currentColor.r, currentColor.g, currentColor.b))
    }
    const colorChange = (e: any) => {
        const [r, g, b] = e.detail.value.substring(0, e.detail.value.length - 1).substring(4).split(",")
        setCurrentColor({ r, g, b })
    }

    return (
        <div className="LedEdit flex flex-1" >
            {/* <Button selected={changesMade()} onClick={saveMap}>
                Save
            </Button> */}


            <div className="LedEdit__colorPicker flex">
                {/*@ts-ignore*/}
                <color-picker
                    onChange={colorChange}
                    id="picker"
                    value="#ff0000"
                    formats="rgb"
                    style='height: 100%'
                >
                    {/*@ts-ignore*/}
                </color-picker>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-1">
                    <div className="LedEdit__control mx-5 flex flex-col">
                        <Button className='mb-2 btn-outline' onClick={setColor} selected={ppp()} disabled={!ppp()} disabledOnClick={() => {
                            Toast.Warn("Single key changes can only be made with a pro account")
                        }}>
                            Apply
                        </Button>

                        <br />
                        <Button className='btn-outline' onClick={setAllToColor} selected={true}>
                            Apply To All
                        </Button>


                    </div>
                    <div className="LedEdit__usable flex flex-col flex-1 border rounded rounded-xl p-4" >
                        <h2 className='text-lg mb-3'>Applied Colors</h2>
                        <UsableLedColors />
                    </div>
                </div>
                <div className="ml-5 mt-2">
                    <HelpText>
                        Select a Key from Layout, choose or input color code into color picker and click 'APPLY' to begin setting individual key colors. Select 'U' from the Layer Selector panel to set Underglow LED colors.
                    </HelpText>
                </div>

            </div>





        </div>
    );
}
