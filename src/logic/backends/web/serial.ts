
import { Subscribable } from "../../subscribable";
//@ts-ignore
import { WebSerial } from "./WebSerial";
import { delay } from "./helper";
export enum ControlCodes {
  CtrlC = "\x03",
  CtrlD = "\x04",
  Space = "\x20",
}
export class Serial extends Subscribable {
  private static instance: Serial;

  connected: boolean = false;
  port: any;
  loop: any = undefined;
  responses: string[] = [];
  canSend: boolean;
  gotRepl: boolean = false;
  renderData: undefined | ((data: string) => void) = undefined;
  private constructor() {
    super();
    //@ts-ignore
    this.port = new WebSerial(this.communicate);
    this.canSend = true;
  }

  public static getInstance(): Serial {
    if (!Serial.instance) {
      console.log("making a new one");
      Serial.instance = new Serial();
    }
    return Serial.instance;
  }

  getReplConnection = async () => {
    if (this.gotRepl) {
      return await delay();
    } else {
      this.toggleLock(true);
      this.ctrld();
      await delay();
      this.ctrlc();
      await delay();
      this.ctrlc();
      await delay();
      this.write("\r\n");
      this.toggleLock(false);
      this.gotRepl = true;
      return await delay();
    }
  };

  handleResponse = (returnFromPort: string) => {
    this.responses.push(returnFromPort);
    if (this.renderData) {
      console.log("adding line");
      this.renderData(returnFromPort);
    }
    this.updateSubScribers();
  };
  communicate = (msg: string) => {
    if (this.renderData) {
      console.log("adding info line");
      this.renderData(msg);
    }
  };

  readPort = async () => {
    const returnFromPort = this.port.readUntil("\n");
    if (returnFromPort) {
      this.handleResponse(returnFromPort);
    }
  };

  mainloop = () => {
    if (this.port) {
      if (this.port.opened()) {
        if (!this.connected) {
          this.connected = true;
          this.updateSubScribers();
        }
      } else {
        if (this.connected) {
          this.connected = false;
          this.updateSubScribers();
        }
      }
      this.readPort();
    }
  };

  write = async (data: any) => {
    // if (this.canSend) {
    console.log("writing:", data);
    this.port.write(data);
    // } else {
    //     this.communicate("ToolBox ERROR: ToolBox is in the middle of possessing commands try again after you see a message saying 'Terminal Free'")
    // }
  };
  writeStringToByte = (data: string) => {
    //         let utf8Encode = new TextEncoder();
    // const bytearr=utf8Encode.encode(data);
    // // console.log(bytearr)
    // // this.serial.write(bytearr)
    // // this.serial.write("\x15")
    // this.serial.write(data+"\r\n")
    this.write(data + "\r\n");
  };

  startLoop = () => {
    setTimeout(() => {
      this.loop = setInterval(this.mainloop, 100);
    }, 1000);
  };

  toggleLock = (value: boolean) => {
    this.canSend = !value;
    if (this.canSend) {
      this.communicate("ToolBox Info: Finished Terminal Free Once again");
    } else {
      this.communicate(
        "ToolBox Info: Terminal is locked ToolBox is using it for a bit."
      );
    }
  };

  sendAndStealResponse = async (toSend: string) => {
    const startingLength = Number(`${this.responses.length}`);
    console.log("before sending", this.responses.length);
    this.writeStringToByte(toSend);
    let delayCount = 0;
    while (this.responses.length !== startingLength + 2) {
      delayCount++;
      await delay(20);
    }
    console.log(
      "after sending had to wait",
      delayCount,
      this.responses.length,
      this.responses[this.responses.length - 1]
    );
    return this.responses[this.responses.length - 1];
  };
  ctrlc = () => {
    this.write(ControlCodes.CtrlC);
  };
  ctrld = () => {
    this.write(ControlCodes.CtrlD);
  };
  anykey = () => {
    this.write(ControlCodes.Space);
  };
  reconnect = async () => {
    const isBrowser = typeof window !== "undefined";
    if (isBrowser) {
      //@ts-ignore

      let usedPorts = await navigator.serial.getPorts();
      if (usedPorts.length > 0) {
        this.port.open(usedPorts[0], 9600);
        this.communicate(
          `ToolBox Info: Reconnecting to last used port ${JSON.stringify(
            usedPorts[0].getInfo()
          )}`
        );
        this.startLoop();
      }
    }
  };
  open = async (callBack?: () => void) => {
    this.port.open(9600);
    this.startLoop();
    // if (callBack) {

    //   const isBrowser = typeof window !== "undefined";
    //   if (isBrowser) {
    //     //@ts-ignore
    //     navigator.serial.addEventListener("connect", (e) => {
    //       callBack();
    //       // Connect to `e.target` or add it to a list of available ports.
    //     });
    //   }
    // }
  };
  close = () => {
    console.log("closing");
    this.port.close();
    clearInterval(this.loop);
    this.connected = false;
  };
}
