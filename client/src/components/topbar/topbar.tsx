import Searchbar from '../searchbar/searchbar'
import ConnectivityStatus from '../connectivityStatus/connectivityStatus'
import AccountIcon from '../accountIcon/accountIcon'

export default function Topbar() {
    return (
        <div className="topbar flex w-f flex-1 items-center justify-between">
            <Searchbar />

            <div className="topbar__right flex">
                <div className="topbar__right__connectivitystatus self-center mr-6">
                    <ConnectivityStatus />
                </div>
                <AccountIcon />
            </div>
        </div>
    )
}