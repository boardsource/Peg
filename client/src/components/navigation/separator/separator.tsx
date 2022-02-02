export default function Separator(props: title) {
    return (
        <div className="mb-3 mt-5 border-b border-b-purple-500">
            <p class='text-[12px] text-gray-400'>{props.title.toUpperCase()}</p>
        </div>

    )

}