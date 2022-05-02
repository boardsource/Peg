import { createSignal, For, onCleanup, onMount, Show } from "solid-js"
import { isKeyCode, ShareableFeatureToDisplayWord } from "../../logic/helpers"
import { ProgramSettings } from "../../logic/programSettings"
import { RemoteContentManager } from "../../logic/remoteContentManager"
import { FeatureResponse, KeyCode, ShareableFeatureType } from "../../types/types"
import Button from "../button/button"
import Paragraph from "../paragraph/paragraph"
import PppChecker from "../pppChecker/pppChecker"
import Searchbar from "../searchbar/searchbar"
const programSettings = ProgramSettings.getInstance()

type ShareModalProps = {
    featureType: ShareableFeatureType
    keyboard: string
    close: () => void

}
enum Views {
    ListView,
    SingleView
}

export default function DownloadModal(props: ShareModalProps) {
    const remoteContentManager = new RemoteContentManager(props.featureType, props.keyboard)
    const [listOfFeatures, setListOfFeatures] = createSignal(remoteContentManager.listOfFeatures),
        [currentView, SetCurrentView] = createSignal(Views.ListView),
        [selectedFeature, setSelectedFeature] = createSignal(remoteContentManager.selectedFeature),
        [search, setSearch] = createSignal(""),
        [searchResults, setSearchResults] = createSignal<FeatureResponse[]>([])

    const subId = remoteContentManager.Subscribe(() => {
        setListOfFeatures(remoteContentManager.listOfFeatures)
        setSelectedFeature(remoteContentManager.selectedFeature)
        filterResults()
    })
    onMount(() => {
        remoteContentManager.GetFeatureList()
    })
    onCleanup(() => {
        remoteContentManager.Unsubscribe(subId)
    })
    const backToListView = () => {
        SetCurrentView(Views.ListView)

    }
    const selectFeature = (feature: FeatureResponse) => {
        remoteContentManager.GetFeature(feature)
        SetCurrentView(Views.SingleView)
    }
    const filterResults = () => {
        const features = listOfFeatures().sort((a, b) => b.downloads - a.downloads);
        if (search() !== "") {
            // user is searching for something
            const tempSearchResults = features.filter((feature) => {
                const title = feature.title.toLowerCase(),
                    description = feature.description.toLowerCase(),
                    keyboard = feature.keyboard.toLowerCase(),
                    currentSearch = search().toLowerCase(),
                    universalOverRide = feature.universal ? true : keyboard === props.keyboard.toLowerCase()
                return title.includes(currentSearch) ||
                    keyboard.includes(currentSearch) ||
                    description.includes(currentSearch) &&
                    universalOverRide
            })
            setSearchResults(tempSearchResults)
        } else if (features.length > 0 && !features[0].universal) {
            // no search but feature is not universal 
            const tempSearchResults = features.filter((feature) => feature.keyboard.toLowerCase() === props.keyboard.toLowerCase())
            setSearchResults(tempSearchResults)
        } else {
            // just send it all
            setSearchResults(features)
        }
    }
    const returnListView = () => {
        return (
            <div>
                <div className="flex">
                    <Searchbar value={search()}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={ShareableFeatureToDisplayWord(props.featureType)}
                        name="search"
                        enterPressed={filterResults}
                    />
                    <Button onClick={filterResults} selected={true}>
                        Search
                    </Button>
                </div>
                <For each={searchResults()} fallback={<div>Loading...</div>}>
                    {(feature, index) => (
                        <div>
                            <h3>
                                {feature.title}
                            </h3>
                            <p>
                                Downloads: {feature.downloads}
                            </p>
                            <p>
                                originally made for: {feature.keyboard}
                            </p>

                            <Paragraph truncate={20}>
                                {feature.description}
                            </Paragraph>
                            <Button onClick={() => { selectFeature(feature) }} selected={false}>
                                More Info
                            </Button>

                        </div>

                    )}

                </For>
            </div>


        )
    }
    const shouldRenderCode = () => {
        switch (props.featureType) {
            case ShareableFeatureType.keyMaps:
                return false
            case ShareableFeatureType.ledMaps:
                return false
            case ShareableFeatureType.keyCodes:
                return true
            case ShareableFeatureType.oleds:
                return false
            case ShareableFeatureType.codeBlocks:
                return true
        }
    }
    const renderExample = () => {
        switch (props.featureType) {
            case ShareableFeatureType.keyMaps:
                return ""
            case ShareableFeatureType.ledMaps:
                return ""
            case ShareableFeatureType.keyCodes:
                const code = selectedFeature()?.code
                if (code && isKeyCode(code)) {
                    const keycode: KeyCode = code
                    return (<p>
                        code: {keycode.code}
                        <br />
                        display: {keycode.display}
                        <br />
                        Description: {keycode.Description}

                    </p>)
                } else {
                    return ""
                }

            case ShareableFeatureType.oleds:
                return ""

            case ShareableFeatureType.codeBlocks:
                // this should work but modal css is so fucked
                return (
                    <code style="white-space: pre-wrap">
                        # codeblock
                        {selectedFeature()?.code}
                        # codeblock
                    </code>
                )
        }
    }
    const returnSingleView = () => {

        return (

            <Show when={currentView() === Views.SingleView && selectedFeature() !== undefined} fallback={<div>Loading...</div>}>
                <h3>
                    {selectedFeature()?.title}
                </h3>
                <Paragraph>
                    {selectedFeature()?.description}
                </Paragraph>
                <Show when={shouldRenderCode()} fallback={""}>
                    <Paragraph>
                        {renderExample()}
                    </Paragraph>
                </Show>
                <div className="flex">


                    <Button onClick={backToListView} selected={false}>
                        Back
                    </Button>
                    <Button onClick={() => remoteContentManager.ApplyFeature()} selected={true}>
                        Add to board
                    </Button>
                </div>

            </Show>



        )

    }
    const returnCorrectView = () => {
        switch (currentView()) {
            case Views.ListView:
                return returnListView()
            case Views.SingleView:
                return returnSingleView()
        }
    }

    return (
        <PppChecker fallback={(
            <div>
                <h2>Pro Account Feature</h2>
                <p>
                    This feature is limited to pro accounts, pick up a pro account
                    <a href={programSettings.PppBuyLink} target="blank"> here</a> to unlock the ability to download {ShareableFeatureToDisplayWord(props.featureType)}
                    and many more features.
                </p>
            </div>
        )}>
            <div className="DownloadModal">
                {returnCorrectView()}
            </div>
        </PppChecker>
    )
}