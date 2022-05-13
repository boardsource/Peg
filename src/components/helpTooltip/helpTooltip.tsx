import { ToolTip } from '../../logic/tooltip'

const toolTip = ToolTip.getInstance()

type HelpTooltipProps = {
  children: any,
  title?: String
}

export default function HelpTooltip(props: HelpTooltipProps) {
  const mouseEnter = (event: Event) => {
    if (props.children) {
      const description = props.children
      const title = props.title
      //@ts-ignore
      toolTip.Show(event.clientX, event.clientY, title, description)
    }
  }
  const mouseLeave = (event: Event) => {
    if (props.children) {
      toolTip.Hide()
    }
  }
  return (
    <div className="flex self-center">
      <svg xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 fill-slate-300 ml-1 mt-.75"
        viewBox="0 0 20 20"
        fill="currentColor"
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      >
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
    </div>



  )
}