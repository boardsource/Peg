import * as solid from "solid-js";
import { ModalDefault } from "../types/types";
import { Subscribable } from "./subscribable";

export class Modal extends Subscribable {
    private static instance: Modal;
    render: solid.JSX.Element
    title: string = ""
    defaultView: ModalDefault = ModalDefault.None
    visible: boolean = false
    canClose: boolean = false
    private constructor() {
        super();


    }

    public static getInstance(): Modal {
        if (!Modal.instance) {
            console.log("setting up")
            Modal.instance = new Modal();
        }
        console.log("give it to em")
        return Modal.instance;
    }

    public Open(title: string, canClose: boolean, render: solid.JSX.Element,) {
        console.log("hello")
        this.render = render;
        this.visible = true
        this.canClose = canClose
        this.title = title;
        this.updateSubScribers()
    }

    public OpenDefault(title: string, canClose: boolean, defaultView: ModalDefault,) {
        this.defaultView = defaultView
        this.visible = true
        this.canClose = canClose
        this.title = title;
        this.updateSubScribers()
    }
    public Close() {
        if (this === undefined) {
            Modal.getInstance()
        }
        this.visible = false
        this.defaultView = ModalDefault.None
        this.updateSubScribers()
    }


}