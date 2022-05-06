

type ToggleProps = {
    label: string;
    value: boolean;
    name: string
    onChange: (e: { target: { name: string, value: boolean } }) => void
};

export default function Toggle(props: ToggleProps) {

    // this works but the css is wack 

    return (
        <div class="form-control">
            <label class="label cursor-pointer">
                <span class="label-text">{props.label}</span>
                <input type="checkbox" class="toggle toggle-primary"
                    name={props.name}
                    checked={props.value}
                    onChange={(e) => {
                        props.onChange({
                            target: {
                                //@ts-ignore
                                name: props.name, value: e.target.checked
                            }
                        })
                    }

                    }
                />
            </label>
        </div>



    );
}
