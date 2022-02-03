import testAvatar from '../../images/test_account_icon.png'


export default function AccountIcon() {
    return (
        <div className="accounticon flex items-center">
            <div className="accounticon__icon mr-2">
                <img class='w-11' src={testAvatar} alt=" account avatar" />
            </div>
            <div className="accounticon__info">
                <h4 class='text-[13px] leading-4'>Bolster Boi</h4>
                <p class='text-[11px]'>Basic Account</p>
            </div>
        </div>
    )
}