const { contextBridge, ipcRenderer } = require('electron');
console.log("this ran")
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {

        send(channel: string, data: any) {
            ipcRenderer.send(channel, data);
        },
        //@ts-ignore
        on(channel, func) {
            // const validChannels = ['ipc-example'];
            // if (validChannels.includes(channel)) {
            //     // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args));
            // }
        },
        //@ts-ignore
        once(channel, func) {
            const validChannels = ['ipc-example'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.once(channel, (event, ...args) => func(...args));
            }
        },
    },
});




