export class Color {
    r: number
    g: number
    b: number

    constructor(r: number, g: number, b: number) {
        this.r = r
        this.g = g
        this.b = b
    }


    toString(): string {
        return `${this.r},${this.g},${this.b}`
    }


}