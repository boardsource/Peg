import { For, Show } from "solid-js";
import { proxyDescriptor } from "solid-js/store/types/store";
import { PropAliases } from "solid-js/web";
import Button from '../button/button'

type ScrollerProps = {
  list: object;
  direction?: string;
  stickySide?: string;
  size: string;
  children?: any
  title?: string,
}

export default function Scroller(props: ScrollerProps) {
  const returnStickySide = () => {
    switch (props.stickySide) {
      case 'right':
        return 'right-0 flex-col'
      case 'left':
        return 'left-0 flex-col'
      case 'top':
        return 'top-0'
      case 'bottom':
        return 'bottom-0'
      default:
        return 'right-0 flex-col'
    }
  }

  const returnStyles = () => {
    let styles = ``
    if (props.size) {
      if (props.stickySide === 'top' || props.stickySide === 'bottom') {
        styles += `height: ${props.size}px; width: 100%;`
      } else {
        styles += `width: ${props.size}px; height: 100%;`
      }
    }
    return styles
  }

  return (
    <div className={`
        ${props.direction ? props.direction === 'vertical' ? 'flex-col' : '' : ''}
        ${props.stickySide !== undefined ? returnStickySide() : 'right-0'}
        scrollerContainer flex absolute h-full pb-4 pl-4 pr-4 w-full overflow-scroll`}
      style={`
          ${props.size !== undefined ? returnStyles() : ''}
    `}
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