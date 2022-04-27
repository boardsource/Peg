import { FeatureResponse, ShareableFeatureType } from "../types/types";
import { ProgramSettings } from "./programSettings";
import axios from "axios"
import { Subscribable } from "./subscribable";


export class RemoteContentManager extends Subscribable {
    featureType: ShareableFeatureType
    keyboard: string
    programSettings: ProgramSettings
    listOfFeatures: FeatureResponse[] = []
    constructor(featureType: ShareableFeatureType, keyboard: string) {
        super()
        this.featureType = featureType
        this.keyboard = keyboard
        this.programSettings = ProgramSettings.getInstance()
    }
    public GetFeatureList() {
        axios.get(`${this.programSettings.apiUrl}feature/${this.featureType}`).then(response => {
            if (response.status === 200) {
                this.listOfFeatures = response.data
                this.updateSubScribers()

            } else {


            }
        }).catch(error => {

        })

    }
    public GetFeature(id: string) {
        axios.get(`${this.programSettings.apiUrl}feature/single${id}`).then(response => {
            if (response.status === 200) {
                console.log("res is ", response)
                this.updateSubScribers()

            } else {


            }
        }).catch(error => {

        })
    }
    ApplyFeature() {

    }
}
