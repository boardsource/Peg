

type ToggleProps = {
    label: string;
    value: boolean;
    name: string
    onChange: (e: { target: { name: string, value: boolean } }) => void
};

export default function Toggle(props: ToggleProps) {

    // this works but the css is wack 

    return (
        <div class="form-control items-start">
            <label class="label cursor-pointer p-0">
                <span className="label-text mr-1.5">{props.label}</span>
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
