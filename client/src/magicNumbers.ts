const root = document.documentElement;
export const magicNumbers = {
    keyMultiplyer: 42
}
root.style.setProperty('--keyMultiplyer', magicNumbers.keyMultiplyer + "px");