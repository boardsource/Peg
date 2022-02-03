import { connect } from 'http2'
import StatusIndicator from './statusIndicator/statusIndicator'

type ConnectivityStatus = {
    internetConnection: boolean,
    boardConnected: boolean,
    keyboard: string,
}

const connectivityStatus: ConnectivityStatus = {
    internetConnection: true,
    boardConnected: true,
    keyboard: 'Corne LP'
}


const renderStatus = () => {
    if (connectivityStatus.boardConnected) {
        if (connectivityStatus.internetConnection) {
            //internet and board connected
            return <StatusIndicator status='board connected with internet' keyboard={connectivityStatus.keyboard} />
        } else {
            //no internet but board connected
            return <StatusIndicator status='board connected without internet' />
        }
    } else {
        if (connectivityStatus.internetConnection) {
            //internet and no board connected
            return <StatusIndicator status='no board connected with internet' />

        } else {
            //no internet and no board connected
            return <StatusIndicator status='no board connected without internet' />
        }
    }
}

export default function ConnectivityStatus() {
    return (
        <>
            {renderStatus()}
        </>


    )
}