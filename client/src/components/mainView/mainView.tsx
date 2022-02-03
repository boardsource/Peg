type MainViewProps = {
    title: string,
    children: any
}

export default function MainView(props: MainViewProps) {
    return (
        <div className="mainview flex flex-col">
            <h1 className="mb-4 text-xl">{props.title}</h1>
            {props.children}
        </div>
    )
}

