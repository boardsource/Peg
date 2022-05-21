import { createSignal, onCleanup } from 'solid-js'
import { ProgramSettings } from '../../logic/programSettings'
const programSettings = ProgramSettings.getInstance()

export default function AccountIcon() {
    const [proPlan, setproPlan] = createSignal(programSettings.PPP)

    const updateLocalState = () => {
        setproPlan(programSettings.PPP)
    }
    const subId = programSettings.Subscribe(updateLocalState)
    onCleanup(() => {
        programSettings.Unsubscribe(subId)
    })


    return (
        <div className="accounticon flex items-center">

            <div className="accounticon__info">
                {/* <h4 className='text-[13px] leading-4 '>Bolster Boi</h4> */}
                <p className='text-[11px]'>{proPlan() ? "Pro Account" : "Basic Account"}</p>
            </div>
        </div>
    )


    // return (
    //     <div className="accounticon flex items-center">
    //         <div className="accounticon__icon mr-2">
    //             <img class='w-11' src={testAvatar} alt=" account avatar" />
    //         </div>
    //         <div className="accounticon__info">
    //             <h4 className='text-[13px] leading-4 '>Bolster Boi</h4>
    //             <p className='text-[11px]'>Basic Account</p>
    //         </div>
    //     </div>
    // )

}