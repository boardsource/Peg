type SeparatorProps = {
    title: string
}

export default function Separator(props: SeparatorProps) {
    return (
        <div className="mb-3 mt-5 border-b border-b-purple-500">
            <p class='text-[12px] text-gray-400'>{props.title.toUpperCase()}</p>
        </div>
    )
}