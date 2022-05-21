import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { AppManager } from "../src/logic/appManager"
import * as path from 'path';
import { ElectronEvents, FileName } from '../src/types/types';
let mainWindow: BrowserWindow | null = null;
let pegApp: AppManager | null = null;
const createWindow = async () => {

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    maxWidth: 1280,
    maxHeight: 720,
    minWidth: 1280,
    minHeight: 720,
    icon: path.join(__dirname, "..", "favicon.ico"),
    frame: false,
    titleBarStyle: 'hiddenInset',
    // titleBarOverlay: {
    //   color: '#2f3241',
    //   symbolColor: '#74b1be'
    // },
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
      pegApp.diskManager.readSettings(ElectronEvents.ReadSettings, FileName.settings)
      pegApp.diskManager.readSettings(ElectronEvents.ReadCustomCodes, FileName.customCodes)
    } else {
      if (mainWindow !== null) {
        const pegApp = new AppManager(mainWindow)
        pegApp.diskManager.cacheData("")
        pegApp.diskManager.readSettings(ElectronEvents.ReadSettings, FileName.settings)
        pegApp.diskManager.readSettings(ElectronEvents.ReadCustomCodes, FileName.customCodes)
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
ipcMain.on(ElectronEvents.FreshDriveScan, (event: Electron.IpcMainEvent, fileName: string,) => {
  if (pegApp) {
    pegApp.FreshScan(event, fileName)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.FreshScan(event, fileName)

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

ipcMain.on(ElectronEvents.SaveSettings, (event: Electron.IpcMainEvent, file: string,) => {
  if (pegApp) {
    pegApp.SaveSetting(event, file, ElectronEvents.SaveSettings)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.SaveSetting(event, file, ElectronEvents.SaveSettings)

    }
  }
}
)

ipcMain.on(ElectronEvents.SaveCustomCodes, (event: Electron.IpcMainEvent, file: string,) => {
  console.log("save file")
  if (pegApp) {
    pegApp.SaveSetting(event, file, ElectronEvents.SaveCustomCodes)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.SaveSetting(event, file, ElectronEvents.SaveCustomCodes)

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

ipcMain.on(ElectronEvents.InstallKmk, (event: Electron.IpcMainEvent, path: string) => {
  if (pegApp) {
    pegApp.InstallKmk(path)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.InstallKmk(path)

    }
  }
}
)

ipcMain.on(ElectronEvents.DownLoadAndInstallLib, (event: Electron.IpcMainEvent, data: { boardName: string, path: string, }) => {
  if (pegApp) {
    pegApp.DownloadAndInstallLib(data.boardName, data.path)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.DownloadAndInstallLib(data.boardName, data.path)
    }
  }
}
)

ipcMain.on(ElectronEvents.SaveOled, (event: Electron.IpcMainEvent, data: { fileData: number[][], fileNumber: number | string }) => {
  if (pegApp) {
    pegApp.oledSave(event, data)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.oledSave(event, data)

    }
  }
}
)
ipcMain.on(ElectronEvents.ReadOled, (event: Electron.IpcMainEvent, fileNumber: number) => {
  if (pegApp) {
    pegApp.oledread(event, fileNumber)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.oledread(event, fileNumber)

    }
  }
}
)

ipcMain.on(ElectronEvents.DownLoadKmk, (event: Electron.IpcMainEvent) => {
  if (pegApp) {
    pegApp.DownloadKmk()
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.DownloadKmk()

    }
  }
}
)


ipcMain.on(ElectronEvents.SetProPlan, (event: Electron.IpcMainEvent, id: string) => {
  if (pegApp) {
    pegApp.saveProPlan(event, id)
  } else {
    if (mainWindow !== null) {
      const pegApp = new AppManager(mainWindow)
      pegApp.saveProPlan(event, id)

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


ipcMain.on(ElectronEvents.WindowClose, (event: Electron.IpcMainEvent) => {
  if (mainWindow !== null) {
    mainWindow.close()
  }
}
)
ipcMain.on(ElectronEvents.WindowFullScreen, (event: Electron.IpcMainEvent) => {
  if (mainWindow !== null) {
    mainWindow.fullScreen = !mainWindow.fullScreen
  }
}
)
ipcMain.on(ElectronEvents.WindowMinimize, (event: Electron.IpcMainEvent) => {
  if (mainWindow !== null) {
    mainWindow.minimize()
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
