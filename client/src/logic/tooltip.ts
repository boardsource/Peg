
import { Subscribable } from "./subscribable";

export class ToolTip extends Subscribable {
    private static instance: ToolTip;
    x: number = 0
    y: number = 0
    visible: boolean = false
    title: string = ""
    body: string = ""
    private constructor() {
        super();


    }

    public static getInstance(): ToolTip {
        if (!ToolTip.instance) {
            ToolTip.instance = new ToolTip();
        }
        return ToolTip.instance;
    }

    Show(x: number, y: number, title: string, body: string) {
        // console.log("body", body)
        this.x = x;
        this.y = y;
        this.title = title;
        this.body = body;
        this.visible = true
        this.updateSubScribers()
    }
    Hide() {
        this.x = 0;
        this.y = 0;
        this.title = "";
        this.body = "";
        this.visible = false
        this.updateSubScribers()
    }


}