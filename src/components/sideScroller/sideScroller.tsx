import { For } from "solid-js";
import { proxyDescriptor } from "solid-js/store/types/store";
import { PropAliases } from "solid-js/web";
import Button from '../../components/button/button'

type ScrollerProps = {
  list: object;
  direction?: string;
  stickySide?: string;
  size: string;
}

export default function SideScroller(props: ScrollerProps) {
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
        scrollerContainer flex bg-orange-300 absolute overflow-scroll`}
      style={`
          ${props.size !== undefined ? returnStyles() : ''}
    `}
    ><div className="relative">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique ullam pariatur nostrum sit ipsa incidunt quos quam aliquam beatae, esse, vitae saepe voluptates harum, porro voluptatum repudiandae exercitationem minus officiis?
        Inventore odio iure sunt beatae ipsa porro non dignissimos illo earum quaerat. At praesentium iusto deserunt nam sapiente asperiores quam, illum, ipsa expedita ea ex, sequi a. Quas, est ea.
        Voluptate ducimus maiores voluptas et rerum. Totam deserunt magni quas placeat, expedita impedit obcaecati dolores quaerat tempora odit corrupti alias ipsa assumenda. Repellendus in hic, assumenda esse ullam accusamus incidunt.
        Soluta sed cum deleniti? Explicabo cum suscipit eum voluptates consequatur voluptate earum eos aperiam ratione unde, molestiae libero qui nostrum accusamus neque exercitationem dolores quod assumenda ipsam corporis sunt. Eius!
        Odio vitae aspernatur vel expedita earum repellendus sunt. Asperiores doloremque accusantium illo omnis id quos in eligendi dignissimos vitae, harum cupiditate, reiciendis, corporis fugit. Id iste provident est ipsa vero?
        Nemo nobis qui, dignissimos sit corporis in neque illo reprehenderit esse facilis unde dolore voluptate nam provident cumque ratione eius, ea incidunt architecto doloribus magnam dolorem soluta! Voluptates, rem minus?
        Pariatur architecto accusantium explicabo illum esse totam excepturi incidunt sapiente eaque assumenda, molestiae atque fugiat asperiores possimus deleniti odit maxime magni! Provident odit minus ipsa cumque dolorum excepturi aut quidem!
        Fugiat quidem illum necessitatibus pariatur suscipit placeat, et sit ipsam omnis architecto deleniti ducimus id nam maiores asperiores quis distinctio minima debitis magni animi illo quaerat delectus! Tempora, saepe assumenda.
      </div>

      <For each={props.list} fallback={<div>Loading...</div>}>
        {(key, index) => (
          <div>
            <p>
              code: {key.code}
            </p>
            <p>
              display: {key.display}
            </p>
            <p>
              Description: {key.Description}
            </p>
            <div className="flex">
              {/* <ShareFeature featureType={ShareableFeatureType.keyCodes} keycode={key} />
                 <Button
                   selected={true}
                   onClick={() => {
                     //@ts-ignore
                     keycodes.RemoveCustomCode(key.code)
                   }}>
                   delete
                 </Button> */}
              <p>Complicated Stuff Here</p>
            </div>
          </div>
        )}
      </For>
    </div>
  )
}