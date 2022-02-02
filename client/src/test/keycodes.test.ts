//@ts-ignore
import { KeyCodes } from "../logic/keyCodes";



describe("tests for keycodes", () => {
    let keyCodes: KeyCodes

    beforeEach(() => {
        keyCodes = KeyCodes.getInstance()
    });
    afterEach(() => {

    });

    it("will return a full keycode for a string", () => {
        const keycodeString = "KC.Q"
        const code = keyCodes.KeyCodeForString(keycodeString)
        expect(code.code).toBe(keycodeString);
    });
    it("will return a no code for string that cant be a code", () => {
        const noCode = "KC.NO"
        const keycodeString = "KC.QK"
        const code = keyCodes.KeyCodeForString(keycodeString)
        expect(code.code).toBe(noCode);





    });
    // it("you can change the time", () => {

    //     expect(4).toBe(4);
    // });


});