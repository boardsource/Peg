import HelpTooltip from '../../components/helpTooltip/helpTooltip'
import { Show } from 'solid-js'

type TextareaProps = {
  placeholder?: string
  onChange: (e: any) => void
  value: string
  name: string
  label?: string
  helpText?: string
}

export default function Textarea(props: TextareaProps) {
  if (props.label) {


    return (
      <div class="form-control w-full  mb-1">
        <label class="label flex items-start self-start">
          <span class={`label-text ${props.helpText ? 'mr-0.5' : ''}`}>{props.label}</span>
          <Show when={props.helpText} fallback={''}>
            <HelpTooltip>Testing how this goes.</HelpTooltip>
          </Show>
        </label>
        <textarea
          placeholder={props.placeholder}
          class="textarea textarea-bordered resize-none"
          value={props.value}
          onChange={props.onChange}
          name={props.name}
        />

      </div>


    );
  } else {
    return (
      <textarea
        placeholder={props.placeholder}
        class="textarea textarea-bordered resize-none  mb-1"
        value={props.value}
        onChange={props.onChange}
        name={props.name}
      />




    );
  }

}