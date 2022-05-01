import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { ProgramSettings } from "../../logic/programSettings";

const programSettings = ProgramSettings.getInstance()
type PppCheckerProps = {
    children: any
    fallback?: any
    false?: boolean
};

export default function PppChecker(props: PppCheckerProps) {
    const [proPlan, setproPlan] = createSignal(programSettings.PPP)

    const updateLocalState = () => {
        setproPlan(programSettings.PPP)
    }
    const subId = programSettings.Subscribe(updateLocalState)
    onCleanup(() => {
        programSettings.Unsubscribe(subId)
    })


    return (
        <Show when={props.false ? !proPlan() : proPlan()} fallback={props.fallback}>
            {props.children}
        </Show>
    );
}
