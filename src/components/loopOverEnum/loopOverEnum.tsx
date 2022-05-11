import { For } from "solid-js";
import Button from '../../components/button/button'

type LoopOverEnumProps = {
  className?: string;
  enum: any
  selected: string
  defaultButtons?: boolean
  children?: any
  childrenClassName?: string;
  childrenSelectedClassName?: string;
  buttonOnClick?: (selectedValue: any) => void;
  tinyButtons?: boolean
  oledInfo?: boolean
};


export default function LoopOverEnum(props: LoopOverEnumProps) {
  const renderDefault = (key: string) => {
    if (props.defaultButtons) {

      return (<Button tinyButtons={props.tinyButtons} oledInfo={props.oledInfo} selected={props.selected === props.enum[key]}
        onClick={() => {
          props.buttonOnClick(props.enum[key])
        }}>
        {key}
      </Button>)
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


