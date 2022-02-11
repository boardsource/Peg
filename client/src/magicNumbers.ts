const root = document.documentElement;
export const magicNumbers = {
    keyMultiplyer: 42,
    oledPixel: 5
}
root.style.setProperty('--keyMultiplyer', magicNumbers.keyMultiplyer + "px");
root.style.setProperty('--oledPixel', magicNumbers.oledPixel + "px");