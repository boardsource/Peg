import { createSignal } from 'solid-js'
import MainView from '../../components/mainView/mainView'
import OledDisplay from '../../components/oled/oledDisplay/oledDisplay'
import OledImageUpLoader from '../../components/oled/oledImageUploader/oledImageUpLoader'
import { Oled } from '../../types/types'

export default function OLED() {
    const [oled, setOled] = createSignal<Oled>([])
    return (
        <MainView title='OLED' description={""}>
            <OledDisplay oled={oled} />
            <OledImageUpLoader setOled={setOled} />
        </MainView>

    )
}