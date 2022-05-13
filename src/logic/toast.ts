
import { ToastLevel, ToastMessage } from "../types/types";
import { Subscribable } from "./subscribable";
import { nanoid } from 'nanoid/non-secure'


export class Toast extends Subscribable {
    private static instance: Toast;
    visible: boolean = true
    messages: Map<string, ToastMessage> = new Map()
    upTime: number = 2000
    private constructor() {
        super()
    }

    public static getInstance(): Toast {
        if (!Toast.instance) {
            Toast.instance = new Toast();
        }
        return Toast.instance;
    }
    show(message: string, toastLevel: ToastLevel, uptime: number = this.upTime) {
        const id = nanoid(10)
        this.messages.set(id, { message, toastLevel, id });
        this.visible = true
        this.updateSubScribers()
        this.hide(id, uptime)
    }
    public Error(message: string, uptime: number = this.upTime) {
        this.show(message, ToastLevel.error)
    }

    public Info(message: string, uptime: number = this.upTime) {
        this.show(message, ToastLevel.info)
    }
    public Warn(message: string, uptime: number = this.upTime) {
        this.show(message, ToastLevel.warn)
    }
    public Success(message: string, uptime: number = this.upTime) {
        this.show(message, ToastLevel.success)
    }
    public Debug(message: string, uptime: number = this.upTime * 100) {
        this.show(message, ToastLevel.debug, uptime)
    }
    public static Info(message: string) {
        Toast.getInstance().Info(message)
    }
    public static Error(message: string) {
        Toast.getInstance().Error(message)
    }
    public static Warn(message: string) {
        Toast.getInstance().Warn(message)
    }
    public static Success(message: string) {
        Toast.getInstance().Success(message)
    }
    public static Debug(message: string) {
        Toast.getInstance().Debug(message)
    }


    hide(id: string, uptime: number) {
        setTimeout(() => {
            this.messages.delete(id)
            this.updateSubScribers()
        }, uptime)
    }
    public Close(id: string) {
        this.messages.delete(id)
        this.updateSubScribers()
    }
}