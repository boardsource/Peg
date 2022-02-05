import testAvatar from '../../images/test_account_icon.png'
import ConnectivityStatus from '../connectivityStatus/connectivityStatus'


export default function AccountIcon() {
    return (
        <div className="accounticon flex items-center">
            <div className="accounticon__icon mr-2">
                <img class='w-11' src={testAvatar} alt=" account avatar" />
            </div>
            <div className="accounticon__info">
                <h4 className='text-[13px] leading-4 '>Bolster Boi</h4>
                <p className='text-[11px]'>Basic Account</p>
            </div>
        </div>
    )
}