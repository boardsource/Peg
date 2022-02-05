export class Color {
    r: number
    g: number
    b: number

    constructor(r: number | string, g: number | string, b: number | string) {
        if (typeof r === "string") {
            this.r = Number(r)
        } else {
            this.r = r
        }
        if (typeof g === "string") {
            this.g = Number(g)
        } else {
            this.g = g
        }
        if (typeof b === "string") {
            this.b = Number(b)
        } else {
            this.b = b
        }
    }

    toString(): string {
        return `[${this.r},${this.g},${this.b}]`
    }
    public static IsColor(colorString: string): Color | undefined {
        if (colorString.startsWith("[")) {
            const colorParts = colorString.substring(0, colorString.length - 1)
                .substring(1)
                .split(",")
            if (colorParts.length === 3) {
                return new Color(colorParts[0], colorParts[1], colorParts[2])
            } else {
                return undefined
            }
        } else {
            return undefined
        }
    }

    public static Red(): Color {
        return new Color(255, 0, 0)
    }
    public static Green(): Color {
        return new Color(0, 255, 0)
    }
    public static Blue(): Color {
        return new Color(0, 0, 255)
    }
    public static Pink(): Color {
        return new Color(255, 0, 127)
    }
    public static Yellow(): Color {
        return new Color(255, 255, 0)
    }
    public static Purple(): Color {
        return new Color(127, 0, 255)
    }
    public static Teal(): Color {
        return new Color(0, 255, 255)
    }
    public static Orange(): Color {
        return new Color(255, 128, 0)
    }
    public static White(): Color {
        return new Color(255, 255, 255)
    }





}