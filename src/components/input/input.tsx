

type InputProps = {
    placeholder?: string
    onChange: (e: any) => void
    value: string
    name: string
    label?: string
};

export default function Input(props: InputProps) {
    if (props.label) {


        return (
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">{props.label}</span>
                </label>
                <input type="text"
                    placeholder={props.placeholder}
                    class="input input-bordered input-primary w-full max-w-xs"
                    value={props.value}
                    onChange={props.onChange}
                    name={props.name}
                />

            </div>


        );
    } else {
        return (

            <input type="text"
                placeholder={props.placeholder}
                class="input input-bordered input-primary w-full max-w-xs"
                value={props.value}
                onChange={props.onChange}
                name={props.name}
            />



        );
    }
    // old classnames
    // $inline-block px-2 py-1 border-2  border-purple-600 ${props.selected ? "bg-purple-600 text-white" : " text-purple-600"} font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out

}
