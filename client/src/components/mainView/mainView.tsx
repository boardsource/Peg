// import anime from 'animejs/lib/anime.es.js';
import { onMount } from 'solid-js'
// import { Transition } from 'solid-transition-group'
import { createSignal } from 'solid-js'


type MainViewProps = {
    title: string,
    description?: string,
    children: any
}

export default function MainView(props: MainViewProps) {
    // onMount(() => {
    //     toggleShow(true)
    // })
    // const [show, toggleShow] = createSignal(false)
    //onClick={() => toggleShow(!show())}

    const runNotification = () => {
        console.log('hi')
    }
    return (
        <div className="mainview flex flex-col bg-red-100 flex-1 items-start">
            <h1 className="flex mb-4 text-xl text-[22px] mb-3 tracking-wide truncate">
                {props.title}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-slate-300 ml-1 mt-.75" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
            </h1>
            <p className='text-slate-400 text-sm'>{props.description}</p>
            {props.children}

            {/* {show() && ( */}

            {/* )} */}
            {/* </Transition> */}

        </div>
    )
}

