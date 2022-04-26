import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { canConstructReadableStream } from "workbox-core/_private";
import { Notification } from "../../logic/notification";
import { NotificationColor } from '../../types/types'

type NotificationDisplayProps = {
  test?: string
}

const notification = Notification.getInstance()

export default function NotificationDisplay(props: NotificationDisplayProps) {
  const [state, setState] = createStore({ visible: notification.visible, title: notification.title, message: notification.message, color: notification.color, duration: notification.duration, progressBarWidth: notification.progressBarWidth });

  const updateLocalState = () => {
    setState({ visible: notification.visible, title: notification.title, message: notification.message, color: notification.color, duration: notification.duration, progressBarWidth: notification.progressBarWidth });
  }
  const subId = notification.Subscribe(updateLocalState)
  onCleanup(() => {
    notification.Unsubscribe(subId)
  })
  const returnNotificationProperties = () => {
    switch (state.color) {
      case NotificationColor.Green:
        return {
          bg: 'bg-green-500',
          border: 'border-green-400',
          progress: 'bg-green-400',
          titleIcon: (
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
            </svg>
          )
        }
      case NotificationColor.Yellow:
        return {
          bg: 'bg-yellow-500',
          border: 'border-yellow-400',
          progress: 'bg-yellow-400',
          titleIcon: (
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation-triangle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
            </svg>
          )
        }
      case NotificationColor.Red:
        return {
          bg: 'bg-red-600',
          border: 'border-red-500',
          progress: 'bg-red-500',
          titleIcon: (
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
            </svg>
          )
        }
      case NotificationColor.Blue:
        return {
          bg: 'bg-blue-600',
          border: 'border-blue-500',
          progress: 'bg-blue-500',
          titleIcon: (
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
            </svg>
          )
        }
    }
  }
  const returnBorder = () => {
    if (state.duration) {
      return ''
    } else {
      return 'border-b'
    }
  }

  return (
    <div className={`notification absolute flex ml-auto mr-auto text-center left-0 right-0 z-50 mt-6 translate-y-[-130%] opacity-0 transition duration-300 ${state.visible ? 'translate-y-[0] opacity-100' : ''}`}>
      <div class={`${returnNotificationProperties().bg} shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3`} id="static-example" role="alert" aria-live="assertive" aria-atomic="true" data-mdb-autohide="false">
        <div className="
        ">
          <div class={`${returnNotificationProperties().bg} flex justify-between items-center py-2 px-3 bg-clip-padding ${returnBorder()} ${returnNotificationProperties().border} rounded-t-lg`}>
            <p class="font-bold text-white flex items-center">
              {returnNotificationProperties().titleIcon}
              {state.title}
            </p>
            <div class="flex items-center content-center">
              <button onClick={() => setState({ visible: false })} type="button" class="btn-close btn-close-white box-content w-5 h-5 ml-3 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline" data-mdb-dismiss="toast" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <Show when={state.duration} fallback={''}>
            <div class="w-full bg-gray-200 h-1">
              <div class={`${returnNotificationProperties().progress} h-1 transition-[width]`} style={`width: ${state.progressBarWidth}%`}>
              </div>
            </div>
          </Show>
        </div>
        <div class={`${returnNotificationProperties().bg} p-3 rounded-b-lg break-words text-white`}>
          {state.message}
        </div>
      </div>
    </div>
  )
}



