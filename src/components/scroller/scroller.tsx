import { For } from "solid-js";
import { proxyDescriptor } from "solid-js/store/types/store";
import { PropAliases } from "solid-js/web";
import Button from '../button/button'

type ScrollerProps = {
  list: object;
  direction?: string;
  stickySide?: string;
  size: string;
  children?: any
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
        scrollerContainer flex absolute h-full p-4`}
      style={`
          ${props.size !== undefined ? returnStyles() : ''}
    `}
    ><div className="relative">
        {props.children}
      </div>
    </div>
  )
}