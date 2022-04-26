

type ToggleProps = {
    label: string;
    value: boolean;
    name: string
    onChange: (e: { target: { name: string, value: boolean } }) => void
};

export default function Toggle(props: ToggleProps) {

    // this works but the css is wack 

    return (


        <div class="flex justify-center">
            <div class="form-check form-switch">
                <input class="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
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
                    type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                <label class="form-check-label inline-block text-gray-800" for="flexSwitchCheckDefault">{props.label}</label>
            </div>
        </div>

    );
}
