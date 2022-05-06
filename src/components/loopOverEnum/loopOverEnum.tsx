import { For } from "solid-js";
type LoopOverEnumProps = {
    className?: string;
    enum: any
    selected: string
    defaultButtons?: boolean
    children?: any
    childrenClassName?: string;
    childrenSelectedClassName?: string;
    buttonOnClick?: (selectedValue: any) => void
};


export default function LoopOverEnum(props: LoopOverEnumProps) {
    const renderDefault = (key: string) => {
        if (props.defaultButtons) {

            return (<button className={`$inline-block px-2 py-1 border-2  border-purple-600 
            ${//@ts-ignore
                props.selected === props.enum[key] ? "bg-purple-600 text-white" : " text-purple-600"} 
            font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 
            focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                onClick={() => {
                    //@ts-ignore
                    props.buttonOnClick(props.enum[key])

                }}
            >
                {key}
            </button>)
        } else {
            return (<div className={`loopOverEnum__single 
            
            ${//@ts-ignore
                props.childrenClassName} ${key} ${props.selected === props.enum[key] ?
                    `selected ${props.childrenSelectedClassName}` : ""} `}
            >
                {props.children}
            </div>)
        }
    }
    return (
        <div className={`loopOverEnum flex ${props.className}`}>

            <For each={Object.keys(props.enum).filter((item) => isNaN(Number(item)))} fallback={<div>Loading...</div>}>
                {(key) => (
                    <>
                        {renderDefault(key)}
                    </>
                )}
            </For>

        </div>
    );
}


