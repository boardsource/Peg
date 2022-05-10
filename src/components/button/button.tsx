

type ButtonProps = {
    selected: boolean
    onClick: () => void
    children: any
    selectOne?: boolean
    tinyButtons?: boolean
};

export default function Button(props: ButtonProps) {
    const returnClasses = () => {
        let classes = `btn`
        if (props.selectOne) {
            classes += ` btn-warning mr-1`
            if (props.selected) {
                classes += ' btn-warning'
            } else {
                classes += ` btn-outline`
            }
        }
        else {
            classes += ` btn-primary btn-outline`
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
    return (
        <button className={`${returnClasses()}`}
            onClick={() => {
                props.onClick()
            }}
        >
            {props.children}
        </button>
    );
    // old classnames
    // $inline-block px-2 py-1 border-2  border-purple-600 ${props.selected ? "bg-purple-600 text-white" : " text-purple-600"} font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out

}
