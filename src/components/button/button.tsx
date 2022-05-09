import { Toast } from "../../logic/toast";


type ButtonProps = {
    selected: boolean
    onClick: () => void
    children: any
    disabled?: boolean
    className?: string
};

export default function Button(props: ButtonProps) {
    return (
        <button className={`btn btn-sm btn-outline btn-primary ${props.className}`}
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
