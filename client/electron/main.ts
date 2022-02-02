import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { AppManager } from "../src/logic/appManager"
import * as path from 'path';
import { ElectronEvents } from '../src/types/types';
let mainWindow: BrowserWindow | null = null;
let pegApp: AppManager | null = null;
const createWindow = async () => {

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    // icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  if (mainWindow !== null) {
    const pegApp = new AppManager(mainWindow)
    await pegApp.diskManager.cacheData("")
    pegApp.run()
  }

  if (app.isPackaged) {
    // 'build/index.html'
    mainWindow.loadURL(`file://${__dirname}/../index.html`);
  } else {
    mainWindow.loadURL('http://localhost:3000/index.html');
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === "win32" ? ".cmd" : "")),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }
  mainWindow.on('ready-to-show', () => {
    if (pegApp) {
      pegApp.diskManager.cacheData("")
    } else {
      if (mainWindow !== null) {
        const pegApp = new AppManager(mainWindow)
        pegApp.diskManager.cacheData("")
      }
    }
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', async () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();

};
app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});


ipcMain.on(ElectronEvents.Scan, (event: Electron.IpcMainEvent, fileName: string,) => {
  if (pegApp) {
    pegApp.Scan(event, fileName)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.Scan(event, fileName)

    }
  }
}
)

ipcMain.on(ElectronEvents.SaveMap, (event: Electron.IpcMainEvent, file: string,) => {
  if (pegApp) {
    pegApp.fileSave(event, file)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.fileSave(event, file)

    }
  }
}
)

ipcMain.on(ElectronEvents.Savefile, (event: Electron.IpcMainEvent, data: { fileData: string, path: string[] }) => {
  if (pegApp) {
    pegApp.writeFile(event, data)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.writeFile(event, data)

    }
  }
}
)


ipcMain.on(ElectronEvents.FilePicker, async (event: Electron.IpcMainEvent, file: string,) => {
  if (mainWindow !== null) {
    const drivePath = await dialog.showOpenDialogSync(mainWindow, {
      properties: ['openFile', 'openDirectory']
    })
    event.reply(ElectronEvents.FilePickerClose, drivePath ? drivePath[0] : '')
  }
}
)



app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  });


})
