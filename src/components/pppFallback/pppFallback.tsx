import { onMount, createSignal } from 'solid-js'
import { PropAliases } from 'solid-js/web'
import Button from '../../components/button/button'
import pegLogo from '../../images/peg_logo.svg'

type PppFallbackProps = {
  modal: boolean
}

// const [modal, setModal] = createSignal()
// onCleanup(() => {
//   remoteContentManager.Unsubscribe(subId)
// })

export default function PppFallback(props: PppFallbackProps) {
  return (

    //uncomment this papa to test checking against props
    // <div className={`${props.modal ? 'bg-primary ' : 'border border-base-300 bg-base-200 '} flex flex-col w-full h-full items-center justify-center rounded rounded-xl`}>


    // comment this papa our when you're testing the one above, this works with no props being checked
    <div className={`border border-base-300 bg-base-200 flex flex-col w-full h-full items-center justify-center rounded rounded-xl`}>


      <div className={`bg-base-100 p-[4rem] rounded rounded-xl flex flex-col justify-center items-center content-center relative`}>
        <img src={pegLogo} className='w-[12.5rem] mb-8' alt="peg logo" />
        <h3 className='text-[1.2rem] mb-1'>Peg Pro Account Feature</h3>
        <h4 className='mb-[3.5rem] text-[.9rem] max-w-[26rem] text-center'>In order to use this feature of Peg you must upgrade your account and purchase a license.</h4>
        <Button className='btn-outline btn-success relative animate-bounce' selected={true} onClick={() => { }}>
          {/* <span class="flex absolute -right-[0.2rem] -top-[0.2rem] h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span> */}
          Upgrade Your Account
        </Button>

        <p className='text-[.75rem] mt-[1rem]'>To learn more about our pricing, features, and licenses please visit <span className='text-primary'>peg.software</span>.</p>
      </div>

    </div >
  )
}

