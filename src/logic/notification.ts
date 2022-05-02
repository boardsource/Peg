import { Subscribable } from "./subscribable";
import { NotificationColor } from '../types/types'
import { threadId } from "worker_threads";

export class Notification extends Subscribable {
  private static instance: Notification;
  visible: boolean = false
  title?: string = ""
  message: string = ""
  color: NotificationColor = NotificationColor.Red
  duration?: number | undefined = undefined
  progressBarWidth: number | undefined = undefined
  private constructor() {
    super();
  }

  public static getInstance(): Notification {
    if (!Notification.instance) {
      Notification.instance = new Notification();
    }
    return Notification.instance;
  }

  setProgressBarWidth = () => {
    var duration = this.duration
    var percent = duration / 100
    var i = 100
    var interval = setInterval(() => {
      i--
      this.progressBarWidth = i
      console.log(this.progressBarWidth)
      this.updateSubScribers()
      if (i <= 0) {
        clearInterval(interval)
        // this.Hide()
        // this.updateSubScribers()
      }
    }, percent)
  }


  Show(title: string, message: string, color: NotificationColor, duration: number) {
    this.visible = true,
      this.title = title,
      this.message = message,
      this.color = color,
      this.duration = duration
    if (duration) {
      this.setProgressBarWidth()
    } else {
      return
    }
    this.updateSubScribers()
  }

  Hide() {
    this.visible = false,
      this.title = ''
    this.message = '',
      this.color = '',
      this.duration = undefined,
      this.updateSubScribers()
  }

}