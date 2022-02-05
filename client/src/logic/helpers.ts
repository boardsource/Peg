import { KeyCode } from "../types/types";
import { Color } from "./color";

export const isColor = (color: any): color is Color => "r" in color
export const isKeyCode = (keyCode: any): keyCode is KeyCode => "code" in keyCode
