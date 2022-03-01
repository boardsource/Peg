import MainView from '../../components/mainView/mainView'
import { Notification } from "../../logic/notification";
import { NotificationColor } from '../../types/types'

const notification = Notification.getInstance()

export default function Options() {
    return (
        <MainView title="Options">
            <p>options will go here</p>
            <p>testisfng</p>
            <button onClick={() => notification.Show('TESTING', 'this is a test notifiasdfkjsadlfjsadlfjcation', NotificationColor.Green, 5000)}>TEST SHOW</button>
        </MainView >
    )
}