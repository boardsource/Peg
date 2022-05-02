import { ClientManager } from "../logic/clientManager"


describe("tests for client manager", () => {
    beforeEach(() => {
    });
    afterEach(() => {
    });

    it("will update state for waiting key", () => {
        //@ts-ignore
        window.electron = {
            ipcRenderer: {
                send: jest.fn(),
                on: jest.fn(),
                once: jest.fn(),
            },
        }

        const clientManger = ClientManager.getInstance()
        const index = 1
        const isLed = true
        const isEncoder = true
        clientManger.NoticeThatKeyIsWaiting(index, isLed, isEncoder)

        expect(clientManger.waitingIndex).toBe(index);
        expect(clientManger.waitingIsLed).toBe(isLed);
        expect(clientManger.waitingIsEncoder).toBe(isEncoder);

    });
    it("is a singleton", () => {
        //@ts-ignore
        window.electron = {
            ipcRenderer: {
                send: jest.fn(),
                on: jest.fn(),
                once: jest.fn(),
            },
        }
        const clientManger = ClientManager.getInstance()

        const secondManger = ClientManager.getInstance()
        const index = 1
        const isLed = true
        const isEncoder = true
        clientManger.NoticeThatKeyIsWaiting(index, isLed, isEncoder)
        expect(secondManger.waitingIndex).toBe(index);
        expect(secondManger.waitingIsLed).toBe(isLed);
        expect(secondManger.waitingIsEncoder).toBe(isEncoder);

    });
    it("you can subscribe to changes", () => {

        //@ts-ignore
        window.electron = {
            ipcRenderer: {
                send: jest.fn(),
                on: jest.fn(),
                once: jest.fn(),
            },
        }
        let testValue = 0
        const changeTestValueOnUpDate = () => {
            testValue = 1
        }
        const clientManger = ClientManager.getInstance()
        clientManger.Subscribe(changeTestValueOnUpDate)
        const index = 1
        const isLed = true
        const isEncoder = true
        clientManger.NoticeThatKeyIsWaiting(index, isLed, isEncoder)
        expect(testValue).toBe(1);
    });
    it("you can unsubscribe to changes", () => {

        //@ts-ignore
        window.electron = {
            ipcRenderer: {
                send: jest.fn(),
                on: jest.fn(),
                once: jest.fn(),
            },
        }
        let testValue = 0
        const changeTestValueOnUpDate = () => {
            testValue = 1
        }
        const clientManger = ClientManager.getInstance()
        const subId = clientManger.Subscribe(changeTestValueOnUpDate)
        clientManger.Unsubscribe(subId)
        const index = 1
        const isLed = true
        const isEncoder = true
        clientManger.NoticeThatKeyIsWaiting(index, isLed, isEncoder)
        expect(testValue).toBe(0);
    });


});