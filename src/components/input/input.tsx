import HelpTooltip from '../../components/helpTooltip/helpTooltip'
import { Show } from 'solid-js'

type InputProps = {
  placeholder?: string
  onChange: (e: any) => void
  value: string
  name: string
  label?: string
  helpText?: string
  className?: string
};

export default function Input(props: InputProps) {
  if (props.label) {


    return (
      <div class="form-control w-full mb-1">
        <label class="label flex items-start self-start">
          <span class={`label-text ${props.helpText ? 'mr-0.5' : ''}`}>{props.label}</span>
          <Show when={props.helpText} fallback={''}>
            <HelpTooltip>Testing how this goes.</HelpTooltip>
          </Show>
        </label>
        <input type="text"
          placeholder={props.placeholder}
          class={`input input-bordered input-sm w-full ${props.className ? props.className : ''}`}
          value={props.value}
          onChange={props.onChange}
          name={props.name}
        />
      </div>
    );
  } else {
    return (
      <div className="mb-1">
        <input type="text"
          placeholder={props.placeholder}
          class="input input-bordered input-sm input-primary w-full max-w-xs"
          value={props.value}
          onChange={props.onChange}
          name={props.name}
        />
      </div>




    );
  }
  // old classnames
  // $inline-block px-2 py-1 border-2  border-purple-600 ${props.selected ? "bg-purple-600 text-white" : " text-purple-600"} font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out

}
