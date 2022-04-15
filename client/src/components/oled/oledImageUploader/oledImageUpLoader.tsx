import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { KeyMap } from "../../../logic/keymapManager";
import { OledPixel } from "../../../types/types";

const keymap = KeyMap.getInstance()
type OledImageUpLoaderProps = {
    currentLayer: () => number

};


export default function OledImageUpLoader(props: OledImageUpLoaderProps) {
    let canvasEl: any = null

    const [selectedImage, setSelectedImage] = createSignal()

    const addImageToCanvas = (img: HTMLImageElement) => {
        if (canvasEl !== null) {
            const ctx = canvasEl.getContext('2d');
            ctx.drawImage(selectedImage(), 0, 0)
            const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
            const data = imageData.data;
            if (keymap.oled) {
                keymap.oled.DataToPegMap(data, props.currentLayer())
            }

        } else {
            console.log("duck this im out")
        }
    }
    const uploadImage = (e: Event) => {
        //@ts-ignore
        const file = e.target.files[0]
        const imageUrl = URL.createObjectURL(file)
        const image = new Image()
        image.src = imageUrl
        setSelectedImage(image)
        // idk why this is needed
        setTimeout(() => {
            addImageToCanvas(image)
        }, 500);
    }

    return (
        <div className="oledImageUpLoader">
            <canvas ref={canvasEl} width="128" height="32" className="hidden "></canvas>

            <input type="file"
                onChange={uploadImage}
                accept="image/png, image/jpeg, image/bmp" />
        </div>
    );
}


