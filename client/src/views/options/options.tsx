import MainView from '../../components/mainView/mainView'
import { For, createSignal } from 'solid-js'
import { Notification } from "../../logic/notification";
import { NotificationColor } from '../../types/types'

const notification = Notification.getInstance()

const [layersArray, setLayersArray] = createSignal([1, 2, 3, 4, 5])

export default function Options() {
    return (
        <MainView title="Options">
            <p>options will go here</p>
            <p>testisfng</p>
            <button onClick={() => notification.Show('TESTING', 'this is a test notifiasdfkjsadlfjsadlfjcation', NotificationColor.Green, 5000)}>TEST SHOW</button>
            <div className="testToggle">
                <p>SELECT THEME:</p>
                <div class="dropdown">
                    <select class="select select-primary w-full max-w-xs">
                        <option disabled selected>What is the best TV show?</option>
                        <option>Game of Thrones</option>
                        <option>Lost</option>
                        <option>Breaking Bad</option>
                        <option>Walking Dead</option>
                    </select>
                </div>
                <div className="layer-selector">
                    <For each={layersArray()} fallback={<div>Loading...</div>}>
                        {/* ASK COLE ABOUT STUFF IN () BELOW, ref other component */}
                        {() => (
                            <div className="test"><p>hi</p></div>
                        )}
                    </For>
                </div>

            </div>
        </MainView >
    )
}