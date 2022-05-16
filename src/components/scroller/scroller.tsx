import { Show } from "solid-js";

import { ScrollerDirection, ScrollerSides } from "../../types/types";

type ScrollerProps = {
  direction?: ScrollerDirection;
  stickySide?: ScrollerSides;
  size?: string;
  children: any
  title?: string,
}

export default function Scroller(props: ScrollerProps) {
  const returnStickySide = () => {
    switch (props.stickySide) {
      case ScrollerSides.Left:
        return 'left-0 flex-col'
      case ScrollerSides.Top:
        return 'top-0'
      case ScrollerSides.Bottom:
        return 'bottom-0'
      case ScrollerSides.Right:
        return 'right-0 flex-col'
      default:
        return 'right-0'
    }
  }

  const returnStyles = () => {
    let styles = ``
    if (props.size) {
      if (props.stickySide === ScrollerSides.Top || props.stickySide === ScrollerSides.Bottom) {
        styles += `height: ${props.size}px; width: 100%;`
      } else if (props.stickySide === ScrollerSides.Left || props.stickySide === ScrollerSides.Right) {
        styles += `width: ${props.size}px; height: 100%;`
      }
    }
    return styles
  }

  return (
    <div className={`
        ${props.direction === ScrollerDirection.Vertical ? 'flex-col' : ''}
        ${returnStickySide()}
        scrollerContainer flex absolute h-full pb-4 pl-4 pr-4 w-full overflow-scroll`}
      style={returnStyles()}
    >
      <Show when={props.title} fallback={''}>
        <div className="flex z-10 sticky top-0 w-full bg-base-100 pt-4 pb-1 mb-1.5">
          <h3 className='text-lg'>{props.title}</h3>
        </div>
      </Show>
      <div className="relative">
        {props.children}
      </div>
    </div>
  )
}