
type ParagraphProps = {
    truncate?: number
    className?: string
    children: any

}

export default function Paragraph(props: ParagraphProps) {
    const returnText = () => {
        if (props.truncate !== undefined && props.children.length > props.truncate) {

            //trim the string to the maximum length
            let trimmedString = props.children.substring(0, props.truncate);

            //re-trim if we are in the middle of a word
            trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
            return trimmedString
        } else {
            return props.children
        }
    }
    return (
        <p>
            {returnText()}
        </p>
    )
}