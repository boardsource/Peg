import { Toast } from "../../logic/toast";


type ButtonProps = {
    selected: boolean
    onClick: () => void
    children: any

    oledInfo?: boolean
    tinyButtons?: boolean

    disabled?: boolean
    className?: string

    icon?: boolean

};

export default function Button(props: ButtonProps) {
    const returnClasses = () => {
        let classes = `btn mr-1`
        if (props.oledInfo) {
            classes += ` hover:btn-warning`
        } else {
            classes += ` `
        }
        return classes += returnButtonSizes()
    }
    const returnButtonSizes = () => {
        let btnSize = ``
        if (props.tinyButtons) {
            return ` btn-xs`
        } else {
            return ` btn-sm`
        }
    }
    const returnColor = () => {
        let color = ``
        if (props.oledInfo) {
            color += ` btn-warning`
        } else {
            return ` btn-primary`
        }
        return color
    }
    return (
        <button className={`${returnClasses()} ${props.selected ? `${returnColor()}` : ' btn-outline'} ${props.className}`}
            onClick={() => {
                if (props.disabled !== undefined) {
                    if (props.disabled === false) {
                        props.onClick()
                    } else {
                        Toast.Debug("Button Disabled")
                    }
                } else {
                    props.onClick()
                }



            }}
        >
            {props.children}
        </button>
    );
    // old classnames
    // $inline-block px-2 py-1 border-2  border-purple-600 ${props.selected ? "bg-purple-600 text-white" : " text-purple-600"} font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out

}
