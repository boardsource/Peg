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
        const layer = 1
        const isLed = true
        clientManger.NoticeThatKeyIsWaiting(index, layer, isLed)

        expect(clientManger.waitingIndex).toBe(index);
        expect(clientManger.waitingLayer).toBe(layer);
        expect(clientManger.waitingIsLed).toBe(isLed);
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
        const layer = 1
        const isLed = true
        clientManger.NoticeThatKeyIsWaiting(index, layer, isLed)
        expect(secondManger.waitingIndex).toBe(index);
        expect(secondManger.waitingLayer).toBe(layer);
        expect(secondManger.waitingIsLed).toBe(isLed);
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
        const layer = 1
        const isLed = true
        clientManger.NoticeThatKeyIsWaiting(index, layer, isLed)
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
        const layer = 1
        const isLed = true
        clientManger.NoticeThatKeyIsWaiting(index, layer, isLed)
        expect(testValue).toBe(0);
    });


});